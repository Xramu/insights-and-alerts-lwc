## Task Description

Create an Insights and Alerts Lightning Web Component called `InsightsAndAlertsWindow` following the description inside this prompt.

The code should follow standard Salesforce styling and development best practices and be deployable to scratch org or sandbox.

Keep it fun and readable.

## Custom Object References

Object:
- Use the custom object `Insight_and_Alert__c` to read the needed records.
- The `Completed__c` checkbox field is possible to be written to.

Fields inside `Insight_and_Alert__c`:
- `Completed__c`: Checkbox status of this insight being completed or not.
- `Context__c`: Picklist field classifying this insight's context type.
- `Details__c`: Rich text area containing this insight's in-depth details.
- `Open_Record__c`: URL of the record that this insight is created of.
- `Rationale__c`: Shorter details of the insight and its context.
- `Suggested_Action__c`: Name of the action that is suggested for this insight.
- `Topic__c`: Title of the insight.

Read the metadata of the project to find field types and other details.

## Related Colors

`Context__c` picklist related colors in hex:
- Potential: `#b4d1de`
- Lead: `#1894c9`
- Account: `#97c39b`
- Opportunity: `#c9b4de`
- To-Do: `#efe183`

## Component Layout Specifications

Layout vertically of the component from the top to the bottom is:
- LWC Title Row
- LWC Description Row
- Context Filter Row
- Insights List

### LWC Title Row

The title row contains this lightning web component's label and a lightning-refresh button.

The label is aligned normally to the left and the text is set as `Intelligent Alerts`.

The refresh button is on the same row but aligned to the right.

### LWC Description Row

The description row is located underneath the title row with a short non-bold label with the text `Today's Priorities & Insights`.

### Context Filter Row

The context filter row is located underneath the description row.

The context filter row's function is to allow the filtering of the loaded insights.

The context row includes a button of each possible picklist item for the `Context__c` field for the `Insight_and_Alert__c` object.

In the beginning of the button row there is also an extra button labeled `All` that will show all the insights when selected. This is also the default state to show the component in.

Each button's label is as follows:
- All: `All`
- Potential: `Potentials`
- Lead: `Leads`
- Account: `Accounts`
- Opportunity: `Opportunities`
- To-Do: `To-Do`

The filter buttons are grey when not selected. When a button is clicked and that filter is used, the button is colored in their related color defined above in the `Related Colors` section.

When the `All` filter is selected, the All button is colored in darker grey.

When a filter button is pressed, the Insights List will update in real time to show only records that match the filtering criteria.

### Insights List

The insights list is located underneath the context filter row.

The insights list has an expandable section for each `Insight_and_Alert__c` record that matches the current context filter.

The insights list works in an accordion style, but does not use lightning accordion because it needs to show multiple elements inside the collapsed view.

Each expandable section, even when collapsed will always show:
- `Topic__c` as its title label.
- A color coded badge with a label on the right side.<br>
The badge is labeled and colored based on its record's `Context__c` field.<br>
The labels and colors are matched with the filtering button labels and colors.
- `Completed__c` as a checkbox on the right side of the label.
- `Rationale__c` as a description under the label

Each expandable section contains a child LWC called `Insight Detail Section` that the record gets passed to.

The Insight Detail Section gets only shown when the section is expanded.

Multiple sections can be expanded at the same time.

#### Insight Detail Section

The `InsightDetailSection` should be its own component separate from the main `InsightsAndAlertsWindow` component and gets created dynamically inside the Insights List for each filtered insight record.

The Insight Details Section has a reference to a single `Insight_and_Alert__c` record that it will display.

The Insight Detail Section should contain the following items stacked vertically:
- Expandable section for showing the `Details__c` of this section's record. Label the expandable section `Details` and keep it collapsed by default.
- Row with two lightning buttons.<br>
First button is labeled with the value of `Suggested_action__c` field of this section's record.<br>
Second button is the `View Record Button`.

The `View Record Button` will dynamically change based on the `Context__c` of the record in the following way:
- Potential: Label will be set to `View Record`
- Lead: Label will be set to `View Lead`
- Account: Label will be set to `View Account`
- Opportunity: Label will be set to `View Opportunity`
- To-Do: Label will be set to `View Record`

When the `View Record Button` is pressed, the URL inside the `Open_Record__c` field will be opened.

If `Open_Record__c` field is empty, the `View Record Button` will not be rendered at all.

The expandable section for showing `Details__c` will collapse if the record that it belongs to gets collapsed.

## User Interface Requirements

The user can press the checkmark on each expandable section to toggle the completed state of that section's insight record. The change will be saved to the record instantly whenever changed.

## Extra Specifications

- The title label, badge, rationale description and completed checkbox is always shown in the same way no matter if the insight section is collapsed or not. The additional expanded information is just expanded underneath them.
- Keep the project modular and easy to read.
- Create the filtering system in a easy to expand style.
- Just create a deployable exposed lightning web component, do not create any kind of page for it.