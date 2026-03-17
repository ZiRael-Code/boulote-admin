"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { useProfessionalProfile } from "@/hooks/use-professionals";
import { useAssignAsMentor } from "@/hooks/use-professionals";

export default function AssignMentorRolePage() {
  const router = useRouter();
  const params = useParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId ? Number(rawId) : 0;

  const { data: profile, isLoading, error } = useProfessionalProfile(id, id > 0);
  const assignMutation = useAssignAsMentor();

  const [mentorCategory, setMentorCategory] = useState("");
  const [maxMentees, setMaxMentees] = useState("50");
  const [dismissedBanner, setDismissedBanner] = useState(false);

  if (!isLoading && profile?.mentorEligibility?.isMentor) {
    router.replace(`/dashboard/professionals/${id}`);
    return null;
  }
  const handleAssign = () => {
    assignMutation.mutate(
        {
          id,
          data: {
            category: mentorCategory || profile?.mentorEligibility?.category,
            specializedAreas: profile?.mentorEligibility?.specializedAreas,
            maxMentees: Number(maxMentees),
          },
        },
        {
          onSuccess: () => router.replace(`/dashboard/professionals/${id}`),
        }
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading profile..." className="py-32" />;
  }

  if (error || !profile) {
    return <ErrorState title="Failed to load profile" className="py-32" />;
  }

  const initials = profile.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const allCriteriaMet = profile.mentorEligibility?.criteria?.every((c) => c.met);

  return (
      <div className="flex flex-col gap-8 px-8 py-8 max-w-4xl">
        <div className="flex items-center gap-4">
          <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-secondary-500">Assign Mentor Role</h1>
        </div>

        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-[#C7D7E8] flex items-center justify-center shrink-0">
            <span className="text-2xl font-medium text-secondary-500">{initials}</span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-secondary-500">{profile.name}</h2>
            <p className="text-base text-secondary-500">{profile.role}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-warning-500">&#9733;</span>
              <span className="text-secondary-500">{profile.rating?.toFixed(1)}/5</span>
              <span className="text-neutral-500">• Based on {profile.reviewCount} reviews</span>
              <span className="text-neutral-500">• {profile.subscription}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-secondary-500">Mentor Qualification Check</h3>
          <div className="flex flex-col gap-2">
            {profile.mentorEligibility?.criteria?.map((criterion, index) => (
                <div key={index} className="flex items-center gap-2">
              <span className={criterion.met ? "text-success-500" : "text-error-500"}>
                {criterion.met ? "✓" : "✗"}
              </span>
                  <span className="text-sm text-secondary-500">
                {criterion.requirement} ({criterion.currentValue})
              </span>
                </div>
            ))}
          </div>

          {!dismissedBanner && (
              <div className={`border rounded-lg p-4 flex items-center justify-between ${
                  allCriteriaMet
                      ? "bg-warning-50 border-warning-200"
                      : "bg-primary-50 border-primary-200"
              }`}>
                <div className="flex flex-col gap-1">
                  <p className={`text-sm font-semibold ${allCriteriaMet ? "text-warning-800" : "text-primary-800"}`}>
                    {allCriteriaMet ? "All Criteria Met!" : "Admin Override"}
                  </p>
                  <p className={`text-sm ${allCriteriaMet ? "text-warning-700" : "text-primary-700"}`}>
                    {allCriteriaMet
                        ? "This professional is eligible for mentor role."
                        : "As admin, you can assign this professional as a mentor regardless of criteria."}
                  </p>
                </div>
                <button
                    onClick={() => setDismissedBanner(true)}
                    className="w-6 h-6 flex items-center justify-center hover:opacity-70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
          )}
        </div>

        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg font-semibold text-secondary-500">Mentor Assignment Details</h3>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-secondary-500">Mentor Category</label>
            <select
                value={mentorCategory || profile.mentorEligibility?.category || ""}
                onChange={(e) => setMentorCategory(e.target.value)}
                className="w-full h-12 px-4 border border-neutral-500 rounded-md text-sm bg-white"
            >
              <option value="">Select Mentor category</option>
              <option value="technical">Technical Mentor</option>
              <option value="career">Career Mentor</option>
              <option value="business">Business Mentor</option>
              {profile.mentorEligibility?.category && (
                  <option value={profile.mentorEligibility.category}>
                    {profile.mentorEligibility.category}
                  </option>
              )}
            </select>
          </div>

          {profile.mentorEligibility?.specializedAreas?.length > 0 && (
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-secondary-500">Specialised Areas</label>
                <div className="flex flex-wrap gap-3">
                  {profile.mentorEligibility.specializedAreas.map((area) => (
                      <span
                          key={area}
                          className="px-4 py-2 bg-primary-50 rounded-full text-sm text-secondary-500"
                      >
                  {area}
                </span>
                  ))}
                </div>
              </div>
          )}

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-secondary-500">Maximum Mentees</label>
            <select
                value={maxMentees}
                onChange={(e) => setMaxMentees(e.target.value)}
                className="w-full h-12 px-4 border border-neutral-500 rounded-md text-sm bg-white"
            >
              <option value="50">50</option>
              <option value="25">25</option>
              <option value="10">10</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
              className="bg-primary-500 text-white px-8 py-3"
              onClick={handleAssign}
              loading={assignMutation.isPending}
              disabled={assignMutation.isPending}
          >
            <span className="text-base font-medium">Assign as mentor</span>
          </Button>
          <Button
              variant="outline"
              className="border border-neutral-500 px-8 py-3"
              onClick={() => router.back()}
          >
            <span className="text-base font-medium">Cancel</span>
          </Button>
        </div>
      </div>
  );
}