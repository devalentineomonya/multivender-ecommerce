"use client";
import { useMemo } from "react";
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
import { useI18nStore } from "@/lib/i18n/store";
import type { TranslationKey } from "@/lib/i18n/translations";

function getNewPasswordSchema(t: (key: TranslationKey) => string) {
  return z
    .object({
      email: z.string().email(t("auth.errors.invalidEmail")).nonempty(t("auth.errors.emailRequired")),
      newPassword: z
        .string()
        .min(8, t("auth.errors.newPasswordMin8"))
        .nonempty(t("auth.errors.newPasswordRequired")),
      confirmPassword: z.string().nonempty(t("auth.errors.confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("auth.errors.passwordsDontMatch"),
      path: ["confirmPassword"],
    });
}

type NewPasswordFormData = z.infer<ReturnType<typeof getNewPasswordSchema>>;

const NewPassword = () => {
  const { t } = useI18nStore();
  const setNewPassword = useSetNewPassword();
  const schema = useMemo(() => getNewPasswordSchema(t), [t]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: NewPasswordFormData) => {
    const id = toast.loading(t("auth.toast.resettingPassword"));
    try {
      const response = await setNewPassword.mutateAsync(data);
      if (response?.success) {
        reset();
        toast.success(response.message || t("auth.toast.passwordResetSuccess"));
      } else {
        toast.error(response?.message || t("auth.toast.passwordResetFailed"));
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t("auth.toast.genericError"));
    } finally {
      toast.done(id);
    }
  };

  return (
    <AuthLayout title={t("auth.newPassword.title")} description={t("auth.newPassword.description")}>
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

        <AuthInput
          type="password"
          label={t("auth.newPasswordLabel")}
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
          label={t("auth.confirmPasswordLabel")}
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
              t("auth.forgetPassword.submit")
            )}
          </button>
        </div>
        <p className="mt-8 text-xs  text-center text-gray-700">
          {t("auth.newPassword.signInPrompt")}
          <Link
            href="/auth/sign-in"
            className="font-semibold capitalize ml-3 text-sky-600"
          >
            {t("auth.signIn.link")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default NewPassword;
