"use client";
import Link from "next/link";
import { useRouter } from "next-nprogress-bar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "../components/auth-input";
import { BiLock } from "react-icons/bi";
import { HiAtSymbol } from "react-icons/hi";
import { useForm } from "react-hook-form";
import AuthLayout from "../layout/auth-layout";
import SignInWithGoogle from "../components/sign-in-with-google";
import { useSigninUser } from "@/features/auth/sign-in-user";
import { toast } from "react-toastify";
import { useState } from "react";
import { getRoleDashboardPath, UserRole } from "@/lib/auth/roles";

// Zod schema for validation
const signInSchema = z.object({
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .nonempty("Password is required"),
  remember: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const signInUser = useSigninUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (values: SignInFormData) => {
    const id = toast.loading("Logging in...");
    try {
      const response = await signInUser.mutateAsync(values);

      if (response?.success) {
        toast.success("Welcome back!");
        setIsRedirecting(true);
        reset();

        // Redirect based on user role (admin -> /admin/dashboard, vendor -> /vendor/dashboard, user -> /user/dashboard)
        const role = (response?.role || "user") as UserRole;
        const destination = getRoleDashboardPath(role);
        router.push(destination);
      } else {
        toast.error(
          response?.message || "Invalid credentials. Please try again."
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

  const isDisabled = isSubmitting || signInUser.isPending || isRedirecting;

  return (
    <AuthLayout
      title="Welcome Back"
      description="Enter your credentials to access your account"
    >
      <form className="max-w-96 w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
        <AuthInput
          type="email"
          label="Email Address*"
          icon={<HiAtSymbol />}
          disabled={isDisabled}
          {...register("email")}
        />
        {errors.email && (
          <div className="text-red-600 text-xs mt-1">
            {errors.email.message}
          </div>
        )}

        <AuthInput
          type="password"
          label="Password*"
          icon={<BiLock />}
          disabled={isDisabled}
          {...register("password")}
        />
        {errors.password && (
          <div className="text-red-600 text-xs mt-1">
            {errors.password.message}
          </div>
        )}

        <div className="flex justify-between items-center text-xs mt-3">
          <label className="flex gap-x-2 items-center text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              {...register("remember")}
              id="remember"
              disabled={isDisabled}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Remember Me</span>
          </label>
          <Link
            className="text-primary font-semibold hover:underline"
            href="/auth/forget-password"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="flex justify-center items-center mt-6">
          <button
            type="submit"
            className="bg-primary text-white hover:opacity-90 w-full h-11 rounded-lg text-sm font-medium flex justify-center items-center gap-x-3 transition-opacity"
            disabled={isDisabled}
          >
            {isSubmitting || signInUser.isPending ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        <SignInWithGoogle disabled={isDisabled} />

        <p className="mt-6 text-xs text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-primary hover:underline ml-1"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
