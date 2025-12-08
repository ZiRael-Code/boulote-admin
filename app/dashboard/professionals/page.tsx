"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Button from "@/components/ui/button";

export default function ProfessionalsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const totalProfessionals = 1247;
  const itemsPerPage = 20;

  return (
    <div className="flex flex-col gap-8 px-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-semibold tracking-[1px] text-secondary-500">
          Professional management
        </h1>
        <p className="text-base font-normal text-secondary-500">
          Manage job requests, AI shortlisting, and professional assignments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-5">
          <p className="text-2xl font-semibold text-primary-500">23</p>
          <p className="text-xl font-normal text-secondary-500">Pending Approvals</p>
        </div>

        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-5">
          <p className="text-2xl font-semibold text-primary-500">189</p>
          <p className="text-xl font-normal text-secondary-500">Mentors</p>
        </div>

        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-5">
          <p className="text-2xl font-semibold text-primary-500">456</p>
          <p className="text-xl font-normal text-secondary-500">Premium members</p>
        </div>

        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-5">
          <p className="text-2xl font-semibold text-primary-500">{totalProfessionals.toLocaleString()}</p>
          <p className="text-xl font-normal text-secondary-500">Total Professionals</p>
        </div>
      </div>

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
            <option>All Skills</option>
          </select>

          <select className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white">
            <option>All Ratings</option>
          </select>

          <select className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white">
            <option>Subscriptions</option>
          </select>

          <select className="h-12 px-4 border border-neutral-500 rounded-md text-base text-neutral-500 bg-white">
            <option>All Status</option>
          </select>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="h-12 px-6 border border-neutral-500">
            <span className="text-base font-normal text-secondary-500">Export CSV</span>
          </Button>
          <Button
            className="h-12 px-6 bg-primary-500 text-white"
            onClick={() => router.push("/dashboard/professionals/pending")}
          >
            <span className="text-base font-medium">Pending 23 approvals</span>
          </Button>
        </div>
      </div>

      <div className="bg-white border border-border-500 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Professional</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Skills</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Ratings</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Subscription</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Joined</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-500">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
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
                  <div className="flex items-center gap-1">
                    <span className="text-warning-500">★</span>
                    <span className="text-sm text-secondary-500">4.3</span>
                    <span className="text-xs text-neutral-500">(24)</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-success-600">Premium</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-secondary-500">{index === 2 ? "Pending" : "Active"}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-secondary-500">Mar 12, 2024</span>
                </td>
                <td className="px-6 py-4">
                  <Button
                    className="h-10 px-6 bg-primary-500 text-white"
                    onClick={() => router.push("/dashboard/professionals/123")}
                  >
                    <span className="text-sm font-medium">View Profile</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 text-sm text-neutral-500 disabled:opacity-50"
        >
          ← Previous Page
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-10 h-10 rounded-md flex items-center justify-center text-sm ${
              currentPage === 1
                ? "bg-primary-500 text-white"
                : "bg-white border border-border-500 text-secondary-500"
            }`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`w-10 h-10 rounded-md flex items-center justify-center text-sm ${
              currentPage === 2
                ? "bg-primary-500 text-white"
                : "bg-white border border-border-500 text-secondary-500"
            }`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`w-10 h-10 rounded-md flex items-center justify-center text-sm ${
              currentPage === 3
                ? "bg-primary-500 text-white"
                : "bg-white border border-border-500 text-secondary-500"
            }`}
          >
            3
          </button>
        </div>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="flex items-center gap-2 text-sm text-neutral-500"
        >
          Next Page →
        </button>

        <p className="text-sm text-neutral-500">
          Showing {(currentPage - 1) * itemsPerPage + 1}-{currentPage * itemsPerPage} of {totalProfessionals} professionals
        </p>
      </div>
    </div>
  );
}
