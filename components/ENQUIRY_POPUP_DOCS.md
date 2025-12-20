# Enquiry Popup Modal - Implementation Summary

## Overview

Created an **Enquiry Popup Modal** that automatically appears after 10 seconds when a user visits the site. This allows visitors to quickly submit their contact information for enquiries.

## Features

### ✨ **Key Features:**

- ⏱️ **10-Second Timer** - Automatically appears after 10 seconds
- 📝 **Simple Form** - Only name and phone number required
- ✅ **Validation** - Indian phone number validation (10 digits, starts with 6-9)
- 🎨 **Beautiful UI** - Matches the pink and black theme
- 🔄 **One-Time Display** - Shows only once per session
- 📱 **Responsive** - Works on all screen sizes
- 🚀 **API Integration** - Connected to backend enquiry API

## Files Created/Modified

### Created:

1. **`fronted/components/EnquiryPopupModal.jsx`**
   - Main popup modal component
   - Form handling and validation
   - API integration

### Modified:

2. **`fronted/app/(root)/layout.jsx`**
   - Added EnquiryPopupModal to the layout

## User Flow

```
User visits site
    ↓
After 10 seconds
    ↓
Enquiry popup appears
    ↓
User fills name & phone
    ↓
Submits form
    ↓
Data saved to database
    ↓
Success message shown
    ↓
Modal closes
```

## Popup Timing Strategy

Currently, there are TWO popups:

1. **AuthPopupModal** - Shows at **5 seconds**

   - For login/registration
   - Only for unauthenticated users

2. **EnquiryPopupModal** - Shows at **10 seconds**
   - For collecting enquiries
   - Shows for all users

### Recommended Configuration:

**Option A: Both Popups (Current)**

- Auth popup at 5s for unauthenticated users
- Enquiry popup at 10s for all users
- Good for maximizing both registrations and enquiries

**Option B: Enquiry Only**

- Remove AuthPopupModal
- Keep only EnquiryPopupModal at 10s
- Simpler user experience

**Option C: Conditional Display**

- Show AuthPopupModal at 5s if user is NOT authenticated
- Show EnquiryPopupModal at 10s if user IS authenticated
- Prevents double popups for unauthenticated users

## Form Fields

### Name Field

- **Type**: Text
- **Required**: Yes
- **Min Length**: 2 characters
- **Max Length**: 100 characters
- **Placeholder**: "Enter your full name"

### Phone Number Field

- **Type**: Tel
- **Required**: Yes
- **Pattern**: `[6-9][0-9]{9}`
- **Validation**: Must be a valid 10-digit Indian phone number
- **Placeholder**: "9876543210"
- **Helper Text**: "Enter a valid 10-digit phone number"

## API Integration

### Endpoint Used:

```
POST /api/v1/enquiry
```

### Request Body:

```json
{
  "name": "John Doe",
  "phoneNumber": "9876543210"
}
```

### Success Response:

```json
{
  "success": true,
  "message": "Enquiry submitted successfully! We will contact you soon.",
  "data": {
    "id": 1,
    "name": "John Doe",
    "phoneNumber": "9876543210",
    "createdAt": "2025-12-18T06:00:00.000Z"
  }
}
```

## Styling

- **Background**: Linear gradient from `#1a1a1a` to `#2a2a2a`
- **Border**: Pink accent (`#DC5178`) with 30% opacity
- **Button**: Pink gradient (`#DC5178` to `#c03e62`)
- **Inputs**: Dark background (`#363538`) with pink focus ring
- **Fonts**:
  - Headings: Lexend
  - Body: Jost

## User Actions

1. **Submit** - Submits the enquiry
2. **Maybe Later** - Closes the modal without submitting
3. **Close (X)** - Closes the modal using the close button

## Privacy

Includes a privacy note:

> "We respect your privacy. Your information will be kept confidential."

## Loading States

- Shows spinner icon while submitting
- Button disabled during submission
- Button text changes to "Submitting..."

## Error Handling

- Form validation errors shown inline
- API errors shown via toast notifications
- Network errors handled gracefully

## Toast Notifications

### Success:

```
"Enquiry submitted successfully! We will contact you soon."
```

### Error:

```
"Failed to submit enquiry. Please try again."
```

(Or specific error message from API)

## Testing

To test the popup:

1. Visit any page in the `(root)` layout
2. Wait 10 seconds
3. Popup should appear
4. Fill in name and phone number
5. Submit the form
6. Check database for the enquiry record

## Customization Options

### Change Timer Duration:

In `EnquiryPopupModal.jsx`, line 28:

```javascript
}, 10000); // Change this value (in milliseconds)
```

### Change Form Fields:

Add more fields in the `formData` state and form JSX

### Change Styling:

Modify the className props to match your design

### Change Modal Behavior:

Modify the `useEffect` hook to change when/how the modal appears

## Integration with Admin Panel

Admins can view all enquiries using:

- `useGetAllEnquiriesQuery()` - List all enquiries
- `useGetEnquiryStatsQuery()` - View statistics
- `useUpdateEnquiryMutation()` - Update enquiry status
- `useDeleteEnquiryMutation()` - Delete enquiries

## Next Steps

1. **Create Admin Dashboard** - Build UI to manage enquiries
2. **Email Notifications** - Send email when enquiry is submitted
3. **Analytics** - Track conversion rates
4. **A/B Testing** - Test different popup timings
5. **Follow-up System** - Automated follow-up reminders

## Notes

- Modal shows only once per session (uses `useRef`)
- Form resets after successful submission
- Modal closes automatically after submission
- Phone number must start with 6, 7, 8, or 9 (Indian format)
- All data is stored in PostgreSQL database
