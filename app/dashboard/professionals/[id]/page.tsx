"use client";

import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Tabs } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { StatCard } from "@/components/ui/stat-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import {useProfessionalProfile, useProfessionalReviews} from "@/hooks/use-professionals";
import { formatDate } from "@/lib/utils/format-date";
import { useState } from "react";

type TabType = "overview" | "quiz-history" | "activity" | "reviews";

export default function ProfessionalProfilePage() {
  const router = useRouter();
    const params = useParams();
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = rawId ? Number(rawId) : 0;
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    const { data: profile, isLoading, error } = useProfessionalProfile(id, id > 0);
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

  return (
      <div className="flex flex-col gap-8 px-8 py-8">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-semibold text-secondary-500">
            Professional Profile
          </h1>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            <Avatar initials={initials} size="xl" />
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-secondary-500">{profile.name}</h2>
              <p className="text-base text-secondary-500">{profile.role}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-warning-500">&#9733;</span>
                <span className="text-secondary-500">{profile.rating?.toFixed(1)}/5</span>
                <span className="text-neutral-500">Based on {profile.reviewCount} reviews</span>
                <span className="text-neutral-500">• {profile.subscription}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
              { !profile.mentorEligibility.isMentor ?
              <Button
                  className="bg-primary-500 text-white px-6 py-3"
                  onClick={() => router.push(`/dashboard/professionals/${id}/assign-mentor`)}
              >
                  <span className="text-base font-medium">Assign as mentor</span>
              </Button>
                  :
                  null
              }


            <Button className="bg-error-500 text-white px-6 py-3">
              <span className="text-base font-medium">Deactivate</span>
            </Button>
          </div>
        </div>

        <Tabs
            tabs={[
              { value: "overview" as const, label: "Overview" },
              { value: "quiz-history" as const, label: "Quiz History" },
              { value: "activity" as const, label: "Activity" },
              { value: "reviews" as const, label: "Reviews" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        />

        {activeTab === "overview" && <OverviewTab profile={profile} router={router} id={id} />}
        {activeTab === "quiz-history" && <QuizHistoryTab profile={profile} />}
        {activeTab === "activity" && <ActivityTab profile={profile} />}
          {activeTab === "reviews" && <ReviewsTab id={id} />}
      </div>
  );
}

function OverviewTab({
                       profile,
                       router,
                       id,
                     }: {
  profile: any;
  router: ReturnType<typeof useRouter>;
  id: number;
}) {
  return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-6 gap-6 text-sm">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 uppercase">EMAIL</p>
            <p className="text-sm text-secondary-500">{profile.email}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 uppercase">LOCATION</p>
            <p className="text-sm text-secondary-500">{profile.location || "—"}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 uppercase">JOIN DATE</p>
            <p className="text-sm text-secondary-500">{formatDate(profile.joinedDate)}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 uppercase">LAST ACTIVE</p>
            <p className="text-sm text-secondary-500">
              {profile.lastActive ? formatDate(profile.lastActive) : "—"}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 uppercase">SUBSCRIPTION</p>
            <p className="text-sm text-secondary-500">{profile.subscription}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 uppercase">EXPERIENCE LEVEL</p>
            <p className="text-sm text-secondary-500">{profile.experienceLevel}</p>
          </div>
        </div>

        {profile.skills?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-secondary-500">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill: string) => (
                    <span key={skill} className="px-4 py-2 bg-primary-50 rounded-full text-sm text-secondary-500">
                {skill}
              </span>
                ))}
              </div>
            </div>
        )}

        {profile.bio && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-secondary-500">Bio</h3>
              <p className="text-sm text-secondary-500 leading-relaxed">{profile.bio}</p>
            </div>
        )}

        {profile.mentorEligibility && (
            <>
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-secondary-500">Mentorship Status</h3>
                <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-success-50 text-sm text-secondary-500 rounded-full">
                {profile.mentorEligibility.isMentor ? "Active Mentor" : "Not a mentor"}
              </span>
                  {profile.mentorEligibility.isEligible && (
                      <span className="text-sm text-neutral-500">Eligible based on rating and experience</span>
                  )}
                </div>
              </div>

              {profile.mentorEligibility.criteria?.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-secondary-500">Qualification Criteria</h3>
                    <div className="flex flex-col gap-2">
                      {profile.mentorEligibility.criteria.map((criterion: any, index: number) => (
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
                    {profile.mentorEligibility.isEligible && (
                        <Button
                            className="bg-primary-500 text-white px-6 py-3 self-start"
                            onClick={() => router.push(`/dashboard/professionals/${id}/assign-mentor`)}
                        >
                          <span className="text-base font-medium">Assign As Mentor</span>
                        </Button>
                    )}
                  </div>
              )}
            </>
        )}
      </div>
  );
}

