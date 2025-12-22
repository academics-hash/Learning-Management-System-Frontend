"use client";
import React from "react";
import { Loader2 } from "lucide-react";

// ==============================================
// ADMIN THEME DESIGN SYSTEM (DARK & LIGHT)
// ==============================================

// Color Palette
export const colors = {
    primary: "#DC5178",      // Pink
    primaryHover: "#c03e62",
    secondary: "#4F46E5",    // Indigo
    accent: "#10B981",       // Emerald
    warning: "#F59E0B",      // Amber
    error: "#EF4444",        // Red
};

// Typography classes
export const typography = {
    h1: "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-lexend",
    h2: "text-2xl font-bold text-gray-900 dark:text-white font-lexend",
    h3: "text-xl font-semibold text-gray-900 dark:text-white font-lexend",
    h4: "text-lg font-semibold text-gray-900 dark:text-white font-lexend",
    body: "text-base text-gray-600 dark:text-gray-200 font-jost",
    small: "text-sm text-gray-500 dark:text-gray-300 font-jost",
    muted: "text-xs text-gray-400 dark:text-gray-400 font-jost",
    label: "text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider font-lexend",
};

// ==============================================
// PAGE HEADER COMPONENT
// ==============================================
export const PageHeader = ({ title, description, children }) => (
    <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className={typography.h1}>{title}</h1>
                {description && (
                    <p className="text-gray-500 dark:text-gray-300 text-sm font-jost mt-2">{description}</p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-3">
                    {children}
                </div>
            )}
        </div>
    </div>
);

// ==============================================
// CARD COMPONENT
// ==============================================
export const Card = ({ children, className = "", padding = "p-6", hover = false }) => (
    <div className={`
        bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl rounded-xl border border-black/5 dark:border-white/5 shadow-sm
        ${padding} 
        ${hover ? "hover:border-black/10 dark:hover:border-white/10 hover:shadow-md dark:shadow-black/20 transition-all duration-300" : ""}
        ${className}
    `}>
        {children}
    </div>
);

export const CardHeader = ({ title, description, children }) => (
    <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className={typography.h3}>{title}</h2>
            {description && <p className={typography.small + " mt-1"}>{description}</p>}
        </div>
        {children}
    </div>
);

// ==============================================
// STAT CARD COMPONENT
// ==============================================
export const StatCard = ({ title, value, icon: Icon, variant = "pink" }) => {
    const variants = {
        pink: {
            gradient: "from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-900/10",
            border: "border-pink-200 dark:border-pink-900/30",
            icon: "text-pink-600 dark:text-pink-400",
            iconBg: "bg-pink-100 dark:bg-pink-900/40",
            value: "text-pink-700 dark:text-pink-300"
        },
        indigo: {
            gradient: "from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-900/10",
            border: "border-indigo-200 dark:border-indigo-900/30",
            icon: "text-indigo-600 dark:text-indigo-400",
            iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
            value: "text-indigo-700 dark:text-indigo-300"
        },
        emerald: {
            gradient: "from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10",
            border: "border-emerald-200 dark:border-emerald-900/30",
            icon: "text-emerald-600 dark:text-emerald-400",
            iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
            value: "text-emerald-700 dark:text-emerald-300"
        },
        amber: {
            gradient: "from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10",
            border: "border-amber-200 dark:border-amber-900/30",
            icon: "text-amber-600 dark:text-amber-400",
            iconBg: "bg-amber-100 dark:bg-amber-900/40",
            value: "text-amber-700 dark:text-amber-300"
        },
    };

    const v = variants[variant] || variants.pink;

    return (
        <div className={`
            bg-white dark:bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 
            border ${v.border} hover:shadow-md hover:-translate-y-1 transition-all duration-300
        `}>
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${v.iconBg}`}>
                    <Icon className={`w-5 h-5 ${v.icon}`} />
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-300 font-semibold font-jost uppercase tracking-wide">{title}</p>
                    <p className={`text-2xl font-bold ${v.value} font-lexend mt-0.5`}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                </div>
            </div>
        </div>
    );
};

// ==============================================
// BUTTON COMPONENTS
// ==============================================
export const Button = ({
    children,
    variant = "primary",
    size = "md",
    icon: Icon,
    loading = false,
    disabled = false,
    className = "",
    ...props
}) => {
    const variants = {
        primary: "bg-[#DC5178] hover:bg-[#c03e62] text-white shadow-sm shadow-pink-200 dark:shadow-none",
        secondary: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200",
        ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-100 dark:shadow-none",
        success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-100 dark:shadow-none",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={`
                ${variants[variant]} ${sizes[size]}
                rounded-lg font-medium font-lexend
                flex items-center justify-center gap-2
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : Icon ? (
                <Icon className="w-4 h-4" />
            ) : null}
            {children}
        </button>
    );
};

