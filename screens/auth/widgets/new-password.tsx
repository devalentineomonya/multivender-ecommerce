"use client";
import AuthInput from "../components/auth-input";
import { HiAtSymbol } from "react-icons/hi";
import { BiLock } from "react-icons/bi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthLayout from "../layout/auth-layout";
import { useSetNewPassword } from "@/features/auth/set-new-password";
import { toast } from "react-toastify";
import Link from "next/link";

// Zod schema for form validation
const NewPasswordSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email format")
      .nonempty("Email is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .nonempty("New password is required"),
    confirmPassword: z.string().nonempty("Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Infer the TypeScript type from the Zod schema
type NewPasswordFormData = z.infer<typeof NewPasswordSchema>;

const NewPassword = () => {
  const setNewPassword = useSetNewPassword();
  const {
    register,
    handleSubmit,reset,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(NewPasswordSchema),
  });

  const onSubmit = async (data: NewPasswordFormData) => {
    const id = toast.loading("Resetting Password...");
    try {
      const response = await setNewPassword.mutateAsync(data);
      if (response?.success) {
        reset();
        toast.success(response.message || "Password reset successfully");
      } else {
        toast.error(
          response?.message || "Failed to reset Password. Please try again."
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

  return (
    <AuthLayout
      title="New Password"
      description="Enter your email and new password"
    >
      <form className="max-w-96 w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
        <AuthInput
          type="email"
          label="Email*"
          icon={<HiAtSymbol />}
          {...register("email")}
        />
        {errors.email && (
          <div className="text-red-600 font-semibold text-sm mt-2">
            {errors.email.message}
          </div>
        )}

        <AuthInput
          type="password"
          label="New Password*"
          icon={<BiLock />}
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <div className="text-red-600 font-semibold text-sm mt-2">
            {errors.newPassword.message}
          </div>
        )}

        <AuthInput
          type="password"
          label="Confirm Password*"
          icon={<BiLock />}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <div className="text-red-600 font-semibold text-sm mt-2">
            {errors.confirmPassword.message}
          </div>
        )}

        <div className="flex justify-center items-c mt-8">
          <button
            type="submit"
            className="bg-primary text-white hover:bg-black w-full h-11  rounded-md text-sm  flex justify-center items-center gap-x-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
        <p className="mt-8 text-xs  text-center text-gray-700">
          Sign in to your account
          <Link
            href="/auth/sign-in"
            className="font-semibold capitalize ml-3 text-sky-600"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default NewPassword;
