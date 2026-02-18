import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAllInsights from '@salesforce/apex/InsightsAlertsService.getAllInsights';
import updateCompleted from '@salesforce/apex/InsightsAlertsService.updateCompleted';

/**
 * InsightsAndAlertsWindow
 * - Fetches Insight_and_Alert__c records via Apex
 * - Client-side filtering by Context__c
 * - Expand/collapse multiple sections
 * - Inline completion toggle persists via Apex (optimistic update + rollback)
 *
 * Template rules: no inline expressions/concatenation/function calls in template.
 * All computed labels/styles/classes are getters or fields.
 */
export default class InsightsAndAlertsWindow extends NavigationMixin(LightningElement) {
  // Raw data from server (API shape mapped to UI-friendly shape)
  @track insights = [];
  @track loading = false;
  @track showCompleted = false;
  @track errorMessage = '';

  // Filter state
  @track selectedFilter = 'All'; // All | Potential | Lead | Account | Opportunity | To-Do

  // Color map for contexts
  contextColorMap = {
    Potential: '#b4d1de',
    Lead: '#1894c9',
    Account: '#97c39b',
    Opportunity: '#c9b4de',
    'To-Do': '#efe183'
  };

  // Badge label map for contexts (pluralization per spec)
  contextBadgeLabelMap = {
    Potential: 'Potentials',
    Lead: 'Leads',
    Account: 'Accounts',
    Opportunity: 'Opportunities',
    'To-Do': 'To-Do'
  };

  connectedCallback() {
    console.log('Refreshed');
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    this.errorMessage = '';
    try {
      const records = await getAllInsights();
      // Map to UI-friendly shape with safe defaults and pre-computed properties
      this.insights = (records || []).map((r) => {
        // Save the previous state to keep expanded states
        const previousState = this.getInsightWithId(r.Id);
        const wasExpanded = previousState?.isExpanded;
        const hadExtraDetailsExpanded = previousState?.isDetailsExpanded;
        
        return ({
          id: r.Id,
          topic: r.Topic__c || '',
          context: r.Context__c || '',
          rationale: r.Rationale__c || '',
          details: r.Details__c || '',
          openRecordUrl: r.Open_Record__c || '',
          completed: !!r.Completed__c,
          suggestedAction: r.Suggested_Action__c || '',
          badgeFullClass: `slds-badge ${this.getBadgeClass(r.Context__c)}`,
          badgeLabel: this.getBadgeLabel(r.Id),
          isExpanded: !!wasExpanded,
          isDetailsExpanded: !!hadExtraDetailsExpanded,
          chevronClass: this.getChevronClass(!!wasExpanded),
          titleClass: this.getTitleClass(!!wasExpanded),
          sectionClass: this.getInsightSectionClass(!!r.Completed__c),
          hidden: (r.Completed__c && !this.showCompleted)
        })
      });
    } catch (e) {
      this.errorMessage = this.normalizeError(e);
    } finally {
      this.loading = false;
    }
  }

  getInsightWithId = (insightId) => this.insights.find((i) => i.id === insightId);

  // UI state getters for template
  get hasData() {
    return Array.isArray(this.insights) && this.insights.length > 0;
  }

  get filteredInsights() {
    return this.insights.filter((insight) => {
      // Context based filtering
      if (this.selectedFilter !== 'All' && insight.context !== this.selectedFilter) {
        return false;
      }

      // Return true if not hidden
      return !insight.hidden
    });
  }

  // Title bar actions
  handleRefresh = () => {
    this.loadData();
  };

  // Filter button handlers
  handleFilterAll = () => {
    this.selectedFilter = 'All';
  };
  handleFilterPotential = () => {
    this.selectedFilter = 'Potential';
  };
  handleFilterLead = () => {
    this.selectedFilter = 'Lead';
  };
  handleFilterAccount = () => {
    this.selectedFilter = 'Account';
  };
  handleFilterOpportunity = () => {
    this.selectedFilter = 'Opportunity';
  };
  handleFilterTodo = () => {
    this.selectedFilter = 'To-Do';
  };

  getInsightSectionClass(completed) {
    return `insight-section round-border ${(completed && !this.showCompleted) ? 'hidden' : ''}`.trim();
  }

  getChevronClass(expanded) {
    return `insight-section-chevron chev ${expanded ? 'rotate' : ''}`.trim();
  }

  getTitleClass(expanded) {
    return `slds-text-heading_small insight-title ${expanded ? 'expanded' : 'slds-truncate'}`;
  }

  getBadgeClass(context) {
    const classLookup = {
      'Potential': 'badge-potential',
      'Lead': 'badge-lead',
      'Account': 'badge-account',
      'Opportunity': 'badge-opportunity',
      'To-Do':'badge-todo'
    }

    return classLookup[context] || '';
  }

