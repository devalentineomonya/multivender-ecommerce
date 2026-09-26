"use client";
import React from "react";

import { toast } from "react-toastify";
import OtpInput from "../components/otp-input";
import AuthLayout from "../layout/auth-layout";
import { useRouter } from "next-nprogress-bar";
import { useConfirmOtp } from "@/features/auth/confirm-otp";
import { useResendOtp } from "@/features/auth/resend-otp";
import { createClient } from "@/lib/supabase/client";
import { getUserRole, getRoleDashboardPath } from "@/lib/auth/roles";
import type { User } from "@supabase/supabase-js";

interface OtpFormData {
  otp: string;
}

const OtpForm: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const confirmOTP = useConfirmOtp();
  const resendOTP = useResendOtp();
  const router = useRouter();

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const onOtpSubmit = async (data: OtpFormData) => {
    const id = toast.loading("Verifying...");
    try {
      const response = await confirmOTP.mutateAsync(data);
      if (response?.success) {
        toast.success("Account Verified successfully");
        const role = getUserRole(user);
        router.push(getRoleDashboardPath(role));
      } else {
        toast.error(response?.message || "Invalid OTP. Please try again.");
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later."
      );
    } finally {
      toast.done(id);
    }
  };
  const onOtpResend = async () => {
    const id = toast.loading("Requesting Code...");

    try {
      const response = await resendOTP.mutateAsync();
      if (response?.success) {
        toast.success(response.message || "OTP resent successfully");
      } else {
        toast.error(
          response?.message || "Failed to resent OTP. Please try again."
        );
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later."
      );
    } finally {
      toast.done(id);
    }
  };

  const FormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otpValues = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("otp-"))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value)
      .join("");

    if (otpValues.length < 6) {
      return toast.error("Invalid OTP. Please try again.");
    }
    onOtpSubmit({ otp: otpValues });
  };

  return (
    <AuthLayout
      title="Verify Account"
      description="Enter the OTP sent to your email"
    >
      <form className="max-w-96 w-full mt-4" onSubmit={FormSubmission}>
        <OtpInput
          onOtpSubmit={(otp: string) => onOtpSubmit({ otp })}
          length={6}
        />
        <div className="text-xs text-center mt-4">
          <span suppressHydrationWarning>Enter the 6-digit code sent to {user?.email}</span>
        </div>
        <div className="flex flex-col justify-center items-center mt-4">
          <button
            disabled={resendOTP.isPending || confirmOTP.isPending}
            type="submit"
            className="bg-primary text-white hover:bg-black w-full h-11 rounded-md text-sm flex justify-center items-center gap-x-3"
          >
            Verify
          </button>
          <div className="flex items-center justify-center gap-x-4 text-sm mt-4">
            <span>Didn&apos;t receive code? </span>
            <button
              onClick={() => onOtpResend()}
              disabled={resendOTP.isPending || confirmOTP.isPending}
              type="button"
              className="text-primary text-medium underline"
            >
              Resend
            </button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OtpForm;
