"use client";
import React, { useState, useEffect } from "react";
import {
    useGetCourseLecturesQuery,
    useRemoveLectureMutation,
    useReorderLecturesMutation,
    useRenameSectionMutation,
    useDeleteSectionMutation
} from "@/feature/api/lectureApi";
import {
    Plus,
    Edit,
    Trash2,
    Video,
    PlayCircle,
    ArrowLeft,
    GripVertical,
    Pencil,
    FolderX,
    ChevronDown,
    ChevronUp,
    Folder,
    GripHorizontal,
    MoreVertical,
    Loader2
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    PageHeader,
    Card,
    Button,
    LoadingState,
    ErrorState,
    EmptyState,
    Badge,
    StatCard,
    IconButton,
    Input,
    Modal,
    Divider,
    Section as UISection
} from "@/app/(admin)/admin/components/AdminUI";

const CourseLectures = ({ params }) => {
    const { courseId } = useParams();
    const router = useRouter();

    const { data, isLoading, error, refetch } = useGetCourseLecturesQuery(courseId, {
        skip: !courseId,
        refetchOnMountOrArgChange: true
    });

    const [removeLecture, { isLoading: isDeleting }] = useRemoveLectureMutation();

    const lectures = data?.lectures || [];
    const courseTitle = data?.courseTitle || "Course Lectures";

    const handleDelete = async (lectureId) => {
        try {
            await removeLecture(lectureId).unwrap();
            toast.success("Lecture deleted successfully");
        } catch (err) {
            toast.error("Failed to delete lecture");
        }
    };

    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) return;
        router.push(`/admin/lecture/create?courseId=${courseId}&section=${encodeURIComponent(newFolderName.trim())}`);
    };

    if (isLoading) return <LoadingState message="Loading lectures..." />;
    if (error) return <ErrorState message="Failed to load lectures" onRetry={refetch} />;

    const sections = Object.entries(
        lectures.reduce((acc, lecture) => {
            const section = lecture.section || "General";
            if (!acc[section]) acc[section] = [];
            acc[section].push(lecture);
            return acc;
        }, {})
    );

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4">
                <Link
                    href="/admin/lecture"
                    className="flex items-center gap-2 text-gray-500 hover:text-[#DC5178] transition-colors w-fit group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-lexend text-xs font-bold uppercase tracking-wider">Back to Lectures</span>
                </Link>

                <PageHeader
                    title={courseTitle}
                    description="Organize and manage lectures within folders"
                >
                    <Button
                        variant="secondary"
                        icon={Folder}
                        onClick={() => setIsCreateFolderOpen(true)}
                    >
                        Create Folder
                    </Button>
                    <Link href={`/admin/lecture/create?courseId=${courseId}`}>
                        <Button icon={Plus}>Add New Lecture</Button>
                    </Link>
                </PageHeader>
            </div>

            {/* Folder List */}
            <div className="space-y-6">
                {lectures.length === 0 ? (
                    <Card>
                        <EmptyState
                            icon={Video}
                            title="No lectures found"
                            description="This course doesn't have any lectures yet. Start by creating your first lecture."
                            action={
                                <Link href={`/admin/lecture/create?courseId=${courseId}`}>
                                    <Button variant="primary" icon={Plus}>
                                        Create First Lecture
                                    </Button>
                                </Link>
                            }
                        />
                    </Card>
                ) : (
                    sections.map(([section, sectionLectures]) => (
                        <SectionAccordion
                            key={section}
                            section={section}
                            lectures={sectionLectures}
                            courseId={courseId}
                            handleDelete={handleDelete}
                            isDeleting={isDeleting}
                        />
                    ))
                )}
            </div>

            {/* Create Folder Modal */}
            <Modal
                isOpen={isCreateFolderOpen}
                onClose={() => setIsCreateFolderOpen(false)}
                title="Create New Folder"
                icon={Folder}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={handleCreateFolder}
                            disabled={!newFolderName.trim()}
                        >
                            Create & Add Lecture
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-gray-500 text-sm font-medium font-jost leading-relaxed">
                        Folders are defined by the section name of your lectures. Create a new folder by initializing its first lecture.
                    </p>
                    <Input
                        label="Folder Name"
                        placeholder="e.g., Advanced Concepts"
                        autoFocus
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    />
                </div>
            </Modal>
        </div>
    );
};

