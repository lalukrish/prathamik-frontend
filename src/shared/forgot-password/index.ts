import api from "@/lib/axios";

export const ForgotPassword = async (email: string) => {
    const response = await api.post("/auth/forgot-password", {
        email,
    });
    return response.data;
}

export const ResetPassword = async (token: string, password: string) => {
    const response = await api.post("/auth/reset-password", {
        token,
        password,
    });
    return response.data;
}