import AdminLayout from "@/components/layout/AdminLayout";

export default function AddProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
