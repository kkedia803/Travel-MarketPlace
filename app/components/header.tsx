"use client"

import Link from "next/link"
import { useAuth } from "../contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Compass, LogOut, Menu, Package, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

export function Header() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 600; // change according to your hero height (px)
      if (window.scrollY > heroHeight) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
  
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const getDashboardLink = () => {
    if (!user) return "/auth/login"

    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "seller":
        return "/seller/dashboard"
      default:
        return "/user/dashboard"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className={` ${pathname!=='/'?"sticky":"fixed"} top-0 z-50 w-full backdrop-blur-[27px] ${pathname!=='/'?"bg-black/30":""} ${scrolled?"bg-black/30":""}`}>
      <div className=" flex h-16 sm:h-24 items-center justify-between pl-0 pr-5 sm:pl-14 sm:pr-14 ">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white/90">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <nav className="grid gap-6 text-lg font-medium">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex w-full items-center py-2 hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href={getDashboardLink()}
                  className="flex w-full items-center py-2 hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <Compass className="h-8 w-8 text-primary text-white " />
            <span className={`font-bold text-2xl sm:text-3xl text-white font-bulgatti`}>TracoIt</span>
          </Link>
          <nav className="hidden md:flex gap-6 ml-6">
            {navItems.map((item, index) => (
              <Link
              key={index}
              href={item.href}
              className={`text-base sm:text-xl font-onest font-medium transition-colors hover:text-stone-300 text-white/90`}
            >
              {item.name}
            </Link>
            
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || ""} alt={user.name || user.email} />
                    <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-white/90 font-onest sm:text-xl">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button  className="font-onest sm:text-xl bg-stone-800">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

