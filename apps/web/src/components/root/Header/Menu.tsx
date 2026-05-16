import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@senara/ui/components/sheet";

import { Separator } from "@senara/ui/components/separator";

import { MenuIcon } from "lucide-react";
import MenuList from "./MenuList";

const Menu = () => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <MenuIcon />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="hidden">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Select a page</SheetDescription>
        </SheetHeader>
        <div className="mx-4">
          <MenuList
            orientation="vertical"
            className="h-screen items-center justify-center px-2"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Menu;
