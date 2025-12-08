"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import Button from "@/components/ui/button";

export default function PendingApprovalsPage() {
  const router = useRouter();
  const hasPending = true;

  if (!hasPending) {
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
            Pending Professionals Approvals
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-3xl">👥</span>
          </div>
          <h2 className="text-2xl font-semibold text-secondary-500">All Caught Up!</h2>
          <p className="text-base text-neutral-500 text-center max-w-md">
            Great work! There are no pending professional applications to review right now. New applications will appear here when submitted.
          </p>
          <div className="flex gap-4">
            <Button className="bg-primary-500 text-white px-6 py-3">
              <span className="text-base font-medium">View All Professionals</span>
            </Button>
            <Button variant="outline" className="border border-neutral-500 px-6 py-3">
              <span className="text-base font-medium">Invite Professionals</span>
            </Button>
          </div>
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
          Pending Professionals Approvals
        </h1>
      </div>

      <div className="bg-warning-50 border border-[#FFB636] rounded-lg p-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-warning-800">23 professionals</p>
          <p className="text-sm text-warning-700">
            Complete this quick assessment to increase your visibility to companies by 3x.
          </p>
        </div>
        <button className="w-6 h-6 flex items-center justify-center text-warning-700 hover:text-warning-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white border border-border-500 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Professional</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Skills</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Experience</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Documents</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Applied</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-500">
            {Array.from({ length: 2 }).map((_, index) => (
              <tr key={index} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-secondary-500">JD</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-secondary-500">John Doe</p>
                      <p className="text-xs text-neutral-500">johnd@gmail.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-secondary-500">React</p>
                    <p className="text-sm text-secondary-500">Node.js</p>
                    <p className="text-sm text-secondary-500">Python</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-secondary-500">5+ years</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-sm">
                    <span>✓ Resume</span>
                    <span>✓ Portfolio</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-secondary-500">Mar 12,2024</span>
                </td>
                <td className="px-6 py-4">
                  <Button
                    className="h-10 px-6 bg-primary-500 text-white"
                    onClick={() => router.push("/dashboard/professionals/review/123")}
                  >
                    <span className="text-sm font-medium">Review</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <p className="text-sm text-neutral-500">Showing 1-20 of 1,247 professionals</p>
      </div>
    </div>
  );
}


