"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useGetCourseByIdQuery, useEditCourseMutation, useTogglePublishCourseMutation } from '@/feature/api/courseApi';
import {
    PageHeader,
    Card,
    Button,
    Input,
    Select,
    Textarea,
    Toggle,
    LoadingState,
    Divider,
    typography
} from "@/app/(admin)/admin/components/AdminUI";

const EditCoursePage = () => {
    const { courseId } = useParams();
    const router = useRouter();

    const { data, isLoading: isFetching, refetch } = useGetCourseByIdQuery(courseId);
    const [editCourse, { isLoading: isUpdating }] = useEditCourseMutation();
    const [togglePublish, { isLoading: isToggling }] = useTogglePublishCourseMutation();

    const [form, setForm] = useState({
        course_title: "",
        sub_title: "",
        description: "",
        category: "",
        course_level: "Beginner",
        course_price: "",
        course_type: "",
    });
    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);

    // Populate form when data loads
    useEffect(() => {
        if (data?.course) {
            const c = data.course;
            setForm({
                course_title: c.course_title || "",
                sub_title: c.sub_title || "",
                description: c.description || "",
                category: c.category || "",
                course_level: c.course_level || "Beginner",
                course_price: c.course_price || "",
                course_type: c.course_type || "paid",
            });
            setPreviewThumbnail(c.course_thumbnail || "");
        }
    }, [data]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.course_title || !form.category) {
            toast.error("Title and Category are required");
            return;
        }
        if (form.course_type === "paid" && (!form.course_price || parseFloat(form.course_price) <= 0)) {
            toast.error("Valid price is required for paid courses");
            return;
        }

        const formData = new FormData();
        formData.append("course_title", form.course_title);
        formData.append("sub_title", form.sub_title);
        formData.append("description", form.description);
        formData.append("category", form.category);
        formData.append("course_level", form.course_level);
        formData.append("course_type", form.course_type);
        formData.append("course_price", form.course_price);

        if (thumbnailFile) {
            formData.append("course_thumbnail", thumbnailFile);
        }

        try {
            await editCourse({ courseId, formData }).unwrap();
            toast.success("Course updated successfully!");
            router.push('/admin/courses');
            router.refresh();
        } catch (error) {
            console.error("Update failed", error);
            toast.error(error?.data?.message || "Failed to update course");
        }
    };

    const handlePublishToggle = async () => {
        try {
            const isPublished = data?.course?.is_published;
            await togglePublish({ courseId, publish: !isPublished }).unwrap();
            toast.success(isPublished ? "Course Unpublished" : "Course Published successfully");
            refetch();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (isFetching) return <LoadingState message="Fetching course details..." />;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link
                    href="/admin/courses"
                    className="flex items-center gap-2 text-gray-500 hover:text-[#DC5178] transition-colors w-fit group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-lexend text-xs font-bold uppercase tracking-wider">Back to My Courses</span>
                </Link>

                <PageHeader
                    title="Course Customization"
                    description="Update your course identity, content structure, and pricing."
                >
                    <Card padding="px-4 py-2" className="flex items-center gap-4 bg-white/50 border-gray-100">
                        <div className="space-y-0.5">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Status</p>
                            <p className={`text-xs font-bold font-lexend ${data?.course?.is_published ? "text-emerald-600" : "text-amber-500"}`}>
                                {data?.course?.is_published ? "PUBLISHED" : "DRAFT"}
                            </p>
                        </div>
                        <Toggle
                            checked={data?.course?.is_published}
                            onChange={handlePublishToggle}
                        />
                    </Card>
                </PageHeader>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card padding="p-8">
                            <h3 className={typography.h4 + " mb-6 pb-2 border-b border-gray-50 flex items-center gap-2"}>
                                <span className="w-1.5 h-6 bg-[#DC5178] rounded-full"></span>
                                Primary Details
                            </h3>
                            <div className="space-y-6">
                                <Input
                                    label="Course Title"
                                    name="course_title"
                                    value={form.course_title}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Compelling Subtitle"
                                    name="sub_title"
                                    value={form.sub_title}
                                    onChange={handleChange}
                                    placeholder="Briefly describe what students will achieve"
                                />
                                <Textarea
                                    label="Full Description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={8}
                                    placeholder="Go deep into what this course offers..."
                                />
                            </div>
                        </Card>

                        <Card padding="p-8">
                            <h3 className={typography.h4 + " mb-6 pb-2 border-b border-gray-50 flex items-center gap-2"}>
                                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                                Classification & Pricing
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                />
                                <Select
                                    label="Difficulty Level"
                                    name="course_level"
                                    value={form.course_level}
                                    onChange={handleChange}
                                    options={[
                                        { label: "Beginner Friendly", value: "Beginner" },
                                        { label: "Intermediate", value: "Intermediate" },
                                        { label: "Advanced Level", value: "Advanced" },
                                    ]}
                                />
                                <Select
                                    label="Access Type"
                                    name="course_type"
                                    value={form.course_type}
                                    onChange={handleChange}
                                    options={[
                                        { label: "Premium (Paid)", value: "paid" },
                                        { label: "Public (Free)", value: "free" },
                                    ]}
                                />
                                {form.course_type === 'paid' && (
                                    <Input
                                        label="Price (₹)"
                                        type="number"
                                        name="course_price"
                                        value={form.course_price}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Media & Actions */}
                    <div className="space-y-6">
                        <Card padding="p-6">
                            <h3 className={typography.h4 + " mb-6 pb-2 border-b border-gray-50 flex items-center gap-2"}>
                                <ImageIcon size={20} className="text-[#DC5178]" />
                                Branding
                            </h3>
                            <div className="space-y-6">
                                <div className="group relative aspect-video bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-100 flex items-center justify-center transition-all hover:border-[#DC5178]/50">
                                    {previewThumbnail ? (
                                        <img src={previewThumbnail} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-300">
                                            <Upload size={32} />
                                            <span className="text-xs font-bold font-lexend uppercase tracking-widest">No Thumbnail</span>
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-[2px]">
                                        <div className="bg-white p-3 rounded-full shadow-xl">
                                            <Upload size={20} className="text-[#DC5178]" />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Supported: JPG, PNG, WEBP (16:9)</p>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => document.querySelector('input[type="file"]').click()}
                                    >
                                        Change Thumbnail
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        <Card padding="p-6" className="bg-gray-50 border-gray-100 flex flex-col gap-3">
                            <Button
                                type="submit"
                                icon={Save}
                                loading={isUpdating}
                                className="w-full py-4 text-base"
                            >
                                Publish Changes
                            </Button>
                            <Link href="/admin/courses">
                                <Button variant="ghost" className="w-full">
                                    Cancel
                                </Button>
                            </Link>
                        </Card>

                        <div className="p-5 border border-red-100 rounded-xl bg-red-50/50 space-y-3">
                            <div className="flex items-center gap-2 text-red-600">
                                <Trash2 size={16} />
                                <span className="text-sm font-bold font-lexend">Danger Zone</span>
                            </div>
                            <p className="text-xs text-red-700/70 font-medium font-jost leading-relaxed">
                                Once deleted, a course and all its associated data cannot be recovered.
                            </p>
                            <Button variant="danger" size="sm" className="w-full bg-red-100 border-red-200 text-red-600 hover:bg-red-200 shadow-none">
                                Delete Course
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditCoursePage;
