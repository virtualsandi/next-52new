"use client";

import Sidebar from "@/components/sidebar/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout-container">
      <Sidebar />
      <main className="admin-layout-content">{children}</main>
    </div>
  );
}
