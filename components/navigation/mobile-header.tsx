"use client";

import { Menu, Bell, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
        <Link href="/dashboard/notifications" className="w-6 h-6 flex items-center justify-center" aria-label="Notifications">
          <Bell className="w-6 h-6" />
        </Link>
        <Link href="/dashboard/settings" className="w-6 h-6 flex items-center justify-center" aria-label="Settings">
          <Settings className="w-6 h-6" />
        </Link>
        <Link href="/dashboard/settings" className="w-6 h-6 rounded-full bg-neutral-200" aria-label="Account" />
      </div>
    </header>
  );
}

