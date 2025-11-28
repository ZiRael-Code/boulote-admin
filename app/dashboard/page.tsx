"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { NotificationItem } from "@/components/dashboard/notification-item";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { getAdminDashboard } from "@/lib/api/services/dashboard";
import { formatLastLogin, formatPercentage } from "@/lib/utils/format-date";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-error-500 text-lg font-medium mb-2">
            Failed to load dashboard
          </p>
          <p className="text-neutral-500">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      title: "Total Professional",
      value: data.totalProfessionals.toLocaleString(),
      change: formatPercentage(data.professionalGrowthPercentage),
    },
    {
      title: "Companies Registered",
      value: data.totalCompanies.toLocaleString(),
      change: formatPercentage(data.companyGrowthPercentage),
    },
    {
      title: "Active Professionals",
      value: data.activeProfessionals.toLocaleString(),
      change: formatPercentage(data.professionalGrowthPercentage),
    },
    {
      title: "Active Companies",
      value: data.activeCompanies.toLocaleString(),
      change: formatPercentage(data.companyGrowthPercentage),
    },
    {
      title: "Inactive Professionals",
      value: data.inactiveProfessionals.toLocaleString(),
      change: formatPercentage(0),
    },
    {
      title: "Inactive Companies",
      value: data.inactiveCompanies.toLocaleString(),
      change: formatPercentage(0),
      icon: Building2,
    },
  ];

  const getNotificationBadge = (type: string): "urgent" | "pending" => {
    if (type === "PAYMENT_DISPUTE" || type === "SYSTEM_UPDATE") return "urgent";
    return "pending";
  };

  const getActivityIcon = (type: string) => {
    if (type === "PAYMENT_DISPUTE")
      return "/assets/icon/dashboard/success.svg";
    return "/assets/icon/dashboard/sparkles.svg";
  };

  return (
    <div className="px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl lg:text-[32px] font-semibold lg:leading-[38.4px] lg:tracking-[1px] text-secondary-500">
            Admin Dashboard
          </h1>
          <p className="text-base lg:text-xl font-medium lg:leading-6 lg:tracking-[0.1px] text-secondary-500">
            {data.welcomeMessage} • Last login:{" "}
            {formatLastLogin(data.lastLogin)}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-border-500 rounded-md p-4 lg:p-6 flex flex-col gap-10">
              <h2 className="text-xl font-normal text-secondary-500">
                Notifications
              </h2>
              <div className="flex flex-col gap-10">
                {data.notifications.map((notification, index) => (
                  <NotificationItem
                    key={index}
                    title={notification.title}
                    description={notification.message}
                    badge={getNotificationBadge(notification.type)}
                  />
                ))}
              </div>
              <a
                href="#"
                className="text-base font-medium text-primary-500 hover:text-primary-600 capitalize"
              >
                View All Notifications →
              </a>
            </div>

            <div className="border border-border-500 rounded-md p-4 lg:p-6 flex flex-col gap-10">
              <h2 className="text-xl font-normal text-secondary-500">
                Recent System Activity
              </h2>
              <div className="flex flex-col gap-10">
                {data.systemActivities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    title={activity.title}
                    description={activity.message}
                    time={activity.timeAgo}
                    icon={getActivityIcon(activity.type)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
