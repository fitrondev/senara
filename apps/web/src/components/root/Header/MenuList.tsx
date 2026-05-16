"use client";

import { menuData } from "@/constants/LinkMenu";
import { SignInButton } from "@clerk/nextjs";
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

      <Button asChild>
        <SignInButton mode="modal">Login</SignInButton>
      </Button>

      {/* <SignInButton mode="modal"/>
        <Button className="w-full">Login</Button>
      </SignInButton> */}
    </nav>
  );
};

export default MenuList;
