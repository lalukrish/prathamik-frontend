"use client";

import Button from "@/components/ui/button/Button";
import { ForgotPassword } from "@/shared/forgot-password";
import { useState } from "react";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState("");

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await ForgotPassword(email);

            if (!response.success) {
                throw new Error(
                    response.message ||
                    "Entered email is not registered"
                );
            }

            setShowSuccess(true);
            setEmail("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md">
                <h1 className="text-2xl font-bold mb-2">
                    Forgot Password
                </h1>

                <p className="text-gray-500 mb-6">
                    Enter your email address and
                    we'll send you a password
                    reset link.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            placeholder="Enter your email"
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}
                    </Button>
                </form>
            </div>

            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-semibold mb-2">
                            Email Sent
                        </h2>

                        <p className="text-gray-600">
                            Your password reset link has
                            been sent.
                        </p>

                        <button
                            onClick={() =>
                                setShowSuccess(false)
                            }
                            className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPasswordPage;