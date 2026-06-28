// "use client";

// import { useEffect } from "react";

// import { useDispatch } from "react-redux";

// import { setUser } from "@/redux/slices/userSlice";
// import { getUserProfile } from "@/shared/user";
// import { useRouter } from "next/navigation";

// // import { getUserProfile } from "@/services/user.service";

// export default function AuthProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {

//         const user = JSON.parse(localStorage.getItem("user") ?? "{}");
//         const token = user.token;
//        const id = user.id; 
//         if (!id || !token) {
//           router.replace("/signin");
//           return;
//         }

//         const response = await getUserProfile(id);

//         dispatch(setUser(response.data));
//       } catch (error) {
//         console.log(error);

//         router.replace("/signin");
//       }
//     };

//     fetchUser();
//   }, [dispatch, router]);

//   return <>{children}</>;
// }

"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { setUser } from "@/redux/slices/userSlice";
import { getUserProfile } from "@/shared/user";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        // if (!storedUser) {
        //   router.replace("/signin");
        //   return;
        // }

        // const user = JSON.parse(storedUser);

        // if (!user?.id || !user?.token) {
        //   router.replace("/signin");
        //   return;
        // }

        // const response = await getUserProfile(user.id);

        //dispatch(setUser(response.data));
      } catch (error) {
        console.error(error);

        // localStorage.removeItem("user");
        // router.replace("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, router]);

  if (loading) {
    return null; 
  }

  return <>{children}</>;
}