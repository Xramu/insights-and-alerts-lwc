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
  @api suggestedAction = '';
  @api openRecordUrl = '';
  @api expanded = false;

  detailsExpandedInternal = false;

  connectedCallback() {
    // Keep details expanded by default and sync with parent expanded state
    this.detailsExpandedInternal = this.expanded;
  }

  renderedCallback() {
    // Render rich text safely into the container
    const container = this.template.querySelector('.rich-content');
    if (container) {
      // Replace content if changed
      if (container.innerHTML !== (this.details || '')) {
        // Note: RTA content comes from org and WITH SECURITY_ENFORCED is applied server-side.
        // LWC sanitizes dangerous markup when rendering. Avoid script execution.
        // eslint-disable-next-line @lwc/lwc/no-inner-html
        container.innerHTML = this.details || '';
      }
    }
  }

  // Exposed getter for template to determine expanded state
  get detailsExpanded() {
    // If parent is not expanded, force details hidden
    return this.expanded && this.detailsExpandedInternal;
  }

  // Section class and chevron class
  get detailsSectionClass() {
    return this.detailsExpanded ? 'slds-section__content' : 'slds-section__content slds-hide';
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
    // Context-driven label per spec
    switch (this.context) {
      case 'Lead':
        return 'View Lead';
      case 'Account':
        return 'View Account';
      case 'Opportunity':
        return 'View Opportunity';
      case 'Potential':
      case 'To-Do':
      default:
        return 'View Record';
    }
  }

  // Events / handlers
  toggleDetails = () => {
    if (!this.expanded) {
      // Parent not expanded => keep hidden
      return;
    }
    this.detailsExpandedInternal = !this.detailsExpandedInternal;
    // Fire a simple event for parent wiring (no payload needed)
    this.dispatchEvent(new CustomEvent('collapse'));
  };

  handleSuggestedAction = () => {
    // Placeholder; consumers can listen for this event to perform actual action logic
    this.dispatchEvent(
      new CustomEvent('suggestedaction', {
        detail: {
          recordId: this.recordId,
          context: this.context,
          label: this.suggestedActionLabel
        }
      })
    );
  };

  handleViewRecord = () => {
    if (this.openRecordUrl) {
      // Use window.open to external/relative URL in same tab
      window.open(this.openRecordUrl, '_self');
    }
  };
}