// ==============================================
// INPUT COMPONENTS
// ==============================================
export const Input = ({
    label,
    error,
    className = "",
    ...props
}) => (
    <div className="space-y-2">
        {label && <label className={typography.label}>{label}</label>}
        <input
            className={`
                w-full px-4 py-2.5 rounded-lg 
                border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50
                focus:border-[#DC5178] focus:ring-4 focus:ring-[#DC5178]/5 
                transition-all outline-none 
                text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium font-jost
                ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/5" : ""}
                ${className}
            `}
            {...props}
        />
        {error && <p className="text-red-500 text-xs font-jost">{error}</p>}
    </div>
);

export const Textarea = ({
    label,
    error,
    className = "",
    rows = 4,
    ...props
}) => (
    <div className="space-y-2">
        {label && <label className={typography.label}>{label}</label>}
        <textarea
            rows={rows}
            className={`
                w-full px-4 py-2.5 rounded-lg 
                border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50
                focus:border-[#DC5178] focus:ring-4 focus:ring-[#DC5178]/5 
                transition-all outline-none resize-none
                text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-medium font-jost
                ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/5" : ""}
                ${className}
            `}
            {...props}
        />
        {error && <p className="text-red-500 text-xs font-jost">{error}</p>}
    </div>
);

export const Select = ({
    label,
    options = [],
    error,
    className = "",
    ...props
}) => (
    <div className="space-y-2">
        {label && <label className={typography.label}>{label}</label>}
        <select
            className={`
                w-full px-4 py-2.5 rounded-lg 
                border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50
                focus:border-[#DC5178] focus:ring-4 focus:ring-[#DC5178]/5 
                transition-all outline-none 
                text-gray-900 dark:text-white font-medium font-jost
                ${error ? "border-red-500" : ""}
                ${className}
            `}
            {...props}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        {error && <p className="text-red-500 text-xs font-jost">{error}</p>}
    </div>
);

