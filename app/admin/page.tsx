"use client";

import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS } from '@/lib/graphql/queries';
import { Card } from '@/components/ui/card';
import { Loader2, Users, Image, CheckCircle, DollarSign } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading dashboard data: {error.message}
      </div>
    );
  }

  const stats = {
    totalUsers: data?.users.aggregate.count || 0,
    totalImages: data?.images.aggregate.count || 0,
    successRate: calculateSuccessRate(data?.processing_stats.nodes || []),
    revenue: calculateRevenue(data?.users.nodes || [])
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend="+12%"
        />
        <StatCard
          title="Total Images"
          value={stats.totalImages}
          icon={Image}
          trend="+8%"
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={CheckCircle}
          trend="+5%"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue}`}
          icon={DollarSign}
          trend="+15%"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Processing Activity</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={generateChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-full bg-blue-100 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm text-green-600">{trend}</span>
        <span className="text-sm text-gray-600"> vs last month</span>
      </div>
    </Card>
  );
}

function calculateSuccessRate(images: any[]) {
  if (images.length === 0) return 0;
  const successful = images.filter(img => img.status === 'COMPLETED').length;
  return Math.round((successful / images.length) * 100);
}

function calculateRevenue(users: any[]) {
  return users.reduce((total, user) => total + (user.credits || 0), 0) * 0.1;
}

function generateChartData() {
  // Sample data - replace with real data from your backend
  return Array.from({ length: 7 }).map((_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    value: Math.floor(Math.random() * 100)
  })).reverse();
}