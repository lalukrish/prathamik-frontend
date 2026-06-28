import axios from "axios";

export const Login = async (data: { email: string; password: string }) => {
    const response = await axios.post(
           `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        data,
        { withCredentials: true }
    );
    return response.data;
};     

//  `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,



export const Signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return axios.post( `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, data);
};

