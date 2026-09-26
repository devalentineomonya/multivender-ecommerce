"use client";

import { createClient } from "@/lib/supabase/client";
import { CredentialResponse } from "google-one-tap";
import { useRouter } from 'next-nprogress-bar';
import React, { useEffect } from "react";

const OneTap = () => {
  const supabase = createClient();
  const router = useRouter();

  // Generate nonce to use for Google ID token sign-in
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return [nonce, hashedNonce];
  };

  useEffect(() => {
    const loadGoogleScript = () => {
      if (!document.getElementById("google-identity-script")) {
        const script = document.createElement("script");
        script.id = "google-identity-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = initializeGoogleOneTap;
        document.body.appendChild(script);
      } else {
        initializeGoogleOneTap();
      }
    };

    // const initializeGoogleOneTap = async () => {
    //   console.log('Initializing Google One Tap')

    //   const [nonce, hashedNonce] = await generateNonce()
    //   console.log('Nonce: ', nonce, hashedNonce)

    //   // Check if there's already an existing session before initializing the One Tap UI
    //   const { data, error } = await supabase.auth.getSession()
    //   if (error) {
    //     console.error('Error getting session', error)
    //   }
    //   if (data.session) {
    //     router.push('/')
    //     return
    //   }

    //   // Ensure `google.accounts` is available
    //   if (window.google && window.google.accounts) {
    //     window.google.accounts.id.initialize({
    //       client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    //       callback: async (response: CredentialResponse) => {
    //         try {
    //           // Send ID token returned in response.credential to Supabase
    //           const { data, error } = await supabase.auth.signInWithIdToken({
    //             provider: 'google',
    //             token: response.credential,
    //             nonce,
    //           })

    //           if (error) throw error
    //           console.log('Session data: ', data)
    //           console.log('Successfully logged in with Google One Tap')

    //           // Redirect to protected page
    //           router.push('/')
    //         } catch (error) {
    //           console.error('Error logging in with Google One Tap', error)
    //         }
    //       },
    //       nonce: hashedNonce,
    //       // Use FedCM for prompt (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
    //       use_fedcm_for_prompt: true,
    //     })

    //     // Handle notifications (e.g., retry on `tap_outside`)
    //     window.google.accounts.id.prompt((notification) => {
    //       if (notification.getSkippedReason() === 'tap_outside') {
    //         console.log('Prompt was dismissed. Retrying...')
    //         window.google.accounts.id.prompt()
    //       }
    //     })
    //   } else {
    //     console.error('Google Identity Services script failed to load.')
    //   }
    // }

    const initializeGoogleOneTap = async () => {
      console.log("Initializing Google One Tap");

      const [nonce, hashedNonce] = await generateNonce();
      console.log("Nonce: ", nonce, hashedNonce);

      // Check if there's already an existing session before initializing the One Tap UI
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session", error);
      }
      if (data.session) {
        router.push("/");
        return;
      }

      // Ensure `google.accounts` is available
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: async (response: CredentialResponse) => {
            try {
              // Send ID token returned in response.credential to Supabase
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
                nonce,
              });

              if (error) throw error;
              console.log("Session data: ", data);
              console.log("Successfully logged in with Google One Tap");

              // Redirect to protected page
              router.push("/");
            } catch (error) {
              console.error("Error logging in with Google One Tap", error);
            }
          },
          nonce: hashedNonce,
          // Use FedCM for prompt (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
          use_fedcm_for_prompt: true,
          cancel_on_tap_outside: false,
        });
      } else {
        console.error("Google Identity Services script failed to load.");
      }
    };

    loadGoogleScript();
    return () => {
      // Clean up script and remove event listeners
      const script = document.getElementById("google-identity-script");
      if (script) document.body.removeChild(script);
    };
  }, [router, supabase]);

  return (
    <>
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default OneTap;
