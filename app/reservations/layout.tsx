import { DashboardProvider } from "@/contexts/DashboardContext";

export default function ReservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
