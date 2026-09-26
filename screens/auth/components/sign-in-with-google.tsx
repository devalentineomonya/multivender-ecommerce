"use client";
import React, { useState } from "react";
import { Google } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next-nprogress-bar';

const SignInWithGoogle: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSignIn = () => {
    setLoading(true);
    router.push("/api/auth/sign-in-with-google");
  };

  return (
    <>
      <Separator className="w-full my-4" orientation="horizontal" />
      <div className="flex justify-center items-center">
        <button
          type="button"
          className="bg-transparent text-black hover:bg-black hover:text-white border border-primary disabled:bg-black w-full h-11 rounded-md text-sm flex justify-center items-center gap-x-3"
          disabled={disabled || loading}
          onClick={handleSignIn}
        >
          {loading ? (
            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className="flex items-center gap-x-4 justify-center">
              <Google />
              <span>Sign Up with Google</span>
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default SignInWithGoogle;
