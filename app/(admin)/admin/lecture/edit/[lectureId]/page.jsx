"use client";
import React, { useState, useEffect } from "react";
import { useEditLectureMutation, useGetLectureByIdQuery } from "@/feature/api/lectureApi";
import { useGetCreatorCoursesQuery } from "@/feature/api/courseApi";
import { Loader2, Upload, ArrowLeft, CheckCircle2, Video, Info, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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

const EditLecture = () => {
    const { lectureId } = useParams();
    const searchParams = useSearchParams();
    const courseId = searchParams.get("courseId");
    const router = useRouter();

    const { data: lectureData, isLoading: isLoadingLecture } = useGetLectureByIdQuery(lectureId);
    const { data: coursesData, isLoading: isLoadingCourses } = useGetCreatorCoursesQuery();
    const [editLecture, { isLoading: isUpdating, isSuccess, error }] = useEditLectureMutation();

    const [lectureTitle, setLectureTitle] = useState("");
    const [section, setSection] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedCourses, setSelectedCourses] = useState([]);

    const creatorCourses = coursesData?.courses || [];

    useEffect(() => {
        if (lectureData?.lecture) {
            setLectureTitle(lectureData.lecture.lectureTitle);
            setSection(lectureData.lecture.section || "");
            setVideoPreview(lectureData.lecture.videoUrl);
            setIsPreviewFree(lectureData.lecture.isPreviewFree);
            if (lectureData.lecture.courses) {
                setSelectedCourses(lectureData.lecture.courses.map(c => c.id));
            }
        }
    }, [lectureData]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Lecture updated successfully");
            if (courseId) {
                router.push(`/admin/lecture/${courseId}`);
            } else {
                router.push(`/admin/lecture`);
            }
        }
        if (error) {
            toast.error(error?.data?.message || "Failed to update lecture");
        }
    }, [isSuccess, error, router, courseId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        }
    };

    const handleCourseToggle = (cId) => {
        setSelectedCourses((prev) =>
            prev.includes(cId)
                ? prev.filter(id => id !== cId)
                : [...prev, cId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!lectureTitle) {
            toast.error("Title is required");
            return;
        }
        if (selectedCourses.length === 0) {
            toast.error("Please select at least one course");
            return;
        }

        let interval;
        if (videoFile) {
            interval = setInterval(() => {
                setUploadProgress((prev) => (prev >= 95 ? 95 : prev + 5));
            }, 800);
        }

        const formData = new FormData();
        formData.append("lectureTitle", lectureTitle);
        formData.append("section", section);
        if (videoFile) {
            formData.append("videoFile", videoFile);
        }
        formData.append("isPreviewFree", isPreviewFree);
        formData.append("courseIds", JSON.stringify(selectedCourses));

        try {
            const targetCourseId = courseId || selectedCourses[0];
            await editLecture({ courseId: targetCourseId, lectureId, formData }).unwrap();

            if (interval) {
                clearInterval(interval);
                setUploadProgress(100);
            }
        } catch (err) {
            if (interval) clearInterval(interval);
            setUploadProgress(0);
            console.error(err);
        }
    };

    if (isLoadingLecture || isLoadingCourses) return <LoadingState message="Fetching content details..." />;

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
                    title="Edit Lesson Content"
                    description="Refine your lecture title, folder placement, or update the video file."
                />
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card padding="p-8">
                        <h3 className={typography.h4 + " mb-6 pb-2 border-b border-gray-50 flex items-center gap-2"}>
                            <span className="w-1.5 h-6 bg-[#DC5178] rounded-full"></span>
                            Basic Info
                        </h3>
                        <div className="space-y-6">
                            <Input
                                label="Lecture Title"
                                value={lectureTitle}
                                onChange={(e) => setLectureTitle(e.target.value)}
                                placeholder="e.g. Master React Hooks"
                            />
                            <Input
                                label="Folder / Section Name"
                                placeholder="e.g. Advanced Concepts"
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                            />
                        </div>
                    </Card>

                    <Card padding="p-8">
                        <h3 className={typography.h4 + " mb-6 pb-2 border-b border-gray-50 flex items-center gap-2"}>
                            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                            Video Resource
                        </h3>
                        <div className="space-y-4">
                            <div className="group relative aspect-video bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-100 flex items-center justify-center transition-all hover:border-[#DC5178]/50">
                                {videoPreview ? (
                                    <div className="w-full h-full relative group/video">
                                        <video src={videoPreview} className="w-full h-full object-cover" controls />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-md py-2 text-center opacity-0 group-hover/video:opacity-100 transition-opacity">
                                            <p className="text-white text-[10px] font-bold font-lexend uppercase tracking-widest">Click below to change video</p>
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
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">New File</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card padding="p-6">
                        <h3 className={typography.h4 + " mb-6 pb-2 border-b border-gray-50 flex items-center gap-2 font-lexend"}>
                            Course Availability
                        </h3>
                        <div className="space-y-4">
                            <label className={typography.label}>Target Courses</label>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {creatorCourses.map((course) => (
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
                            loading={isUpdating}
                            icon={Save}
                            className="w-full py-4 text-base"
                            disabled={uploadProgress > 0 && uploadProgress < 100}
                        >
                            {uploadProgress > 0 && uploadProgress < 100
                                ? `Uploading ${uploadProgress}%`
                                : 'Update Content'}
                        </Button>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#DC5178] transition-all duration-500 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        )}
                        <Link href={courseId ? `/admin/lecture/${courseId}` : "/admin/lecture"}>
                            <Button variant="ghost" className="w-full mt-2">Cancel Changes</Button>
                        </Link>
                    </Card>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                        <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-700 font-medium font-jost leading-relaxed">
                            Updating the video file will replace the current content on the server. Old videos are permanently deleted.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditLecture;
