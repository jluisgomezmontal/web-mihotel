import { DashboardProvider } from "@/contexts/DashboardContext";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
