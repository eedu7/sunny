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
    <div className="sticky top-0 z-50 mx-auto my-4 flex max-w-7xl items-center justify-between">
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

interface NavItem {
  href: string;
  title: string;
}

const navItems: NavItem[] = [
  {
    href: "#about",
    title: "About",
  },
  {
    href: "#projects",
    title: "Projects",
  },
  {
    href: "#skills",
    title: "Skills",
  },
  {
    href: "#experience",
    title: "Experience",
  },
  {
    href: "#blog",
    title: "Blog",
  },
  {
    href: "#contact",
    title: "Contact",
  },
];

const HeaderNavbar = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map(({ href, title }) => (
          <NavigationMenuItem key={href} asChild className={navigationMenuTriggerStyle()}>
            <Link href={href}>{title}</Link>
          </NavigationMenuItem>
        ))}
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
