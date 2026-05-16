"use client";

import { menuData } from "@/constants/LinkMenu";
import { SignInButton, SignUpButton, Show } from "@clerk/nextjs";
import { Button } from "@senara/ui/components/button";
import { Separator } from "@senara/ui/components/separator";
import { cn } from "@senara/ui/lib/utils";
import Link from "next/link";
import React from "react";

type Props = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

const MenuList: React.FC<Props> = ({
  orientation = "horizontal",
  className = "",
}) => {
  const containerClass =
    orientation === "horizontal"
      ? "flex gap-4 items-center text-sm font-semibold"
      : "flex flex-col gap-2 text-lg";

  return (
    <nav
      className={cn(containerClass, className?.trim() ?? "")}
      aria-label="Main navigation"
    >
      {menuData.map((item) => (
        <Link
          key={item.href}
          href={item.href as any}
          className="hover:text-primary"
        >
          {item.name}
        </Link>
      ))}

      <Separator className={"lg:hidden"} />

      <Show when={"signed-out"}>
        <div className="w-full flex flex-col gap-2">
          <Button size={"lg"} className="w-full lg:hidden" asChild>
            <SignInButton mode="modal">Login</SignInButton>
          </Button>

          <Button
            size={"lg"}
            variant={"outline"}
            className="w-full lg:hidden"
            asChild
          >
            <SignUpButton mode="modal">Register</SignUpButton>
          </Button>
        </div>
      </Show>

      <Show when={"signed-in"}>
        <Button size={"lg"} className="w-full lg:hidden" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </Show>
    </nav>
  );
};

export default MenuList;
