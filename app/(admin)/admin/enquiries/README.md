# Admin Enquiries Page - Implementation Summary

## Overview

Created a comprehensive admin page for managing enquiries with a beautiful table interface, statistics dashboard, filtering, and inline editing capabilities.

## Files Created/Modified

### Created:

1. **`fronted/app/(admin)/admin/enquiries/page.jsx`**
   - Main enquiries management page
   - Table view with all enquiry data
   - Inline editing functionality
   - Delete confirmation dialog
   - Statistics cards
   - Pagination
   - Status filtering

### Modified:

2. **`fronted/app/(admin)/admin/components/AdminSidebar.jsx`**
   - Added "Enquiries" link to sidebar navigation
   - Added MessageSquare icon from lucide-react

## Features

### ✨ **Statistics Dashboard**

- **Total Enquiries** - Shows total count
- **Pending** - Yellow card with pending count
- **Contacted** - Blue card with contacted count
- **Converted** - Green card with converted count
- **Rejected** - Red card with rejected count

### 📊 **Table Features**

- **Columns:**
  - ID
  - Name (with user icon)
  - Phone Number (with phone icon)
  - Status (color-coded badges)
  - Notes
  - Created At (formatted date/time)
  - Actions (Edit/Delete buttons)

### 🔍 **Filtering**

- Filter by status dropdown
- Options: All, Pending, Contacted, Converted, Rejected
- Resets to page 1 when filter changes

### ✏️ **Inline Editing**

- Click Edit button to enable editing mode
- Edit status via dropdown
- Edit notes via text input
- Save or Cancel buttons
- Real-time updates

### 🗑️ **Delete Functionality**

- Delete button for each enquiry
- Confirmation dialog before deletion
- Toast notification on success/error

### 📄 **Pagination**

- 10 entries per page
- Previous/Next buttons
- Page counter
- Shows entry range (e.g., "Showing 1 to 10 of 25 entries")

### 🎨 **Status Color Coding**

- **Pending**: Yellow badge
- **Contacted**: Blue badge
- **Converted**: Green badge
- **Rejected**: Red badge

## UI/UX Design

### Color Scheme:

- **Background**: `#151419` (dark)
- **Cards**: `#1a191f` (slightly lighter)
- **Borders**: White with 10% opacity
- **Primary**: `#DC5178` (pink)
- **Text**: White and gray variations

### Typography:

- **Headings**: Lexend font
- **Body**: Jost font
- **Table**: Clean, readable layout

### Icons:

- **User Icon**: For names
- **Phone Icon**: For phone numbers
- **Edit Icon**: For edit action
- **Delete Icon**: For delete action
- **MessageSquare Icon**: Sidebar navigation

## API Integration

### Hooks Used:

```javascript
useGetAllEnquiriesQuery({ status, page, limit });
useGetEnquiryStatsQuery();
useUpdateEnquiryMutation();
useDeleteEnquiryMutation();
```

### API Endpoints:

- `GET /api/v1/enquiry?status=&page=&limit=` - List enquiries
- `GET /api/v1/enquiry/stats` - Get statistics
- `PUT /api/v1/enquiry/:id` - Update enquiry
- `DELETE /api/v1/enquiry/:id` - Delete enquiry

## User Flow

### Viewing Enquiries:

```
Admin clicks "Enquiries" in sidebar
    ↓
Page loads with stats and table
    ↓
Admin can filter by status
    ↓
Admin can navigate pages
```

### Editing Enquiry:

```
Admin clicks Edit button
    ↓
Row enters edit mode
    ↓
Admin changes status/notes
    ↓
Admin clicks Save
    ↓
Data updated in database
    ↓
Success toast shown
    ↓
Table refreshed
```

### Deleting Enquiry:

```
Admin clicks Delete button
    ↓
Confirmation dialog appears
    ↓
Admin confirms deletion
    ↓
Enquiry deleted from database
    ↓
Success toast shown
    ↓
Table refreshed
```

## Responsive Design

- Table scrolls horizontally on small screens
- Stats cards stack on mobile
- Maintains readability across devices

## Loading States

- Full-page loader on initial load
- Button disabled states during actions
- "Saving..." and "Deleting..." text feedback

## Error Handling

- Toast notifications for all errors
- Graceful fallbacks for missing data
- Network error handling

## Empty State

- Shows "No enquiries found" message
- Displayed when no data matches filters

## Date Formatting

- Indian locale format
- Shows: DD MMM YYYY, HH:MM
- Example: "18 Dec 2025, 12:00"

## Sidebar Navigation

- **Route**: `/admin/enquiries`
- **Icon**: MessageSquare (chat bubble icon)
- **Position**: Between "Lectures" and "Users"
- **Active State**: Pink background when on enquiries page

## Table Interactions

### Hover Effects:

- Row hover: Slight background highlight
- Button hover: Icon color change
- Edit/Delete buttons: Background color on hover

### Click Actions:

- Edit: Opens inline editing mode
- Delete: Opens confirmation dialog
- Save: Updates and closes edit mode
- Cancel: Discards changes and closes edit mode

## Statistics Cards Layout

```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│  Total  │ Pending │Contacted│Converted│Rejected │
│   150   │   45    │   60    │   30    │   15    │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

## Table Layout

```
┌────┬──────────┬──────────────┬─────────┬────────┬────────────┬─────────┐
│ ID │   Name   │Phone Number  │ Status  │ Notes  │Created At  │ Actions │
├────┼──────────┼──────────────┼─────────┼────────┼────────────┼─────────┤
│ #1 │ John Doe │ 9876543210   │ Pending │   -    │18 Dec 2025 │ 🖊️ 🗑️  │
└────┴──────────┴──────────────┴─────────┴────────┴────────────┴─────────┘
```

## Customization Options

### Change Items Per Page:

In `page.jsx`, line 18:

```javascript
const limit = 10; // Change this value
```

### Change Status Colors:

In `getStatusColor` function:

```javascript
case 'pending': return 'bg-yellow-500/20 text-yellow-500';
// Modify colors as needed
```

### Add More Filters:

Add additional filter dropdowns in the Filters section

### Add Export Functionality:

Add export button to download enquiries as CSV/Excel

## Next Steps

1. **Export Feature** - Add CSV/Excel export
2. **Bulk Actions** - Select multiple enquiries for bulk operations
3. **Search** - Add search by name or phone number
4. **Email Integration** - Send emails directly from the table
5. **Notes History** - Track changes to notes
6. **Assignment** - Assign enquiries to team members
7. **Follow-up Reminders** - Set reminders for follow-ups
8. **Advanced Filters** - Date range, multiple status selection

## Access Control

- Only accessible to admin and superadmin roles
- Protected by admin layout authentication
- Redirects non-admin users to home page

## Performance

- Pagination limits data load
- Efficient API queries
- Optimistic UI updates
- Cached data with RTK Query

## Browser Compatibility

- Works on all modern browsers
- Responsive design for mobile/tablet
- Touch-friendly buttons and controls

## Testing Checklist

- [ ] View enquiries list
- [ ] Filter by status
- [ ] Navigate pages
- [ ] Edit enquiry status
- [ ] Edit enquiry notes
- [ ] Delete enquiry
- [ ] View statistics
- [ ] Check responsive design
- [ ] Test error handling
- [ ] Verify permissions
