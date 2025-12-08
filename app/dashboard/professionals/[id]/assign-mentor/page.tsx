"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import Button from "@/components/ui/button";

export default function AssignMentorRolePage() {
  const router = useRouter();
  const [mentorCategory, setMentorCategory] = useState("");
  const [specializedAreas, setSpecializedAreas] = useState<string[]>([
    "Web Development",
    "Mobile Development",
    "DevOps",
    "Data Science",
  ]);
  const [maxMentees, setMaxMentees] = useState("50");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const toggleSpecializedArea = (area: string) => {
    if (specializedAreas.includes(area)) {
      setSpecializedAreas(specializedAreas.filter((a) => a !== area));
    } else {
      setSpecializedAreas([...specializedAreas, area]);
    }
  };

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
            <span className="text-neutral-500">• Based on 12 reviews</span>
            <span className="text-neutral-500">• Premium Member</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-secondary-500">Mentor Qualification check</h3>
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

        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-warning-800">All Criteria met !</p>
            <p className="text-sm text-warning-700">
              This professional is eligible for mentor role .
            </p>
          </div>
          <button className="w-6 h-6 flex items-center justify-center text-warning-700 hover:text-warning-900">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-6">
        <h3 className="text-lg font-semibold text-secondary-500">Mentor Assignment Details</h3>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-secondary-500">Mentor Category</label>
          <select
            value={mentorCategory}
            onChange={(e) => setMentorCategory(e.target.value)}
            className="w-full h-12 px-4 border border-neutral-500 rounded-md text-sm bg-white"
          >
            <option value="">Select Mentor category</option>
            <option value="technical">Technical Mentor</option>
            <option value="career">Career Mentor</option>
            <option value="business">Business Mentor</option>
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-secondary-500">Specialised Areas</label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={specializedAreas.includes("Web Development")}
                onChange={() => toggleSpecializedArea("Web Development")}
                className="w-4 h-4 text-primary-500"
              />
              <span className="text-sm text-secondary-500">Web Development</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={specializedAreas.includes("Mobile Development")}
                onChange={() => toggleSpecializedArea("Mobile Development")}
                className="w-4 h-4"
              />
              <span className="text-sm text-secondary-500">Mobile Development</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={specializedAreas.includes("DevOps")}
                onChange={() => toggleSpecializedArea("DevOps")}
                className="w-4 h-4"
              />
              <span className="text-sm text-secondary-500">DevOps</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={specializedAreas.includes("Data Science")}
                onChange={() => toggleSpecializedArea("Data Science")}
                className="w-4 h-4"
              />
              <span className="text-sm text-secondary-500">Data Science</span>
            </label>
          </div>
        </div>

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

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-secondary-500">Additional Notes</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any additional notes about this mentor asssignment..."
            className="w-full h-32 px-4 py-3 border border-neutral-500 rounded-md text-sm resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button className="bg-primary-500 text-white px-8 py-3">
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


