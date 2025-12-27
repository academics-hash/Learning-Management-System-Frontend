"use client";
import React, { useState } from 'react';
import { useGetAllContactsQuery } from '@/feature/api/contactusApi';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { getBaseUrl } from '@/utils/apiConfig';
import {
    Download,
    Mail,
    User,
    Calendar,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    Inbox,
    Search,
    RefreshCw,
    Phone
} from "lucide-react";
import {
    PageHeader,
    Card,
    Button,
    LoadingState,
    ErrorState,
    EmptyState,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableHeader,
    StatCard,
    Input
} from '@/app/(admin)/admin/components/AdminUI';

const ContactsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);

    // Fetch all contacts
    const { data, isLoading, isError, error, refetch, isFetching } = useGetAllContactsQuery();

    const contacts = data?.data || [];

    // Filter contacts based on search term
    const filteredContacts = contacts.filter(contact =>
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate stats
    const stats = {
        total: contacts.length,
        today: contacts.filter(c => {
            const today = new Date();
            const contactDate = new Date(c.createdAt);
            return contactDate.toDateString() === today.toDateString();
        }).length,
        thisWeek: contacts.filter(c => {
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const contactDate = new Date(c.createdAt);
            return contactDate >= weekAgo;
        }).length,
        thisMonth: contacts.filter(c => {
            const now = new Date();
            const contactDate = new Date(c.createdAt);
            return contactDate.getMonth() === now.getMonth() && contactDate.getFullYear() === now.getFullYear();
        }).length
    };

    // Export to Excel function
    const exportToExcel = async () => {
        try {
            if (contacts.length === 0) {
                toast.error("No data to export");
                return;
            }

            const excelData = contacts.map((contact, index) => ({
                'S.No': index + 1,
                'Name': contact.name,
                'Email': contact.email,
                'Phone': contact.phoneNumber || 'N/A',
                'Message': contact.comment,
                'Received At': new Date(contact.createdAt).toLocaleString('en-IN')
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            worksheet['!cols'] = [
                { wch: 6 }, { wch: 25 }, { wch: 30 }, { wch: 60 }, { wch: 22 }
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Contact Messages');
            XLSX.writeFile(workbook, `Contact_Messages_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success(`Exported ${contacts.length} messages successfully!`);
        } catch (error) {
            console.error('Export error:', error);
            toast.error("Failed to export data");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) return <LoadingState message="Loading contact messages..." />;

    if (isError) return (
        <ErrorState
            title="Failed to load contacts"
            message={error?.data?.message || "Something went wrong while fetching contact messages."}
            onRetry={refetch}
        />
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Contact Messages"
                description="View and manage contact form submissions from your website"
            >
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        icon={RefreshCw}
                        onClick={refetch}
                        loading={isFetching}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="secondary"
                        icon={Download}
                        onClick={exportToExcel}
                    >
                        Export to Excel
                    </Button>
                </div>
            </PageHeader>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Messages" value={stats.total} icon={Inbox} variant="indigo" />
                <StatCard title="Today" value={stats.today} icon={Calendar} variant="emerald" />
                <StatCard title="This Week" value={stats.thisWeek} icon={MessageSquare} variant="amber" />
                <StatCard title="This Month" value={stats.thisMonth} icon={Mail} variant="pink" />
            </div>

            {/* Search */}
            <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC5178]/30 focus:border-[#DC5178]/50 transition-all font-jost text-sm"
                        />
                    </div>
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-300 font-bold font-lexend uppercase tracking-wider">
                    Showing <span className="text-[#DC5178]">{filteredContacts.length}</span> of <span className="text-gray-900 dark:text-white">{stats.total}</span> messages
                </div>
            </Card>

            {/* Table */}
            <Card padding="p-0">
                {filteredContacts.length === 0 ? (
                    <EmptyState
                        icon={Inbox}
                        title="No contact messages found"
                        description={searchTerm ? "No messages match your search criteria." : "You haven't received any contact form submissions yet."}
                    />
                ) : (
                    <Table>
                        <TableHead>
                            <tr>
                                <TableHeader>Contact Info</TableHeader>
                                <TableHeader>Message</TableHeader>
                                <TableHeader>Received At</TableHeader>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {filteredContacts.map((contact) => (
                                <TableRow
                                    key={contact.id}
                                    className="cursor-pointer hover:bg-pink-50/50 dark:hover:bg-pink-900/10"
                                    onClick={() => setSelectedContact(selectedContact?.id === contact.id ? null : contact)}
                                >
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold font-lexend">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center border border-pink-200 dark:border-pink-800">
                                                    <span className="text-[#DC5178] text-sm font-bold">
                                                        {contact.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <span>{contact.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-semibold font-jost ml-10">
                                                <Mail size={12} className="text-[#DC5178]" />
                                                {contact.email}
                                            </div>
                                            {contact.phoneNumber && (
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-semibold font-jost ml-10">
                                                    <Phone size={12} className="text-[#DC5178]" />
                                                    {contact.phoneNumber}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p
                                            className={`text-sm text-gray-600 dark:text-gray-300 font-medium font-jost transition-all duration-300 ${selectedContact?.id === contact.id
                                                ? 'whitespace-normal'
                                                : 'max-w-[300px] truncate'
                                                }`}
                                            title={contact.comment}
                                        >
                                            {contact.comment || <span className="text-gray-300 dark:text-gray-600 italic">No message</span>}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs text-gray-400 font-bold font-lexend gap-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} className="text-[#DC5178]" />
                                                {formatDate(contact.createdAt)}
                                            </span>
                                            <span className="text-gray-400 opacity-70 ml-4 font-normal">
                                                {formatTime(contact.createdAt)}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Expanded Contact Detail Modal/Panel */}
            {selectedContact && (
                <Card className="animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold font-lexend text-gray-900 dark:text-white">
                                Message Details
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-jost">
                                Received on {formatDate(selectedContact.createdAt)} at {formatTime(selectedContact.createdAt)}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedContact(null)}
                        >
                            Close
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-lexend mb-2">From</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center border border-pink-200 dark:border-pink-800">
                                        <span className="text-[#DC5178] text-lg font-bold">
                                            {selectedContact.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-900 dark:text-white font-bold font-lexend">{selectedContact.name}</p>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <a
                                                href={`mailto:${selectedContact.email}`}
                                                className="text-sm text-[#DC5178] hover:underline font-medium font-jost flex items-center gap-1"
                                            >
                                                <Mail size={14} />
                                                {selectedContact.email}
                                            </a>
                                            {selectedContact.phoneNumber && (
                                                <a
                                                    href={`tel:${selectedContact.phoneNumber}`}
                                                    className="text-sm text-gray-500 hover:text-[#DC5178] font-medium font-jost flex items-center gap-1"
                                                >
                                                    <Phone size={14} />
                                                    {selectedContact.phoneNumber}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-lexend mb-2">Message</p>
                                <p className="text-gray-700 dark:text-gray-200 font-medium font-jost leading-relaxed whitespace-pre-wrap">
                                    {selectedContact.comment}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <a
                            href={`mailto:${selectedContact.email}?subject=Re: Your message on Stackup Learning Hub`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#DC5178] hover:bg-[#c94570] text-white rounded-xl font-lexend text-sm font-semibold transition-all"
                        >
                            <Mail size={16} />
                            Reply via Email
                        </a>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ContactsPage;
