"use client";
import AuthInput from "../components/auth-input";
import { HiAtSymbol } from "react-icons/hi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AuthLayout from "../layout/auth-layout";
import { useForgetPassword } from "@/features/auth/forget-password";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";

const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email format").nonempty("Email is required"),
});

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

const ForgetPassword = () => {
  const resetPassword = useForgetPassword();
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    const id = toast.loading("Requesting Reset...");
    try {
      const response = await resetPassword.mutateAsync(data);
      if (response?.success) {
        reset()
        toast.success(response.message || "Request sent successfully");
        router.push("/auth/new-password");
      } else {
        toast.error(
          response?.message || "Failed to request reset. Please try again."
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
      title="Reset Password"
      description="Enter your email to reset your password"
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

        <div className=" flex flex-col justify-center items-center mt-8">
          <button
            type="submit"
            className="bg-primary text-white hover:bg-black w-full h-11  rounded-md text-sm  flex justify-center items-center gap-x-3"
            disabled={isSubmitting || resetPassword.isPending}
          >
            {isSubmitting ? (
              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Reset Password"
            )}
          </button>
          <p className="mt-8 text-xs  text-center text-gray-700">
            Have your password?
            <Link
              href="/auth/sign-in"
              className="font-semibold capitalize ml-3 text-sky-600"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
;
};

export default ForgetPassword;
