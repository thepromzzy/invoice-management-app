import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background lg:pl-[103px]">
      <AppSidebar />
      <main className="mx-auto w-full max-w-[730px] px-6 py-8 md:px-12 md:py-14 lg:py-16">
        {children}
      </main>
    </div>
  );
}
