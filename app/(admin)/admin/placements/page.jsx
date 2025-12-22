"use client";
import React, { useState } from 'react';
import {
    useGetAllPlacementsQuery,
    useDeletePlacementMutation,
    useCreatePlacementMutation
} from '@/feature/api/placementApi';
import {
    Plus,
    Trash2,
    User,
    Briefcase,
    IndianRupee,
    Play,
    Image as ImageIcon,
    Upload,
    X,
    Loader2
} from 'lucide-react';
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
    IconButton,
    Badge,
} from "@/app/(admin)/admin/components/AdminUI";
import { toast } from 'sonner';
import Image from 'next/image';

const PlacementsAdminPage = () => {
    const { data, isLoading, isError, refetch } = useGetAllPlacementsQuery();
    const [deletePlacement, { isLoading: isDeleting }] = useDeletePlacementMutation();
    const [createPlacement, { isLoading: isCreating }] = useCreatePlacementMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        student_name: '',
        designation: '',
        lpa: '',
    });
    const [studentImage, setStudentImage] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const placements = data?.placements || [];

    const handleDelete = async (id) => {
        toast.promise(deletePlacement(id).unwrap(), {
            loading: 'Deleting placement...',
            success: 'Placement deleted successfully',
            error: 'Failed to delete placement'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.student_name || !formData.designation || !formData.lpa) {
            toast.error("Please fill all required fields");
            return;
        }

        const data = new FormData();
        data.append('student_name', formData.student_name);
        data.append('designation', formData.designation);
        data.append('lpa', formData.lpa);
        if (studentImage) data.append('student_image', studentImage);
        if (videoFile) data.append('video', videoFile);

        toast.promise(createPlacement(data).unwrap(), {
            loading: 'Saving placement success story...',
            success: () => {
                setIsModalOpen(false);
                setFormData({ student_name: '', designation: '', lpa: '' });
                setStudentImage(null);
                setVideoFile(null);
                return "Placement created successfully!";
            },
            error: (err) => err?.data?.message || "Failed to create placement"
        });
    };

    if (isLoading) return <LoadingState message="Loading placements..." />;
    if (isError) return <ErrorState message="Failed to load placements" onRetry={refetch} />;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Placement Management"
                description="Manage student placement success stories"
            >
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Placement</Button>
            </PageHeader>

            <Card padding="p-0">
                {placements.length === 0 ? (
                    <EmptyState
                        icon={User}
                        title="No placements found"
                        description="Start by adding your first placement success story."
                        action={
                            <Button variant="secondary" icon={Plus} onClick={() => setIsModalOpen(true)}>
                                Add your first placement
                            </Button>
                        }
                    />
                ) : (
                    <Table>
                        <TableHead>
                            <tr>
                                <TableHeader>Student</TableHeader>
                                <TableHeader>Designation</TableHeader>
                                <TableHeader>Package</TableHeader>
                                <TableHeader>Media</TableHeader>
                                <TableHeader className="text-right">Actions</TableHeader>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {placements.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                                                {item.student_image ? (
                                                    <Image src={item.student_image} alt={item.student_name} width={40} height={40} className="object-cover" />
                                                ) : (
                                                    <User size={20} className="text-gray-400" />
                                                )}
                                            </div>
                                            <span className="font-bold font-lexend text-gray-900 dark:text-white">{item.student_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-jost font-medium text-gray-600 dark:text-gray-400">{item.designation}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="success">{item.lpa}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {item.student_image && <ImageIcon size={16} className="text-emerald-500" title="Image available" />}
                                            {item.video_url && <Play size={16} className="text-blue-500" title="Video available" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <IconButton
                                            icon={Trash2}
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            loading={isDeleting}
                                            disabled={isDeleting}
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this placement?")) {
                                                    handleDelete(item.id);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold font-lexend text-gray-900 dark:text-white">Add New Placement</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold font-lexend text-gray-500 uppercase tracking-wider">Student Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#DC5178] outline-none"
                                        placeholder="Ex: Anand S"
                                        value={formData.student_name}
                                        onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold font-lexend text-gray-500 uppercase tracking-wider">Designation</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#DC5178] outline-none"
                                        placeholder="Ex: Software Engineer"
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold font-lexend text-gray-500 uppercase tracking-wider">Package (LPA)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#DC5178] outline-none"
                                    placeholder="Ex: 4.5 LPA"
                                    value={formData.lpa}
                                    onChange={(e) => setFormData({ ...formData, lpa: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold font-lexend text-gray-500 uppercase tracking-wider">Student Photo</label>
                                    <div className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setStudentImage(e.target.files[0])}
                                        />
                                        <Upload size={20} className="text-[#DC5178] mb-2" />
                                        <span className="text-xs font-bold font-lexend text-gray-400">
                                            {studentImage ? studentImage.name : "Upload Image"}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold font-lexend text-gray-500 uppercase tracking-wider">Interview Video</label>
                                    <div className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setVideoFile(e.target.files[0])}
                                        />
                                        <Play size={20} className="text-[#DC5178] mb-2" />
                                        <span className="text-xs font-bold font-lexend text-gray-400">
                                            {videoFile ? videoFile.name : "Upload Video"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    loading={isCreating}
                                >
                                    {isCreating ? "Saving..." : "Save Placement"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlacementsAdminPage;
