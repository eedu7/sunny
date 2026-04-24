"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
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
  const isMobile = useIsMobile();
  return (
    <div className="sticky top-0 z-50 mx-auto my-4 flex max-w-7xl items-center justify-between">
      <HeaderLogo />
      {!isMobile && <HeaderNavbar />}
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
      <Button variant="ghost" asChild className={cn(fontdinerSwanky.className, "text-xl")}>
        <Link href="#hero">Salman Hassan</Link>
      </Button>
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
