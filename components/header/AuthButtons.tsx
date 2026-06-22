"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthToken, clearAuthToken } from "@/lib/auth";

export function AuthButtons() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists on mount
    setIsLoggedIn(!!getAuthToken());
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setIsLoggedIn(false);
    router.refresh(); // Refresh page to update authentication state globally
  };

  if (isLoggedIn) {
    return (
      <button
        onClick={handleLogout}
        className="block rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 cursor-pointer"
      >
        Logout
      </button>
    );
  }

  return (
    <div className="sm:flex sm:gap-4">
      <Link
        className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
        href="/login"
      >
        Login
      </Link>

      <Link
        className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 sm:block"
        href="/register"
      >
        Register
      </Link>
    </div>
  );
}
