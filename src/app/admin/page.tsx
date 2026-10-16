import { redirect } from "next/navigation";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { AdminDashboard } from "./_components/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuth = await isAuthenticatedAdmin();

  if (!isAuth) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
