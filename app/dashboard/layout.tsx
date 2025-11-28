"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileHeader } from "@/components/navigation/mobile-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
