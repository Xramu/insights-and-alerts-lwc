import { LightningElement, track } from 'lwc';
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
export default class InsightsAndAlertsWindow extends LightningElement {
  // Raw data from server (API shape mapped to UI-friendly shape)
  @track insights = [];
  @track loading = false;
  @track errorMessage = '';

  // Filter state
  @track selectedFilter = 'All'; // All | Potential | Lead | Account | Opportunity | To-Do

  // Expansion state (Id -> boolean)
  expandedMap = new Map();

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
      this.insights = (records || []).map((r) => ({
        id: r.Id,
        topic: r.Topic__c || '',
        context: r.Context__c || '',
        rationale: r.Rationale__c || '',
        details: r.Details__c || '',
        openRecordUrl: r.Open_Record__c || '',
        completed: !!r.Completed__c,
        suggestedAction: r.Suggested_Action__c || '',
        // Pre-computed properties for template use
        badgeClass: this.getBadgeClass(r.Id),
        badgeSelectedClass: this.getBadgeSelectedClass(),
        badgeFullClass: `slds-badge slds-m-right_small ${this.getBadgeClass(r.Id)} ${this.getBadgeSelectedClass()}`,
        badgeLabel: this.getBadgeLabel(r.Id),
        isExpanded: !!this.expandedMap.get(r.Id),
        isDetailsExpanded: !!this.expandedMap.get(r.Id)
      }));
      // preserve expansion where possible
      const newExpanded = new Map();
      for (const ins of this.insights) {
        newExpanded.set(ins.id, this.expandedMap.get(ins.id) === true);
      }
      this.expandedMap = newExpanded;
    } catch (e) {
      this.errorMessage = this.normalizeError(e);
    } finally {
      this.loading = false;
    }
  }

  // UI state getters for template
  get hasData() {
    return Array.isArray(this.insights) && this.insights.length > 0;
  }

  get filteredInsights() {
    if (this.selectedFilter === 'All') {
      return this.insights;
    }
    return this.insights.filter((i) => i.context === this.selectedFilter);
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

  // Button styles depend on selection; we return style strings
  get allButtonStyle() {
    // darker grey when selected
    return this.selectedFilter === 'All' ? 'background:#9e9e9e;color:white' : '';
  }
  get potentialStyle() {
    return this.selectedFilter === 'Potential' ? this.styleFor('Potential') : '';
  }
  get leadStyle() {
    return this.selectedFilter === 'Lead' ? this.styleFor('Lead') : '';
  }
  get accountStyle() {
    return this.selectedFilter === 'Account' ? this.styleFor('Account') : '';
  }
  get opportunityStyle() {
    return this.selectedFilter === 'Opportunity' ? this.styleFor('Opportunity') : '';
  }
  get todoStyle() {
    return this.selectedFilter === 'To-Do' ? this.styleFor('To-Do') : '';
  }

  styleFor(ctx) {
    const color = this.contextColorMap[ctx] || '';
    return color ? `background:${color};color:#16325c` : '';
  }

  // Compute per-record class names without inline expressions
  getBadgeClass(insightId) {
    const rec = this.insights.find((i) => i.id === insightId);
    const ctx = rec ? rec.context : '';
    switch (ctx) {
      case 'Potential': return 'badge-potential';
      case 'Lead': return 'badge-lead';
      case 'Account': return 'badge-account';
      case 'Opportunity': return 'badge-opportunity';
      case 'To-Do': return 'badge-todo';
      default: return '';
    }
  }

  // Computed button classes/styles (no inline concatenation in template)
  get ctxButtonClass() {
    return 'slds-m-right_x-small';
  }

  selectedButtonStyle = 'btn-all-selected';
  selectedBadgeStyle = 'badge-all-selected';

  getFilterButtonClasses(buttonType, selectedStyle, additionalStyling) {
    return `${this.selectedFilter === buttonType ? selectedStyle : ''} ${additionalStyling}`.trim();
  }

  getBadgeSelectedClass() {
    return this.getFilterButtonClasses('All', this.selectedBadgeStyle, '');
  }

  // Predefined button classes for each context
  get allButtonClass() {
    return this.getFilterButtonClasses('All', this.selectedButtonStyle, 'slds-m-right_x-small');
  }

  get potentialButtonClass() {
    return this.getFilterButtonClasses('Potential', this.selectedButtonStyle, this.ctxButtonClass);
  }

  get leadButtonClass() {
    return this.getFilterButtonClasses('Lead', this.selectedButtonStyle, this.ctxButtonClass);
  }

  get accountButtonClass() {
    return this.getFilterButtonClasses('Account', this.selectedButtonStyle, this.ctxButtonClass);
  }

  get opportunityButtonClass() {
    return this.getFilterButtonClasses('Opportunity', this.selectedButtonStyle, this.ctxButtonClass);
  }

  get todoButtonClass() {
    return this.getFilterButtonClasses('To-Do', this.selectedButtonStyle, this.ctxButtonClass);
  }

  // Helper to get badge label (used in template)
  getBadgeLabel(insightId) {
    const rec = this.insights.find((i) => i.id === insightId);
    const ctx = rec ? rec.context : '';
    return this.contextBadgeLabelMap[ctx] || '';
  }

  // Get the full class string for badge to avoid concatenation in template
  getBadgeFullClass(insightId) {
    return `slds-badge slds-m-right_small ${this.getBadgeClass(insightId)} ${this.getBadgeSelectedClass()}`;
  }

  // Expand/collapse
  toggleExpand = (event) => {
    const id = event.currentTarget?.dataset?.id;
    
    if (!id) return;

    this.insights = this.insights.map((insight) => {
      // Update map and insight object only if the ID was found
      if (insight.id === id) {
        const newState = !insight.isExpanded;
        this.expandedMap.set(id, newState);

        return { ...insight, isExpanded: newState };
      }
      
      return insight;
    })
  };

  // Completed toggle
  async handleCompletedToggle(event) {
    const id = event.currentTarget?.dataset?.id;
    const checked = event.target?.checked === true;
    if (!id) return;

    // optimistic update
    const idx = this.insights.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const previous = this.insights[idx].completed;
    this.insights[idx].completed = checked;
    this.insights = [...this.insights];

    try {
      await updateCompleted({ updates: [{ id, completed: checked }] });
    } catch (e) {
      // rollback on error
      this.insights[idx].completed = previous;
      this.insights = [...this.insights];
      this.notify('Update Failed', this.normalizeError(e), 'error');
    }
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
