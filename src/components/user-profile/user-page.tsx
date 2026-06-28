'use client'

import { setUser } from "@/redux/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import UserMetaCard from "./UserMetaCard";
import UserInfoCard from "./UserInfoCard";
import UserAddressCard from "./UserAddressCard";
import { getUserProfile } from "@/shared/user";

export default function ProfilePage() {

  const dispatch = useDispatch();

  const [userdata, setUserData] = useState<any>(null);

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        const id = user.id;

        if (!id) return;

        console.log("FETCH USER CALLED");

        const data = await getUserProfile(id);

        console.log("USER RESPONSE =>", data);

        dispatch(setUser(data.data));
        setUserData(data.data);

      } catch (error) {

        console.log("FETCH USER ERROR =>", error);
      }
    };

    fetchUser();

  }, [dispatch]);

  return (
    <div>
      <UserMetaCard user={userdata} />
        <UserAddressCard />
      {/* <UserInfoCard /> */}
    
    </div>
  );
}