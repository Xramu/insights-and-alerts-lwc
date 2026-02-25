import { LightningElement, api } from 'lwc';

/**
 * InsightDetailSection
 * - Displays Details__c (rich text) in a collapsible section
 * - Two buttons: Suggested Action (label from record), and conditional View Record button
 * - Follows parent expand via @api expanded
 *
 * Template rules: no inline expressions/concatenation/function calls in template.
 */
export default class InsightDetailSection extends LightningElement {
  @api recordId;
  @api topic = '';
  @api context = '';
  @api details = '';
  @api rationale = '';
  @api suggestedAction = '';
  @api openRecordUrl = '';
  @api expanded = false;

  detailsExpandedInternal = false;

  connectedCallback() {
    // Keep details expanded by default and sync with parent expanded state
    this.detailsExpandedInternal = this.expanded;
  }

  // Exposed getter for template to determine expanded state
  get detailsExpanded() {
    // If parent is not expanded, force details hidden
    return this.detailsExpandedInternal;
  }

  get expanderClass() {
    return `slds-button slds-section__title-action slds-card round-border detail-expander ${this.detailsExpanded ? 'open' : ''}`;
  }

  get chevronClass() {
    return this.detailsExpanded ? 'chev rotate' : 'chev';
  }

  // Labels and visibility
  get suggestedActionLabel() {
    return this.suggestedAction || 'Suggested Action';
  }

  get showViewButton() {
    return !!this.openRecordUrl;
  }

  get viewButtonLabel() {
    const contextLookup = {
      'Lead': 'View Lead',
      'Account': 'View Account',
      'Opportunity': 'View Opportunity'
    }

    return contextLookup[this.context] || 'View Record';
  }

  // Events / handlers
  toggleDetails = () => {
    this.detailsExpandedInternal = !this.detailsExpandedInternal;
    // Fire a simple event for parent wiring (no payload needed)
    this.dispatchEvent(new CustomEvent('collapse'));
  };

  handleSuggestedAction = () => {
    // Pass record id and action to parent
    const event = new CustomEvent('launchsuggestedaction', {
      bubbles: true,
      composed: true,
      detail: {
        recordId: this.recordId,
        actionName: this.suggestedAction
      }
    })

    this.dispatchEvent(event);
  };

  handleViewRecord = () => {
    if (this.openRecordUrl) {
      // Use window.open to external/relative URL in same tab
      window.open(this.openRecordUrl, '_self');
    }
  };
}
