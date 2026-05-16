import { ModeToggle } from "@/components/mode-toggle";
import Logo from "./Logo";
import MenuList from "./MenuList";
import { Button } from "@senara/ui/components/button";
import Link from "next/link";
import Menu from "./Menu";

import { SignInButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden lg:block">
          <MenuList orientation="horizontal" />
        </div>

        <div className="">
          <div className="flex items-center gap-4">
            <ModeToggle />

            <div className="hidden lg:inline-flex">
              <SignInButton mode="modal">
                <Button>Login</Button>
              </SignInButton>
            </div>

            <Menu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
