import type * as React from "react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@senara/ui/components/card";
import { Skeleton } from "@senara/ui/components/skeleton";
import { cn } from "@senara/ui/lib/utils";

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
  isLoading?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
  valueClassName,
  isLoading = false,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium">{label}</p>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <p
              className={cn(
                "text-2xl font-bold tracking-tight text-foreground",
                valueClassName
              )}
            >
              {value}
            </p>
          )}
          {description ? (
            <p className="text-muted-foreground text-[11px]">{description}</p>
          ) : null}
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
              iconClassName
            )}
          >
            <Icon className="size-5" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

