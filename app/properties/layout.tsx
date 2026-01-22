import { DashboardProvider } from "@/contexts/DashboardContext";

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
