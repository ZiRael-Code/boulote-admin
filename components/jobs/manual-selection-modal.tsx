"use client";

import { X, Search, ChevronDown } from "lucide-react";
import Button from "@/components/ui/button";

type ManualSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAssign: () => void;
};

export function ManualSelectionModal({
  isOpen,
  onClose,
  onAssign,
}: ManualSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border-500 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-secondary-500">
            Manual Professional Selection
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="border border-neutral-500 rounded-md h-12 px-6 py-4 flex items-center justify-between">
            <span className="text-lg font-light text-secondary-500">Search</span>
            <Search className="w-6 h-6" />
          </div>

          <div className="flex gap-4">
            <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
              <span className="text-base font-normal text-neutral-500">
                All Categories
              </span>
              <ChevronDown className="w-8 h-8" />
            </button>

            <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
              <span className="text-base font-normal text-neutral-500">
                All Experience
              </span>
              <ChevronDown className="w-8 h-8" />
            </button>

            <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
              <span className="text-base font-normal text-neutral-500">
                All ratings
              </span>
              <ChevronDown className="w-8 h-8" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <ProfessionalSelectionCard />
            <ProfessionalSelectionCard />
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-border-500">
            <Button
              variant="outline"
              className="border border-neutral-500 px-7 py-3"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary-500 text-white px-7 py-3"
              onClick={onAssign}
            >
              Assign Selected professional
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfessionalSelectionCard() {
  return (
    <div className="border border-border-500 rounded-md p-6 flex gap-4 items-start">
      <div className="flex-1 flex gap-4">
        <div className="w-[70px] h-[70px] rounded-full bg-[#CFD3D7] flex items-center justify-center shrink-0">
          <span className="text-[16.8px] font-medium">SM</span>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4">
              <p className="text-base font-medium text-secondary-500">
                Sarah Johnson
              </p>
              <p className="text-base font-normal text-neutral-500">
                Senior Fullstack Developer
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-warning-500 text-2xl">★</span>
              <p className="text-base font-normal text-neutral-500">
                (127 reviews) • 98% success rate
              </p>
            </div>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                5+
              </p>
              <p className="text-xs font-normal text-neutral-500">YEARS EXP</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                89
              </p>
              <p className="text-xs font-normal text-neutral-500">PROJECTS</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                96%
              </p>
              <p className="text-xs font-normal text-neutral-500">AI MATCH</p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
              <span className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                React
              </span>
            </div>
            <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
              <span className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                AWS
              </span>
            </div>
            <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
              <span className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                MongoDB
              </span>
            </div>
            <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
              <span className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                TypeScript
              </span>
            </div>
          </div>

          <Button variant="outline" className="border border-neutral-500 w-full h-12">
            <span className="text-lg font-medium">View Profile</span>
          </Button>
        </div>
      </div>

      <input type="checkbox" className="w-6 h-6 shrink-0" />
    </div>
  );
}

