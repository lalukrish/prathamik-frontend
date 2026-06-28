"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/authentication/modal";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";

export type AuthMode = "signin" | "signup";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Which form to show first. Defaults to "signin". */
  initialMode?: AuthMode;
};

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Reset to the requested mode every time the modal is (re)opened
  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);

  const handleSuccess = () => {
    onClose();
    // The pages calling this already redirect with router.push("/")
    // inside the forms themselves on success, so nothing else is needed here.
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClassName="max-w-md">
      {mode === "signin" ? (
        <SignInForm
          onSuccess={handleSuccess}
          onSwitchToSignUp={() => setMode("signup")}
        />
      ) : (
        <SignUpForm
          onSuccess={handleSuccess}
          onSwitchToSignIn={() => setMode("signin")}
        />
      )}
    </Modal>
  );
}