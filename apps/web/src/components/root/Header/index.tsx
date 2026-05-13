import { ModeToggle } from "@/components/mode-toggle";
import Logo from "./Logo";
import { Button } from "@senara/ui/components/button";
import Link from "next/link";

const Header = () => {
  return (
    <header>
      <div className="container h-16 flex items-center justify-between">
        <Logo />

        <div className="">
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
