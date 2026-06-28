"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";

export default function UserMetaCard({ user }: any) {
  const { isOpen, openModal, closeModal } = useModal();


  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .required("First name is required"),

    lastName: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .required("Last name is required"),

    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

   // phone: Yup.string().required("Phone number is required"),
  });



  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
     // phone: "",
    },

    validationSchema,

    enableReinitialize: true,

    onSubmit: async (values) => {
       try {
    const payload = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
    //  phone: values.phone,
    };

const user = JSON.parse(localStorage.getItem("user") ?? "{}");
const token = user.token;  
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/user/dc639345-4f4c-4251-9ac8-f0dfa13355ad`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);

    closeModal();
  } catch (error) {
    console.log(error);
  }
},
  });


  useEffect(() => {
    if (user) {
      const names = user.name?.split(" ") || [];

      formik.setValues({
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        email: user.email || "",
      //  phone: user.phone || "",
      });
    }
  }, [user]);

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
              <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-blue-100 dark:bg-blue-900">
  <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
    {user?.name?.charAt(0).toUpperCase() ?? ""}
  </span>
</div>

            <div className="">
              <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                {user?.name}
              </h4>

              <p className="text-sm text-gray-500">{user?.email}</p>

              <p className="text-sm text-gray-500">
                {user?.organization?.name}
              </p>
              
            </div>
          </div>

         <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] m-4"
      >
        <div className="w-full rounded-3xl bg-white p-6 dark:bg-gray-900">
          <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
            Edit Profile
          </h4>

          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              

              <div>
                <Label>First Name</Label>

                <Input
                  type="text"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.firstName &&
                  formik.errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.firstName}
                    </p>
                  )}
              </div>

             
              <div>
                <Label>Last Name</Label>

                <Input
                  type="text"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.lastName &&
                  formik.errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.lastName}
                    </p>
                  )}
              </div>

            
              <div>
                <Label>Email</Label>

                <Input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.email}
                  </p>
                )}
              </div>
            </div>


            <div className="flex justify-end gap-3 mt-6">
              <Button
                size="sm"
                variant="outline"
                onClick={closeModal}
                type="button"
              >
                Cancel
              </Button>

              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}