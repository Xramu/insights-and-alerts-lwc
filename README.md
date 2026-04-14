# Insights & Alerts Lightning Web Component

Disclaimer: This is a demo component for demo purposes only. The base of the code is generated using Agentforce Vibes that I started to build on, code quality may vary!

Custom Lightning Web Component that reads and displays custom insight objects from the Salesforce org. Gives a compact yet expandable view of each insight and allows filtering based on the context.

![Image of the custom Lightning Web Component.](images/insights-and-alerts-component.png)

Note: All of the data in the picture is mockup data and not based on anything real.

# Table of Contents

- [VS Code for Salesforce DX Setup](#vs-code-for-salesforce-dx-setup)
- [Deployment](#deployment)
- [Deployment (Agentforce Vibes)](#deploy-with-agentforce-vibes)
- [Deployment (Manual)](#manual-deployment)
- [View the Insights and Alerts Component](#view-the-insights-and-alerts-component)

## VS Code for Salesforce DX Setup

[Resources for installing VSCode for Salesforce DX projects](https://developer.salesforce.com/docs/platform/sfvscode-extensions/overview)

# Deployment

To deploy to your org, you will first need to:
1. Install VS Code, Salesforce CLI and a version of the JDK (See the link above)

2. Authorize the org through the Command Palette pressing `Cmd + Shift + P` or `Ctrl + Shift + P` and selecting `SFDX: Authorize an Org`

## Deploy with Agentforce Vibes

This deployment method uses Agentforce Vibes' Workflow functionailty. Make sure you have authorized your org.

To deploy with the included workflow:

1. Open Agentforce Vibes chat window and write the command `/deploy_component.md`

    ![Preview of the chat window having the command written inside it.](images/deploy_command_preview.png)

2. After a successful deployment, you can view the component by following [View the Insights and Alerts Component](#view-the-insights-and-alerts-component)

If Agentforce Vibes ran into issues or you can not see the component after running the workflow, you can try again with a new chat by pressing the `+` Sign at the top of the Agentforce Vibes chat window.

Follow the [Manual Deployment](#manual-deployment) steps if the deployment with Agentforce Vibes does not work.

## Manual Deployment

1. Right-click the `force-app` folder and selecting `SFDX: Deploy This Source to Org`

2. Create or import `Insight_and_Alert__c` objects into your org.

3. Add the `Insights And Alerts Window` custom component to a page inside your org.

## View the Insights and Alerts Component