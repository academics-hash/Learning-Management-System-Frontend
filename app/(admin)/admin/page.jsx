"use client";
import React from 'react';
import { useGetDashboardStatsQuery } from '@/feature/api/statsApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, BookOpen, Video, TrendingUp, Clock, Award, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { PageHeader, Card, StatCard, LoadingState, ErrorState, Badge, typography } from '@/app/(admin)/admin/components/AdminUI';

const AdminDashboard = () => {
  const { data, isLoading, error, refetch } = useGetDashboardStatsQuery();

  if (isLoading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message="Failed to load dashboard statistics" onRetry={refetch} />;

  const stats = data?.stats || { totalUsers: 0, totalCourses: 0, totalLectures: 0 };

  // Pie chart data
  const pieData = [
    { name: 'Students', value: stats.totalUsers, color: '#DC5178' },
    { name: 'Courses', value: stats.totalCourses, color: '#4F46E5' },
    { name: 'Lectures', value: stats.totalLectures, color: '#10B981' },
  ];

  const COLORS = ['#DC5178', '#4F46E5', '#10B981'];

  // Mock activity data
  const recentActivities = [
    { type: 'user', message: 'New student registered', time: '2 min ago', icon: Users },
    { type: 'course', message: 'Course "React Basics" updated', time: '15 min ago', icon: BookOpen },
    { type: 'lecture', message: 'New lecture uploaded', time: '1 hour ago', icon: Video },
    { type: 'user', message: '5 new enrollments', time: '3 hours ago', icon: Award },
  ];

  // Mock trend data
  const trendData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 25 },
    { name: 'Fri', value: 22 },
    { name: 'Sat', value: 30 },
    { name: 'Sun', value: 28 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Admin Dashboard"
        description="Overview of your learning management system"
      />

      {/* Stats Grid */}
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
          title="This Week"
          value="+12%"
          icon={TrendingUp}
          variant="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution Chart */}
        <Card className="lg:col-span-1">
          <h2 className={typography.h3 + " mb-6"}>Distribution</h2>
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

        {/* Trend Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className={typography.h3}>Weekly Activity</h2>
            <Badge variant="success">
              <span className="flex items-center gap-1">
                <ArrowUpRight size={12} />
                +15.3%
              </span>
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#colorValue)"
                dot={{ fill: '#DC5178', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#DC5178' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className={typography.h3}>Recent Activity</h2>
            <Activity size={18} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-pink-50 rounded-lg">
                    <Icon size={16} className="text-[#DC5178]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-semibold font-jost truncate">
                      {activity.message}
                    </p>
                    <p className="text-gray-400 text-xs font-jost flex items-center gap-1 mt-1 font-medium">
                      <Clock size={10} />
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Summary */}
        <Card>
          <h2 className={typography.h3 + " mb-6"}>Platform Summary</h2>
          <div className="space-y-5">
            {/* Growth indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-sm font-bold font-lexend">Students</span>
                  <span className="text-green-600 text-xs font-bold flex items-center">
                    <ArrowUpRight size={12} />
                    12%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 font-lexend">{stats.totalUsers}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-sm font-bold font-lexend">Courses</span>
                  <span className="text-green-600 text-xs font-bold flex items-center">
                    <ArrowUpRight size={12} />
                    8%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 font-lexend">{stats.totalCourses}</p>
              </div>
            </div>

            {/* Total count */}
            <div className="bg-gradient-to-r from-pink-50 to-indigo-50 rounded-xl p-6 border border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-bold font-lexend mb-1">Total Content Items</p>
                  <p className="text-4xl font-bold text-[#DC5178] font-lexend">
                    {(stats.totalUsers + stats.totalCourses + stats.totalLectures).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-pink-100">
                  <TrendingUp className="w-8 h-8 text-[#DC5178]" />
                </div>
              </div>
            </div>

            {/* Quick info */}
            <p className="text-gray-500 text-sm font-medium font-jost leading-relaxed">
              Your platform has <span className="text-[#DC5178] font-bold">{stats.totalUsers}</span> students
              learning from <span className="text-indigo-600 font-bold">{stats.totalCourses}</span> courses
              with <span className="text-emerald-600 font-bold">{stats.totalLectures}</span> lectures.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;