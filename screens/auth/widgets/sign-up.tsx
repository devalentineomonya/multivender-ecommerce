"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthInput from "../components/auth-input";
import { BiLock, BiUser, BiStore } from "react-icons/bi";
import { HiAtSymbol } from "react-icons/hi";
import AuthLayout from "../layout/auth-layout";
import { useSignUpUser } from "@/features/auth/sign-up-user";
import { toast } from "react-toastify";
import SignInWithGoogle from "../components/sign-in-with-google";
import { useRouter } from "next-nprogress-bar";
import { useI18nStore } from "@/lib/i18n/store";
import type { TranslationKey } from "@/lib/i18n/translations";

function getSignUpSchema(t: (key: TranslationKey) => string) {
  return z.object({
    firstName: z
      .string()
      .min(2, t("auth.errors.firstNameMin"))
      .nonempty(t("auth.errors.firstNameRequired")),
    lastName: z
      .string()
      .min(2, t("auth.errors.lastNameMin"))
      .nonempty(t("auth.errors.lastNameRequired")),
    email: z.string().email(t("auth.errors.invalidEmail")).nonempty(t("auth.errors.emailRequired")),
    password: z
      .string()
      .min(6, t("auth.errors.passwordMin6"))
      .nonempty(t("auth.errors.passwordRequired")),
    role: z.enum(["user", "vendor"]).default("user"),
    storeName: z.string().optional(),
  });
}

type SignUpFormData = z.infer<ReturnType<typeof getSignUpSchema>>;

const SignUp = () => {
  const { t } = useI18nStore();
  const [selectedRole, setSelectedRole] = useState<"user" | "vendor">("user");
  const signUpUser = useSignUpUser();
  const router = useRouter();
  const schema = useMemo(() => getSignUpSchema(t), [t]);

  const {
    register: formRegister,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "user",
      storeName: "",
    },
  });

  const handleRoleChange = (role: "user" | "vendor") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const onSubmit = async (values: SignUpFormData) => {
    const id = toast.loading(t("auth.toast.creatingAccount"));
    try {
      const response = await signUpUser.mutateAsync({
        ...values,
        role: selectedRole,
      });

      if (response.success) {
        reset();
        toast.success(t("auth.toast.accountCreated"));
        router.push("/auth/confirm-otp");
      } else {
        toast.error(response.message || t("auth.toast.signUpFailed"));
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error(t("auth.toast.unexpectedError"));
      }
      console.error("Error details:", error);
    } finally {
      toast.done(id);
    }
  };

  return (
    <AuthLayout title={t("auth.signUp.title")} description={t("auth.signUp.description")}>
      <form
        className="max-w-96 w-full mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Account Role Selector */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
          <button
            type="button"
            onClick={() => handleRoleChange("user")}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
              selectedRole === "user"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-gray-500 hover:text-slate-900"
            }`}
          >
            {t("auth.role.customer")}
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("vendor")}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
              selectedRole === "vendor"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-gray-500 hover:text-slate-900"
            }`}
          >
            {t("auth.role.vendor")}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-2">
          <div>
            <AuthInput
              type="text"
              label={t("auth.firstName")}
              icon={<BiUser />}
              {...formRegister("firstName")}
            />
            {errors.firstName && (
              <div className="text-red-600 text-xs mt-1">
                {errors.firstName.message}
              </div>
            )}
          </div>
          <div>
            <AuthInput
              type="text"
              label={t("auth.lastName")}
              icon={<BiUser />}
              {...formRegister("lastName")}
            />
            {errors.lastName && (
              <div className="text-red-600 text-xs mt-1">
                {errors.lastName.message}
              </div>
            )}
          </div>
        </div>

        {selectedRole === "vendor" && (
          <div className="animate-in fade-in">
            <AuthInput
              type="text"
              label={t("auth.storeName")}
              icon={<BiStore />}
              {...formRegister("storeName")}
            />
            {errors.storeName && (
              <div className="text-red-600 text-xs mt-1">
                {errors.storeName.message}
              </div>
            )}
          </div>
        )}

        <AuthInput
          type="email"
          label={t("auth.emailAddress")}
          icon={<HiAtSymbol />}
          {...formRegister("email")}
        />
        {errors.email && (
          <div className="text-red-600 text-xs mt-1">
            {errors.email.message}
          </div>
        )}

        <AuthInput
          type="password"
          label={t("auth.password")}
          icon={<BiLock />}
          {...formRegister("password")}
        />
        {errors.password && (
          <div className="text-red-600 text-xs mt-1">
            {errors.password.message}
          </div>
        )}

        <div className="flex justify-center items-center mt-6">
          <button
            type="submit"
            className="bg-primary text-white hover:opacity-90 w-full h-11 rounded-lg text-sm font-medium flex justify-center items-center gap-x-3 transition-opacity"
            disabled={isSubmitting || signUpUser.isPending}
          >
            {isSubmitting || signUpUser.isPending ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : selectedRole === "vendor" ? (
              t("auth.signUp.submitVendor")
            ) : (
              t("auth.signUp.submit")
            )}
          </button>
        </div>

        <SignInWithGoogle disabled={isSubmitting || signUpUser.isPending} />

        <p className="mt-6 text-xs text-center text-gray-600">
          {t("auth.signUp.haveAccount")}{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-primary hover:underline ml-1"
          >
            {t("auth.signIn.link")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
