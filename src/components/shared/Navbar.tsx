"use client";

import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { logout, useCurrentUser } from "@/services/AuthService/AuthService";
import { Skeleton } from "../ui/skeleton";
import NLButton from "../ui/core/ImageUploader/NLButton";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading } = useCurrentUser();

  const handleLogOut = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/all-debates", label: "All Debates" },
  ];

  return (
    <header className="border-b w-full sticky top-0 z-50 bg-white shadow-sm">
      <div className="container flex justify-between items-center mx-auto h-16 px-3">
        {/* Logo */}
        <Link href={"/"}>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-600">
            Debate Arena
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-grow justify-center">
          <ul className="flex space-x-6 text-sm text-gray-800 font-medium">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className={clsx(
                  pathname === link.href && "text-primary-500",
                  "font-bold"
                )}
              >
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center">
          {/* Desktop Buttons + Dropdown */}
          <nav className="md:flex gap-2 items-center">
            {loading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <Skeleton className="h-4 w-16 bg-gray-200" />
                </div>
              </div>
            ) : (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none cursor-pointer">
                      <Avatar className="border-2 border-primary-500 rounded-full">
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback>Profile</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href={`/${user.role}/update-profile`}>
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href={`/${user.role}`}>Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogOut}
                        className="cursor-pointer text-red-500"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link href={"/sign-in"}>
                      <NLButton variant="outline" className="mr-2 text-sm text-teal-500 hover:text-teal-700">
                        Sign In
                      </NLButton>
                    </Link>
                    <Link href={"/sign-up"}>
                      <NLButton variant="outline" className="text-sm text-teal-500 hover:text-teal-700">
                        Sign Up
                      </NLButton>
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="space-y-4 mt-4 p-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={clsx(
                        pathname === link.href && "text-primary-500",
                        "block text-sm font-semibold"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
