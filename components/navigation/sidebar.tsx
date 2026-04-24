"use client";

import Link from "next/link";
import Image from "next/image";

type SidebarProps = {
  isOpen?: boolean;
  onToggle?: () => void;
};

type MenuItem = {
  icon: string;
  label: string;
  href: string;
  iconSize?: number;
};

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const menuItems: MenuItem[] = [
    {
      icon: "/assets/icon/dashboard/overview.svg",
      label: "Overview",
      href: "/dashboard",
      iconSize: 24,
    },
    {
      icon: "/assets/icon/dashboard/job.svg",
      label: "Job Management",
      href: "/dashboard/jobs",
      iconSize: 24,
    },
    {
      icon: "/assets/icon/dashboard/professionals.svg",
      label: "Professionals",
      href: "/dashboard/professionals",
      iconSize: 24,
    },
    {
      icon: "/assets/icon/dashboard/companies.svg",
      label: "Companies",
      href: "/dashboard/companies",
      iconSize: 24,
    },
    {
      icon: "/assets/icon/dashboard/community.svg",
      label: "Community",
      href: "/dashboard/community",
      iconSize: 24,
    },
    {
      icon: "/assets/icon/dashboard/settings.svg",
      label: "Settings",
      href: "/dashboard/settings",
      iconSize: 32,
    },
    {
      icon: "/assets/icon/dashboard/quiz.svg",
      label: "Quizzes",
      href: "/dashboard/quizzes",
      iconSize: 24,
    },
    {
      icon: "/assets/icon/dashboard/quiz.svg",
      label: "Mentorship",
      href: "/dashboard/mentorship",
      iconSize: 24,
    },
    {
      icon: "/assets/icon/dashboard/notifications.svg",
      label: "Notifications&Messaging",
      href: "/dashboard/notifications",
      iconSize: 32,
    }
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onToggle}
      />

      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-white border-r border-border-500 rounded-br-md rounded-tr-md p-4 flex flex-col gap-[33px] z-50 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "w-[250px]" : "w-[70px] max-lg:-translate-x-full"
        }`}
      >
        <div className="flex gap-[33px] mt-[45px] items-start shrink-0 w-full">
          <div
            className={`flex-1 min-w-0 h-0 transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src="/assets/logo.png"
              alt="Boulote"
              width={140}
              height={40}
            />
          </div>
          <button
            onClick={onToggle}
            className="mt-3 block overflow-hidden cursor-pointer shrink-0 hover:bg-neutral-100 rounded transition-colors"
          >
            <Image
              src="/assets/icon/dashboard/hamburger-menu.svg"
              alt="Menu"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className="h-8 shrink-0 w-full" />

        <nav className="flex flex-col gap-[33px] overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex items-center h-8 shrink-0 hover:bg-neutral-50 rounded transition-colors"
              title={!isOpen ? item.label : undefined}
            >
              <div
                className={`flex items-center transition-all duration-300 ${
                  isOpen ? "gap-4" : "justify-center w-full"
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={item.iconSize}
                  height={item.iconSize}
                  className="shrink-0"
                />
                <p
                  className={`font-medium text-lg leading-[21.6px] text-secondary-500 whitespace-nowrap transition-all duration-300 ${
                    isOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4 absolute pointer-events-none"
                  }`}
                >
                  {item.label}
                </p>
              </div>

              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-secondary-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
