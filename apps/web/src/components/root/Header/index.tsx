import { ModeToggle } from "@/components/mode-toggle";
import Logo from "./Logo";
import MenuList from "./MenuList";
import { Button } from "@senara/ui/components/button";
import Link from "next/link";
import Menu from "./Menu";

import { SignInButton, Show } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden lg:block">
          <MenuList orientation="horizontal" />
        </div>

        <div className="">
          <div className="flex items-center gap-4">
            <ModeToggle />

            <Show when={"signed-out"}>
              <Button size={"lg"} className="hidden lg:inline-flex" asChild>
                <SignInButton mode="modal">Login</SignInButton>
              </Button>
            </Show>

            <Show when={"signed-in"}>
              <Button size={"lg"} className="hidden lg:inline-flex" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </Show>

            <Menu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
