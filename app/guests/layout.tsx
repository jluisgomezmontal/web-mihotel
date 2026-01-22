import { DashboardProvider } from "@/contexts/DashboardContext";

export default function GuestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
