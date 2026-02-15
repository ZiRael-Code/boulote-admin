"use client";

import { X } from "lucide-react";
import Button from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import type { Job, ShortlistingResult, ShortlistedProfessional } from "@/lib/types/job";

type ShortlistingResultsModalProps = {
  job: Job;
  results: ShortlistingResult;
  onClose: () => void;
};

export function ShortlistingResultsModal({
  job,
  results,
  onClose,
}: ShortlistingResultsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border-500">
          <div>
            <h2 className="text-2xl font-semibold text-secondary-500">
              AI Shortlisting Results
            </h2>
            <p className="text-base text-neutral-500 mt-1">
              {job.title} • {job.companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-md"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-900">
                  Total Candidates Found
                </p>
                <p className="text-2xl font-semibold text-primary-500 mt-1">
                  {results.candidatesFound}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-primary-900">
                  Processed At
                </p>
                <p className="text-base text-primary-700 mt-1">
                  {new Date(results.processedTime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-secondary-500">
              Shortlisted Professionals
            </h3>
            <div className="flex flex-col gap-4">
              {results.professionals.map((shortlisted: ShortlistedProfessional, index: number) => {
                const professional = shortlisted.professional;
                const initials = `${professional.firstName?.[0] || ""}${professional.lastName?.[0] || ""}`.toUpperCase();
                const name = `${professional.firstName} ${professional.lastName}`;

                return (
                  <div
                    key={professional.id || index}
                    className="border border-border-500 rounded-lg p-4 flex flex-col gap-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar initials={initials} size="lg" />
                        <div>
                          <h4 className="text-base font-semibold text-secondary-500">
                            {name}
                          </h4>
                          <p className="text-sm text-neutral-500">
                            {professional.profession || "Professional"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-primary-50 px-3 py-1 rounded-md">
                        <p className="text-sm font-medium text-primary-700">
                          {shortlisted.matchScore}% Match
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-neutral-500">Match Level</p>
                        <p className="text-sm font-medium text-secondary-500">
                          {shortlisted.matchLevel}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Success Rate</p>
                        <p className="text-sm font-medium text-secondary-500">
                          {professional.successRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Reviews</p>
                        <p className="text-sm font-medium text-secondary-500">
                          {professional.totalRatings || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Rating</p>
                        <p className="text-sm font-medium text-secondary-500">
                          {professional.averageRating?.toFixed(1) || "N/A"}
                        </p>
                      </div>
                    </div>

                    {shortlisted.matchedSkills.length > 0 && (
                      <div>
                        <p className="text-xs text-neutral-500 mb-2">Matched Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {shortlisted.matchedSkills.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 self-end">
                      <Button
                        variant="outline"
                        className="border border-neutral-500 px-4 py-2"
                      >
                        View Profile
                      </Button>
                      <Button className="bg-primary-500 text-white px-4 py-2">
                        Assign to Project
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 p-6 border-t border-border-500">
          <Button
            variant="outline"
            className="border border-neutral-500 px-6 py-3"
            onClick={onClose}
          >
            Close
          </Button>
          <Button className="bg-primary-500 text-white px-6 py-3">
            Export Results
          </Button>
        </div>
      </div>
    </div>
  );
}
