"use client";
import React, { useState } from 'react';
import { useGetAllUsersQuery } from '@/feature/api/authApi';
import * as XLSX from "xlsx";
import { Download, Search, Users, UserCheck, Calendar, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
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
} from "@/app/(admin)/admin/components/AdminUI";

const SalesUsersPage = () => {
    const { data, isLoading, isError, refetch } = useGetAllUsersQuery();
    const allUsers = data?.users || [];

    // Filter out admin, superadmin, mentor, and sales roles
    // The user requested to only see regular users (students)
    const filteredUsers = allUsers.filter(user =>
        user.role !== 'admin' &&
        user.role !== 'superadmin' &&
        user.role !== 'mentor' &&
        user.role !== 'sales'
    );

    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        if (!filteredUsers || filteredUsers.length === 0) return;

        setIsExporting(true);

        setTimeout(() => {
            try {
                const excelData = filteredUsers.map(user => ({
                    "Name": user.name,
                    "Email": user.email,
                    "Phone": user.phone || "N/A",
                    "Role": user.role,
                    "Joined Date": new Date(user.createdAt || user.created_at).toLocaleDateString()
                }));

                const worksheet = XLSX.utils.json_to_sheet(excelData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
                XLSX.writeFile(workbook, "Students_Data.xlsx");

                toast.success("Exported successfully!");
            } catch (error) {
                console.error("Export failed:", error);
                toast.error("Failed to export data");
            } finally {
                setIsExporting(false);
            }
        }, 1000);
    };

    if (isLoading) return <LoadingState message="Loading users..." />;
    if (isError) return <ErrorState message="Failed to load users" onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Student Management"
                description="View all registered students and their details"
            >
                <Button
                    variant="secondary"
                    icon={Download}
                    onClick={handleExport}
                    disabled={filteredUsers.length === 0}
                    loading={isExporting}
                >
                    {isExporting ? 'Exporting...' : 'Export to Excel'}
                </Button>
            </PageHeader>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Total Registered"
                    value={allUsers.length}
                    icon={Users}
                    variant="pink"
                />
                <StatCard
                    title="Students"
                    value={filteredUsers.length}
                    icon={UserCheck}
                    variant="indigo"
                />
                <StatCard
                    title="Joined This Month"
                    value={filteredUsers.filter(u => {
                        const date = new Date(u.createdAt || u.created_at);
                        const now = new Date();
                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }).length}
                    icon={Calendar}
                    variant="emerald"
                />
            </div>

            {/* Users Table */}
            <Card padding="p-0">
                {filteredUsers.length === 0 ? (
                    <EmptyState
                        icon={Search}
                        title="No students found"
                        description="There are currently no registered students in the application."
                    />
                ) : (
                    <Table>
                        <TableHead>
                            <tr>
                                <TableHeader>Student</TableHeader>
                                <TableHeader>Contact Details</TableHeader>
                                <TableHeader>Current Role</TableHeader>
                                <TableHeader>Registration Date</TableHeader>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-10 h-10 border border-gray-100 shadow-sm">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback className="bg-linear-to-br from-[#DC5178] to-indigo-500 text-white text-sm font-bold font-lexend">
                                                    {user.name?.charAt(0).toUpperCase() || "S"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-lexend text-gray-900 text-sm font-bold">
                                                    {user.name}
                                                </h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-lexend mt-0.5">
                                                    UID: {user.id}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-[13px] font-medium font-jost">
                                                <Mail size={12} className="text-[#DC5178]" />
                                                <span className="text-gray-700">{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] font-medium font-jost">
                                                <Phone size={12} className="text-gray-400" />
                                                <span className="text-gray-500">{user.phone || "Not provided"}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="default">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-[13px] font-lexend">
                                            <p className="text-gray-900 font-bold">
                                                {new Date(user.createdAt || user.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                                {new Date(user.createdAt || user.created_at).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Total Footer */}
            {filteredUsers.length > 0 && (
                <div className="text-center py-2">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest font-lexend">
                        Showing <span className="text-[#DC5178]">{filteredUsers.length}</span> Registered Students
                    </p>
                </div>
            )}
        </div>
    );
};

export default SalesUsersPage;
