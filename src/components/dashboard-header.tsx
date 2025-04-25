"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquare, Settings, LogOut, User, BarChart } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import type { Session } from "next-auth";

interface UserMenuProps {
  session: Session | null;
  onSignOut: () => Promise<void>;
}

function UserMenu({ session, onSignOut }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="User menu"
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User avatar"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User avatar"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {session?.user?.name ?? "My Account"}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/statistics"
            className="flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            <span>Statistics</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onSignOut}
          className="flex items-center gap-2 text-red-500 focus:bg-red-50 focus:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardHeader() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span className="font-bold">VibeBlogger</span>
          </Link>
          <nav className="hidden items-center space-x-4 text-sm font-medium md:flex">
            <Link
              href="/dashboard"
              className="hover:text-foreground/80 transition-colors"
            >
              Sessions
            </Link>
            <Link
              href="/dashboard/generated"
              className="hover:text-foreground/80 transition-colors"
            >
              Generated Blogs
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <UserMenu session={session} onSignOut={handleSignOut} />
        </div>
      </div>
    </header>
  );
}
