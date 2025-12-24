"use client";
import React, { useState } from 'react';
import { useGetPendingEnrollmentsQuery, useApproveEnrollmentMutation, useRejectEnrollmentMutation } from '@/feature/api/enrollmentApi';
import { PageHeader, Card, LoadingState, ErrorState, Badge, typography, Modal, Button } from '../../components/AdminUI';
import { Users, GraduationCap, Calendar, CheckCircle, Search, Mail, BookOpen, Clock, Phone, ArrowLeft, AlertCircle, ShieldCheck, ShieldX, XCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const EnrollmentRequests = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const { data, isLoading, error, refetch } = useGetPendingEnrollmentsQuery();
    const [approveEnrollment, { isLoading: isApproving }] = useApproveEnrollmentMutation();
    const [rejectEnrollment, { isLoading: isRejecting }] = useRejectEnrollmentMutation();
    const router = useRouter();

    if (isLoading) return <LoadingState message="Fetching enrollment requests..." />;
    if (error) return <ErrorState message="Failed to load requests" onRetry={refetch} />;

    const requests = data?.enrollments || [];

    const handleApprove = async () => {
        if (!selectedRequest) return;

        try {
            await approveEnrollment(selectedRequest.id).unwrap();
            toast.success(`Access granted to ${selectedRequest.studentName}`);
            setIsApproveModalOpen(false);
            setSelectedRequest(null);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to approve request");
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;

        try {
            await rejectEnrollment(selectedRequest.id).unwrap();
            toast.success(`Request from ${selectedRequest.studentName} has been rejected`);
            setIsRejectModalOpen(false);
            setSelectedRequest(null);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to reject request");
        }
    };

    const openApproveModal = (id, studentName, courseTitle) => {
        setSelectedRequest({ id, studentName, courseTitle });
        setIsApproveModalOpen(true);
    };

    const openRejectModal = (id, studentName, courseTitle) => {
        setSelectedRequest({ id, studentName, courseTitle });
        setIsRejectModalOpen(true);
    };

    const filteredRequests = requests.filter(r => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;

        return (
            r.student?.name?.toLowerCase().includes(search) ||
            r.student?.email?.toLowerCase().includes(search) ||
            r.course?.course_title?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link href="/admin/enrollments" className="flex items-center gap-2 text-gray-500 hover:text-[#DC5178] transition-colors w-fit">
                    <ArrowLeft size={18} />
                    <span className="text-sm font-bold">Back to All Enrollments</span>
                </Link>
                <PageHeader
                    title="Enrollment Requests"
                    description="Review and approve student access requests for paid courses"
                />
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex items-center gap-4 p-6 border-l-4 border-l-orange-400">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Requests</p>
                        <p className="text-2xl font-black text-gray-900 font-lexend">{requests.length}</p>
                    </div>
                </Card>
            </div>

            {/* Search Bar */}
            <Card className="flex items-center gap-4 p-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#DC5178]/20 focus:border-[#DC5178] transition-all text-sm font-medium"
                    />
                </div>
            </Card>

            {/* Requests Table */}
            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-jost">
                        <thead className="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Student Details</th>
                                <th className="px-6 py-4">Course Requested</th>
                                <th className="px-6 py-4">Requested Date</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-jost italic">
                                        {searchTerm ? `No requests found for "${searchTerm}"` : 'No pending requests.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#DC5178] font-black text-sm shadow-sm ring-2 ring-gray-100">
                                                    {req.student?.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-black text-gray-900 font-lexend">{req.student?.name || 'N/A'}</p>
                                                    <p className="flex items-center gap-1.5 text-[12px] text-gray-500 font-medium">
                                                        <Mail size={12} className="text-[#DC5178] opacity-60" />
                                                        {req.student?.email || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-8 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
                                                    {req.course?.course_thumbnail ? (
                                                        <Image src={req.course.course_thumbnail} alt={req.course?.course_title || "Course"} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><BookOpen size={14} className="text-gray-300" /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold text-gray-900 max-w-[200px] line-clamp-1">{req.course?.course_title || 'N/A'}</p>
                                                    {req.course?.course_price > 0 && (
                                                        <span className="text-[11px] text-gray-400 font-bold">Price: ₹{req.course.course_price}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-bold text-gray-700">{new Date(req.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[11px] text-gray-400 font-medium font-jost uppercase tracking-tighter">
                                                    at {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openApproveModal(req.id, req.student?.name, req.course?.course_title)}
                                                    disabled={isApproving || isRejecting}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50"
                                                >
                                                    <CheckCircle size={14} />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => openRejectModal(req.id, req.student?.name, req.course?.course_title)}
                                                    disabled={isApproving || isRejecting}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
                                                >
                                                    <XCircle size={14} />
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Approve Confirmation Modal */}
            <Modal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                title="Confirm Approval"
                icon={ShieldCheck}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-500"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setIsApproveModalOpen(false)}
                            disabled={isApproving}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleApprove}
                            loading={isApproving}
                        >
                            Confirm & Grant Access
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-900/20">
                        <AlertCircle className="text-[#DC5178] shrink-0 mt-0.5" size={18} />
                        <div className="text-sm">
                            <p className="text-gray-900 dark:text-white font-bold mb-1">Grant Full Access?</p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                You are about to grant <span className="text-[#DC5178] font-black">{selectedRequest?.studentName}</span> full access to the course: <br />
                                <span className="text-gray-900 dark:text-white font-bold">&quot;{selectedRequest?.courseTitle}&quot;</span>
                            </p>
                        </div>
                    </div>
                    <p className="text-[12px] text-gray-400 font-medium px-1 italic">
                        * This will activate the enrollment and mark the payment status as &quot;paid&quot;.
                    </p>
                </div>
            </Modal>

            {/* Reject Confirmation Modal */}
            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                title="Reject Request"
                icon={ShieldX}
                iconBg="bg-red-50"
                iconColor="text-red-500"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setIsRejectModalOpen(false)}
                            disabled={isRejecting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleReject}
                            loading={isRejecting}
                        >
                            Yes, Reject Request
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                        <div className="text-sm">
                            <p className="text-gray-900 dark:text-white font-bold mb-1">Reject Application?</p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                Are you sure you want to reject the request from <span className="text-red-600 font-black">{selectedRequest?.studentName}</span> for: <br />
                                <span className="text-gray-900 dark:text-white font-bold">&quot;{selectedRequest?.courseTitle}&quot;</span>
                            </p>
                        </div>
                    </div>
                    <p className="text-[12px] text-gray-400 font-medium px-1 italic">
                        * This will remove the request. The student will be able to request access again if needed.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default EnrollmentRequests;
