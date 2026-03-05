import Link from 'next/link';
import Image from "next/image";
import { getUser } from "@/auth/server";
import { Button } from './button';
import DarkModeToggle from './DarkModeToggle';
import LogOutButton from './LogOutButton';
import { SidebarTrigger } from './sidebar';

async function Header() {
    const user = await getUser();
  return (
    <header className="relative flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-8">
        <SidebarTrigger className="absolute left-2 top-1/2 -translate-y-1/2"/>
        <Link className="flex items-center gap-2.5 pl-8" href="/">
            <Image
                src="/book.png"
                height={32}
                width={32}
                alt="logo"
                className="rounded-lg"
                priority
            />
            <span className="text-lg font-semibold tracking-tight">Notes App</span>
        </Link>

        <div className="flex items-center gap-3">
            {user ? (
                <LogOutButton />
            ) : (
                <>
                <Button asChild size="sm" className="hidden sm:flex">
                    <Link href="/sign-up">Sign Up</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                    <Link href="/login">Login</Link>
                </Button>
                </>
            )}
            <DarkModeToggle />
        </div>
    </header>
  );
}

export default Header
