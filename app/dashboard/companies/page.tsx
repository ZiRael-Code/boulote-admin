"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { Pagination } from "@/components/ui/pagination";
import {
  useCompaniesDashboard,
  useCompanies,
} from "@/hooks/use-companies";
import { formatRelativeTime } from "@/lib/utils/format-date";
import type { Company } from "@/lib/types/company";

export default function CompaniesPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: dashboardData, isLoading: isLoadingStats } =
    useCompaniesDashboard(true);
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useCompanies(true);

  const stats = dashboardData?.stats;
  const companies = companiesData?.content || [];
  const totalCompanies = companiesData?.totalElements || 0;
  const totalPages = companiesData?.totalPages || 1;

  return (
    <div className="flex flex-col gap-8 px-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-semibold tracking-[1px] text-secondary-500">
            Company management
          </h1>
          <p className="text-base font-normal text-secondary-500">
            Manage job requests, AI shortlisting, and professional assignments
          </p>
        </div>
        <Button
          className="bg-primary-500 text-white px-6 py-3 h-12"
          onClick={() => router.push("/dashboard/companies/new")}
        >
          <span className="text-base font-medium">Add New Company</span>
        </Button>
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
          <StatCard value={stats?.totalCompanies?.toLocaleString() || 0} label="Total Companies" />
          <StatCard value={stats?.activeCompanies || 0} label="Active Companies" />
          <StatCard value={stats?.pendingApprovals || 0} label="Pending Approvals" />
          <StatCard value={(stats?.premiumPlans || 0) + (stats?.enterprisePlans || 0)} label="Premium & Enterprise" />
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
            <option>All Industry</option>
          </select>

          <select className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white">
            <option>All Sizes</option>
          </select>

          <select className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white">
            <option>All plans</option>
          </select>

          <select className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white">
            <option>All Status</option>
          </select>

          <Button variant="outline" className="h-12 px-6 border border-neutral-500">
            <span className="text-base font-normal text-secondary-500">
              Export CSV
            </span>
          </Button>
          {stats && stats.pendingApprovals > 0 && (
            <Button
              className="h-12 px-6 bg-primary-500 text-white"
              onClick={() => router.push("/dashboard/companies/pending")}
            >
              <span className="text-base font-medium">
                Pending {stats.pendingApprovals} approvals
              </span>
            </Button>
          )}
        </div>

        {isLoadingCompanies ? (
          <div className="bg-white border border-border-500 rounded-lg p-6">
            <LoadingSpinner message="Loading companies..." />
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white border border-border-500 rounded-lg p-6">
            <EmptyState message="No companies found" />
          </div>
        ) : (
          <div className="bg-white border border-border-500 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                    Company
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                    Industry
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                    Size
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                    Plan
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                    Last active
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-500">
                {companies.map((company) => (
                  <CompanyRow
                    key={company.id}
                    company={company}
                    router={router}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalCompanies > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCompanies}
            shownItems={companies.length}
            itemLabel="companies"
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

function CompanyRow({
  company,
  router,
}: {
  company: Company;
  router: ReturnType<typeof useRouter>;
}) {
  const isPending = company.status === "IN_REVIEW" || company.status === "Pending";

  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar initials={company.initials} />
          <div className="flex flex-col">
            <p className="text-sm font-medium text-secondary-500">
              {company.name}
            </p>
            <p className="text-xs text-neutral-500">{company.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-secondary-500">{company.industry}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-secondary-500">{company.size}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-secondary-500">{company.plan}</span>
      </td>
      <td className="px-6 py-4"><StatusBadge status={company.status} /></td>
      <td className="px-6 py-4">
        <span className="text-sm text-secondary-500">
          {formatRelativeTime(company.lastActive)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <Button
            className="h-10 px-6 bg-primary-500 text-white"
            onClick={() => router.push(`/dashboard/companies/${company.id}`)}
          >
            <span className="text-sm font-medium">View</span>
          </Button>
          {isPending ? (
            <>
              <Button
                className="h-10 px-6 bg-success-500 text-white"
                onClick={() =>
                  router.push(`/dashboard/companies/review/${company.id}`)
                }
              >
                <span className="text-sm font-medium">Approve</span>
              </Button>
              <Button
                variant="outline"
                className="h-10 px-6 border border-error-500 text-error-500"
              >
                <span className="text-sm font-medium">Reject</span>
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="h-10 px-6 border border-neutral-500"
            >
              <span className="text-sm font-medium">Edit</span>
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

