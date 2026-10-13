"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

import { Button } from "@senara/ui/components/button";

export function HeaderAuth() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="gap-1.5 text-xs font-semibold shadow-xs"
          render={<Link href="/dashboard" />}
        >
          <span>Mulai Gratis</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2.5">
        <Button
          size="sm"
          className="gap-1.5 text-xs font-semibold"
          render={<Link href="/dashboard" />}
        >
          <span>Dashboard</span>
          <ArrowRight className="size-3.5" />
        </Button>
        <UserButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <SignInButton mode="modal">
        <Button
          variant="ghost"
          size="sm"
          className="hidden text-xs font-medium sm:inline-flex"
        >
          Masuk
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button
          size="sm"
          className="gap-1 px-2.5 text-xs font-semibold shadow-xs sm:gap-1.5 sm:px-3"
        >
          <span>Mulai Gratis</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </SignUpButton>
    </div>
  );
}

