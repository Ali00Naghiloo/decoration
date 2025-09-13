"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // Using a state to prevent flash of unauthenticated content
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for the token in localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      // If no token, redirect to the login page
      router.replace("/login");
    } else {
      // If token exists, we can consider the user authenticated for this simple check
      // In a real-world app, you might want to verify the token with an API call here
      setIsLoading(false);
    }
  }, [router]);

  // While checking, show a loading indicator or nothing at all
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p> {/* Or a fancy spinner component */}
      </div>
    );
  }

  // If authenticated, render the children (the actual page)
  return <>{children}</>;
}
