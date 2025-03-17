"use client";
import { usePathname } from "next/navigation";
import Logo from "../../public/logosaas.png";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SignOutButton, useAuth, UserButton } from "@clerk/nextjs";
import { LogInIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 inset-x-0 backdrop-blur-sm z-50 w-full">
      {pathname === "/" && (
        <div className="w-full flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
          <p className="text-white/60 hidden md:block">
            Enhance your resume with the power of AI.
          </p>
          <div className="inline-flex gap-1 items-center">
            <Link
              href={isSignedIn ? "/dashboard" : "/sign-in"}
              className="hover:underline"
            >
              <p>Get started for free ✨</p>
            </Link>
          </div>
        </div>
      )}

      <div className="w-full py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href={"/"}>
              <Image src={Logo} alt="Saas logo" height={40} width={40} />
            </Link>

            <nav className="hidden md:flex gap-6 text-black/60 items-center">
              <Link
                href="https://github.com/Venu005/student-resume"
                className="hover:underline"
              >
                About
              </Link>
              {isSignedIn ? (
                <div className="flex space-x-4">
                  <Button asChild variant={"link"}>
                    <Link href="/dashboard">
                      <span>Dashboard</span>
                    </Link>
                  </Button>
                  <SignOutButton>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      className="flex items-center gap-2"
                    >
                      <LogOutIcon className="size-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </Button>
                  </SignOutButton>
                  <UserButton />
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    asChild
                    variant="ghost"
                    className="font-semibold text-zinc-600 hover:bg-transparent"
                  >
                    <Link href="/sign-in" className="flex items-center gap-2">
                      <LogInIcon />
                      <span className="hidden sm:inline">Sign In</span>
                    </Link>
                  </Button>

                  <Button asChild>
                    <Link href="/sign-up" className="flex items-center gap-2">
                      <span className="hidden sm:inline">Sign Up</span>
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
