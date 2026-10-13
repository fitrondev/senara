import type * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

import { Badge } from "@senara/ui/components/badge";
import { Button } from "@senara/ui/components/button";
import { cn } from "@senara/ui/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  badgeText?: string;
  badgeIcon?: LucideIcon;
  backHref?: Route;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badgeText,
  badgeIcon: BadgeIcon,
  backHref,
  backLabel = "Kembali",
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        {backHref ? (
          <div className="mb-1.5">
            <Button
              variant="ghost"
              size="xs"
              className="-ml-2 gap-1 text-muted-foreground hover:text-foreground"
              render={<Link href={backHref} />}
            >
              <ArrowLeft className="size-3.5" />
              <span>{backLabel}</span>
            </Button>
          </div>
        ) : null}

        {badgeText ? (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1.5 border-primary/30 bg-primary/5 text-primary text-xs"
            >
              {BadgeIcon ? <BadgeIcon className="size-3.5" /> : null}
              <span>{badgeText}</span>
            </Badge>
          </div>
        ) : null}

        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground break-words sm:text-3xl">
          {title}
        </h1>

        {description ? (
          <p className="text-muted-foreground text-sm break-words">{description}</p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

