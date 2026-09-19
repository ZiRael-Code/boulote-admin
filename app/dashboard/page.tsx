"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/stat-card";
import { NotificationItem } from "@/components/dashboard/notification-item";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { getAdminDashboard } from "@/lib/api/services/dashboard";
import { SimplePagination } from "@/components/ui/simple-pagination";
import {
  useAdminActivitiesPage,
  useAdminNotificationsPage,
} from "@/hooks/use-admin-dashboard-pages";
import { formatLastLogin, formatPercentage } from "@/lib/utils/format-date";

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });

  const [notificationPage, setNotificationPage] = useState(0);
  const [activityPage, setActivityPage] = useState(0);
  const notificationsQuery = useAdminNotificationsPage(notificationPage, PAGE_SIZE);
  const activitiesQuery = useAdminActivitiesPage(activityPage, PAGE_SIZE);

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

  // Prefer the server-paged lists; if those endpoints are unavailable fall
  // back to paging what the dashboard payload already carries.
  const serverNotifications = notificationsQuery.data && !notificationsQuery.isError;
  const notificationsShown = serverNotifications
    ? notificationsQuery.data!.content
    : data.notifications.slice(
        notificationPage * PAGE_SIZE,
        (notificationPage + 1) * PAGE_SIZE
      );
  const notificationsTotalPages = serverNotifications
    ? notificationsQuery.data!.totalPages
    : Math.ceil(data.notifications.length / PAGE_SIZE);

  const serverActivities = activitiesQuery.data && !activitiesQuery.isError;
  const activitiesShown = serverActivities
    ? activitiesQuery.data!.content
    : data.systemActivities.slice(
        activityPage * PAGE_SIZE,
        (activityPage + 1) * PAGE_SIZE
      );
  const activitiesTotalPages = serverActivities
    ? activitiesQuery.data!.totalPages
    : Math.ceil(data.systemActivities.length / PAGE_SIZE);

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
              <div className="flex flex-col divide-y divide-border-500">
                {notificationsShown.length === 0 ? (
                  <p className="text-sm text-neutral-400">No unread notifications.</p>
                ) : (
                  notificationsShown.map((notification) => (
                    <div key={notification.id} className="py-5 first:pt-0 last:pb-0">
                      <NotificationItem
                        title={notification.title}
                        description={notification.message}
                        badge={getNotificationBadge(notification.type)}
                        actionUrl={notification.actionUrl}
                      />
                    </div>
                  ))
                )}
              </div>
              <SimplePagination
                page={notificationPage}
                totalPages={notificationsTotalPages}
                onPageChange={setNotificationPage}
                disabled={notificationsQuery.isFetching}
              />
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
              <div className="flex flex-col divide-y divide-border-500">
                {activitiesShown.length === 0 ? (
                  <p className="text-sm text-neutral-400">No recent activity.</p>
                ) : (
                  activitiesShown.map((activity, index) => (
                    <div key={index} className="py-5 first:pt-0 last:pb-0">
                      <ActivityItem
                        title={activity.title}
                        description={activity.message}
                        time={activity.timeAgo}
                        icon={getActivityIcon(activity.type)}
                      />
                    </div>
                  ))
                )}
              </div>
              <SimplePagination
                page={activityPage}
                totalPages={activitiesTotalPages}
                onPageChange={setActivityPage}
                disabled={activitiesQuery.isFetching}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
