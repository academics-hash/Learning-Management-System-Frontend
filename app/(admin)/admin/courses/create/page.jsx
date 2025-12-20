"use client";
import React, { useState } from "react";
import { useCreateCourseMutation } from "@/feature/api/courseApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import {
    PageHeader,
    Card,
    Button,
    Input,
    Select,
    typography
} from "@/app/(admin)/admin/components/AdminUI";

const CreateCoursePage = () => {
    const [createCourse, { isLoading }] = useCreateCourseMutation();
    const router = useRouter();

    const [form, setForm] = useState({
        course_title: "",
        category: "",
        course_type: "paid",
        course_price: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.course_title || !form.category) {
            toast.error("Title and Category are required");
            return;
        }

        if (form.course_type === "paid" && (!form.course_price || form.course_price <= 0)) {
            toast.error("Please enter a valid price for a paid course");
            return;
        }

        try {
            await createCourse(form).unwrap();
            toast.success("Course created successfully!");
            router.push("/admin/courses");
        } catch (error) {
            console.error("Failed to create course", error);
            const errMsg = error?.data?.message || "Failed to create course";
            toast.error(errMsg);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
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
                    title="Initialize New Course"
                    description="Fill in the basic details to start building your course content."
                />
            </div>

            {/* Form Card */}
            <Card padding="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Course Title */}
                        <Input
                            label="Course Title"
                            name="course_title"
                            value={form.course_title}
                            onChange={handleChange}
                            placeholder="e.g. Master React & Next.js"
                            required
                        />

                        {/* Category */}
                        <Input
                            label="Category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="e.g. Programming, Web Development"
                            required
                        />

                        {/* Row: Type & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Pricing Strategy"
                                name="course_type"
                                value={form.course_type}
                                onChange={handleChange}
                                options={[
                                    { label: "Paid Course", value: "paid" },
                                    { label: "Free Content", value: "free" },
                                ]}
                            />

                            {form.course_type === "paid" && (
                                <Input
                                    label="Price (₹)"
                                    type="number"
                                    name="course_price"
                                    value={form.course_price}
                                    onChange={handleChange}
                                    placeholder="499"
                                    min="1"
                                    required
                                    className="animate-in fade-in slide-in-from-top-2 duration-300"
                                />
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                        <Link href="/admin/courses">
                            <Button variant="ghost">Discard</Button>
                        </Link>
                        <Button
                            type="submit"
                            icon={Save}
                            loading={isLoading}
                        >
                            Create Course
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Helpful Info */}
            <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold text-lg">!</span>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900 font-lexend mb-1">Quick Tip</h4>
                    <p className="text-xs text-blue-700 font-medium leading-relaxed font-jost">
                        Once you create the course, you can continue to add more details like its thumbnail, description, and upload lectures.
                        Your course will remain as a <span className="font-bold underline">Draft</span> until you explicitly publish it.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateCoursePage;
