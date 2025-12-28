"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import Button from "@/components/ui/button";
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <span className="px-2 py-1 bg-success-50 text-success-700 rounded text-xs font-medium">
            Active
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium">
            IN REVIEW
          </span>
        );
      case "Pending":
        return (
          <span className="px-2 py-1 bg-warning-50 text-warning-700 rounded text-xs font-medium">
            Pending
          </span>
        );
      case "Inactive":
        return (
          <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs font-medium">
            Inactive
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs font-medium">
            {status}
          </span>
        );
    }
  };

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
          <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-5">
            <p className="text-2xl font-semibold text-primary-500">
              {stats?.totalCompanies?.toLocaleString() || 0}
            </p>
            <p className="text-xl font-normal text-secondary-500">
              Total Companies
            </p>
          </div>

          <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-5">
            <p className="text-2xl font-semibold text-primary-500">
              {stats?.activeCompanies || 0}
            </p>
            <p className="text-xl font-normal text-secondary-500">
              Active Companies
            </p>
          </div>

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
              {(stats?.premiumPlans || 0) + (stats?.enterprisePlans || 0)}
            </p>
            <p className="text-xl font-normal text-secondary-500">
              Premium & Enterprise
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
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-neutral-500">Loading companies...</p>
              </div>
            </div>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white border border-border-500 rounded-lg p-6">
            <div className="flex items-center justify-center py-12">
              <p className="text-neutral-500 text-lg">No companies found</p>
            </div>
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
                    getStatusBadge={getStatusBadge}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalCompanies > 0 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 text-sm text-neutral-500 disabled:opacity-50"
            >
              ← Previous Page
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }).map(
                (_, index) => {
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
                }
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage >= totalPages}
              className="flex items-center gap-2 text-sm text-neutral-500 disabled:opacity-50"
            >
              Next Page →
            </button>

            <p className="text-sm text-neutral-500">
              Showing {companies.length} of {totalCompanies} companies
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CompanyRow({
  company,
  router,
  getStatusBadge,
}: {
  company: Company;
  router: ReturnType<typeof useRouter>;
  getStatusBadge: (status: string) => JSX.Element;
}) {
  const isPending = company.status === "IN_REVIEW" || company.status === "Pending";

  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-secondary-500">
              {company.initials}
            </span>
          </div>
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
      <td className="px-6 py-4">{getStatusBadge(company.status)}</td>
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