function QuizHistoryTab({ profile }: { profile: any }) {
  const quizStats = profile.quizStats;

  return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-4 gap-6">
          <StatCard value={quizStats?.quizzesTaken ?? 0} label="Quiz Taken" />
          <StatCard value={`${quizStats?.averageScore ?? 0}%`} label="Average score" />
          <StatCard value={quizStats?.skillsCertified ?? 0} label="Skills certified" />
          <StatCard value={quizStats?.skillLevel ?? "—"} label="Skill level" />
        </div>

        <div className="flex flex-col gap-4">
          {quizStats?.quizHistory?.length > 0 ? (
              quizStats.quizHistory.map((quiz: any, index: number) => (
                  <div
                      key={index}
                      className="border border-border-500 rounded-lg p-6 flex items-center justify-between"
                  >
                    <div className="flex flex-col gap-2">
                      <h4 className="text-base font-semibold text-secondary-500">{quiz.quizName}</h4>
                      <div className="flex gap-3 text-sm text-neutral-500">
                        <span>{formatDate(quiz.dateTaken)}</span>
                        <span>•</span>
                        <span>{quiz.questionCount} questions</span>
                        <span>•</span>
                        <span>{quiz.timeLimit} seconds</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-medium text-primary-500">{quiz.percentage}</span>
                      <Button variant="outline" className="border border-neutral-500 px-6 py-2">
                        <span className="text-sm">View Details</span>
                      </Button>
                    </div>
                  </div>
              ))
          ) : (
              <p className="text-sm text-neutral-500">No quiz history available</p>
          )}
        </div>
      </div>
  );
}
function ActivityTab({ profile }: { profile: any }) {
    const activities = profile.recentActivities;

    if (!activities?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg text-neutral-500">No recent activity</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {activities.map((activity: any, index: number) => (
                <div key={index} className="border border-border-500 rounded-lg p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                        <span className="text-primary-500 text-lg">&#9733;</span>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <p className="text-sm font-medium text-secondary-500">{activity.type}</p>
                        <p className="text-sm text-neutral-500">{activity.description}</p>
                        <p className="text-xs text-neutral-400">{activity.timeAgo}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ReviewsTab({ id }: { id: number }) {
    const { data: reviews, isLoading } = useProfessionalReviews(id, true);

    if (isLoading) {
        return <LoadingSpinner message="Loading reviews..." className="py-12" />;
    }

    if (!reviews?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg text-neutral-500">No reviews yet</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {reviews.map((review: any, index: number) => (
                <div key={index} className="border border-border-500 rounded-lg p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="text-base font-semibold text-secondary-500">{review.companyName}</p>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < review.overallRating ? "text-warning-500" : "text-neutral-300"}>
                  &#9733;
                </span>
                            ))}
                            <span className="text-sm text-neutral-500 ml-1">{review.overallRating}/5</span>
                        </div>
                    </div>

                    <div className="flex gap-6 text-sm">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-neutral-500 uppercase">QUALITY OF WORK</p>
                            <p className="text-sm text-secondary-500">{review.qualityOfWork}/5</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-neutral-500 uppercase">COMMUNICATION</p>
                            <p className="text-sm text-secondary-500">{review.communication}/5</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-neutral-500 uppercase">WOULD RECOMMEND</p>
                            <p className={`text-sm font-medium ${review.wouldRecommend ? "text-success-500" : "text-error-500"}`}>
                                {review.wouldRecommend ? "Yes" : "No"}
                            </p>
                        </div>
                    </div>

                    {review.comment && (
                        <p className="text-sm text-neutral-500 leading-relaxed">{review.comment}</p>
                    )}

                    {review.skillsMentioned?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {review.skillsMentioned.map((skill: string) => (
                                <span key={skill} className="px-3 py-1 bg-primary-50 rounded-full text-xs text-secondary-500">
                  {skill}
                </span>
                            ))}
                        </div>
                    )}

                    <p className="text-xs text-neutral-400">{formatDate(review.createdAt)}</p>
                </div>
            ))}
        </div>
    );
}