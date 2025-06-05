# Salesforce Sample Data Upload Instructions

## How to Upload the Sample Data

### 1. **Prepare Your Salesforce Org**
- Make sure all custom objects are created (Guest__c, Staff__c, Room__c, etc.)
- Ensure all custom fields are properly configured
- Verify field types match the data being uploaded

### 2. **Upload Order (Important!)**
Upload in this specific order to avoid reference errors:

1. **Staff__c** (no dependencies)
2. **Guest__c** (no dependencies) 
3. **Room__c** (will link to Guest__c later)
4. **Face_Log__c** (will link to Room__c later)
5. **Alert__c** (will link to Face_Log__c later)
6. **Audio_Log__c** (will link to Guest__c later)
7. **Linen_Stock__c** (will link to Room__c later)

### 3. **Upload Methods**

#### Option A: Data Import Wizard
1. Go to Setup → Data → Data Import Wizard
2. Select "Custom Objects" 
3. Choose your object (e.g., Guest__c)
4. Upload the corresponding CSV file
5. Map fields if needed
6. Review and start import

#### Option B: Data Loader
1. Download Salesforce Data Loader
2. Login with your credentials
3. Select "Insert" operation
4. Choose object and CSV file
5. Map fields and execute

#### Option C: Workbench
1. Go to workbench.developerforce.com
2. Login to your org
3. Go to Data → Insert
4. Select object and upload CSV
5. Map fields and insert

### 4. **After Upload - Link Records**

After uploading all data, you'll need to link some records:

#### Link Guests to Rooms:
\`\`\`sql
-- Update Room records to reference Guest records
-- You'll need to get the actual Salesforce IDs after upload
\`\`\`

#### Link Face Logs to Rooms:
\`\`\`sql
-- Update Face_Log__c records with Room__c references
\`\`\`

#### Link Alerts to Face Logs:
\`\`\`sql
-- Update Alert__c records with Face_Log__c references
\`\`\`

### 5. **Verification**
- Check record counts match CSV row counts
- Verify relationships are properly linked
- Test the application to ensure data displays correctly

### 6. **Troubleshooting**
- **Field mapping errors**: Check field API names match CSV headers
- **Data type errors**: Ensure date formats are correct (YYYY-MM-DDTHH:MM:SSZ)
- **Required field errors**: Make sure all required fields have values
- **Duplicate errors**: Check for duplicate Name values if Name is unique

### 7. **Sample Data Overview**
- **10 Guests** with check-in dates and room assignments
- **8 Staff Members** with different roles and shifts  
- **20 Rooms** with various statuses (Vacant/Occupied/Alerted)
- **15 Face Detection Logs** with different match types
- **10 Security Alerts** with various statuses and types
- **10 Audio Recordings** linked to guest interactions
- **15 Linen Stock Items** with different statuses

This sample data will give you a realistic dataset to test all features of the theft prevention application.
