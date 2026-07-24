"use client";

import { useEffect, useState } from "react";

interface PortalHeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
  notificationCount?: number;
}

export default function PortalHeader({
  title,
  subtitle,
  onMenuToggle,
  notificationCount = 0,
}: PortalHeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("rynex-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("rynex-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("rynex-theme", "light");
      }
      return next;
    });
  };

  return (
    <header className="portal-header">
      {/* Mobile menu toggle */}
      <button
        id="portal-sidebar-toggle"
        className="sidebar-toggle"
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
      >
        <i className="fa fa-bars" />
      </button>

      {/* Title */}
      <div className="portal-header-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {/* Actions */}
      <div className="portal-header-actions">
        {/* Theme Toggle */}
        <button
          id="portal-theme-toggle-btn"
          className="header-icon-btn"
          aria-label="Toggle Theme"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          onClick={toggleTheme}
        >
          <i className={`fa ${isDarkMode ? "fa-sun" : "fa-moon"}`} />
        </button>

        {/* Notifications */}
        <button
          id="portal-notifications-btn"
          className="header-icon-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <i className="fa fa-bell" />
          {notificationCount > 0 && <span className="header-notif-dot" />}
        </button>

        {/* Help */}
        <button
          id="portal-help-btn"
          className="header-icon-btn"
          aria-label="Help"
          title="Help"
        >
          <i className="fa fa-circle-question" />
        </button>
      </div>
    </header>
  );
}
