"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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

  const professionalsIcon = "/assets/icon/dashboard/professionals.svg";
  const companiesIcon = "/assets/icon/dashboard/companies.svg";

  const stats = [
    {
      title: "Total Professional",
      value: data.totalProfessionals.toLocaleString(),
      change: formatPercentage(data.professionalGrowthPercentage),
      changePositive: data.professionalGrowthPercentage >= 0,
      icon: professionalsIcon,
    },
    {
      title: "Companies Registered",
      value: data.totalCompanies.toLocaleString(),
      change: formatPercentage(data.companyGrowthPercentage),
      changePositive: data.companyGrowthPercentage >= 0,
      icon: companiesIcon,
    },
    {
      title: "Active Professionals",
      value: data.activeProfessionals.toLocaleString(),
      change: formatPercentage(data.professionalGrowthPercentage),
      changePositive: data.professionalGrowthPercentage >= 0,
      icon: professionalsIcon,
    },
    {
      title: "Active Companies",
      value: data.activeCompanies.toLocaleString(),
      change: formatPercentage(data.companyGrowthPercentage),
      changePositive: data.companyGrowthPercentage >= 0,
      icon: companiesIcon,
    },
    {
      title: "Inactive Professionals",
      value: data.inactiveProfessionals.toLocaleString(),
      icon: professionalsIcon,
    },
    {
      title: "Inactive Companies",
      value: data.inactiveCompanies.toLocaleString(),
      icon: companiesIcon,
    },
  ];

  const URGENT_TYPES = ["PAYMENT_DISPUTE", "SYSTEM_ALERT", "SECURITY_ALERT"];

  const getNotificationBadge = (type: string): "urgent" | "pending" => {
    return URGENT_TYPES.includes(type) ? "urgent" : "pending";
  };

  const getActivityIcon = (type: string) => {
    if (URGENT_TYPES.includes(type) || type === "CONTENT_FLAGGED")
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changePositive={stat.changePositive}
                icon={stat.icon}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-border-500 rounded-md p-4 lg:p-6 flex flex-col gap-10">
              <h2 className="text-xl font-normal text-secondary-500">
                Notifications
              </h2>
              <div className="flex flex-col gap-10">
                {data.notifications.length === 0 ? (
                  <p className="text-sm text-neutral-400">No unread notifications.</p>
                ) : (
                  data.notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      title={notification.title}
                      description={notification.message}
                      badge={getNotificationBadge(notification.type)}
                      actionUrl={notification.actionUrl}
                    />
                  ))
                )}
              </div>
              <Link
                href="/dashboard/support"
                className="text-base font-medium text-primary-500 hover:text-primary-600 capitalize"
              >
                View Support Requests →
              </Link>
            </div>

            <div className="border border-border-500 rounded-md p-4 lg:p-6 flex flex-col gap-10">
              <h2 className="text-xl font-normal text-secondary-500">
                Recent System Activity
              </h2>
              <div className="flex flex-col gap-10">
                {data.systemActivities.length === 0 ? (
                  <p className="text-sm text-neutral-400">No recent activity.</p>
                ) : (
                  data.systemActivities.map((activity, index) => (
                    <ActivityItem
                      key={index}
                      title={activity.title}
                      description={activity.message}
                      time={activity.timeAgo}
                      icon={getActivityIcon(activity.type)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
