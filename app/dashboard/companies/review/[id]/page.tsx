"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, FileText } from "lucide-react";
import Button from "@/components/ui/button";
import {
  useCompanyProfile,
  useApproveCompany,
  useRejectCompany,
} from "@/hooks/use-companies";
import { formatDate } from "@/lib/utils/format-date";
import type { CompanyProfile, CompanyDocument, TeamMember, RecentActivity } from "@/lib/types/company";

type TabType = "company-info" | "documents" | "team-details" | "history";

export default function ReviewCompanyApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = Number(params.id);
  const [activeTab, setActiveTab] = useState<TabType>("company-info");
  const [adminNotes, setAdminNotes] = useState("");

  const { data: profile, isLoading } = useCompanyProfile(companyId, true);
  const approveMutation = useApproveCompany();
  const rejectMutation = useRejectCompany();

  const handleApprove = () => {
    approveMutation.mutate(companyId);
  };

  const handleReject = () => {
    if (confirm("Are you sure you want to reject this company?")) {
      rejectMutation.mutate({ companyId });
    }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 px-8 py-8">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-500">Loading application...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col gap-8 px-8 py-8">
        <div className="flex items-center justify-center py-32">
          <p className="text-neutral-500 text-lg">Application not found</p>
        </div>
      </div>
    );
  }

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
          Review company Application
        </h1>
      </div>

      <div className="border-b border-border-500 flex gap-8">
        <button
          onClick={() => setActiveTab("company-info")}
          className={`px-6 py-4 border-b-2 transition-colors ${
            activeTab === "company-info"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          <span className="text-base font-normal">Company Info</span>
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

      {activeTab === "company-info" && (
        <CompanyInfoTab
          profile={profile}
          adminNotes={adminNotes}
          onAdminNotesChange={setAdminNotes}
        />
      )}

      {activeTab === "documents" && <DocumentsTab profile={profile} />}

      {activeTab === "team-details" && <TeamDetailsTab profile={profile} />}

      {activeTab === "history" && <HistoryTab profile={profile} />}

        <div className="flex gap-4 pt-4 border-t border-border-500">
          <Button
            className="bg-error-500 text-white px-6 py-3"
            onClick={handleReject}
            loading={rejectMutation.isPending}
            disabled={rejectMutation.isPending || approveMutation.isPending}
          >
            <span className="text-base font-medium">Reject Company</span>
          </Button>
          <Button
            className="bg-success-500 text-white px-6 py-3"
            onClick={handleApprove}
            loading={approveMutation.isPending}
            disabled={approveMutation.isPending || rejectMutation.isPending}
          >
            <span className="text-base font-medium">Approve Company</span>
          </Button>
        </div>
    </div>
  );
}

function CompanyInfoTab({
  profile,
  adminNotes,
  onAdminNotesChange,
}: {
  profile: CompanyProfile;
  adminNotes: string;
  onAdminNotesChange: (notes: string) => void;
}) {
  const initials = profile.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
            <span className="text-lg font-medium text-secondary-500">
              {initials}
            </span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-secondary-500">
              {profile.name}
            </h2>
            <p className="text-base text-neutral-500">{profile.industry}</p>
            <p className="text-sm text-neutral-500">
              {profile.email}
              {profile.phone && ` | ${profile.phone}`}
            </p>
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                {profile.website}
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-500">Location</p>
            <p className="text-base font-medium text-secondary-500">
              {profile.location}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Employee Count</p>
            <p className="text-base font-medium text-secondary-500">
              {profile.employeeCount}
            </p>
          </div>
          {profile.foundedYear && (
            <div>
              <p className="text-sm text-neutral-500">Founded</p>
              <p className="text-base font-medium text-secondary-500">
                {profile.foundedYear}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-secondary-500">
            Company Description
          </h3>
          <p className="text-base text-neutral-600 leading-relaxed">
            {profile.description || "No description provided."}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-secondary-500">
            Admin notes
          </h3>
          <textarea
            value={adminNotes}
            onChange={(e) => onAdminNotesChange(e.target.value)}
            placeholder="Add any additional note"
            className="w-full h-32 px-4 py-3 border border-neutral-500 rounded-md text-base resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function DocumentsTab({ profile }: { profile: CompanyProfile }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-500 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-secondary-500 mb-4">
          Company Documents
        </h2>
        <div className="flex flex-col gap-4">
          {profile.documents && profile.documents.length > 0 ? (
            profile.documents.map((doc: CompanyDocument, index: number) => (
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
                      {doc.type} • {doc.fileSize} •{" "}
                      {formatDate(doc.uploadDate)}
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

function TeamDetailsTab({ profile }: { profile: CompanyProfile }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border-500 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-secondary-500 mb-4">
          Team Members
        </h2>
        <div className="flex flex-col gap-4">
          {profile.teamMembers && profile.teamMembers.length > 0 ? (
            profile.teamMembers.map((member: TeamMember, index: number) => {
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

function HistoryTab({ profile }: { profile: CompanyProfile }) {
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
              history.recentActivities.map((activity: RecentActivity, index: number) => (
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
      </div>
    </div>
  );
}