// ==============================================
// SECTION ACCORDION COMPONENT
// ==============================================
const SectionAccordion = ({ section, lectures, courseId, handleDelete, isDeleting }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [items, setItems] = useState(lectures);
    const [reorderLectures] = useReorderLecturesMutation();
    const [renameSectionMutation] = useRenameSectionMutation();
    const [deleteSectionMutation] = useDeleteSectionMutation();

    // Modals
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [newName, setNewName] = useState(section);
    const [isRenaming, setIsRenaming] = useState(false);
    const [isDeletingFolder, setIsDeletingFolder] = useState(false);

    useEffect(() => {
        setItems(lectures);
    }, [lectures]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setItems(newItems);

        try {
            const lectureOrders = newItems.map((item, index) => ({
                lectureId: item.id,
                position: index,
            }));
            await reorderLectures({ lectureOrders }).unwrap();
            toast.success("Order updated");
        } catch (error) {
            setItems(lectures);
            toast.error("Failed to update order");
        }
    };

    const handleRename = async () => {
        if (!newName.trim() || newName === section) return;
        setIsRenaming(true);
        try {
            await renameSectionMutation({
                courseId,
                oldSection: section,
                newSection: newName.trim()
            }).unwrap();
            toast.success("Folder renamed");
            setIsRenameOpen(false);
        } catch (err) {
            toast.error("Failed to rename folder");
        } finally {
            setIsRenaming(false);
        }
    };

    const handleDeleteFolder = async () => {
        setIsDeletingFolder(true);
        try {
            await deleteSectionMutation({ courseId, sectionName: section }).unwrap();
            toast.success("Folder and lectures deleted");
            setIsDeleteOpen(false);
        } catch (err) {
            toast.error("Failed to delete folder");
        } finally {
            setIsDeletingFolder(false);
        }
    };

    return (
        <Card padding="p-0" className="overflow-hidden border-gray-100 shadow-sm">
            {/* Folder Header */}
            <div className={`p-4 flex items-center justify-between group transition-colors ${isOpen ? 'bg-gray-50 border-b border-gray-100' : 'hover:bg-gray-50/50'}`}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-[#DC5178] shadow-sm border border-transparent hover:border-gray-100"
                    >
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl transition-all shadow-sm ${isOpen ? 'bg-[#DC5178] text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                            <Folder size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 font-lexend">{section}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{items.length} lectures • Drag to reorder</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <Link href={`/admin/lecture/create?courseId=${courseId}&section=${encodeURIComponent(section)}`}>
                        <IconButton icon={Plus} title="Add Lecture to Folder" variant="primary" />
                    </Link>
                    <IconButton icon={Pencil} title="Rename Folder" onClick={() => setIsRenameOpen(true)} />
                    <IconButton icon={FolderX} variant="danger" title="Delete Folder" onClick={() => setIsDeleteOpen(true)} />
                </div>
            </div>

            {/* Folder Content / Lecture List */}
            {isOpen && (
                <div className="p-3 bg-white">
                    {items.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 font-jost text-sm italic py-12 border-2 border-dashed border-gray-100 rounded-xl m-2">
                            Folder is empty
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={items.map(l => l.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-1.5">
                                    {items.map((lecture, index) => (
                                        <SortableLectureItem
                                            key={lecture.id}
                                            lecture={lecture}
                                            index={index}
                                            courseId={courseId}
                                            handleDelete={handleDelete}
                                            isDeleting={isDeleting}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            )}

            {/* Rename Modal */}
            <Modal
                isOpen={isRenameOpen}
                onClose={() => setIsRenameOpen(false)}
                title="Rename Folder"
                icon={Pencil}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleRename} loading={isRenaming}>Rename Folder</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="New Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                    />
                </div>
            </Modal>

            {/* Delete Folder Modal */}
            <Modal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title="Delete Folder"
                icon={FolderX}
                iconBg="bg-red-50"
                iconColor="text-red-500"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteFolder} loading={isDeletingFolder}>Delete Folder & Content</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-gray-500 font-medium font-jost leading-relaxed">
                        Are you sure you want to delete the folder <span className="text-gray-900 font-bold">&quot;{section}&quot;</span>?
                    </p>
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                        <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest mb-1">DANGER ZONE</p>
                        <p className="text-sm text-red-700 font-medium">This will permanently delete all <span className="font-bold underline">{items.length} lectures</span> inside this folder. This action cannot be undone.</p>
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

// ==============================================
// SORTABLE LECTURE ITEM COMPONENT
// ==============================================
const SortableLectureItem = ({ lecture, index, courseId, handleDelete, isDeleting }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lecture.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 1000 : 'auto',
    };

    const confirmDelete = async () => {
        setIsConfirmingDelete(true);
        try {
            await handleDelete(lecture.id);
            setIsDeleteModalOpen(false);
        } finally {
            setIsConfirmingDelete(false);
        }
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group ${isDragging
                        ? 'bg-pink-50 border-[#DC5178] shadow-xl rotate-1'
                        : 'bg-white border-gray-100 hover:border-pink-200 hover:shadow-md hover:translate-x-1'
                    }`}
            >
                <div className="flex items-center gap-4 flex-1">
                    {/* Drag Handle */}
                    <button
                        {...attributes}
                        {...listeners}
                        className="p-1.5 text-gray-300 hover:text-[#DC5178] cursor-grab active:cursor-grabbing rounded-lg hover:bg-pink-50 transition-all"
                        title="Drag to reorder"
                    >
                        <GripVertical size={16} />
                    </button>

                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-white transition-colors">
                        <span className="text-gray-400 font-bold font-lexend text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#DC5178] transition-colors font-lexend truncate">
                            {lecture.lectureTitle}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-[10px] font-bold uppercase tracking-widest font-lexend">
                            <span className="flex items-center gap-1.5 text-gray-400">
                                <PlayCircle size={12} className="text-[#DC5178]" />
                                Video Lecture
                            </span>
                            {lecture.isPreviewFree && (
                                <Badge variant="success">Free Preview</Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-all">
                    <Link href={`/admin/lecture/edit/${lecture.id}?courseId=${courseId}`}>
                        <IconButton icon={Edit} title="Edit Lecture" />
                    </Link>
                    <IconButton
                        icon={Trash2}
                        variant="danger"
                        title="Delete Lecture"
                        onClick={() => setIsDeleteModalOpen(true)}
                    />
                </div>
            </div>

            {/* Individual Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Lecture"
                icon={Trash2}
                iconBg="bg-red-50"
                iconColor="text-red-500"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete} loading={isConfirmingDelete}>Delete Lecture</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-lexend mb-1">Deleting Lecture</p>
                        <p className="text-gray-900 font-bold font-lexend">{lecture.lectureTitle}</p>
                    </div>
                    <p className="text-gray-500 font-medium font-jost leading-relaxed">
                        Are you sure you want to permanently delete this lecture? The video file will also be removed from storage.
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default CourseLectures;
