// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { ResetPassword } from "@/shared/forgot-password";

// const ResetPasswordPage = () => {
//     const searchParams = useSearchParams();
//     const token = searchParams.get("token");

//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [showSuccess, setShowSuccess] = useState(false);
//     const router = useRouter();

//     const validatePassword = (password: string) => {
//         return /^[A-Za-z0-9]{6,}$/.test(password);
//     };

//     const handleSubmit = async (
//         e: React.FormEvent<HTMLFormElement>
//     ) => {
//         e.preventDefault();

//         setError("");

//         if (!password || !confirmPassword) {
//             setError("All fields are required");
//             return;
//         }

//         if (!validatePassword(password)) {
//             setError("Password must be at least 6 characters long");
//             return;
//         }

//         if (password !== confirmPassword) {
//             setError("Passwords do not match");
//             return;
//         }

//         try {
//             setLoading(true);

//             const response = await ResetPassword(token || "", password);

//             if (!response.success) {
//                 throw new Error(
//                     response.message ||
//                     "Failed to reset password"
//                 );
//             }

//             setShowSuccess(true);
//             setPassword("");
//             setConfirmPassword("");
//         } catch (err) {
//             setError(
//                 err instanceof Error
//                     ? err.message
//                     : "Something went wrong"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//             <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
//                 <h1 className="text-2xl font-bold mb-2">
//                     Reset Password
//                 </h1>

//                 <p className="text-gray-500 mb-6">
//                     Enter your new password.
//                 </p>

//                 <form
//                     onSubmit={handleSubmit}
//                     className="space-y-4"
//                 >
//                     <div>
//                         <label className="block mb-1 text-sm font-medium">
//                             New Password
//                         </label>

//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) =>
//                                 setPassword(
//                                     e.target.value
//                                 )
//                             }
//                             className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter new password"
//                         />
//                     </div>

//                     <div>
//                         <label className="block mb-1 text-sm font-medium">
//                             Confirm Password
//                         </label>

//                         <input
//                             type="password"
//                             value={confirmPassword}
//                             onChange={(e) =>
//                                 setConfirmPassword(
//                                     e.target.value
//                                 )
//                             }
//                             className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Confirm password"
//                         />
//                     </div>

//                     {error && (
//                         <p className="text-sm text-red-500">
//                             {error}
//                         </p>
//                     )}


//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
//                     >
//                         {loading
//                             ? "Updating..."
//                             : "Reset Password"}
//                     </button>
//                 </form>
//                 {showSuccess && (
//                     <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//                         <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
//                             <h2 className="text-lg font-semibold mb-2">
//                                 Password Updated
//                             </h2>

//                             <p className="text-gray-600">
//                                 Your password has been reset successfully.
//                                 You can now log in with your new password.
//                             </p>

//                             <button
//                                 onClick={() => {
//                                     setShowSuccess(false);
//                                     router.push("/signin");
//                                 }}
//                                 className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
//                             >
//                                 Continue to Sign In
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ResetPasswordPage;


"use client";

import ResetPasswordForm from "@/components/auth/reset-password";
import { Suspense } from "react";
// import ResetPasswordForm from "@/components/auth/reset-password/index";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}