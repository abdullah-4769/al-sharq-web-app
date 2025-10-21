'use client'

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()?.toLowerCase()

  // Define pages where you don't want the navbar
  const hideNavbarPaths = ["/authentication/signup", "/authentication/signin" , "/"]
  const hideNavbar = hideNavbarPaths.some(path => pathname?.startsWith(path))

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  )
}