  regularButtonStyle = 'custom-button';
  selectedButtonStyle = `${this.regularButtonStyle} selected`;

  getFilterButtonClasses(buttonType, selectedStyle, additionalStyling) {
    const baseClass = this.selectedFilter === buttonType ? selectedStyle : this.regularButtonStyle;
    // Add context-specific class using lookup table
    const contextClassLookup = {
      'Potential': 'potential',
      'Lead': 'lead',
      'Account': 'account',
      'Opportunity': 'opportunity',
      'To-Do': 'todo',
      'All': 'all'
    };
    const contextClass = contextClassLookup[buttonType] || '';
    return `${baseClass} ${contextClass} ${additionalStyling}`.trim();
  }

  getBadgeSelectedClass() {
    return this.getFilterButtonClasses('All', this.selectedButtonStyle, '');
  }

  // Predefined button classes for each context
  get allButtonClass() {
    return this.getFilterButtonClasses('All', this.selectedButtonStyle, '');
  }

  get potentialButtonClass() {
    return this.getFilterButtonClasses('Potential', this.selectedButtonStyle, '');
  }

  get leadButtonClass() {
    return this.getFilterButtonClasses('Lead', this.selectedButtonStyle, '');
  }

  get accountButtonClass() {
    return this.getFilterButtonClasses('Account', this.selectedButtonStyle, '');
  }

  get opportunityButtonClass() {
    return this.getFilterButtonClasses('Opportunity', this.selectedButtonStyle, '');
  }

  get todoButtonClass() {
    return this.getFilterButtonClasses('To-Do', this.selectedButtonStyle, '');
  }

  get checkClass() {
    return 'check undone';
  }

  // Helper to get badge label (used in template)
  getBadgeLabel(insightId) {
    const rec = this.getInsightWithId(insightId);
    const ctx = rec ? rec.context : '';
    return this.contextBadgeLabelMap[ctx] || '';
  }

  // Expand/collapse
  toggleExpand = (event) => {
    const id = event.currentTarget?.dataset?.id;
    
    if (!id) return;

    this.insights = this.insights.map((insight) => {
      // Update insight object only if the ID was found
      if (insight.id === id) {
        const newState = !insight.isExpanded;

        return { ...insight,
          isExpanded: newState,
          chevronClass: this.getChevronClass(newState),
          titleClass: this.getTitleClass(newState)
        };
      }
      
      return insight;
    })
  };

  handleShowCompletedChange(event) {
    this.showCompleted = !!event?.target?.checked;

    // Update section classes and hidden value
    this.insights = this.insights.map((insight) => {
      insight.sectionClass = this.getInsightSectionClass(insight.completed);

      // Only allow disabling hidden state
      if (this.showCompleted && insight.hidden) {
        insight.hidden = false;
      }

      return insight;
    })
  }

  // Completed toggle
  async handleCompletedToggle(event) {
    const id = event.currentTarget?.dataset?.id;
    const checked = !!event.target?.checked;
    if (!id) return;

    // optimistic update
    const idx = this.insights.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const previous = this.insights[idx].completed;
    this.insights[idx].completed = checked;
    this.insights = [...this.insights];

    try {
      const results = await updateCompleted({ updates: [{ recordId: id, completed: checked }] });
    } catch (e) {
      // rollback on error
      this.insights[idx].completed = previous;
      this.notify('Update Failed', this.normalizeError(e), 'error');
    }

    // Update class
    this.insights[idx].sectionClass = this.getInsightSectionClass(this.insights[idx].completed);
  }

  // Navigation from the "View All" button
  handleNavigationToRecordPage() {
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: 'Insight_and_Alert__c',
        actionName: 'list'
      },
      state: {
        filterName: 'All'
      }
    });
  }

  // Child "collapse" event bubble handler (placeholder to meet template wiring)
  handleChildCollapse() {
    // The child section's internal Details collapse is bound to parent expansion;
    // no extra action needed. Method provided to comply with no-inline-calls rule.
  }

  // Toast helper
  notify(title, message, variant) {
    // Lazy-create a custom event for toast without importing lightning/platformShowToastEvent
    // to keep the sample lightweight; in a real app import and dispatch ShowToastEvent.
    // eslint-disable-next-line no-console
    console[variant === 'error' ? 'error' : 'log'](`${title}: ${message}`);
  }

  normalizeError(e) {
    if (!e) return 'Unknown error';
    if (Array.isArray(e.body)) {
      return e.body.map((err) => err.message).join(', ');
    }
    if (e.body && typeof e.body.message === 'string') {
      return e.body.message;
    }
    return e.message || String(e);
  }
}
