"use client";
import React, { useState } from 'react';
import {
    useGetAdminsAndMentorsQuery,
    useCreateAdminOrMentorMutation,
    useDeleteAdminOrMentorMutation
} from '@/feature/api/superadminApi';
import {
    UserPlus,
    Trash2,
    Mail,
    Phone,
    Shield,
    UserCheck,
    Users,
    Search,
    AlertCircle,
    Eye,
    EyeOff
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import {
    PageHeader,
    Card,
    Button,
    LoadingState,
    ErrorState,
    EmptyState,
    Badge,
    StatCard,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableHeader,
    Modal,
    Input,
    Select,
    IconButton,
} from "@/app/(admin)/admin/components/AdminUI";

const EmployeesPage = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const isSuperAdmin = currentUser?.role === 'superadmin';

    const { data, isLoading, isError, refetch } = useGetAdminsAndMentorsQuery();
    const [createEmployee, { isLoading: isCreating }] = useCreateAdminOrMentorMutation();
    const [deleteEmployee] = useDeleteAdminOrMentorMutation();

    const employees = data?.users || [];

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'mentor'
    });

    const [showPassword, setShowPassword] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            const result = await createEmployee(formData).unwrap();
            toast.success(result.message || "Employee added successfully");
            setIsAddModalOpen(false);
            setFormData({ name: '', email: '', phone: '', password: '', role: 'mentor' });
            refetch();
        } catch (error) {
            toast.error(error.data?.message || "Failed to add employee");
        }
    };

    const handleDeleteClick = (emp) => {
        setEmployeeToDelete(emp);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteEmployee = async () => {
        if (!employeeToDelete) return;

        try {
            const result = await deleteEmployee(employeeToDelete.id).unwrap();
            toast.success(result.message || "Employee deleted successfully");
            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
            refetch();
        } catch (error) {
            toast.error(error.data?.message || "Failed to delete employee");
        }
    };

    if (isLoading) return <LoadingState message="Loading employees..." />;
    if (isError) return <ErrorState message="Failed to load employees" onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Employee Management"
                description="Manage your team of administrators, mentors, and sales staff"
            >
                {isSuperAdmin && (
                    <Button
                        variant="primary"
                        icon={UserPlus}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Employee
                    </Button>
                )}
            </PageHeader>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Staff"
                    value={employees.length}
                    icon={Users}
                    variant="pink"
                />
                <StatCard
                    title="Administrators"
                    value={employees.filter(e => e.role === 'admin').length}
                    icon={Shield}
                    variant="indigo"
                />
                <StatCard
                    title="Mentors"
                    value={employees.filter(e => e.role === 'mentor').length}
                    icon={UserCheck}
                    variant="amber"
                />
                <StatCard
                    title="Sales Staff"
                    value={employees.filter(e => e.role === 'sales').length}
                    icon={Users}
                    variant="emerald"
                />
            </div>

            {/* Employees Table */}
            <Card padding="p-0">
                {employees.length === 0 ? (
                    <EmptyState
                        icon={Search}
                        title="No employees found"
                        description="Start by adding your first team member."
                        action={
                            isSuperAdmin && (
                                <Button
                                    variant="primary"
                                    icon={UserPlus}
                                    onClick={() => setIsAddModalOpen(true)}
                                >
                                    Add Employee
                                </Button>
                            )
                        }
                    />
                ) : (
                    <Table>
                        <TableHead>
                            <tr>
                                <TableHeader>Employee</TableHeader>
                                <TableHeader>Contact</TableHeader>
                                <TableHeader>Role</TableHeader>
                                <TableHeader>Joined</TableHeader>
                                <TableHeader className="text-right">Actions</TableHeader>
                            </tr>
                        </TableHead>
                        <TableBody>
                            {employees.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-10 h-10 border border-gray-100 shadow-sm">
                                                <AvatarImage src={emp.avatar} />
                                                <AvatarFallback className="bg-white text-[#DC5178] text-sm font-bold font-lexend border border-pink-100">
                                                    {emp.name?.charAt(0).toUpperCase() || "E"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-lexend text-gray-900 dark:text-white text-sm font-bold">
                                                    {emp.name}
                                                </h4>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-[13px] font-medium font-jost">
                                                <Mail size={12} className="text-[#DC5178]" />
                                                <span className="text-gray-700 dark:text-gray-200">{emp.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] font-medium font-jost">
                                                <Phone size={12} className="text-gray-400 dark:text-gray-500" />
                                                <span className="text-gray-500 dark:text-gray-400">{emp.phone || "Not provided"}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            emp.role === 'admin' ? 'primary' :
                                                emp.role === 'mentor' ? 'warning' : 'success'
                                        }>
                                            {emp.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-[13px] font-lexend">
                                            <p className="text-gray-900 dark:text-white font-bold">
                                                {new Date(emp.createdAt || emp.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <IconButton
                                            icon={Trash2}
                                            variant="danger"
                                            title="Delete Employee"
                                            onClick={() => handleDeleteClick(emp)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Add Employee Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Employee"
                icon={UserPlus}
            >
                <form onSubmit={handleAddEmployee} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                    />
                    <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10 digit number"
                        required
                    />
                    <div className="relative">
                        <Input
                            label="Initial Password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Min 8 chars, mixed case, symbols"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] text-gray-400 hover:text-[#DC5178] transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <Select
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        options={[
                            { label: 'Mentor', value: 'mentor' },
                            { label: 'Admin', value: 'admin' },
                            { label: 'Sales', value: 'sales' },
                        ]}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isCreating}
                        >
                            Create Account
                        </Button>
                    </div>
                </form>
            </Modal>
            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Employee"
                icon={Trash2}
                iconBg="bg-red-50"
                iconColor="text-red-500"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="text-red-500 shrink-0" size={20} />
                        <div>
                            <p className="text-sm font-bold text-red-900 font-lexend">Confirm Deletion</p>
                            <p className="text-xs text-red-600 font-jost mt-1">
                                Are you sure you want to delete <span className="font-bold">{employeeToDelete?.name}</span>? This action cannot be undone.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDeleteEmployee}
                        >
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EmployeesPage;
