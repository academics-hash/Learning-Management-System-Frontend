"use client";
import React, { useState } from 'react';
import { useGetAllEnquiriesQuery, useDeleteEnquiryMutation, useUpdateEnquiryMutation, useGetEnquiryStatsQuery } from '@/feature/api/enquiryApi';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { getBaseUrl } from '@/utils/apiConfig';
import {
    Download,
    Trash2,
    Edit,
    Phone,
    User,
    Filter,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    MessageSquare,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import {
    PageHeader,
    Card,
    Button,
    LoadingState,
    ErrorState,
    EmptyState,
    Badge,
    StatCard,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableHeader,
    IconButton,
    Select,
    Modal,
    Textarea
} from '@/app/(admin)/admin/components/AdminUI';

const SalesEnquiriesPage = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [editingEnquiry, setEditingEnquiry] = useState(null);
    const [editData, setEditData] = useState({ status: '', notes: '' });

    const limit = 10;

    // Fetch enquiries
    const { data, isLoading, refetch, isError } = useGetAllEnquiriesQuery({
        status: statusFilter,
        page,
        limit
    });

    // Fetch stats
    const { data: statsData } = useGetEnquiryStatsQuery();

    const [deleteEnquiry, { isLoading: isDeleting }] = useDeleteEnquiryMutation();
    const [updateEnquiry, { isLoading: isUpdating }] = useUpdateEnquiryMutation();

    const enquiries = data?.data?.enquiries || [];
    const pagination = data?.data?.pagination || {};
    const stats = statsData?.data || { total: 0, pending: 0, contacted: 0, converted: 0, rejected: 0 };

    // Export to Excel function
    const exportToExcel = async () => {
        try {
            const response = await fetch(`${getBaseUrl('enquiry')}?limit=10000`, {
                credentials: 'include'
            });
            const allData = await response.json();
            const allEnquiries = allData?.data?.enquiries || [];

            if (allEnquiries.length === 0) {
                toast.error("No data to export");
                return;
            }

            const excelData = allEnquiries.map((enquiry, index) => ({
                'S.No': index + 1,
                'ID': enquiry.id,
                'Name': enquiry.name,
                'Phone Number': enquiry.phoneNumber,
                'Status': enquiry.status,
                'Notes': enquiry.notes || '-',
                'Created At': new Date(enquiry.createdAt).toLocaleString('en-IN'),
                'Updated At': new Date(enquiry.updatedAt).toLocaleString('en-IN')
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            worksheet['!cols'] = [
                { wch: 6 }, { wch: 8 }, { wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 40 }, { wch: 20 }, { wch: 20 }
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Enquiries');
            XLSX.writeFile(workbook, `Enquiries_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success(`Exported ${allEnquiries.length} enquiries successfully!`);
        } catch (error) {
            console.error('Export error:', error);
            toast.error("Failed to export data");
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteEnquiry(deleteId).unwrap();
            toast.success("Enquiry deleted successfully");
            setDeleteId(null);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete enquiry");
        }
    };

    const handleUpdate = async () => {
        if (!editingEnquiry) return;
        try {
            await updateEnquiry({
                id: editingEnquiry.id,
                ...editData
            }).unwrap();
            toast.success("Enquiry updated successfully");
            setEditingEnquiry(null);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update enquiry");
        }
    };

    const startEdit = (enquiry) => {
        setEditingEnquiry(enquiry);
        setEditData({
            status: enquiry.status,
            notes: enquiry.notes || ''
        });
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'contacted': return 'info';
            case 'converted': return 'success';
            case 'rejected': return 'danger';
            default: return 'default';
        }
    };

    if (isLoading) return <LoadingState message="Loading enquiries..." />;
    if (isError) return <ErrorState message="Failed to load enquiries" onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Enquiries Management"
                description="Track and handle customer enquiries for the sales team"
            >
                <Button
                    variant="secondary"
                    icon={Download}
                    onClick={exportToExcel}
                >
                    Export to Excel
                </Button>
            </PageHeader>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Total" value={stats.total} icon={MessageSquare} variant="indigo" />
                <StatCard title="Pending" value={stats.pending} icon={Clock} variant="amber" />
                <StatCard title="Contacted" value={stats.contacted} icon={Phone} variant="indigo" />
                <StatCard title="Converted" value={stats.converted} icon={CheckCircle} variant="emerald" />
                <StatCard title="Rejected" value={stats.rejected} icon={XCircle} variant="pink" />
            </div>

            {/* Filters */}
            <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-500 font-lexend font-bold text-sm">
                        <Filter size={18} className="text-[#DC5178]" />
                        <span>Filter Status:</span>
                    </div>
                    <div className="w-48">
                        <Select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            options={[
                                { label: 'All Statuses', value: '' },
                                { label: 'Pending', value: 'pending' },
                                { label: 'Contacted', value: 'contacted' },
                                { label: 'Converted', value: 'converted' },
                                { label: 'Rejected', value: 'rejected' },
                            ]}
                        />
                    </div>
                </div>
                <div className="text-sm text-gray-400 font-bold font-lexend uppercase tracking-wider">
                    Showing <span className="text-[#DC5178]">{enquiries.length}</span> of <span className="text-gray-900">{stats.total}</span> enquiries
                </div>
            </Card>

            {/* Table */}
            <Card padding="p-0">
                {enquiries.length === 0 ? (
                    <EmptyState
                        icon={MessageSquare}
                        title="No enquiries found"
                        description="There are no enquiries matches your current filters."
                    />
                ) : (
                    <>
                        <Table>
                            <TableHead>
                                <tr>
                                    <TableHeader>User Info</TableHeader>
                                    <TableHeader>Status</TableHeader>
                                    <TableHeader>Notes</TableHeader>
                                    <TableHeader>Created At</TableHeader>
                                    <TableHeader className="text-right">Actions</TableHeader>
                                </tr>
                            </TableHead>
                            <TableBody>
                                {enquiries.map((enquiry) => (
                                    <TableRow key={enquiry.id}>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-gray-900 font-bold font-lexend">
                                                    <User size={14} className="text-[#DC5178]" />
                                                    {enquiry.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold font-jost">
                                                    <Phone size={12} />
                                                    {enquiry.phoneNumber}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(enquiry.status)}>
                                                {enquiry.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-gray-500 max-w-[200px] truncate font-medium font-jost" title={enquiry.notes}>
                                                {enquiry.notes || <span className="text-gray-300 italic">No notes</span>}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs text-gray-400 font-bold font-lexend gap-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} className="text-[#DC5178]" />
                                                    {new Date(enquiry.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-gray-400 opacity-70 ml-4 font-normal">{new Date(enquiry.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <IconButton
                                                    icon={Edit}
                                                    variant="ghost"
                                                    title="Edit Enquiry"
                                                    onClick={() => startEdit(enquiry)}
                                                />
                                                <IconButton
                                                    icon={Trash2}
                                                    variant="danger"
                                                    title="Delete Enquiry"
                                                    onClick={() => setDeleteId(enquiry.id)}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <p className="text-gray-500 font-bold font-lexend text-xs uppercase tracking-wider">
                                    Page <span className="text-[#DC5178]">{page}</span> / <span className="text-gray-900">{pagination.totalPages}</span>
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        icon={ChevronLeft}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                        disabled={page === pagination.totalPages}
                                        icon={ChevronRight}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Card>

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingEnquiry}
                onClose={() => setEditingEnquiry(null)}
                title="Edit Enquiry"
                icon={Edit}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setEditingEnquiry(null)}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={handleUpdate}
                            loading={isUpdating}
                        >
                            Save Changes
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-lexend mb-1">Enquiry From</p>
                        <p className="text-gray-900 font-bold font-lexend">{editingEnquiry?.name}</p>
                        <p className="text-sm text-gray-500 font-medium font-jost">{editingEnquiry?.phoneNumber}</p>
                    </div>

                    <Select
                        label="Status"
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        options={[
                            { label: 'Pending', value: 'pending' },
                            { label: 'Contacted', value: 'contacted' },
                            { label: 'Converted', value: 'converted' },
                            { label: 'Rejected', value: 'rejected' },
                        ]}
                    />

                    <Textarea
                        label="Internal Notes"
                        placeholder="Add some notes about this enquiry..."
                        value={editData.notes}
                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    />
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Delete Enquiry"
                icon={Trash2}
                iconBg="bg-red-50"
                iconColor="text-red-500"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            loading={isDeleting}
                        >
                            Delete Permanently
                        </Button>
                    </>
                }
            >
                <p className="text-gray-500 font-medium font-jost leading-relaxed">
                    Are you sure you want to delete this enquiry? This action cannot be revoked and all data for this lead will be lost.
                </p>
            </Modal>
        </div>
    );
};

export default SalesEnquiriesPage;
