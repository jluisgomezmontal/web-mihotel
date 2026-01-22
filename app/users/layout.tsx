import { DashboardProvider } from "@/contexts/DashboardContext";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
