"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Button from "@/components/ui/button";

type TabType = "overview" | "quiz-history" | "activity" | "reviews";

export default function ProfessionalProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

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
          Professional Profile
        </h1>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex gap-6">
          <div className="w-[100px] h-[100px] rounded-full bg-[#C7D7E8] flex items-center justify-center shrink-0">
            <span className="text-2xl font-medium text-secondary-500">JD</span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-secondary-500">John Doe</h2>
            <p className="text-base text-secondary-500">Senior Frontend Developer</p>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((star) => (
                  <span key={star} className="text-warning-500">★</span>
                ))}
                <span className="text-neutral-300">★</span>
              </div>
              <span className="text-secondary-500">4.2/5</span>
              <span className="text-neutral-500">Based on 12 reviews</span>
              <span className="text-neutral-500">• Premium Member</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            className="bg-primary-500 text-white px-6 py-3"
            onClick={() => router.push("/dashboard/professionals/123/assign-mentor")}
          >
            <span className="text-base font-medium">Assign as mentor</span>
          </Button>
          <Button className="bg-error-500 text-white px-6 py-3">
            <span className="text-base font-medium">Deactivate</span>
          </Button>
        </div>
      </div>

      <div className="border-b border-border-500 flex gap-8">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-3 border-b-2 text-base font-medium transition-colors ${
            activeTab === "overview"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("quiz-history")}
          className={`px-4 py-3 border-b-2 text-base font-medium transition-colors ${
            activeTab === "quiz-history"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          Quiz History
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-3 border-b-2 text-base font-medium transition-colors ${
            activeTab === "activity"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          Activity
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-3 border-b-2 text-base font-medium transition-colors ${
            activeTab === "reviews"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          Reviews
        </button>
      </div>

      {activeTab === "overview" && <OverviewTab router={router} />}
      {activeTab === "quiz-history" && <QuizHistoryTab />}
      {activeTab === "activity" && <ActivityTab />}
      {activeTab === "reviews" && <ReviewsTab />}
    </div>
  );
}

function OverviewTab({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-6 gap-6 text-sm">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">EMAIL</p>
          <p className="text-sm text-secondary-500">johndoe@gmail.com</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">LOCATION</p>
          <p className="text-sm text-secondary-500">San francisco</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">JOIN DATE</p>
          <p className="text-sm text-secondary-500">January 15, 2024</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">LAST ACTIVE</p>
          <p className="text-sm text-secondary-500">2 hour ago</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">SUBSCRIPTION</p>
          <p className="text-sm text-secondary-500">Premium (until Dec 2024)</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-500 uppercase">EXPERIENCE LEVEL</p>
          <p className="text-sm text-secondary-500">Senior (5+ years)</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-secondary-500">Skills & Expertise</h3>
        <div className="flex flex-wrap gap-3">
          {["React", "Typescript", "javascript", "Node.js", "HTML/CSS", "Git", "figma"].map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-primary-50 rounded-full text-sm text-secondary-500"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-secondary-500">Bio</h3>
        <p className="text-sm text-secondary-500 leading-relaxed">
          Experienced full-stack developer with 5+ years of expertise in modern web technologies. Passionate about creating scalable, user-friendly
          applications. Strong background in both frontend and backend development with a focus on clean, maintainable code.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-secondary-500">Mentorship Status</h3>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-success-50 text-sm text-secondary-500 rounded-full">
            Not a mentor
          </span>
          <span className="text-sm text-neutral-500">Eligible based on rating and experience</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-secondary-500">Qualification Criteria</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-success-500">✓</span>
            <span className="text-sm text-secondary-500">Rating above 4.5 (current:4.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-success-500">✓</span>
            <span className="text-sm text-secondary-500">Completed advanced skill prior (score:89%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-success-500">✓</span>
            <span className="text-sm text-secondary-500">6+ months on platform</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-success-500">✓</span>
            <span className="text-sm text-secondary-500">Premium subscription</span>
          </div>
        </div>
        <Button
          className="bg-primary-500 text-white px-6 py-3 self-start"
          onClick={() => router.push("/dashboard/professionals/123/assign-mentor")}
        >
          <span className="text-base font-medium">Assign As Mentor</span>
        </Button>
      </div>
    </div>
  );
}

function QuizHistoryTab() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col items-center gap-2">
          <p className="text-2xl font-semibold text-primary-500">12</p>
          <p className="text-sm text-secondary-500">Quiz Taken</p>
        </div>
        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col items-center gap-2">
          <p className="text-2xl font-semibold text-primary-500">89%</p>
          <p className="text-sm text-secondary-500">Average score</p>
        </div>
        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col items-center gap-2">
          <p className="text-2xl font-semibold text-primary-500">8</p>
          <p className="text-sm text-secondary-500">Skills certified</p>
        </div>
        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col items-center gap-2">
          <p className="text-2xl font-semibold text-primary-500">Advanced</p>
          <p className="text-sm text-secondary-500">Skill level</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border border-border-500 rounded-lg p-6 flex items-center justify-between"
          >
            <div className="flex flex-col gap-2">
              <h4 className="text-base font-semibold text-secondary-500">
                Advanced React Development
              </h4>
              <div className="flex gap-3 text-sm text-neutral-500">
                <span>March 10,2024</span>
                <span>•</span>
                <span>45 questions</span>
                <span>•</span>
                <span>60 minutes</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium text-primary-500">92%</span>
              <Button variant="outline" className="border border-neutral-500 px-6 py-2">
                <span className="text-sm">View Details</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm text-neutral-500">
          ← Previous Page
        </button>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-md bg-primary-500 text-white flex items-center justify-center text-sm">
            1
          </button>
          <button className="w-10 h-10 rounded-md border border-border-500 text-secondary-500 flex items-center justify-center text-sm">
            2
          </button>
          <button className="w-10 h-10 rounded-md border border-border-500 text-secondary-500 flex items-center justify-center text-sm">
            3
          </button>
        </div>
        <button className="flex items-center gap-2 text-sm text-neutral-500">
          Next Page →
        </button>
      </div>
    </div>
  );
}

function ActivityTab() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-lg text-neutral-500">Activity tab content</p>
    </div>
  );
}

function ReviewsTab() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-lg text-neutral-500">Reviews tab content</p>
    </div>
  );
}

