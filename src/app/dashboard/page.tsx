import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";
import Footer from "@/components/Footer";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? verifySession(token) : null;

  if (!session) redirect("/");

  return (
    <>
      <DashboardClient username={session.username} />
      <Footer />
    </>
  );
}
