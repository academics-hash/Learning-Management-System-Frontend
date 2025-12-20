# Enquiry API - Frontend Documentation

## Overview

RTK Query API for managing enquiries in the frontend. Provides hooks for submitting enquiries (public) and managing them (admin).

## Installation

The enquiry API has been integrated into the Redux store and is ready to use.

## Available Hooks

### 1. `useSubmitEnquiryMutation` (Public)

Submit a new enquiry - No authentication required.

```javascript
import { useSubmitEnquiryMutation } from "@/feature/api/enquiryApi";

function EnquiryForm() {
  const [submitEnquiry, { isLoading, isSuccess, isError, error }] =
    useSubmitEnquiryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await submitEnquiry({
        name: "John Doe",
        phoneNumber: "9876543210",
      }).unwrap();

      console.log("Success:", result);
      // Show success message
    } catch (err) {
      console.error("Error:", err);
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
```

### 2. `useGetAllEnquiriesQuery` (Admin)

Fetch all enquiries with pagination and filtering.

```javascript
import { useGetAllEnquiriesQuery } from "@/feature/api/enquiryApi";

function EnquiryList() {
  const { data, isLoading, isError } = useGetAllEnquiriesQuery({
    status: "pending", // Optional: filter by status
    page: 1, // Optional: page number
    limit: 10, // Optional: items per page
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading enquiries</div>;

  return (
    <div>
      {data?.data?.enquiries.map((enquiry) => (
        <div key={enquiry.id}>
          <h3>{enquiry.name}</h3>
          <p>{enquiry.phoneNumber}</p>
          <span>{enquiry.status}</span>
        </div>
      ))}

      {/* Pagination info */}
      <p>
        Page {data?.data?.pagination.page} of{" "}
        {data?.data?.pagination.totalPages}
      </p>
    </div>
  );
}
```

### 3. `useGetEnquiryByIdQuery` (Admin)

Fetch a single enquiry by ID.

```javascript
import { useGetEnquiryByIdQuery } from "@/feature/api/enquiryApi";

function EnquiryDetails({ enquiryId }) {
  const { data, isLoading, isError } = useGetEnquiryByIdQuery(enquiryId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Enquiry not found</div>;

  const enquiry = data?.data;

  return (
    <div>
      <h2>{enquiry.name}</h2>
      <p>Phone: {enquiry.phoneNumber}</p>
      <p>Status: {enquiry.status}</p>
      <p>Notes: {enquiry.notes || "No notes"}</p>
    </div>
  );
}
```

### 4. `useUpdateEnquiryMutation` (Admin)

Update enquiry status and notes.

```javascript
import { useUpdateEnquiryMutation } from "@/feature/api/enquiryApi";

function UpdateEnquiry({ enquiryId }) {
  const [updateEnquiry, { isLoading }] = useUpdateEnquiryMutation();

  const handleUpdate = async () => {
    try {
      await updateEnquiry({
        id: enquiryId,
        status: "contacted",
        notes: "Called customer, interested in course",
      }).unwrap();

      console.log("Updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <button onClick={handleUpdate} disabled={isLoading}>
      {isLoading ? "Updating..." : "Mark as Contacted"}
    </button>
  );
}
```

### 5. `useDeleteEnquiryMutation` (Admin)

Delete an enquiry.

```javascript
import { useDeleteEnquiryMutation } from "@/feature/api/enquiryApi";

function DeleteEnquiry({ enquiryId }) {
  const [deleteEnquiry, { isLoading }] = useDeleteEnquiryMutation();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    try {
      await deleteEnquiry(enquiryId).unwrap();
      console.log("Deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      {isLoading ? "Deleting..." : "Delete"}
    </button>
  );
}
```

### 6. `useGetEnquiryStatsQuery` (Admin)

Get enquiry statistics for dashboard.

```javascript
import { useGetEnquiryStatsQuery } from "@/feature/api/enquiryApi";

function EnquiryStats() {
  const { data, isLoading } = useGetEnquiryStatsQuery();

  if (isLoading) return <div>Loading stats...</div>;

  const stats = data?.data;

  return (
    <div className="stats-grid">
      <div>Total: {stats?.total}</div>
      <div>Pending: {stats?.pending}</div>
      <div>Contacted: {stats?.contacted}</div>
      <div>Converted: {stats?.converted}</div>
      <div>Rejected: {stats?.rejected}</div>
    </div>
  );
}
```

## Complete Example: Enquiry Form Component

```javascript
"use client";
import React, { useState } from "react";
import { useSubmitEnquiryMutation } from "@/feature/api/enquiryApi";
import { toast } from "sonner";

export default function EnquiryForm() {
  const [submitEnquiry, { isLoading }] = useSubmitEnquiryMutation();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await submitEnquiry(formData).unwrap();
      toast.success(result.message);

      // Reset form
      setFormData({ name: "", phoneNumber: "" });
    } catch (error) {
      const errorMsg = error?.data?.message || "Failed to submit enquiry";
      toast.error(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          pattern="[6-9][0-9]{9}"
          placeholder="9876543210"
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {isLoading ? "Submitting..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
```

## API Response Structure

### Submit Enquiry Response

```javascript
{
    success: true,
    message: "Enquiry submitted successfully! We will contact you soon.",
    data: {
        id: 1,
        name: "John Doe",
        phoneNumber: "9876543210",
        createdAt: "2025-12-18T06:00:00.000Z"
    }
}
```

### Get All Enquiries Response

```javascript
{
    success: true,
    message: "Enquiries fetched successfully",
    data: {
        enquiries: [...],
        pagination: {
            total: 50,
            page: 1,
            limit: 10,
            totalPages: 5
        }
    }
}
```

## Status Values

- `pending` - New enquiry
- `contacted` - Customer contacted
- `converted` - Customer enrolled
- `rejected` - Enquiry rejected

## Cache Management

The API automatically manages cache invalidation:

- Submitting an enquiry invalidates the enquiry list
- Updating an enquiry invalidates both the specific enquiry and the list
- Deleting an enquiry invalidates the list

## Error Handling

All mutations return errors in the following format:

```javascript
{
    data: {
        success: false,
        message: "Error message here"
    }
}
```

Access error messages using:

```javascript
error?.data?.message || "Default error message";
```
