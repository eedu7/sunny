import { cn } from "@/lib/utils";
import { BellIcon, SearchIcon, UserIcon } from "lucide-react";
import { Fontdiner_Swanky } from "next/font/google";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

export const Header = () => {
  return (
    <div className="flex items-center justify-between">
      <HeaderLogo />
      <HeaderNavbar />
      <HeaderActionButton />
    </div>
  );
};

const fontdinerSwanky = Fontdiner_Swanky({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fontdiner-swanky",
});

const HeaderLogo = () => {
  return (
    <div>
      <h1 className={cn(fontdinerSwanky.className, "text-xl")}>Salman Hassan</h1>
    </div>
  );
};

const HeaderNavbar = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem asChild className={navigationMenuTriggerStyle()}>
          <Link href="#home">Home</Link>
        </NavigationMenuItem>
        <NavigationMenuItem asChild className={navigationMenuTriggerStyle()}>
          <Link href="#about-us">About Us</Link>
        </NavigationMenuItem>
        <NavigationMenuItem asChild className={navigationMenuTriggerStyle()}>
          <Link href="#our-services">Our Services</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const HeaderActionButton = () => {
  return (
    <div>
      <Button size="icon" variant="ghost">
        <SearchIcon />
      </Button>
      <Button size="icon" variant="ghost">
        <BellIcon />
      </Button>
      <Button size="icon" variant="ghost">
        <UserIcon />
      </Button>
    </div>
  );
};
