"use client";
import React, { useState, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetArticleByIdQuery, useUpdateArticleMutation, useDeleteArticleMutation } from "@/feature/api/articleApi";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
    PageHeader,
    Card,
    Button,
    Input,
    Textarea,
    Select,
    Toggle,
    Modal,
    LoadingState,
    ErrorState,
    typography
} from "@/app/(admin)/admin/components/AdminUI";

const EditArticlePage = () => {
    const { id } = useParams();
    const router = useRouter();

    const { data, isLoading: isFetching, isError, refetch } = useGetArticleByIdQuery(id);
    const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
    const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

    const fileInputRef = useRef(null);
    const article = data?.article;

    // Initialize form state from article data using useMemo
    const initialForm = useMemo(() => {
        if (!article) {
            return {
                title: "",
                content: "",
                excerpt: "",
                category: "General",
                author: "StackUp Team",
                tags: "",
                isPublished: false,
            };
        }
        return {
            title: article.title || "",
            content: article.content || "",
            excerpt: article.excerpt || "",
            category: article.category || "General",
            author: article.author || "StackUp Team",
            tags: Array.isArray(article.tags) ? article.tags.join(", ") : (article.tags || ""),
            isPublished: article.isPublished || false,
        };
    }, [article]);

    const [form, setForm] = useState(initialForm);
    const [formInitialized, setFormInitialized] = useState(false);

    // Re-initialize form when article loads (only once)
    if (article && !formInitialized) {
        setForm({
            title: article.title || "",
            content: article.content || "",
            excerpt: article.excerpt || "",
            category: article.category || "General",
            author: article.author || "StackUp Team",
            tags: Array.isArray(article.tags) ? article.tags.join(", ") : (article.tags || ""),
            isPublished: article.isPublished || false,
        });
        setFormInitialized(true);
    }

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(article?.image || null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Update image preview when article loads
    if (article?.image && !imagePreview && !imageFile) {
        setImagePreview(article.image);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleToggleChange = (e) => {
        setForm({ ...form, isPublished: e.target.checked });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.content) {
            toast.error("Title and Content are required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("content", form.content);
            formData.append("excerpt", form.excerpt);
            formData.append("category", form.category);
            formData.append("author", form.author);
            formData.append("tags", form.tags);
            formData.append("isPublished", form.isPublished);

            if (imageFile) {
                formData.append("image", imageFile);
            }

            await updateArticle({ id, formData }).unwrap();
            toast.success("Article updated successfully!");
            router.push("/admin/articles");
        } catch (error) {
            console.error("Failed to update article", error);
            const errMsg = error?.data?.message || "Failed to update article";
            toast.error(errMsg);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteArticle(id).unwrap();
            toast.success("Article deleted successfully!");
            router.push("/admin/articles");
        } catch (error) {
            console.error("Failed to delete article", error);
            toast.error("Failed to delete article");
        }
    };

    const categoryOptions = [
        { label: "General", value: "General" },
        { label: "Technology", value: "Technology" },
        { label: "Education", value: "Education" },
        { label: "Career", value: "Career" },
        { label: "Industry News", value: "Industry News" },
        { label: "Tutorials", value: "Tutorials" },
    ];

    if (isFetching) return <LoadingState message="Loading article..." />;
    if (isError) return <ErrorState message="Failed to load article" onRetry={refetch} />;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link
                    href="/admin/articles"
                    className="flex items-center gap-2 text-gray-500 hover:text-[#DC5178] transition-colors w-fit group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-lexend text-xs font-bold uppercase tracking-wider">Back to Articles</span>
                </Link>

                <PageHeader
                    title="Edit Article"
                    description="Update and manage your article content."
                />
            </div>

            {/* Form Card */}
            <Card padding="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Article Title */}
                    <Input
                        label="Article Title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. 10 Tips for Learning to Code"
                        required
                    />

                    {/* Excerpt */}
                    <Textarea
                        label="Excerpt (Short Summary)"
                        name="excerpt"
                        value={form.excerpt}
                        onChange={handleChange}
                        placeholder="A brief summary of the article (max 500 characters)"
                        rows={2}
                    />

                    {/* Content */}
                    <Textarea
                        label="Content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="Write your article content here..."
                        rows={12}
                        required
                    />

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className={typography.label}>Featured Image</label>
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-[#DC5178] transition-colors">
                            {imagePreview ? (
                                <div className="relative inline-block">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        width={200}
                                        height={120}
                                        className="rounded-lg object-cover max-h-40"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium font-jost">
                                        Click to upload an image
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1 font-jost">
                                        PNG, JPG, WEBP up to 5MB
                                    </p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Row: Category & Author */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                            label="Category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            options={categoryOptions}
                        />

                        <Input
                            label="Author"
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            placeholder="Author name"
                        />
                    </div>

                    {/* Tags */}
                    <Input
                        label="Tags (comma separated)"
                        name="tags"
                        value={form.tags}
                        onChange={handleChange}
                        placeholder="e.g. programming, career, tips"
                    />

                    {/* Publish Toggle */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <Toggle
                            checked={form.isPublished}
                            onChange={handleToggleChange}
                            label="Published"
                            description="Toggle to publish or unpublish this article."
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <Button
                            type="button"
                            variant="danger"
                            icon={Trash}
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            Delete
                        </Button>
                        <div className="flex items-center gap-3">
                            <Link href="/admin/articles">
                                <Button variant="ghost">Cancel</Button>
                            </Link>
                            <Button
                                type="submit"
                                icon={Save}
                                loading={isUpdating}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Article"
                icon={Trash}
                iconColor="text-red-600"
                iconBg="bg-red-50 dark:bg-red-900/20"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDelete} loading={isDeleting}>Delete Article</Button>
                    </>
                }
            >
                <div className="text-center md:text-left">
                    <p className="text-gray-600 dark:text-gray-300 font-jost text-sm leading-relaxed">
                        Are you sure you want to delete <span className="font-bold">&ldquo;{form.title}&rdquo;</span>? This action cannot be undone.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default EditArticlePage;