// ==============================================
// MODAL COMPONENT
// ==============================================
export const Modal = ({
    isOpen,
    onClose,
    title,
    icon: Icon,
    iconColor = "text-[#DC5178]",
    iconBg = "bg-[#DC5178]/10",
    children,
    footer
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-100 p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-800">
                    {Icon && (
                        <div className={`p-2.5 ${iconBg} rounded-xl`}>
                            <Icon className={iconColor} size={20} />
                        </div>
                    )}
                    <h3 className={typography.h3}>{title}</h3>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex justify-end gap-3 p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 rounded-b-2xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

// ==============================================
// TABLE COMPONENTS
// ==============================================
export const Table = ({ children, className = "" }) => (
    <div className="overflow-x-auto">
        <table className={`w-full text-left ${className}`}>
            {children}
        </table>
    </div>
);

export const TableHead = ({ children }) => (
    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-200 font-lexend text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
        {children}
    </thead>
);

export const TableBody = ({ children }) => (
    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
        {children}
    </tbody>
);

export const TableRow = ({ children, onClick, className = "" }) => (
    <tr
        className={`hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors ${onClick ? "cursor-pointer" : ""} ${className}`}
        onClick={onClick}
    >
        {children}
    </tr>
);

export const TableCell = ({ children, className = "" }) => (
    <td className={`px-6 py-4 font-jost text-gray-600 dark:text-gray-200 text-sm ${className}`}>
        {children}
    </td>
);

export const TableHeader = ({ children, className = "" }) => (
    <th className={`px-6 py-3 font-semibold ${className}`}>
        {children}
    </th>
);

// ==============================================
// BADGE COMPONENT
// ==============================================
export const Badge = ({ children, variant = "default" }) => {
    const variants = {
        default: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
        primary: "bg-pink-50 text-[#DC5178] border-pink-100 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-900/30",
        success: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30",
        warning: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30",
        danger: "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30",
        info: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30",
    };

    return (
        <span className={`
            px-2.5 py-0.5 rounded-full text-xs font-semibold border
            ${variants[variant]}
        `}>
            {children}
        </span>
    );
};

// ==============================================
// EMPTY STATE COMPONENT
// ==============================================
export const EmptyState = ({
    icon: Icon,
    title,
    description,
    action
}) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        {Icon && (
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700">
                <Icon size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
        )}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-lexend mb-2">{title}</h3>
        {description && (
            <p className="text-sm text-gray-500 dark:text-gray-300 font-jost mb-6 max-w-sm">{description}</p>
        )}
        {action}
    </div>
);

// ==============================================
// LOADING STATE COMPONENT
// ==============================================
export const LoadingState = ({ message = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-[#DC5178] mb-4" />
        <p className="text-gray-500 font-jost font-medium">{message}</p>
    </div>
);

// ==============================================
// ERROR STATE COMPONENT
// ==============================================
export const ErrorState = ({ message = "Something went wrong", onRetry }) => (
    <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-8 text-center max-w-md shadow-sm">
            <p className="text-red-600 dark:text-red-300 font-medium font-jost mb-4">{message}</p>
            {onRetry && (
                <Button variant="danger" size="sm" onClick={onRetry}>
                    Try Again
                </Button>
            )}
        </div>
    </div>
);

// ==============================================
// TOGGLE/SWITCH COMPONENT
// ==============================================
export const Toggle = ({ checked, onChange, label, description }) => (
    <label className="flex items-center justify-between cursor-pointer group">
        <div className="space-y-0.5">
            {label && (
                <span className="text-base font-semibold text-gray-700 dark:text-gray-200 group-hover:text-[#DC5178] transition-colors font-lexend">
                    {label}
                </span>
            )}
            {description && (
                <p className="text-xs text-gray-400 dark:text-gray-300 font-jost">{description}</p>
            )}
        </div>
        <div className="relative">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full peer peer-checked:bg-[#DC5178] transition-colors"></div>
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
        </div>
    </label>
);

// ==============================================
// ICON BUTTON COMPONENT
// ==============================================
export const IconButton = ({
    icon: Icon,
    variant = "ghost",
    size = "md",
    title,
    loading = false,
    className = "",
    ...props
}) => {
    const variants = {
        ghost: "text-gray-400 hover:text-[#DC5178] hover:bg-pink-50 dark:hover:bg-pink-900/10",
        primary: "text-[#DC5178] hover:bg-pink-50 dark:hover:bg-pink-900/10",
        danger: "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10",
        success: "text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/10",
    };

    const sizes = {
        sm: "p-1.5",
        md: "p-2",
        lg: "p-3",
    };

    return (
        <button
            className={`
                ${variants[variant]} ${sizes[size]}
                rounded-lg transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                relative flex items-center justify-center
                ${className}
            `}
            title={title}
            disabled={props.disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 size={size === "sm" ? 14 : size === "lg" ? 20 : 16} className="animate-spin" />
            ) : (
                <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
            )}
        </button>
    );
};

// ==============================================
// DIVIDER COMPONENT
// ==============================================
export const Divider = ({ className = "" }) => (
    <div className={`border-t border-gray-100 dark:border-gray-800 ${className}`} />
);

// ==============================================
// SECTION COMPONENT
// ==============================================
export const Section = ({ title, description, children, actions }) => (
    <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h2 className={typography.h3}>{title}</h2>
                {description && <p className={typography.small + " mt-1"}>{description}</p>}
            </div>
            {actions}
        </div>
        {children}
    </div>
);

const AdminUI = {
    colors,
    typography,
    PageHeader,
    Card,
    CardHeader,
    StatCard,
    Button,
    Input,
    Textarea,
    Select,
    Modal,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableHeader,
    Badge,
    EmptyState,
    LoadingState,
    ErrorState,
    Toggle,
    IconButton,
    Divider,
    Section,
};

export default AdminUI;
