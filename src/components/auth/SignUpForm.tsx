
"use client";

import React, { useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { Signup } from "@/shared/login";

type SignUpFormProps = {
  /** Called after a successful signup (e.g. to close the modal). */
  onSuccess?: () => void;
  /** Called when the user clicks "Sign In" to switch the modal to sign-in mode. */
  onSwitchToSignIn?: () => void;
};

export default function SignUpForm({
  onSuccess,
  onSwitchToSignIn,
}: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!isChecked) {
      setErrorMessage("Please accept Terms & Conditions");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      };

      await Signup(payload);

      if (onSuccess) {
        onSuccess();
      }

      // Send the user to sign in with their new account
      if (onSwitchToSignIn) {
        onSwitchToSignIn();
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Sign up failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="mb-1.5 text-xl font-bold text-slate-900">Sign Up</h1>
        <p className="text-sm text-slate-500">
          Create your account to start taking mock tests.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                First Name <span className="text-red-500">*</span>
              </Label>

              <Input
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>
                Last Name <span className="text-red-500">*</span>
              </Label>

              <Input
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label>
              Email <span className="text-red-500">*</span>
            </Label>

            <Input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>
              Password <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
          </div>

          <div>
            <Label>
              Confirm Password <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
          </div>

          <div>
            <Checkbox
              checked={isChecked}
              onChange={setIsChecked}
              label={
                <>
                  I agree to the{" "}
                  <a href="/terms" className="text-sky-500 hover:text-sky-600">
                    Terms &amp; Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-sky-500 hover:text-sky-600">
                    Privacy Policy
                  </a>
                </>
              }
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-sky-400 to-cyan-400 px-4 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="font-semibold text-sky-500 hover:text-sky-600"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}