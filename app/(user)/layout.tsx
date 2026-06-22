import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Customer Page",
  description: "",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}