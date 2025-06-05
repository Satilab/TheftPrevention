# Salesforce Custom Objects Setup Guide

Your Salesforce org needs these custom objects and fields for the Hotel Security System to work properly.

## Required Custom Objects

### 1. Guest__c
**Fields to create:**
- `Photo_URL__c` (Text, 255 characters)
- `Room_No__c` (Text, 50 characters)
- `ID_Proof__c` (Text, 255 characters)
- `Checkin_Time__c` (Date/Time)
- `Checkout_Time__c` (Date/Time)
- `Voice_Log_URL__c` (Text, 255 characters)

### 2. Staff__c
**Fields to create:**
- `Role__c` (Picklist: Receptionist, Security, Manager, Housekeeping)
- `Photo_URL__c` (Text, 255 characters)
- `Shift_Start__c` (Time)
- `Shift_End__c` (Time)

### 3. Room__c
**Fields to create:**
- `Room_No__c` (Text, 10 characters, Required, Unique)
- `Status__c` (Picklist: Available, Occupied, Maintenance, Cleaning)
- `Guest__c` (Lookup to Guest__c)

### 4. Face_Log__c
**Fields to create:**
- `Timestamp__c` (Date/Time, Required)
- `Room__c` (Lookup to Room__c)
- `Match_Type__c` (Picklist: Guest, Staff, Unknown, Intruder)
- `Confidence__c` (Number, 2 decimal places, 0-100)
- `Face_Image_URL__c` (Text, 255 characters)

### 5. Alert__c
**Fields to create:**
- `Alert_Type__c` (Picklist: Intrusion, Unauthorized Access, Suspicious Activity)
- `Face_Log__c` (Lookup to Face_Log__c)
- `Status__c` (Picklist: Open, In Progress, Resolved, Escalated)
- `Assigned_To__c` (Lookup to User)
- `Receptionist_Comment__c` (Long Text Area)
- `Owner_Review__c` (Long Text Area)

### 6. Audio_Log__c
**Fields to create:**
- `Linked_Guest__c` (Lookup to Guest__c)
- `Recording_URL__c` (Text, 255 characters)
- `Timestamp__c` (Date/Time)
- `Duration__c` (Number, 0 decimal places)

### 7. Linen_Stock__c
**Fields to create:**
- `Type__c` (Picklist: Towels, Sheets, Pillowcases, Blankets)
- `Room__c` (Lookup to Room__c)
- `Status__c` (Picklist: Clean, Dirty, In Use, Missing)
- `Issue_Date__c` (Date)
- `Return_Date__c` (Date)

## Quick Setup Steps

1. **Go to Setup** in your Salesforce org
2. **Search for "Object Manager"**
3. **Click "Create" → "Custom Object"**
4. **Create each object above with the specified fields**
5. **Set appropriate permissions** for your users

## Alternative: Use Workbench

You can also use Salesforce Workbench to create these objects programmatically if you prefer.

Once these objects are created, the Hotel Security System will work perfectly with your Salesforce org!
