"use client";

import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import { useTheme } from "next-themes";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Image from "next/image";
import { Footer } from "./footer";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-left">
        Rethink <br /> Research
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium text-left">
        <span className="underline">polytree</span> is the platform where <br />
        better, faster research happens.
      </h3>
      {isLoading && (
        <div className="w-full flex items-left justify-left">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <div className="flex items-start justify-left">
          <Button asChild>
            <Link href="/workspace">
              Enter
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
      {!isAuthenticated && !isLoading && (
        <div className="flex items-start justify-left">
          <SignInButton mode="modal">
            <Button className=" p-4">
              Sign Up
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </SignInButton>
        </div>
      )}
    </div>
  );
};
