import { DashboardProvider } from "@/contexts/DashboardContext";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
