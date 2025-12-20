"use client";
import React, { useState } from "react";
import { useCreateLectureMutation, useGetCourseLecturesQuery } from "@/feature/api/lectureApi";
import { useGetCreatorCoursesQuery } from "@/feature/api/courseApi";
import { Loader2, Upload, ArrowLeft, CheckCircle2, Video, Folder, Info, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    PageHeader,
    Card,
    Button,
    Input,
    Toggle,
    LoadingState,
    Divider,
    typography
} from "@/app/(admin)/admin/components/AdminUI";

const CreateLecture = () => {
    const searchParams = useSearchParams();
    const preSelectedCourseId = searchParams.get("courseId");
    const preSelectedSection = searchParams.get("section");

    const preSelectedCourseIdNum = preSelectedCourseId ? parseInt(preSelectedCourseId, 10) : null;

    const [lectureTitle, setLectureTitle] = useState("");
    const [section, setSection] = useState(preSelectedSection || "");
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState(preSelectedCourseIdNum ? [preSelectedCourseIdNum] : []);
    const [uploadProgress, setUploadProgress] = useState(0);

    const router = useRouter();

    const { data: coursesData, isLoading: isLoadingCourses } = useGetCreatorCoursesQuery();
    const { data: courseLecturesData } = useGetCourseLecturesQuery(preSelectedCourseIdNum || selectedCourses[0], {
        skip: !preSelectedCourseIdNum && selectedCourses.length === 0
    });
    const [createLecture, { isLoading }] = useCreateLectureMutation();

    const existingSections = [...new Set(courseLecturesData?.lectures?.map(l => l.section).filter(Boolean) || [])];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        }
    };

    const handleCourseToggle = (courseId) => {
        setSelectedCourses((prev) =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!lectureTitle || !videoFile || selectedCourses.length === 0) {
            toast.error("Please fill all required fields and select at least one course");
            return;
        }

        const interval = setInterval(() => {
            setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 5));
        }, 800);

        const formData = new FormData();
        formData.append("lectureTitle", lectureTitle);
        formData.append("section", section || "General");
        formData.append("videoFile", videoFile);
        formData.append("isPreviewFree", String(isPreviewFree));
        formData.append("courseIds", JSON.stringify(selectedCourses));

        try {
            await createLecture(formData).unwrap();
            clearInterval(interval);
            setUploadProgress(100);

            toast.success("Lecture created successfully");
            if (preSelectedCourseId) {
                router.push(`/admin/lecture/${preSelectedCourseId}`);
            } else {
                router.push("/admin/lecture");
            }
        } catch (err) {
            clearInterval(interval);
            setUploadProgress(0);
            toast.error(err?.data?.message || "Failed to create lecture");
        }
    };

    const creatorCourses = coursesData?.courses || [];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#DC5178] transition-colors w-fit group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-lexend text-xs font-bold uppercase tracking-wider">Back</span>
                </button>

                <PageHeader
                    title="Upload Lecture Content"
                    description="Deepen your course impact by adding high-quality video content."
                />
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card padding="p-8">
                        <h3 className={typography.h4 + " mb-6 pb-2 border-b border-gray-50 flex items-center gap-2"}>
                            <span className="w-1.5 h-6 bg-[#DC5178] rounded-full"></span>
                            Lecture Identity
                        </h3>
                        <div className="space-y-6">
                            <Input
                                label="Lecture Title"
                                value={lectureTitle}
                                onChange={(e) => setLectureTitle(e.target.value)}
                                placeholder="e.g. Master React Hooks"
                            />

                            <div className="space-y-3">
                                <label className={typography.label}>Target Folder</label>
                                {existingSections.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {existingSections.map((folderName) => (
                                            <button
                                                key={folderName}
                                                type="button"
                                                onClick={() => setSection(folderName)}
                                                className={`
                                                    px-3 py-1.5 rounded-lg border text-xs font-bold font-lexend transition-all
                                                    ${section === folderName
                                                        ? 'bg-pink-100 border-pink-200 text-[#DC5178]'
                                                        : 'bg-white border-gray-100 text-gray-400 hover:border-[#DC5178]/30'}
                                                `}
                                            >
                                                {folderName}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <Input
                                    placeholder="Enter folder name or select existing..."
                                    value={section}
                                    onChange={(e) => setSection(e.target.value)}
                                />
                                {section && !existingSections.includes(section) && (
                                    <p className="text-[10px] text-[#DC5178] font-bold font-lexend uppercase tracking-widest flex items-center gap-1.5 bg-pink-50 w-fit px-2 py-1 rounded">
                                        <Plus size={10} /> New Folder will be created
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card padding="p-8">
                        <h3 className={typography.h4 + " mb-6 pb-2 border-b border-gray-50 flex items-center gap-2"}>
                            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                            Video Media
                        </h3>
                        <div className="space-y-4">
                            <div className="group relative aspect-video bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-100 flex items-center justify-center transition-all hover:border-[#DC5178]/50">
                                {videoPreview ? (
                                    <div className="w-full h-full relative group/video">
                                        <video src={videoPreview} className="w-full h-full object-cover" controls />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-md py-2 text-center opacity-0 group-hover/video:opacity-100 transition-opacity">
                                            <p className="text-white text-[10px] font-bold font-lexend uppercase tracking-widest">Click below to replace</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-gray-300">
                                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform">
                                            <Upload className="text-[#DC5178]" size={28} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold font-lexend text-gray-900">Upload Video Lesson</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">MP4, WebM (Max 2GB)</p>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                            </div>
                            {videoFile && (
                                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Video size={18} className="text-emerald-600" />
                                        <span className="text-xs font-bold font-lexend text-emerald-900 truncate max-w-[200px]">{videoFile.name}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Selected</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Sticky */}
                <div className="space-y-6">
                    <Card padding="p-6">
                        <h3 className={typography.h4 + " mb-6 pb-2 border-b border-gray-50 flex items-center gap-2 font-lexend"}>
                            Course Mapping
                        </h3>
                        <div className="space-y-4">
                            <label className={typography.label}>Target Courses</label>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {isLoadingCourses ? (
                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                                        <Loader2 className="animate-spin text-[#DC5178]" size={14} /> Loading list...
                                    </div>
                                ) : creatorCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        onClick={() => handleCourseToggle(course.id)}
                                        className={`
                                            p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3
                                            ${selectedCourses.includes(course.id)
                                                ? 'bg-pink-50 border-pink-200 shadow-sm'
                                                : 'bg-white border-gray-100 hover:border-gray-200'}
                                        `}
                                    >
                                        <div className={`
                                            w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all
                                            ${selectedCourses.includes(course.id) ? 'bg-[#DC5178] border-[#DC5178] shadow-sm' : 'border-gray-200'}
                                        `}>
                                            {selectedCourses.includes(course.id) && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-[13px] font-bold font-lexend truncate ${selectedCourses.includes(course.id) ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {course.course_title}
                                        </span>
                                    </div>
                                ))}
                                {creatorCourses.length === 0 && !isLoadingCourses && (
                                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                        <p className="text-xs font-bold font-lexend text-amber-900">No courses yet!</p>
                                        <p className="text-[10px] text-amber-700 mt-1 font-medium font-jost">Create a course before uploading lectures.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card padding="p-6">
                        <Toggle
                            label="Free Preview"
                            description="Let users sample this content"
                            checked={isPreviewFree}
                            onChange={(e) => setIsPreviewFree(e.target.checked)}
                        />
                    </Card>

                    <Card padding="p-6" className="bg-gray-50 border-gray-100">
                        <Button
                            type="submit"
                            loading={isLoading}
                            className="w-full py-4 text-base"
                            disabled={uploadProgress > 0 && uploadProgress < 100}
                        >
                            {uploadProgress > 0 && uploadProgress < 100
                                ? `Uploading ${uploadProgress}%`
                                : 'Finalize Content'}
                        </Button>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#DC5178] transition-all duration-500 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        )}
                        <Link href="/admin/lecture">
                            <Button variant="ghost" className="w-full mt-2">Discard</Button>
                        </Link>
                    </Card>

                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 flex gap-3">
                        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-700 font-medium font-jost leading-relaxed">
                            Uploading large videos may take a few minutes depending on your connection. Please do not close the window until the process completes.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateLecture;
