"use client";

import { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-[280px] max-w-[85vw]">
            <DashboardSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center justify-between p-3 bg-none">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="h-11 w-11 min-h-[44px] min-w-[44px]"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Responsive Header - Shows on both mobile and desktop */}
        <div className="w-full">
          <DashboardHeader />
        </div>

        {/* Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
