"use client";
import { useMemo } from "react";
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
import { useI18nStore } from "@/lib/i18n/store";
import type { TranslationKey } from "@/lib/i18n/translations";

function getForgetPasswordSchema(t: (key: TranslationKey) => string) {
  return z.object({
    email: z.string().email(t("auth.errors.invalidEmail")).nonempty(t("auth.errors.emailRequired")),
  });
}

type ForgetPasswordFormData = z.infer<ReturnType<typeof getForgetPasswordSchema>>;

const ForgetPassword = () => {
  const { t } = useI18nStore();
  const resetPassword = useForgetPassword();
  const router = useRouter();
  const schema = useMemo(() => getForgetPasswordSchema(t), [t]);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    const id = toast.loading(t("auth.toast.requestingReset"));
    try {
      const response = await resetPassword.mutateAsync(data);
      if (response?.success) {
        reset()
        toast.success(response.message || t("auth.toast.resetRequestSent"));
        router.push("/auth/new-password");
      } else {
        toast.error(response?.message || t("auth.toast.resetRequestFailed"));
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t("auth.toast.genericError"));
    } finally {
      toast.done(id);
    }
  };

  return (
    <AuthLayout
      title={t("auth.forgetPassword.title")}
      description={t("auth.forgetPassword.description")}
    >
      <form className="max-w-96 w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
        <AuthInput
          type="email"
          label={t("auth.email")}
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
              t("auth.forgetPassword.submit")
            )}
          </button>
          <p className="mt-8 text-xs  text-center text-gray-700">
            {t("auth.forgetPassword.haveAccount")}
            <Link
              href="/auth/sign-in"
              className="font-semibold capitalize ml-3 text-sky-600"
            >
              {t("auth.signIn.link")}
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgetPassword;
