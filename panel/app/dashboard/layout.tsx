import AuthWrapper from "@/src/components/auth/AuthWrapper";
import Sidebar from "@/src/components/layout/Sidebar";
import { yekanFont } from "../fonts";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <div className={`flex h-screen bg-gray-50 ${yekanFont.className}`}>
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </AuthWrapper>
  );
}
