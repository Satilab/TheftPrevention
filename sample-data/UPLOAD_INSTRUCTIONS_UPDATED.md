# Salesforce Sample Data Upload Instructions

## Fixed Time Format Issues

The CSV files have been updated with proper Salesforce datetime/time formats:

### Time Fields Format
- **Time fields**: `HH:MM:SS.sssZ` (e.g., `06:00:00.000Z`)
- **DateTime fields**: `YYYY-MM-DDTHH:MM:SS.sssZ` (e.g., `2024-01-20T08:15:00.000Z`)

## Upload Order (Important!)

1. **Staff__c** - Upload first (no dependencies)
2. **Guest__c** - Upload second (no dependencies)
3. **Room__c** - Upload third (no dependencies)
4. **Face_Log__c** - Upload fourth (references Room__c)
5. **Alert__c** - Upload fifth (references Face_Log__c)
6. **Audio_Log__c** - Upload sixth (references Guest__c)
7. **Linen_Stock__c** - Upload last (references Room__c)

## Upload Methods

### Option 1: Data Import Wizard (Recommended for small datasets)
1. Go to Setup → Data → Data Import Wizard
2. Select "Custom Objects"
3. Choose your object (e.g., Staff__c)
4. Upload the CSV file
5. Map fields if needed
6. Review and start import

### Option 2: Data Loader (For larger datasets)
1. Download Salesforce Data Loader
2. Login with your credentials
3. Select "Insert" operation
4. Choose object and CSV file
5. Map fields and execute

## Post-Upload Steps

1. **Verify Record Counts**: Check that all records imported successfully
2. **Update Relationships**: Some lookup relationships may need manual linking
3. **Test the App**: Refresh your theft prevention app to see the data

## Troubleshooting

- **Time Format Errors**: Ensure times are in `HH:MM:SS.sssZ` format
- **Date Format Errors**: Use ISO format `YYYY-MM-DDTHH:MM:SS.sssZ`
- **Lookup Failures**: Upload parent records before child records
- **Field Mapping**: Ensure CSV headers match Salesforce field API names exactly

## Expected Results

After successful upload, you should have:
- 8 Staff members with shift times
- 10 Guests with check-in/out dates
- 20 Rooms with various statuses
- 15 Face detection logs
- 10 Security alerts
- 10 Audio recordings
- 15 Linen stock items

This will populate your dashboards with realistic test data!
