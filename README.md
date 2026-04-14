# Insights & Alerts Lightning Web Component

Disclaimer: This is a demo component for demo purposes only. The base of the code is generated using Agentforce Vibes that I started to build on, code quality may vary!

Custom Lightning Web Component that reads and displays custom insight objects from the Salesforce org. Gives a compact yet expandable view of each insight and allows filtering based on the context.

![Image of the custom Lightning Web Component.](images/insights-and-alerts-component.png)

Note: All of the data in the picture is mockup data and not based on anything real.

# Table of Contents

- [VS Code for Salesforce DX Setup](#vs-code-for-salesforce-dx-setup)
- [Deployment](#deployment)
- [Deploy with Agentforce Vibes](#deploy-with-agentforce-vibes)
- [Manual Deployment](#manual-deployment)
- [View the Insights and Alerts Component](#view-the-insights-and-alerts-component)

## VS Code for Salesforce DX Setup

[Resources for installing VSCode for Salesforce DX projects](https://developer.salesforce.com/docs/platform/sfvscode-extensions/overview)

# Deployment

To deploy to your org, you will first need to:

1. ### Clone the Repository to Your Local Machine

    Use git to clone the repository or download it and open it in Visual Studio Code.

2. ### Connect Your Organization

    Press `Command + Shift + P` on Mac or `Control + Shift + P` on Windows to bring up the Command Palette. Search for the command `SFDX: Authorize an Org` and run it.

3. ### Enable Einstein Generative AI and Agentforce

    The custom object inside the project uses Agentforce's quick actions, so Agentforce needs to be enabled for deployment.

    Open your organization's Setup menu, search and click `Agentforce & Gen AI`

    ![Preview of the Agentforce & Gen AI window inside setup](images/gen_ai_and_agentforce_preview.png)

    Click `Go to Einstein Setup` and enable `Turn on Einstein`

    ![Preview of the Einstein toggle enabled](images/einstein_toggle_preview.png)

    Navigate back to `Agentforce & Gen AI` and click `Go to Agent Studio`

    Enable Agentforce from the top right toggle on the `Agentforce Agents` section

    ![Preview of the Agentforce toggle enabled](images/agentforce_toggle_preview.png)

## Deploy with Agentforce Vibes

This deployment method uses Agentforce Vibes' Workflow functionality. Make sure you have authorized your org.

To deploy with the included workflow:

1. Open Agentforce Vibes chat window and write the command

    ```sh
    /deploy_component.md
    ```

    ![Preview of the chat window having the command written inside it.](images/deploy_command_preview.png)

2. After a successful deployment, you can view the component by following [View the Insights and Alerts Component](#view-the-insights-and-alerts-component)

### Troubleshooting

If Agentforce Vibes ran into issues or you can not see the component after running the workflow, you can try again with a new chat by pressing the `+` Sign at the top of the Agentforce Vibes chat window.

Starting a new task will make sure that any previous chats will not interfere with the workflow process.

![Preview of the Agentforce Vibes chat window highlighting the new task button.](images/new_task_preview.png)

Follow the [Manual Deployment](#manual-deployment) steps if the deployment with Agentforce Vibes does not work.

## Manual Deployment

If deployment with Agentforce Vibes did not work, or you wish to manually deploy the project, follow these steps.

Make sure you have followed the first steps of [Deployment](#deployment) to connect your organization and enable Einstein Gen AI and Agentforce.

1. ### Deploy the Metadata

    Right-click the `force-app` folder and select `SFDX: Deploy This Source to Org` to deploy the needed metadata to your connected organization.

    ![Preview of the force-app folder being right clicked and the "SFDX: Deploy This Source to Org" being highlighted.](images/deploy_this_source_preview.png)

2. ### Assign the Permission Set to View the Component

    The deployed metadata includes a permission set with permissions to view the component. You will need to assign anyone who wants to view the component to the permission set.

    Open your organization's Setup menu, search and click `Permission Sets`

    Search and click the permission set `Alerts And Insights Permissions`

    Click `Manage Assignments`

    ![Preview of the "Manage assignments" button.](images/manage_assignments_preview.png)

    Click `Add Assignment` and select yourself and any other users you want to access the component.

    You should see yourself in the Current Assignments list once you're done.

    ![Preview of the current assignments list showing a user assigned to the permission set.](images/current_assignments_preview.png)

## View the Insights and Alerts Component

Once you have deployed the component either with Vibes or manually, you should be able to see the included Insights and Alerts application inside your organization.

Refresh your browser window by pressing `Command + R` on Mac or `Control + R` on Windows.

Open the App Launcher from the top left and search for `Insights And Alerts`

![Preview of the app launcher highlighting the Insights And Alerts application.](images/app_launcher_preview.png)

Click the Insights And Alerts application to see the demo page with 3 different setups of the component.