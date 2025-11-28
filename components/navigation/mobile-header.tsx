"use client";

import { Menu, Bell, Settings } from "lucide-react";
import Image from "next/image";

type MobileHeaderProps = {
  onMenuClick: () => void;
};

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="lg:hidden flex items-center justify-between h-14 px-4 bg-white border-b border-border-500">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="w-8 h-8 flex items-center justify-center"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Image src="/assets/logo.png" alt="Boulote" width={128} height={40} className="h-8 object-contain" />
      </div>
      <div className="flex items-center gap-6">
        <button className="w-6 h-6 flex items-center justify-center">
          <Bell className="w-6 h-6" />
        </button>
        <button className="w-6 h-6 flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </button>
        <div className="w-6 h-6 rounded-full bg-neutral-200" />
      </div>
    </header>
  );
}

