# Insights & Alerts Lightning Web Component

Disclaimer: This is a demo component for demo purposes only. The base of the code is generated using Agentforce Vibes that I started to build on, code quality may vary!

Custom Lightning Web Component that reads and displays custom insight objects from the Salesforce org. Gives a compact yet expandable view of each insight and allows filtering based on the context.

![Image of the custom Lightning Web Component.](https://github.com/Xramu/insights-and-alerts-lwc/blob/main/images/insights-and-alerts-component.png)

Note: All of the data in the picture is mockup data and not based on anything real.

## VS Code for Salesforce DX Setup

[Resources for installing VSCode for Salesforce DX projects](https://developer.salesforce.com/docs/platform/sfvscode-extensions/overview)

# Deployment

To deploy to your org, you will need to:
1. Install VS Code, Salesforce CLI and a version of the JDK (See the link above)

2. Authorize the org through the Command Palette pressing `Cmd + Shift + P` or `Ctrl + Shift + P` and selecting `SFDX: Authorize an Org`

3. Right-click the `force-app` folder and selecting `SFDX: Deploy This Source to Org`

4. Create or import `Insight and Alert` objects into your org.

5. Add the `Insights And Alerts Window` custom component to a page inside your org.