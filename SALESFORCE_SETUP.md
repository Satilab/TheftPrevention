# Salesforce Integration Setup

This application includes Salesforce integration for managing guest data and security incidents. Follow these steps to set up the integration:

## Current Status
The application currently uses **mock data** for demonstration purposes. To enable real Salesforce integration, follow the setup steps below.

## Setup Steps

### 1. Create a Salesforce Connected App
1. Log in to your Salesforce org
2. Go to Setup → Apps → App Manager
3. Click "New Connected App"
4. Fill in the required fields:
   - Connected App Name: "Hotel Security System"
   - API Name: "Hotel_Security_System"
   - Contact Email: Your email
5. Enable OAuth Settings:
   - Callback URL: `https://your-domain.com/oauth/callback`
   - Selected OAuth Scopes: "Full access (full)"
6. Save and note the Consumer Key and Consumer Secret

### 2. Configure Environment Variables
Add these variables to your `.env.local` file:

\`\`\`bash
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_CLIENT_ID=your_consumer_key_here
SALESFORCE_CLIENT_SECRET=your_consumer_secret_here
SALESFORCE_USERNAME=your_salesforce_username
SALESFORCE_PASSWORD=your_salesforce_password
SALESFORCE_SECURITY_TOKEN=your_security_token
\`\`\`

### 3. Create Custom Fields
Add these custom fields to your Salesforce org:

#### Contact Object:
- `Hotel_Guest_ID__c` (Text, 50 characters)
- `Room_Number__c` (Text, 10 characters)
- `Check_In_Date__c` (Date)
- `Check_Out_Date__c` (Date)
- `Guest_Status__c` (Picklist: Checked In, Checked Out, VIP, Blacklisted)

#### Case Object:
- `Room_Number__c` (Text, 50 characters)
- `Alert_Type__c` (Picklist: intrusion, voice, suspicious, motion, system)
- `Confidence_Score__c` (Number, 2 decimal places)
- `Incident_Time__c` (DateTime)
- `Evidence_URL__c` (URL)
- `Assigned_Staff__c` (Text, 100 characters)

### 4. Create Record Types
Create a "Security Incident" record type for the Case object.

### 5. Install Dependencies
\`\`\`bash
npm install jsforce
\`\`\`

### 6. Test the Connection
1. Restart your application
2. Go to Owner → Settings → Salesforce tab
3. Check if the connection status shows "Connected"

## Features Available with Salesforce Integration

- **Guest Management**: Sync guest data with Salesforce Contacts
- **Security Cases**: Automatically create cases for security incidents
- **Real-time Sync**: Bidirectional data synchronization
- **Reporting**: Use Salesforce reports and dashboards for analytics

## Troubleshooting

### Connection Issues
- Verify your credentials are correct
- Check that your IP is whitelisted in Salesforce
- Ensure the security token is appended to your password

### Custom Field Issues
- Make sure all custom fields are created with the exact API names
- Verify field permissions for your user profile

### API Limits
- Monitor your Salesforce API usage
- Consider implementing caching for frequently accessed data

## Mock Data Mode
When Salesforce credentials are not configured, the application runs in mock data mode:
- All functionality works with simulated data
- No external API calls are made
- Perfect for development and testing
