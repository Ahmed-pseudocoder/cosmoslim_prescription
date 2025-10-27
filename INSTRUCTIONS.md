# How to Connect Your Google Sheet in 5 Minutes

Follow these steps to securely link the application to your Google Sheet. This creates a secure "bridge" so the app can save data without ever exposing your private credentials.

### Step 1: Create Your Google Sheet

1.  Go to [sheets.new](https://sheets.new) to create a new, blank Google Sheet.
2.  Name the sheet whatever you like (e.g., "CosmoSlim Patient Records").
3.  In the very first row (Row 1), create the following headers, one in each cell from A to H:
    `timestamp`, `patientName`, `age`, `date`, `treatment`, `followUpDate`, `instructions`, `session`

    **Important:** The headers must be exactly as written above, in lowercase.

### Step 2: Open the Script Editor

1.  In your new Google Sheet, click on **Extensions** in the top menu.
2.  From the dropdown, select **Apps Script**. A new browser tab will open with the script editor.

### Step 3: Paste the Script Code

1.  Delete any placeholder code that is already in the editor (the `function myFunction() { ... }` part).
2.  Copy the entire block of code from the file `google-apps-script/Code.gs` provided in the project.
3.  Paste this code into the empty script editor.
4.  Click the **Save project** icon (it looks like a floppy disk).

### Step 4: Deploy the Script as a Web App

This is the most important step. We are creating the secure URL that our app will talk to.

1.  At the top right of the script editor, click the blue **Deploy** button.
2.  Select **New deployment** from the dropdown menu.
3.  Click the **gear icon** next to "Select type".
4.  Choose **Web app**.
5.  In the form that appears, fill it out with these exact settings:
    *   **Description:** `CosmoSlim Patient Data API` (or any description you like).
    *   **Execute as:** `Me`.
    *   **Who has access:** `Anyone`.
    
    **Note:** Setting access to `Anyone` does **NOT** mean anyone can see your data. It only means that our web application is allowed to *contact* the script. The script itself protects your sheet. This is safe and necessary.

6.  Click the **Deploy** button.

### Step 5: Authorize Permissions

1.  Google will ask you to authorize the script to access your spreadsheet. This is you giving your own script permission to do its job.
2.  Click **Authorize access**.
3.  Choose your Google account.
4.  You may see a screen that says "Google hasn't verified this app". This is normal. Click **Advanced**, and then click **"Go to (your project name)"**.
5.  On the next screen, click **Allow** to grant the permissions.

### Step 6: Get Your Web App URL

1.  After authorizing, you will see a "Deployment successfully created" message.
2.  It will show you a **Web app URL**. Click the **Copy** button to copy this URL. This is the secure "phone number" for your digital receptionist.

### Step 7: Add the URL to the Application Code

1.  Open the file `services/googleSheetService.ts` in the project editor.
2.  You will see this line at the top:
    ```javascript
    const SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
    ```
3.  Replace the text `PASTE_YOUR_WEB_APP_URL_HERE` with the URL you just copied.
4.  Save the file.

**That's it!** Your application is now securely connected to your Google Sheet. All new records will be saved automatically.
