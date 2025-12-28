"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, FileText, MapPin, Users, Calendar, Globe } from "lucide-react";
import Button from "@/components/ui/button";
import { useCompanyProfile } from "@/hooks/use-companies";
import { formatDate, formatRelativeTime } from "@/lib/utils/format-date";

type TabType = "overview" | "documents" | "team-details" | "history";

export default function CompanyProfilePage() {
  const router = useRouter();
  const params = useParams();
  const companyId = Number(params.id);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const { data: profile, isLoading } = useCompanyProfile(companyId, true);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 px-8 py-8">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-500">Loading company profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col gap-8 px-8 py-8">
        <div className="flex items-center justify-center py-32">
          <p className="text-neutral-500 text-lg">Company not found</p>
        </div>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getStatusBadge = () => {
    switch (profile.status) {
      case "Active":
        return (
          <span className="px-3 py-1 bg-success-50 text-success-700 rounded text-sm font-medium">
            Active
          </span>
        );
      case "Inactive":
        return (
          <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded text-sm font-medium">
            Inactive
          </span>
        );
      case "Pending":
        return (
          <span className="px-3 py-1 bg-warning-50 text-warning-700 rounded text-sm font-medium">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded text-sm font-medium">
            {profile.status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-8 px-8 py-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold text-secondary-500">
          Company Profile
        </h1>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex gap-6">
          <div className="w-[100px] h-[100px] rounded-full bg-primary-50 flex items-center justify-center shrink-0">
            <span className="text-2xl font-medium text-secondary-500">
              {initials}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-secondary-500">
              {profile.name}
            </h2>
            <p className="text-base text-secondary-500">{profile.industry}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-neutral-500">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-500">
                <Users className="w-4 h-4" />
                <span>{profile.employeeCount} employees</span>
              </div>
              {profile.foundedYear && (
                <div className="flex items-center gap-1 text-neutral-500">
                  <Calendar className="w-4 h-4" />
                  <span>Founded {profile.foundedYear}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              {getStatusBadge()}
              <span className="text-sm text-neutral-500">
                {profile.plan} Plan
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border border-neutral-500 px-6 py-3"
            onClick={() => router.push(`/dashboard/companies/review/${companyId}`)}
          >
            <span className="text-base font-medium">Review Application</span>
          </Button>
          <Button className="bg-primary-500 text-white px-6 py-3">
            <span className="text-base font-medium">Edit Company</span>
          </Button>
        </div>
      </div>

      <div className="border-b border-border-500 flex gap-8">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-4 border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          <span className="text-base font-normal">Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`px-6 py-4 border-b-2 transition-colors ${
            activeTab === "documents"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          <span className="text-base font-normal">Documents</span>
        </button>
        <button
          onClick={() => setActiveTab("team-details")}
          className={`px-6 py-4 border-b-2 transition-colors ${
            activeTab === "team-details"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          <span className="text-base font-normal">Team Details</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-4 border-b-2 transition-colors ${
            activeTab === "history"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          <span className="text-base font-normal">History</span>
        </button>
      </div>

      {activeTab === "overview" && <OverviewTab profile={profile} />}
      {activeTab === "documents" && <DocumentsTab profile={profile} />}
      {activeTab === "team-details" && <TeamDetailsTab profile={profile} />}
      {activeTab === "history" && <HistoryTab profile={profile} />}
    </div>
  );
}

function OverviewTab({ profile }: { profile: any }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-semibold text-secondary-500 mb-4">
            Company Information
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Email</p>
              <p className="text-base font-medium text-secondary-500">
                {profile.email}
              </p>
            </div>
            {profile.phone && (
              <div>
                <p className="text-sm text-neutral-500 mb-1">Phone</p>
                <p className="text-base font-medium text-secondary-500">
                  {profile.phone}
                </p>
              </div>
            )}
            {profile.website && (
              <div>
                <p className="text-sm text-neutral-500 mb-1">Website</p>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium text-primary-500 hover:text-primary-600 flex items-center gap-1"
                >
                  <Globe className="w-4 h-4" />
                  {profile.website}
                </a>
              </div>
            )}
            <div>
              <p className="text-sm text-neutral-500 mb-1">Location</p>
              <p className="text-base font-medium text-secondary-500">
                {profile.location}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Industry</p>
              <p className="text-base font-medium text-secondary-500">
                {profile.industry}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Company Size</p>
              <p className="text-base font-medium text-secondary-500">
                {profile.size}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Plan</p>
              <p className="text-base font-medium text-secondary-500">
                {profile.plan}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Joined Date</p>
              <p className="text-base font-medium text-secondary-500">
                {formatDate(profile.joinedDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Last Active</p>
              <p className="text-base font-medium text-secondary-500">
                {formatRelativeTime(profile.lastActive)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-secondary-500">
            Company Description
          </h3>
          <p className="text-base text-neutral-600 leading-relaxed">
            {profile.description || "No description provided."}
          </p>
        </div>

        {profile.history && (
          <div>
            <h3 className="text-lg font-semibold text-secondary-500 mb-4">
              Company Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm text-neutral-500 mb-1">Projects Posted</p>
                <p className="text-2xl font-semibold text-secondary-500">
                  {profile.history.projectsPosted || 0}
                </p>
              </div>
              <div className="bg-primary-50 rounded-lg p-4">
                <p className="text-sm text-neutral-500 mb-1">Active Projects</p>
                <p className="text-2xl font-semibold text-primary-500">
                  {profile.history.activeProjects || 0}
                </p>
              </div>
              <div className="bg-success-50 rounded-lg p-4">
                <p className="text-sm text-neutral-500 mb-1">Completed</p>
                <p className="text-2xl font-semibold text-success-500">
                  {profile.history.completedProjects || 0}
                </p>
              </div>
              <div className="bg-warning-50 rounded-lg p-4">
                <p className="text-sm text-neutral-500 mb-1">Avg Rating</p>
                <p className="text-2xl font-semibold text-warning-500">
                  {profile.history.averageRating
                    ? profile.history.averageRating.toFixed(1)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentsTab({ profile }: { profile: any }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-500 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-secondary-500 mb-4">
          Company Documents
        </h2>
        <div className="flex flex-col gap-4">
          {profile.documents && profile.documents.length > 0 ? (
            profile.documents.map((doc: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border-500 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-secondary-500">
                      {doc.fileName}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {doc.type} • {doc.fileSize} • {formatDate(doc.uploadDate)}
                    </span>
                    <span
                      className={`text-xs mt-1 ${
                        doc.status === "Verified"
                          ? "text-success-600"
                          : "text-warning-600"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 text-center py-8">
              No documents available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TeamDetailsTab({ profile }: { profile: any }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-500 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-secondary-500 mb-4">
          Team Members
        </h2>
        <div className="flex flex-col gap-4">
          {profile.teamMembers && profile.teamMembers.length > 0 ? (
            profile.teamMembers.map((member: any, index: number) => {
              const initials = member.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-border-500 rounded-lg"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-secondary-500">
                      {initials}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-secondary-500">
                      {member.name}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {member.role} • {member.department}
                    </p>
                    <p className="text-xs text-neutral-500">{member.email}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-neutral-500 text-center py-8">
              No team members listed
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryTab({ profile }: { profile: any }) {
  const history = profile.history || {};

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold text-secondary-500 mb-4">
            Company Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-neutral-500">Projects Posted</p>
              <p className="text-2xl font-semibold text-secondary-500">
                {history.projectsPosted || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Active Projects</p>
              <p className="text-2xl font-semibold text-primary-500">
                {history.activeProjects || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Completed</p>
              <p className="text-2xl font-semibold text-success-500">
                {history.completedProjects || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Average Rating</p>
              <p className="text-2xl font-semibold text-secondary-500">
                {history.averageRating
                  ? history.averageRating.toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-secondary-500 mb-4">
            Recent Activities
          </h2>
          <div className="flex flex-col gap-4">
            {history.recentActivities && history.recentActivities.length > 0 ? (
              history.recentActivities.map((activity: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-4 border border-border-500 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-secondary-500">
                      {activity.type}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {activity.timeAgo}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {activity.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 text-center py-8">
                No recent activities
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-secondary-500 mb-4">
            Important Dates
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
              <span className="text-sm text-neutral-500">Registered Date</span>
              <span className="text-sm font-medium text-secondary-500">
                {formatDate(history.registeredDate)}
              </span>
            </div>
            {history.approvedDate && (
              <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm text-neutral-500">Approved Date</span>
                <span className="text-sm font-medium text-secondary-500">
                  {formatDate(history.approvedDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

