import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  signInSchema,
  signUpSchema,
  confirmOtpSchema,
  forgotPasswordSchema,
  newPasswordSchema,
} from "@/lib/validation/schemas";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";

// Routes
const authRouter = new Hono()
  .post("/sign-up", zValidator("json", signUpSchema), async (c) => {
    const body = c.req.valid("json");
    const { email, password, firstName, lastName, role, storeName } = body;
    const userRole = role === "vendor" ? "vendor" : "user";

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          role: userRole,
          storeName: storeName || "",
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm-otp`,
      },
    });

    if (error) {
      console.log(error);
      return c.json({ success: false, message: error.message }, 400);
    }

    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return c.json({
        success: false,
        message: "An account with this email already exists. Please sign in instead.",
      }, 400);
    }

    return c.json({
      success: true,
      message: "User registered successfully",
      data,
      role: userRole,
    });
  })
  .post("/sign-in", zValidator("json", signInSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return c.json({ success: false, message: error.message }, 400);
    }

    const role = getUserRole(data.user);

    return c.json({
      success: true,
      message: "Sign in successful",
      data,
      role,
    });
  })
  .get("/me", async (c) => {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return c.json({ authenticated: false, user: null, role: null }, 401);
    }

    const role = getUserRole(user);

    return c.json({
      authenticated: true,
      user,
      role,
    });
  })
  .post("/confirm-otp", zValidator("json", confirmOtpSchema), async (c) => {
    const { otp } = c.req.valid("json");

    const supabase = await createClient();
    const email = (await supabase.auth.getUser()).data.user?.email;
    if (!email) {
      return c.json(
        { success: false, message: "User not found. Try logging in again" },
        400
      );
    }
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      return c.json({ success: false, message: error.message }, 400);
    }

    return c.json({ success: true, message: "OTP confirmed", data });
  })
  .post("/resend-otp", async (c) => {
    const supabase = await createClient();
    const email = (await supabase.auth.getUser()).data.user?.email;
    if (!email) {
      return c.json(
        { success: false, message: "User not found. Try logging in again" },
        400
      );
    }
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) {
      return c.json({ success: false, message: error.message }, 400);
    }

    return c.json({ success: true, message: "OTP resent" });
  })
  .post(
    "/forget-password",
    zValidator("json", forgotPasswordSchema),
    async (c) => {
      const { email } = c.req.valid("json");

      const supabase = await createClient();
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password`,
      });

      if (error) {
        return c.json({ success: false, message: error.message }, 400);
      }

      return c.json({
        success: true,
        message: "Password reset email sent",
        data,
      });
    }
  )
  .put("/new-password", zValidator("json", newPasswordSchema), async (c) => {
    const { email, newPassword } = c.req.valid("json");

    const supabase = await createClient();
    const { data, error } = await supabase.auth.updateUser({
      email,
      password: newPassword,
    });

    if (error) {
      return c.json({ success: false, message: error.message }, 400);
    }

    return c.json({
      success: true,
      message: "Password updated successfully",
      data,
    });
  })
  .get("/sign-in-with-google", async (c) => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL!}/api/callback/google`,
      },
    });
    if (error) {
      return c.json({ success: false, message: error.message }, 400);
    }
    if (data.url) {
      return c.redirect(data.url);
    }
  });

export default authRouter;
