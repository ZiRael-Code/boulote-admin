"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Button from "@/components/ui/button";
import {
  useProfessionalsDashboard,
  useProfessionals,
} from "@/hooks/use-professionals";
import { formatDate } from "@/lib/utils/format-date";
import type { Professional } from "@/lib/types/professional";

export default function ProfessionalsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data: dashboardData, isLoading: isLoadingStats } =
    useProfessionalsDashboard(true);
  const { data: professionalsData, isLoading: isLoadingProfessionals } =
    useProfessionals(true);

  const stats = dashboardData?.stats;
  const professionals = professionalsData?.content || [];
  const totalProfessionals = professionalsData?.totalElements || 0;
  const totalPages = professionalsData?.totalPages || 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-warning-500";
      case "ACTIVE":
        return "text-success-500";
      case "INACTIVE":
        return "text-neutral-500";
      default:
        return "text-secondary-500";
    }
  };

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case "PREMIUM":
        return "text-success-600";
      case "BASIC":
        return "text-neutral-500";
      default:
        return "text-secondary-500";
    }
  };

  return (
    <div className="flex flex-col gap-8 px-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-semibold tracking-[1px] text-secondary-500">
          Professional management
        </h1>
        <p className="text-base font-normal text-secondary-500">
          Manage job requests, AI shortlisting, and professional assignments
        </p>
      </div>

      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-border-500 rounded-lg p-6 animate-pulse"
            >
              <div className="h-8 bg-neutral-200 rounded mb-4" />
              <div className="h-6 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-5">
            <p className="text-2xl font-semibold text-primary-500">
              {stats?.pendingApprovals || 0}
            </p>
            <p className="text-xl font-normal text-secondary-500">
              Pending Approvals
            </p>
          </div>

          <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-5">
            <p className="text-2xl font-semibold text-primary-500">
              {stats?.activeProfessionals || 0}
            </p>
            <p className="text-xl font-normal text-secondary-500">Active</p>
          </div>

          <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-5">
            <p className="text-2xl font-semibold text-primary-500">
              {stats?.premiumMembers || 0}
            </p>
            <p className="text-xl font-normal text-secondary-500">
              Premium members
            </p>
          </div>

          <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-5">
            <p className="text-2xl font-semibold text-primary-500">
              {stats?.totalProfessionals?.toLocaleString() || 0}
            </p>
            <p className="text-xl font-normal text-secondary-500">
              Total Professionals
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-12 pl-4 pr-12 border border-neutral-500 rounded-md text-base"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          </div>

          <select className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white">
            <option>All Skills</option>
          </select>

          <select className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white">
            <option>All Ratings</option>
          </select>

          <select className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white">
            <option>Subscriptions</option>
          </select>

          <select className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white">
            <option>All Status</option>
          </select>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="h-12 px-6 border border-neutral-500">
            <span className="text-base font-normal text-secondary-500">
              Export CSV
            </span>
          </Button>
          <Button
            className="h-12 px-6 bg-primary-500 text-white"
            onClick={() => router.push("/dashboard/professionals/pending")}
          >
            <span className="text-base font-medium">
              Pending {stats?.pendingApprovals || 0} approvals
            </span>
          </Button>
        </div>
      </div>

      {isLoadingProfessionals ? (
        <div className="bg-white border border-border-500 rounded-lg p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-500">Loading professionals...</p>
            </div>
          </div>
        </div>
      ) : professionals.length === 0 ? (
        <div className="bg-white border border-border-500 rounded-lg p-6">
          <div className="flex items-center justify-center py-12">
            <p className="text-neutral-500 text-lg">No professionals found</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-border-500 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Professional
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Skills
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Ratings
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Subscription
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Joined
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-500">
              {professionals.map((professional) => (
                <ProfessionalRow
                  key={professional.id}
                  professional={professional}
                  router={router}
                  getStatusColor={getStatusColor}
                  getSubscriptionColor={getSubscriptionColor}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalProfessionals > 0 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 text-sm text-neutral-500 disabled:opacity-50"
          >
            ← Previous Page
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-sm ${
                    currentPage === pageNum
                      ? "bg-primary-500 text-white"
                      : "bg-white border border-border-500 text-secondary-500"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-2 text-sm text-neutral-500 disabled:opacity-50"
          >
            Next Page →
          </button>

          <p className="text-sm text-neutral-500">
            Showing {professionals.length} of {totalProfessionals} professionals
          </p>
        </div>
      )}
    </div>
  );
}

function ProfessionalRow({
  professional,
  router,
  getStatusColor,
  getSubscriptionColor,
}: {
  professional: Professional;
  router: ReturnType<typeof useRouter>;
  getStatusColor: (status: string) => string;
  getSubscriptionColor: (subscription: string) => string;
}) {

  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-secondary-500">
              {professional.initials}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-secondary-500">
              {professional.name}
            </p>
            <p className="text-xs text-neutral-500">{professional.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          {professional.skills.slice(0, 3).map((skill, index) => (
            <p key={index} className="text-sm text-secondary-500">
              {skill}
            </p>
          ))}
          {professional.skills.length > 3 && (
            <p className="text-xs text-neutral-500">
              +{professional.skills.length - 3} more
            </p>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <span className="text-warning-500">★</span>
          <span className="text-sm text-secondary-500">
            {professional.rating.toFixed(1)}
          </span>
          <span className="text-xs text-neutral-500">
            ({professional.reviewCount})
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`text-sm font-medium ${getSubscriptionColor(
            professional.subscription
          )}`}
        >
          {professional.subscription}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`text-sm ${getStatusColor(professional.status)}`}>
          {professional.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-secondary-500">
          {formatDate(professional.joinedDate)}
        </span>
      </td>
      <td className="px-6 py-4">
        <Button
          className="h-10 px-6 bg-primary-500 text-white"
          onClick={() => router.push(`/dashboard/professionals/${professional.id}`)}
        >
          <span className="text-sm font-medium">View Profile</span>
        </Button>
      </td>
    </tr>
  );
}
