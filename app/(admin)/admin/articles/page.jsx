"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetAllArticlesQuery, useDeleteArticleMutation } from '@/feature/api/articleApi';
import { Plus, Search, Edit, FileText, Eye, Trash, Calendar, Tag } from 'lucide-react';
import {
    PageHeader,
    Card,
    Button,
    LoadingState,
    ErrorState,
    EmptyState,
    Badge,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableHeader,
    IconButton,
    Modal,
} from "@/app/(admin)/admin/components/AdminUI";

const ArticlesPage = () => {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError, refetch } = useGetAllArticlesQuery({ page, limit: 10 });
    const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
    const articles = data?.articles || [];
    const totalPages = data?.totalPages || 1;
    const totalArticles = data?.totalArticles || 0;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);

    const handleDeleteClick = (articleId) => {
        setArticleToDelete(articleId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (articleToDelete) {
            try {
                await deleteArticle(articleToDelete).unwrap();
                setIsDeleteModalOpen(false);
                setArticleToDelete(null);
            } catch (error) {
                console.error("Failed to delete article", error);
                alert("Failed to delete article");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not published';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) return <LoadingState message="Loading articles..." />;
    if (isError) return <ErrorState message="Failed to load articles" onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Articles"
                description="Manage and publish your blog articles"
            >
                <Link href="/admin/articles/create">
                    <Button icon={Plus}>Create Article</Button>
                </Link>
            </PageHeader>

            {/* Articles Table */}
            <Card padding="p-0">
                {articles.length === 0 ? (
                    <EmptyState
                        icon={Search}
                        title="No articles found"
                        description="You haven't created any articles yet. Start by creating your first article."
                        action={
                            <Link href="/admin/articles/create">
                                <Button variant="secondary" icon={Plus}>
                                    Create your first article
                                </Button>
                            </Link>
                        }
                    />
                ) : (
                    <Table>
                        <TableHead>
                            <tr>
                                <TableHeader>Article</TableHeader>
                                <TableHeader>Category</TableHeader>
                                <TableHeader>Author</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Published</TableHeader>
                                <TableHeader className="text-right">Actions</TableHeader>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                                                <Image
                                                    src={article.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop'}
                                                    alt={article.title}
                                                    width={48}
                                                    height={48}
                                                    unoptimized
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-lexend text-gray-900 dark:text-white text-sm font-bold truncate max-w-[250px]">
                                                    {article.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-jost mt-0.5 font-medium truncate max-w-[250px]">
                                                    {article.excerpt || 'No excerpt'}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="default">{article.category || 'General'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                                            {article.author || 'Unknown'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={article.isPublished ? "success" : "warning"}>
                                            {article.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                                            <Calendar size={12} />
                                            {formatDate(article.publishedAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/admin/articles/${article.id}`}>
                                                <IconButton
                                                    icon={Edit}
                                                    variant="ghost"
                                                    title="Edit Article"
                                                />
                                            </Link>
                                            <IconButton
                                                icon={Trash}
                                                variant="danger"
                                                title="Delete Article"
                                                onClick={() => handleDeleteClick(article.id)}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-jost">
                        Showing page {page} of {totalPages} ({totalArticles} articles)
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Article Stats Summary */}
            {articles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="flex items-center gap-4 border-l-4 border-l-[#DC5178]">
                        <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                            <FileText className="w-5 h-5 text-[#DC5178]" />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold font-lexend uppercase tracking-wide">Total Articles</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white font-lexend">{totalArticles}</p>
                        </div>
                    </Card>
                    <Card className="flex items-center gap-4 border-l-4 border-l-emerald-500">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                            <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold font-lexend uppercase tracking-wide">Published</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white font-lexend">
                                {articles.filter(a => a.isPublished).length}
                            </p>
                        </div>
                    </Card>
                    <Card className="flex items-center gap-4 border-l-4 border-l-amber-500">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                            <Edit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold font-lexend uppercase tracking-wide">Drafts</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white font-lexend">
                                {articles.filter(a => !a.isPublished).length}
                            </p>
                        </div>
                    </Card>
                </div>
            )}

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
                        <Button variant="danger" onClick={confirmDelete} loading={isDeleting}>Delete Article</Button>
                    </>
                }
            >
                <div className="text-center md:text-left">
                    <p className="text-gray-600 dark:text-gray-300 font-jost text-sm leading-relaxed">
                        Are you sure you want to delete this article? This action cannot be undone.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default ArticlesPage;
