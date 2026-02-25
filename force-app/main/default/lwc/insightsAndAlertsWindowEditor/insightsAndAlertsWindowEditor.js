import { LightningElement, api, track } from 'lwc';

export default class InsightsAndAlertsWindowEditor extends LightningElement {
  @api inputVariables = [];
  @track contextItems = [];

  defaultContextItems = [
    {
      id: 0,
      label: 'Potentials',
      context: 'Potential',
      color: '#b4d1de'
    },
    {
      id: 1,
      label: 'Leads',
      context: 'Lead',
      color: '#b4d1de'
    },
    {
      id: 2,
      label: 'Accounts',
      context: 'Account',
      color: '#b4d1de'
    },
    {
      id: 3,
      label: 'Opportunities',
      context: 'Opportunity',
      color: '#b4d1de'
    },
    {
      id: 4,
      label: 'To-Dos',
      context: 'To-Do',
      color: '#b4d1de'
    },
  ]

  connectedCallback() {
    const param = this.inputVariables.find(v => v.name === 'contextItemsJson');

    if (param && param.value) {
      try {
        this.contextItems = JSON.parse(param.value);
      } catch (e) {
        console.error('Failed to parse existing value of contextItemsJson! Falling back to default set...');
        // Default when parsing was unsuccessful
        this.contextItems = this.defaultContextItems;
      }
    } else {
      // Default when previous was empty
      this.contextItems = this.defaultContextItems;
    }
  }

  handleInputChange(event) {
    const { id, field } = event.target.dataset;
    const val = event.target.value;

    // Update the given field with the given value
    this.contextItems = this.contextItems.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    })

    this.dispatchUpdate();
  }

  handleAdd() {
    this.contextItems = [ ...this.contextItems, { id: Date.now(), label: '', context: '', color: '#ffffff' } ];
    
    this.dispatchUpdate();
  }

  handleDelete(event) {
    const id = event?.target?.dataset?.id;
    this.contextItems = this.contextItems.filter((item) => item.id !== id);

    this.dispatchUpdate();
  }

  dispatchUpdate() {
    // Send context items as a JSON string to window
    const event = new CustomEvent('configuration_editor_input_value_changed', {
      bubbles: true,
      composed: true,
      detail: {
        name: 'contextItemsJson',
        newValue: JSON.stringify(this.contextItems),
        newValueDataType: 'String'
      }
    });

    this.dispatchEvent(event);
  }
}