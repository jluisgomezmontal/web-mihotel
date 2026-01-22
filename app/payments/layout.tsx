import { DashboardProvider } from "@/contexts/DashboardContext";

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
