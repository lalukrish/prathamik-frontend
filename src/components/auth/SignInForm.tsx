"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { Login } from "@/shared/login";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


type FormDataType = {
  email: string;
  password: string;
};

type ErrorType = {
  email?: string;
  password?: string;
};

type SignInFormProps = {
  /** Called after a successful login (e.g. to close the modal). */
  onSuccess?: () => void;
  /** Called when the user clicks "Create Account" to switch the modal to sign-up mode. */
  onSwitchToSignUp?: () => void;
};

export default function SignInForm({
  onSuccess,
  onSwitchToSignUp,
}: SignInFormProps) {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorType>({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors: ErrorType = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const validationErrors = validate();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);

      const response = await Login(formData);

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          token: response.data.accessToken,
        })
      );

      if (onSuccess) {
        onSuccess();
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Login failed";

      if (
        message === "Invalid credentials" ||
        message === "Wrong password"
      ) {
        setErrors({
          password: "Invalid email or password",
        });
      } else {
        setErrors({
          password: message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="mb-1.5 text-xl font-bold text-slate-900">Sign In</h1>
        <p className="text-sm text-slate-500">
          Login to continue your mock tests.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* EMAIL */}
          <div>
            <Label>
              Email <span className="text-error-500">*</span>
            </Label>

            <Input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <Label>
              Password <span className="text-error-500">*</span>
            </Label>

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-sky-500 hover:text-sky-600"
              onClick={() => {
                /* hook up to your forgot-password modal/page as needed */
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* SUBMIT */}
          <div>
            <Button type="submit" className="w-full" size="sm" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </div>

          {/* SIGNUP */}
          <div className="text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="font-semibold text-sky-500 hover:text-sky-600"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}