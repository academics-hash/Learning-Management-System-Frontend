"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import { useGetDashboardStatsQuery } from '@/feature/api/statsApi';
import { useGetEnquiryStatsQuery, useGetEnquiryTrendQuery } from '@/feature/api/enquiryApi';
import { useGetAllEnrollmentsQuery } from '@/feature/api/enrollmentApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, BookOpen, Video, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, Activity, MessageSquare, Target, Shield, GraduationCap } from 'lucide-react';
import { PageHeader, Card, StatCard, LoadingState, ErrorState, Badge, typography } from '@/app/(admin)/admin/components/AdminUI';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'superadmin';

  const { data, isLoading: isStatsLoading, error, refetch } = useGetDashboardStatsQuery();
  const { data: enrollmentData, isLoading: isEnrollmentLoading } = useGetAllEnrollmentsQuery();


  // Fetch sales data only for superadmins
  const { data: enquiryData, isLoading: isEnquiryLoading } = useGetEnquiryStatsQuery(undefined, {
    skip: !isSuperAdmin
  });
  const { data: trendDataRaw, isLoading: isTrendLoading } = useGetEnquiryTrendQuery(undefined, {
    skip: !isSuperAdmin
  });

  if (isStatsLoading || isEnrollmentLoading || (isSuperAdmin && (isEnquiryLoading || isTrendLoading))) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message="Failed to load dashboard statistics" onRetry={refetch} />;

  const stats = data?.stats || { totalUsers: 0, totalCourses: 0, totalLectures: 0, totalPlacements: 0 };
  const activities = data?.activities || [];
  const enrollments = enrollmentData?.enrollments || [];
  const enquiryStats = enquiryData?.data || { total: 0, pending: 0, contacted: 0, converted: 0, rejected: 0 };

  const leadTrendData = trendDataRaw?.data || [];

  // Icon mapping for activities
  const activityIcons = {
    user: Users,
    course: BookOpen,
    lecture: Video,
    enquiry: MessageSquare,
    placement: Target,
    default: Activity
  };

  // Time formatter (simple)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  // Main Distribution Data
  const pieData = [
    { name: 'Students', value: stats.totalUsers, color: '#DC5178' },
    { name: 'Courses', value: stats.totalCourses, color: '#4F46E5' },
    { name: 'Lectures', value: stats.totalLectures, color: '#10B981' },
    { name: 'Placements', value: stats.totalPlacements, color: '#f59e0b' },
  ];

  // Sales Distribution Data (for Superadmin)
  const salesPieData = [
    { name: 'Pending', value: enquiryStats.pending, color: '#f59e0b' },
    { name: 'Contacted', value: enquiryStats.contacted, color: '#4F46E5' },
    { name: 'Converted', value: enquiryStats.converted, color: '#10B981' },
  ];

  const COLORS = ['#DC5178', '#4F46E5', '#10B981', '#f59e0b'];
  const SALES_COLORS = ['#f59e0b', '#4F46E5', '#10B981'];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title={isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}
        description="Comprehensive overview of your platform's performance"
      />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalUsers}
          icon={Users}
          variant="pink"
        />
        <StatCard
          title="Active Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          variant="indigo"
        />
        <StatCard
          title="Video Lectures"
          value={stats.totalLectures}
          icon={Video}
          variant="emerald"
        />
        <StatCard
          title="Placements"
          value={stats.totalPlacements}
          icon={Target}
          variant="amber"
        />
      </div>

      {isSuperAdmin && (
        <>
          <div className="flex items-center gap-3 mt-10 mb-4">
            <div className="w-1 h-6 bg-[#DC5178] rounded-full"></div>
            <h2 className={typography.h2}>Sales & Leads Overview</h2>
          </div>

          {/* Sales Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Enquiries"
              value={enquiryStats.total}
              icon={MessageSquare}
              variant="pink"
            />
            <StatCard
              title="Pending Leads"
              value={enquiryStats.pending}
              icon={Clock}
              variant="amber"
            />
            <StatCard
              title="Conversions"
              value={enquiryStats.converted}
              icon={Target}
              variant="emerald"
            />
            <StatCard
              title="Success Rate"
              value={enquiryStats.total > 0 ? ((enquiryStats.converted / enquiryStats.total) * 100).toFixed(1) + "%" : "0%"}
              icon={TrendingUp}
              variant="indigo"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Trend Chart */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className={typography.h3}>Lead Intake Trend</h2>
                <Badge variant={trendDataRaw?.metrics?.growth >= 0 ? "success" : "warning"}>
                  <span className="flex items-center gap-1">
                    {parseFloat(trendDataRaw?.metrics?.growth) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trendDataRaw?.metrics?.today || 0} Leads today ({trendDataRaw?.metrics?.growth || 0}%)
                  </span>
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={leadTrendData}>
                  <defs>
                    <linearGradient id="colorSalesTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC5178" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#DC5178" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(17, 24, 39)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontFamily: 'Jost',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#DC5178"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSalesTrend)"
                    dot={{ fill: '#DC5178', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Sales Distribution */}
            <Card className="lg:col-span-1">
              <h2 className={typography.h3 + " mb-6"}>Lead Pipeline</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={salesPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {salesPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SALES_COLORS[index % SALES_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {salesPieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-500 dark:text-gray-400 font-medium">{item.name}</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* General Distribution and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h2 className={typography.h3 + " mb-6"}>Resource Distribution</h2>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-jost font-medium">{item.name}</span>
                </div>
                <span className="text-gray-900 dark:text-white font-bold font-lexend">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className={typography.h3}>Recent Activity</h2>
            <Activity size={18} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-center py-10 text-gray-400 font-jost italic">No recent activity detected.</p>
            ) : (
              activities.map((activity, index) => {
                const Icon = activityIcons[activity.type] || activityIcons.default;
                return (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="p-2 bg-pink-50 dark:bg-pink-900/10 rounded-lg">
                      <Icon size={16} className="text-[#DC5178]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white text-sm font-semibold font-jost truncate">
                        {activity.message}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs font-jost flex items-center gap-1 mt-1 font-medium">
                        <Clock size={10} />
                        {formatTime(activity.time)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-8 p-4 bg-linear-to-r from-pink-50 to-indigo-50 dark:from-pink-900/10 dark:to-indigo-900/10 rounded-xl border border-pink-100 dark:border-pink-900/20 flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold font-lexend mb-1 uppercase tracking-wider">Total Platform Content</p>
              <p className="text-2xl font-bold text-[#DC5178] font-lexend">
                {(stats.totalUsers + stats.totalCourses + stats.totalLectures + stats.totalPlacements).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#DC5178] opacity-50" />
          </div>
        </Card>
      </div>
      {/* Enrollment Overview */}
      <Card>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#DC5178] rounded-full"></div>
            <h2 className={typography.h2}>Student Enrollments</h2>
          </div>
          <Badge variant="pink">{enrollments.length} Total Enrolled</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-jost border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date joined</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-jost italic bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    No enrollments found yet.
                  </td>
                </tr>
              ) : (
                enrollments.slice(0, 10).map((enrollment, index) => (
                  <tr key={index} className="bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all group">
                    <td className="px-6 py-4 rounded-l-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-[#DC5178] font-bold text-xs uppercase">
                          {enrollment.student?.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white font-bold text-sm">{enrollment.student?.name || 'Unknown User'}</p>
                          <p className="text-gray-400 text-xs">{enrollment.student?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 dark:text-gray-300 font-medium text-sm line-clamp-1">
                        {enrollment.course?.course_title || 'Unknown Course'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={enrollment.is_active ? 'success' : 'secondary'}>
                        {enrollment.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-2xl">
                      <p className="text-gray-500 font-medium text-sm">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};


export default AdminDashboard;