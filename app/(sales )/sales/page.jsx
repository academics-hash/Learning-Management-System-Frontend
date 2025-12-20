"use client";
import React from 'react';
import { useGetDashboardStatsQuery } from '@/feature/api/statsApi';
import { useGetEnquiryStatsQuery, useGetEnquiryTrendQuery, useGetAllEnquiriesQuery } from '@/feature/api/enquiryApi';
import { useGetAllUsersQuery } from '@/feature/api/authApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MessageSquare, Users, TrendingUp, Clock, Activity, Target, CheckCircle } from 'lucide-react';
import { PageHeader, Card, StatCard, LoadingState, ErrorState, Badge, typography } from '@/app/(admin)/admin/components/AdminUI';

const SalesDashboard = () => {
    const { data: dashboardStats, isLoading: isStatsLoading, error: statsError, refetch: refetchStats } = useGetDashboardStatsQuery();
    const { data: enquiryData, isLoading: isEnquiryLoading } = useGetEnquiryStatsQuery();
    const { data: trendDataRaw, isLoading: isTrendLoading } = useGetEnquiryTrendQuery();
    const { data: latestEnquiriesData } = useGetAllEnquiriesQuery({ page: 1, limit: 5 });
    const { data: latestStudentsData } = useGetAllUsersQuery();

    if (isStatsLoading || isEnquiryLoading || isTrendLoading) return <LoadingState message="Loading sales dashboard..." />;
    if (statsError) return <ErrorState message="Failed to load sales statistics" onRetry={refetchStats} />;

    const enquiryStats = enquiryData?.data || { total: 0, pending: 0, contacted: 0, converted: 0, rejected: 0 };
    const trendData = trendDataRaw?.data || [];
    const latestEnquiries = latestEnquiriesData?.data?.enquiries || [];
    const latestStudents = latestStudentsData?.users?.slice(0, 5) || [];

    // Sales specific pie data
    const pieData = [
        { name: 'Pending', value: enquiryStats.pending, color: '#f59e0b' },
        { name: 'Contacted', value: enquiryStats.contacted, color: '#4F46E5' },
        { name: 'Converted', value: enquiryStats.converted, color: '#10B981' },
    ];

    const COLORS = ['#f59e0b', '#4F46E5', '#10B981'];

    // Calculate Conversion Rate
    const conversionRate = enquiryStats.total > 0
        ? ((enquiryStats.converted / enquiryStats.total) * 100).toFixed(1)
        : 0;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <PageHeader
                title="Sales Dashboard"
                description="Monitor leads, enquiries and sales performance"
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Enquiries"
                    value={enquiryStats.total}
                    icon={Users}
                    variant="pink"
                />
                <StatCard
                    title="Pending Action"
                    value={enquiryStats.pending}
                    icon={Clock}
                    variant="amber"
                />
                <StatCard
                    title="Contacted"
                    value={enquiryStats.contacted}
                    icon={MessageSquare}
                    variant="indigo"
                />
                <StatCard
                    title="Total Conversions"
                    value={enquiryStats.converted}
                    icon={Target}
                    variant="emerald"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lead Distribution */}
                <Card className="lg:col-span-1">
                    <h2 className={typography.h3 + " mb-6"}>Lead Distribution</h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    color: '#111827',
                                    fontFamily: 'Jost',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3 mt-4">
                        {pieData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-gray-500 text-sm font-jost font-medium">{item.name}</span>
                                </div>
                                <span className="text-gray-900 font-bold font-lexend">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Lead Trend Chart */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={typography.h3}>Lead Activity Trend</h2>
                        <Badge variant={trendDataRaw?.metrics?.growth >= 0 ? "success" : "warning"}>
                            <span className="flex items-center gap-1">
                                {Number(trendDataRaw?.metrics?.today) > 0 ? (trendDataRaw?.metrics?.growth >= 0 ? <TrendingUp size={12} /> : <Clock size={12} />) : <Clock size={12} />}
                                {trendDataRaw?.metrics?.today || 0} Actions today ({trendDataRaw?.metrics?.growth || 0}%)
                            </span>
                        </Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorSalesValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#DC5178" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#DC5178" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    color: '#111827',
                                    fontFamily: 'Jost',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#DC5178"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorSalesValue)"
                                dot={{ fill: '#DC5178', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#DC5178' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Enquiry Activity */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={typography.h3}>Recent Enquiries</h2>
                        <Activity size={18} className="text-gray-400" />
                    </div>
                    {latestEnquiries.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 font-jost">No recent enquiries</div>
                    ) : (
                        <div className="space-y-4">
                            {latestEnquiries.map((enquiry) => (
                                <div key={enquiry.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="p-2 bg-pink-50 rounded-lg">
                                        <MessageSquare size={16} className="text-[#DC5178]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="text-gray-900 text-sm font-semibold font-jost truncate">
                                                {enquiry.name}
                                            </p>
                                            <Badge variant={enquiry.status === 'pending' ? 'warning' : 'info'} size="sm">
                                                {enquiry.status}
                                            </Badge>
                                        </div>
                                        <p className="text-gray-400 text-xs font-jost flex items-center gap-1 mt-1 font-medium">
                                            <Clock size={10} />
                                            {new Date(enquiry.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Recent Registrations (Conversions) */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={typography.h3}>Recent Student Signups</h2>
                        <CheckCircle size={18} className="text-gray-400" />
                    </div>
                    {latestStudents.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 font-jost">No recent student registrations</div>
                    ) : (
                        <div className="space-y-4">
                            {latestStudents.map((student) => (
                                <div key={student.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="p-2 bg-emerald-50 rounded-lg">
                                        <CheckCircle size={16} className="text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-900 text-sm font-semibold font-jost truncate">
                                            {student.name}
                                        </p>
                                        <p className="text-gray-500 text-xs font-jost truncate">
                                            {student.email}
                                        </p>
                                        <p className="text-gray-400 text-[10px] font-jost mt-1 uppercase font-bold tracking-wider">
                                            Joined {new Date(student.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default SalesDashboard;
