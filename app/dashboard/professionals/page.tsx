"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { StatCard } from "@/components/ui/stat-card";
import { Pagination } from "@/components/ui/pagination";
import {
  useProfessionalsDashboard,
  useProfessionals,
} from "@/hooks/use-professionals";
import { formatDate } from "@/lib/utils/format-date";
import { getStatusTextColor } from "@/lib/utils/status-colors";
import type { Professional } from "@/lib/types/professional";

export default function ProfessionalsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { data: dashboardData, isLoading: isLoadingStats } =
      useProfessionalsDashboard(true);
  const { data: professionalsData, isLoading: isLoadingProfessionals } =
      useProfessionals(true);

  const stats = dashboardData?.stats;
  const allProfessionals = professionalsData?.content || [];
  const totalPages = professionalsData?.totalPages || 1;


  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    allProfessionals.forEach((p) => p.skills?.forEach((s) => skills.add(s)));
    return Array.from(skills).sort();
  }, [allProfessionals]);


  const filtered = useMemo(() => {
    return allProfessionals.filter((p) => {
      const matchesSearch =
          !searchInput ||
          p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          p.email.toLowerCase().includes(searchInput.toLowerCase());

      const matchesSkill =
          !selectedSkill || p.skills?.includes(selectedSkill);

      const matchesRating =
          !selectedRating ||
          (selectedRating === "4.5+" && p.rating >= 4.5) ||
          (selectedRating === "4.0-4.4" && p.rating >= 4.0 && p.rating < 4.5) ||
          (selectedRating === "3.5-3.9" && p.rating >= 3.5 && p.rating < 4.0) ||
          (selectedRating === "below-3.5" && p.rating < 3.5);

      const matchesStatus =
          !selectedStatus ||
          p.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesSkill && matchesRating && matchesStatus;
    });
  }, [allProfessionals, searchInput, selectedSkill, selectedRating, selectedStatus]);

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case "PREMIUM": return "text-success-600";
      case "BASIC": return "text-neutral-500";
      default: return "text-secondary-500";
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <StatCard value={isLoadingStats ? "..." : stats?.pendingApprovals || 0} label="Pending Approvals" />
          <StatCard value={isLoadingStats ? "..." : stats?.activeProfessionals || 0} label="Active" />
          <StatCard value={isLoadingStats ? "..." : stats?.premiumMembers || 0} label="Premium members" />
          <StatCard value={isLoadingStats ? "..." : stats?.totalProfessionals?.toLocaleString() || 0} label="Total Professionals" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <input
                  type="text"
                  placeholder="Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full h-12 pl-4 pr-12 border border-neutral-500 rounded-md text-base"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            </div>

            <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white"
            >
              <option value="">All Skills</option>
              {allSkills.map((skill) => (
                  <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>

            <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white"
            >
              <option value="">All Ratings</option>
              <option value="4.5+">4.5+</option>
              <option value="4.0-4.4">4.0 - 4.4</option>
              <option value="3.5-3.9">3.5 - 3.9</option>
              <option value="below-3.5">Below 3.5</option>
            </select>

            <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white"
            >
              <option value="">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECT">Deactivated</option>
            </select>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="h-12 px-6 border border-neutral-500">
              <span className="text-base font-normal text-secondary-500">Export CSV</span>
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
              <LoadingSpinner message="Loading professionals..." className="py-12" />
            </div>
        ) : filtered.length === 0 ? (
            <div className="bg-white border border-border-500 rounded-lg p-6">
              <EmptyState message="No professionals found" className="py-12" />
            </div>
        ) : (
            <div className="bg-white border border-border-500 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Professional</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Skills</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Ratings</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Subscription</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Joined</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-border-500">
                {filtered.map((professional) => (
                    <ProfessionalRow
                        key={professional.id}
                        professional={professional}
                        router={router}
                        getSubscriptionColor={getSubscriptionColor}
                    />
                ))}
                </tbody>
              </table>
            </div>
        )}

        {filtered.length > 0 && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                shownItems={filtered.length}
                itemLabel="professionals"
                onPageChange={setCurrentPage}
            />
        )}
      </div>
  );
}

function ProfessionalRow({
                           professional,
                           router,
                           getSubscriptionColor,
                         }: {
  professional: Professional;
  router: ReturnType<typeof useRouter>;
  getSubscriptionColor: (subscription: string) => string;
}) {
  return (
      <tr className="hover:bg-neutral-50">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar initials={professional.initials} />
            <div className="flex flex-col">
              <p className="text-sm font-medium text-secondary-500">{professional.name}</p>
              <p className="text-xs text-neutral-500">{professional.email}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-col gap-1">
            {professional.skills.slice(0, 3).map((skill, index) => (
                <p key={index} className="text-sm text-secondary-500">{skill}</p>
            ))}
            {professional.skills.length > 3 && (
                <p className="text-xs text-neutral-500">+{professional.skills.length - 3} more</p>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <Rating value={professional.rating} reviewCount={professional.reviewCount} maxStars={1} />
        </td>
        <td className="px-6 py-4">
        <span className={`text-sm font-medium ${getSubscriptionColor(professional.subscription)}`}>
          {professional.subscription}
        </span>
        </td>
        <td className="px-6 py-4">
        <span className={`text-sm ${getStatusTextColor(professional.status)}`}>
          {professional.status}
        </span>
        </td>
        <td className="px-6 py-4">
          <span className="text-sm text-secondary-500">{formatDate(professional.joinedDate)}</span>
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