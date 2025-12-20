# Excel Export Feature - Documentation

## Overview

Added Excel export functionality to the admin enquiries page, allowing administrators to download all enquiry data as an Excel file.

## Features

### ✨ **Export Button**

- **Location**: Top right of the page, next to the page title
- **Icon**: Download icon (BiDownload)
- **Color**: Green background with hover effects
- **Text**: "Export to Excel"

### 📊 **Export Functionality**

#### **What Gets Exported:**

- All enquiries (not just current page)
- Complete data including:
  - Serial Number (S.No)
  - ID
  - Name
  - Phone Number
  - Status
  - Notes
  - Created At (formatted)
  - Updated At (formatted)

#### **File Details:**

- **Format**: `.xlsx` (Excel format)
- **Filename**: `Enquiries_YYYY-MM-DD.xlsx`
  - Example: `Enquiries_2025-12-18.xlsx`
- **Sheet Name**: "Enquiries"

#### **Column Widths:**

Optimized for readability:

- S.No: 6 characters
- ID: 8 characters
- Name: 25 characters
- Phone Number: 15 characters
- Status: 12 characters
- Notes: 40 characters
- Created At: 20 characters
- Updated At: 20 characters

## How It Works

### User Flow:

```
Admin clicks "Export to Excel" button
    ↓
System fetches ALL enquiries from API
    ↓
Data is formatted for Excel
    ↓
Excel file is generated
    ↓
File downloads automatically
    ↓
Success toast notification shown
```

### Technical Implementation:

1. **Fetch All Data:**

   ```javascript
   fetch(`http://localhost:8080/api/v1/enquiry?limit=10000`);
   ```

   - Fetches up to 10,000 enquiries
   - Bypasses pagination

2. **Format Data:**

   ```javascript
   const excelData = allEnquiries.map((enquiry, index) => ({
     "S.No": index + 1,
     ID: enquiry.id,
     Name: enquiry.name,
     // ... other fields
   }));
   ```

3. **Create Excel File:**
   ```javascript
   const worksheet = XLSX.utils.json_to_sheet(excelData);
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");
   XLSX.writeFile(workbook, fileName);
   ```

## Excel File Structure

### Example Output:

| S.No | ID  | Name     | Phone Number | Status    | Notes           | Created At        | Updated At        |
| ---- | --- | -------- | ------------ | --------- | --------------- | ----------------- | ----------------- |
| 1    | 1   | John Doe | 9876543210   | pending   | -               | 18/12/2025, 12:00 | 18/12/2025, 12:00 |
| 2    | 2   | Jane S.  | 9123456789   | contacted | Called customer | 17/12/2025, 10:30 | 17/12/2025, 15:45 |
| 3    | 3   | Bob K.   | 9988776655   | converted | Enrolled        | 16/12/2025, 09:15 | 16/12/2025, 14:20 |

## Features

### ✅ **Automatic Formatting:**

- Dates formatted in Indian locale
- Empty notes shown as "-"
- Serial numbers auto-generated
- Column widths optimized

### ✅ **Error Handling:**

- Shows error if no data to export
- Handles network errors gracefully
- Console logs errors for debugging

### ✅ **User Feedback:**

- Success toast: "Exported X enquiries successfully!"
- Error toast: "Failed to export data"
- Shows count of exported records

## Usage

### For Admins:

1. Navigate to `/admin/enquiries`
2. Click "Export to Excel" button (top right)
3. Wait for file to download
4. Open the Excel file
5. View/analyze all enquiry data

### Use Cases:

- **Reporting**: Generate monthly/weekly reports
- **Analysis**: Analyze enquiry patterns
- **Backup**: Keep offline backup of data
- **Sharing**: Share data with team members
- **Import**: Import into other systems
- **Printing**: Print enquiry lists

## Customization

### Change Export Limit:

```javascript
const response = await fetch(
  `http://localhost:8080/api/v1/enquiry?limit=10000`,
  {
    credentials: "include",
  }
);
// Change 10000 to your desired limit
```

### Change Filename Format:

```javascript
const fileName = `Enquiries_${new Date().toISOString().split("T")[0]}.xlsx`;
// Modify to: `MyCompany_Enquiries_${Date.now()}.xlsx`
```

### Add More Columns:

```javascript
const excelData = allEnquiries.map((enquiry, index) => ({
  "S.No": index + 1,
  ID: enquiry.id,
  Name: enquiry.name,
  "Phone Number": enquiry.phoneNumber,
  Status: enquiry.status,
  Notes: enquiry.notes || "-",
  "Created At": new Date(enquiry.createdAt).toLocaleString("en-IN"),
  "Updated At": new Date(enquiry.updatedAt).toLocaleString("en-IN"),
  // Add new columns here:
  Email: enquiry.email || "-",
  Source: enquiry.source || "-",
}));
```

### Change Column Widths:

```javascript
worksheet["!cols"] = [
  { wch: 6 }, // S.No
  { wch: 8 }, // ID
  { wch: 30 }, // Name (increased from 25)
  // ... modify as needed
];
```

## Advanced Features (Future Enhancements)

### Potential Additions:

1. **Filter Export**: Export only filtered data
2. **Date Range**: Export data for specific date range
3. **Multiple Formats**: CSV, PDF export options
4. **Scheduled Exports**: Auto-export daily/weekly
5. **Email Export**: Send export via email
6. **Custom Columns**: Let admin choose columns
7. **Styling**: Add colors, borders to Excel
8. **Charts**: Include charts in Excel
9. **Multiple Sheets**: Separate sheets by status
10. **Compression**: ZIP large exports

## Technical Details

### Library Used:

- **xlsx** (SheetJS)
- Version: ^0.18.5
- Already installed in package.json

### Browser Compatibility:

- Works on all modern browsers
- Chrome, Firefox, Safari, Edge
- Downloads directly to Downloads folder

### Performance:

- Fast for up to 10,000 records
- Processes in browser (no server load)
- Instant download

### File Size:

- Approximately 10-20 KB per 100 records
- 1000 records ≈ 100-200 KB
- Very efficient compression

## Error Scenarios

### No Data:

```
Toast: "No data to export"
```

### Network Error:

```
Toast: "Failed to export data"
Console: Full error details
```

### API Error:

```
Toast: "Failed to export data"
Console: API error response
```

## Testing Checklist

- [ ] Click export button
- [ ] Verify file downloads
- [ ] Check filename format
- [ ] Open Excel file
- [ ] Verify all columns present
- [ ] Check data accuracy
- [ ] Test with no data
- [ ] Test with large dataset
- [ ] Verify date formatting
- [ ] Check column widths

## Security

- Uses credentials: 'include' for authentication
- Only accessible to admin users
- No sensitive data exposure
- Client-side processing (secure)

## Button Styling

```css
Background: Green (#16a34a / green-600)
Hover: Darker green (#15803d / green-700)
Shadow: Green glow on hover
Icon: Download icon (20px)
Text: "Export to Excel"
Font: Lexend
Padding: 24px horizontal, 12px vertical
Border Radius: 8px (rounded-lg)
```

## Success Message

Shows count of exported records:

```
"Exported 150 enquiries successfully!"
```

## Notes

- Export fetches ALL data, not just current page
- Limit set to 10,000 to prevent memory issues
- Can be increased if needed
- File downloads immediately
- No server-side processing required
- Works offline after data is fetched

## Support

For issues or enhancements:

1. Check browser console for errors
2. Verify API is accessible
3. Ensure xlsx library is installed
4. Check network tab for API calls
