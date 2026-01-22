import { DashboardProvider } from "@/contexts/DashboardContext";

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
