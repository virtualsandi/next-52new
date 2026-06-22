import AdminLayout from "@/components/layout/AdminLayout";

export default function CustomerChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
