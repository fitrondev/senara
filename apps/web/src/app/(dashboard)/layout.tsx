import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@senara/ui/components/button";
import { Separator } from "@senara/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@senara/ui/components/sidebar";

import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 backdrop-blur transition-[width,height] ease-linear">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-muted-foreground">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              render={<Link href={"/dashboard/templates" as Route} />}
              size="sm"
              className="gap-1.5 shadow-xs"
            >
              <Plus className="size-4" data-icon="inline-start" />
              <span>Buat Undangan Baru</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
