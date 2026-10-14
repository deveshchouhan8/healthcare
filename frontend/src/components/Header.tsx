
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const checkLoginStatus = useCallback(async () => {
    try {

      const response = await fetch(
        "http://localhost:5000/api/patients/me",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );     
      setIsLoggedIn(response.ok);
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsLoggedIn(false);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
      checkLoginStatus();
  }, [checkLoginStatus, pathname]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/patients/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setIsLoggedIn(false);
        router.push("/login");
        router.refresh();
      } else {
        alert(data.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to connect to the server.");
    }
  };

  const authLinkClass = (active: boolean) =>
    active
      ? "rounded-lg bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800"
      : "rounded-lg px-4 py-2 font-medium text-slate-700 hover:text-teal-700";

  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-2xl font-bold text-teal-700">
          MediCare<span className="text-slate-800">+</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-slate-700 hover:text-teal-700">
            Home
          </Link>
          <Link href="/doctors" className="text-slate-700 hover:text-teal-700" >
            Find Doctors
          </Link>
          <Link href="/appointments" className="text-slate-700 hover:text-teal-700" >
            Appointments
          </Link>
          <Link href="/my-appointments" className="text-slate-700 hover:text-teal-700" >
            my-appointments
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {checkingAuth ? (
            <span className="text-sm text-slate-500">
              Loading...
            </span>
          ) : isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className={authLinkClass(pathname === "/login")}
              >
                Login
              </Link>

              <Link
                href="/register"
                className={authLinkClass(pathname === "/register")}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
