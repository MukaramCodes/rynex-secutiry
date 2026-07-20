"use client";

import { useState } from "react";
import Sidebar from "@/components/portal/Sidebar";
import PortalHeader from "@/components/portal/PortalHeader";
import { Role } from "@prisma/client";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface PortalShellProps {
  userName: string;
  userRole: Role;
  pageTitle: string;
  pageSubtitle?: string;
  notificationCount?: number;
  children: React.ReactNode;
}

function buildNavGroups(role: Role): NavGroup[] {
  const groups: NavGroup[] = [];

  // Dashboard — everyone
  groups.push({
    label: "Overview",
    items: [
      { href: "/portal/dashboard", icon: "fa fa-chart-pie", label: "Dashboard" },
    ],
  });

  // Projects & Work
  const projectItems: NavItem[] = [];

  if (["CEO", "ADMIN", "DEVELOPER"].includes(role)) {
    projectItems.push({ href: "/portal/projects", icon: "fa fa-folder-open", label: "All Projects" });
  } else if (["HEAD", "INTERN"].includes(role)) {
    projectItems.push({ href: "/portal/projects", icon: "fa fa-folder-open", label: "My Projects" });
  } else if (role === "CLIENT") {
    projectItems.push({ href: "/portal/projects", icon: "fa fa-folder-open", label: "My Project" });
  }

  // Reports
  if (["CEO", "ADMIN", "DEVELOPER"].includes(role)) {
    projectItems.push({ href: "/portal/reports", icon: "fa fa-file-lines", label: "All Reports" });
  } else if (["HEAD", "INTERN"].includes(role)) {
    projectItems.push({ href: "/portal/reports", icon: "fa fa-file-lines", label: "Reports" });
  } else if (role === "CLIENT") {
    projectItems.push({ href: "/portal/reports", icon: "fa fa-file-download", label: "Deliverables" });
  }

  // Tasks
  if (["CEO", "ADMIN", "DEVELOPER", "HEAD", "INTERN"].includes(role)) {
    projectItems.push({ href: "/portal/tasks", icon: "fa fa-list-check", label: "Tasks" });
  }

  if (projectItems.length > 0) {
    groups.push({ label: "Work", items: projectItems });
  }

  // Messaging
  const msgItems: NavItem[] = [];
  if (["CEO", "DEVELOPER", "HEAD", "CLIENT"].includes(role)) {
    if (role === "CEO") {
      msgItems.push({ href: "/portal/messages", icon: "fa fa-inbox", label: "Client Inbox" });
    } else {
      msgItems.push({ href: "/portal/messages", icon: "fa fa-comments", label: "Messages" });
    }
  }
  if (msgItems.length > 0) {
    groups.push({ label: "Communication", items: msgItems });
  }

  // Management
  const mgmtItems: NavItem[] = [];

  if (["CEO", "ADMIN", "DEVELOPER"].includes(role)) {
    mgmtItems.push({ href: "/portal/users", icon: "fa fa-users", label: "Users" });
  } else if (role === "HEAD") {
    mgmtItems.push({ href: "/portal/users", icon: "fa fa-users", label: "My Team" });
  }

  if (["CEO", "ADMIN", "DEVELOPER", "HEAD"].includes(role)) {
    mgmtItems.push({ href: "/portal/teams", icon: "fa fa-people-group", label: "Teams" });
  }

  if (["CEO", "ADMIN", "DEVELOPER"].includes(role)) {
    mgmtItems.push({ href: "/portal/audit-log", icon: "fa fa-scroll", label: "Audit Log" });
  }

  if (mgmtItems.length > 0) {
    groups.push({ label: "Management", items: mgmtItems });
  }

  // System Settings (CEO + ADMIN only)
  if (["CEO", "ADMIN"].includes(role)) {
    groups.push({
      label: "System",
      items: [
        { href: "/portal/settings", icon: "fa fa-gear", label: "Settings" },
      ],
    });
  }

  return groups;
}

export default function PortalShell({
  children,
}: PortalShellProps) {
  return (
    <div className="portal-page-wrapper">
      {children}
    </div>
  );
}
