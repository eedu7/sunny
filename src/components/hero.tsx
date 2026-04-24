import Link from "next/link";
import { InstagramIcon, XIcon } from "./icons";
import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <div id="hero" className="flex h-screen flex-col items-center justify-center space-y-12 font-mono">
      <div className="mx-auto flex max-w-lg flex-col items-center justify-between gap-4">
        <h1 className="font-bold md:text-4xl">Muhammad Salman Hassan</h1>
        <small className="text-muted-foreground">@sunny</small>
        <p className="text-center text-xs text-muted-foreground md:text-sm">
          AI engineer building intelligent systems - from LLMs and computer vision to production ML pipelines. Turning
          research into products.
        </p>
      </div>
      <div className="space-x-2">
        <Button asChild size="sm" variant="outline">
          <Link href="#projects">View Projects</Link>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link href="#contact">Get in touch</Link>
        </Button>
        {/* TODO: Update the social links */}
        <Button asChild size="icon" variant="ghost">
          <Link href="https://www.instagram.com/">
            <InstagramIcon />
          </Link>
        </Button>
        <Button asChild size="icon" variant="ghost">
          <Link href="https://x.com/">
            <XIcon />
          </Link>
        </Button>
      </div>
    </div>
  );
};
