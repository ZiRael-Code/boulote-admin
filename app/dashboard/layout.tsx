"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileHeader } from "@/components/navigation/mobile-header";
import { AuthGuard } from "@/components/auth-guard";
import { ErrorBoundary } from "@/components/error-boundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sidebar is a fixed-position full-screen drawer below the lg breakpoint
  // (see sidebar.tsx), so starting it "open" meant every page loaded on a
  // phone or tablet with the drawer and its dark overlay covering the whole
  // screen. Start closed (matches server-rendered markup, so no hydration
  // mismatch) and open it back up once we know we're actually on a desktop
  // viewport.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    setIsSidebarOpen(desktop.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsSidebarOpen(e.matches);
    desktop.addEventListener("change", handleChange);
    return () => desktop.removeEventListener("change", handleChange);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-white overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MobileHeader onMenuClick={toggleSidebar} />
          <main className="flex-1 overflow-y-auto">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
