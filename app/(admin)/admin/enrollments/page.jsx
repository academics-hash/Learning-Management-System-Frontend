"use client";
import React, { useState } from 'react';
import { useGetAllEnrollmentsQuery, useRevokeCourseAccessMutation, useActivateEnrollmentMutation } from '@/feature/api/enrollmentApi';
import { PageHeader, Card, LoadingState, ErrorState, Badge, typography, Modal, Button } from '../components/AdminUI';
import { Users, GraduationCap, Calendar, Trash2, Search, Filter, Mail, BookOpen, Clock, ShieldCheck, ShieldAlert, Phone, AlertCircle, ShieldX } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';


const AdminEnrollments = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
    const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);

    const { data, isLoading, error, refetch } = useGetAllEnrollmentsQuery();
    const [revokeAccess, { isLoading: isRevoking }] = useRevokeCourseAccessMutation();
    const [activateAccess, { isLoading: isActivating }] = useActivateEnrollmentMutation();

    if (isLoading) return <LoadingState message="Fetching enrollment records..." />;
    if (error) return <ErrorState message="Failed to load enrollments" onRetry={refetch} />;

    const enrollments = data?.enrollments || [];

    const handleRevoke = async () => {
        if (!selectedEnrollment) return;

        try {
            await revokeAccess(selectedEnrollment.id).unwrap();
            toast.success(`Access revoked for ${selectedEnrollment.studentName}`);
            setIsRevokeModalOpen(false);
            setSelectedEnrollment(null);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to revoke access");
        }
    };

    const handleActivate = async () => {
        if (!selectedEnrollment) return;

        try {
            await activateAccess(selectedEnrollment.id).unwrap();
            toast.success(`Access activated for ${selectedEnrollment.studentName}`);
            setIsActivateModalOpen(false);
            setSelectedEnrollment(null);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to activate access");
        }
    };

    const openRevokeModal = (id, studentName, courseTitle) => {
        setSelectedEnrollment({ id, studentName, courseTitle });
        setIsRevokeModalOpen(true);
    };

    const openActivateModal = (id, studentName, courseTitle) => {
        setSelectedEnrollment({ id, studentName, courseTitle });
        setIsActivateModalOpen(true);
    };

    const filteredEnrollments = enrollments.filter(e => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;

        return (
            e.student?.name?.toLowerCase().includes(search) ||
            e.student?.email?.toLowerCase().includes(search) ||
            e.student?.phone?.toLowerCase().includes(search) ||
            e.course?.course_title?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="space-y-8">
            <PageHeader
                title="Course Enrollments"
                description="Manage and monitor student access to your courses"
            />

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4 p-6 border-l-4 border-l-[#DC5178]">
                    <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#DC5178]">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Enrollments</p>
                        <p className="text-2xl font-black text-gray-900 font-lexend">{enrollments.length}</p>
                    </div>
                </Card>

                <Card className="flex items-center gap-4 p-6 border-l-4 border-l-green-500">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Active Access</p>
                        <p className="text-2xl font-black text-gray-900 font-lexend">
                            {enrollments.filter(e => e.is_active).length}
                        </p>
                    </div>
                </Card>

                <Card className="flex items-center gap-4 p-6 border-l-4 border-l-indigo-500">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Last 7 Days</p>
                        <p className="text-2xl font-black text-gray-900 font-lexend">
                            {enrollments.filter(e => {
                                const weekAgo = new Date();
                                weekAgo.setDate(weekAgo.getDate() - 7);
                                return new Date(e.createdAt) >= weekAgo;
                            }).length}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Filter Bar */}
            <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by student, email, phone or course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#DC5178]/20 focus:border-[#DC5178] transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold border border-gray-100 hover:bg-gray-100 transition-all">
                        <Filter size={16} />
                        Filter
                    </button>
                    <Link
                        href="/admin/enrollments/requests"
                        className="flex items-center gap-2 px-4 py-2 bg-[#DC5178] text-white rounded-xl text-sm font-bold border border-[#DC5178] hover:bg-[#c4456a] transition-all shadow-lg shadow-[#DC5178]/20"
                    >
                        <Clock size={16} />
                        View Requests
                    </Link>
                    <button
                        onClick={() => refetch()}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-[#DC5178] rounded-xl text-sm font-bold border border-pink-100 hover:bg-pink-100 transition-all"
                    >
                        <Clock size={16} />
                        Refresh
                    </button>
                </div>
            </Card>

            {/* Enrollment Table */}
            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-jost">
                        <thead className="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Student Details</th>
                                <th className="px-6 py-4">Course Information</th>
                                <th className="px-6 py-4">Payment & Status</th>
                                <th className="px-6 py-4">Enrollment Date</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-jost italic">
                                        {searchTerm ? `No results found for "${searchTerm}"` : 'No enrollment records found.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredEnrollments.map((enr) => (
                                    <tr key={enr.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#DC5178] font-black text-sm shadow-sm ring-2 ring-gray-100">
                                                    {enr.student?.name?.[0]?.toUpperCase() || 'U'}
                                                </div>

                                                <div>
                                                    <p className="text-[14px] font-black text-gray-900 font-lexend">{enr.student?.name || 'N/A'}</p>
                                                    <p className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium">
                                                        <Mail size={12} className="text-[#DC5178] opacity-60" />
                                                        {enr.student?.email || 'N/A'}
                                                    </p>
                                                    {enr.student?.phone && (
                                                        <p className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium mt-0.5">
                                                            <Phone size={12} className="text-[#DC5178] opacity-60" />
                                                            {enr.student.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-8 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
                                                    {enr.course?.course_thumbnail ? (
                                                        <Image src={enr.course.course_thumbnail} alt={enr.course?.course_title || "Course"} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><BookOpen size={14} className="text-gray-300" /></div>
                                                    )}
                                                </div>

                                                <p className="text-[13px] font-bold text-gray-900 max-w-[200px] line-clamp-1">{enr.course?.course_title || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={enr.payment_status === 'free' ? 'secondary' : 'indigo'}>
                                                        {enr.payment_status?.toUpperCase()}
                                                    </Badge>
                                                    <Badge variant={enr.is_active ? 'success' : 'secondary'}>
                                                        {enr.is_active ? 'ACTIVE' : 'REVOKED'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-gray-700">{new Date(enr.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[11px] text-gray-400 font-medium font-jost uppercase tracking-tighter">
                                                    at {new Date(enr.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center">
                                                {enr.is_active ? (
                                                    <button
                                                        onClick={() => openRevokeModal(enr.id, enr.student?.name, enr.course?.course_title)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Revoke Access"
                                                    >
                                                        <ShieldAlert size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => openActivateModal(enr.id, enr.student?.name, enr.course?.course_title)}
                                                        className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                                        title="Activate Access"
                                                    >
                                                        <ShieldCheck size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Revoke Confirmation Modal */}
            <Modal
                isOpen={isRevokeModalOpen}
                onClose={() => setIsRevokeModalOpen(false)}
                title="Revoke Course Access"
                icon={ShieldX}
                iconBg="bg-red-50"
                iconColor="text-red-500"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setIsRevokeModalOpen(false)}
                            disabled={isRevoking}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleRevoke}
                            loading={isRevoking}
                        >
                            Yes, Revoke Access
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                        <div className="text-sm">
                            <p className="text-gray-900 dark:text-white font-bold mb-1">Confirm Action</p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                Are you sure you want to revoke access for <span className="text-red-600 font-black">{selectedEnrollment?.studentName}</span> from the course: <br />
                                <span className="text-gray-900 dark:text-white font-bold">&quot;{selectedEnrollment?.courseTitle}&quot;</span>
                            </p>
                        </div>
                    </div>
                    <p className="text-[12px] text-gray-400 font-medium px-1 italic text-center">
                        The student will no longer be able to access course content until access is re-granted.
                    </p>
                </div>
            </Modal>

            {/* Activate Confirmation Modal */}
            <Modal
                isOpen={isActivateModalOpen}
                onClose={() => setIsActivateModalOpen(false)}
                title="Activate Course Access"
                icon={ShieldCheck}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-500"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setIsActivateModalOpen(false)}
                            disabled={isActivating}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleActivate}
                            loading={isActivating}
                        >
                            Yes, Activate Access
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                        <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                        <div className="text-sm">
                            <p className="text-gray-900 dark:text-white font-bold mb-1">Confirm Activation</p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                You are about to re-grant course access to <span className="text-emerald-600 font-black">{selectedEnrollment?.studentName}</span> for: <br />
                                <span className="text-gray-900 dark:text-white font-bold">&quot;{selectedEnrollment?.courseTitle}&quot;</span>
                            </p>
                        </div>
                    </div>
                    <p className="text-[12px] text-gray-400 font-medium px-1 italic text-center">
                        The student will immediately regain access to all course content and materials.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default AdminEnrollments;