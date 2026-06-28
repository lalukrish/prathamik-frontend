// "use client";

// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import BasicTableOne from "@/components/tables/BasicTableOne";
// import { FileUploadField, NormalInputField, PasswordInputField } from "@/components/form/formFields";
// import { getAllCandidates } from "@/shared/candidates";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import { getAllJobsDropDown, JobApplying } from "@/shared/jobs";
// import { useRouter } from "next/navigation";
// import { Modal } from "@/components/ui/modal";
// import Snackbar from "@/components/ui/notification";

// export default function CandidateTable() {
//   const [search, setSearch] = useState("");
//    const [snackbar, setSnackbar] = useState<{
//      show: boolean;
//      variant: "success" | "error" | "warning" | "info";
//      message: string;
//    }>({ show: false, variant: "info", message: "" });
 

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [jobDetails, setJobDetails] = useState<any[]>([]);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState<any>(null);


//   const showSnackbar = (
//     variant: "success" | "error" | "warning" | "info",
//     message: string
//   ) => {
//     setSnackbar({ show: false, variant, message });
//     setTimeout(() => setSnackbar({ show: true, variant, message }), 50);
//   };


//   const router = useRouter();
//   const clearErrorsRef = useRef<() => void>(() => setErrors({}));
//   clearErrorsRef.current = () => setErrors({});

//   const validate = (data: any, isEdit = false) => {
//     const e: Record<string, string> = {};

//     const name = data.name?.trim();
//     if (!name) e.name = "Name is required";
//     else if (name.length < 3) e.name = "Minimum 3 characters";

//     const email = data.email?.trim();
//     if (!email) e.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
//       e.email = "Invalid email format";

//     const phone = data.phone?.trim();
//     if (!phone) e.phone = "Phone is required";
//     else if (!/^\d{10}$/.test(phone)) e.phone = "Phone must be 10 digits";

//     const totalExperience = Number(data.totalExperience);
//     if (!data.totalExperience && data.totalExperience !== 0)
//       e.totalExperience = "Experience is required";
//     else if (totalExperience < 0) e.totalExperience = "Must be >= 0";

//     const currentSalary = Number(data.currentSalary);
//     if (!data.currentSalary && data.currentSalary !== 0)
//       e.currentSalary = "Current salary is required";
//     else if (currentSalary < 0) e.currentSalary = "Must be >= 0";

//     const expectedSalary = Number(data.expectedSalary);
//     if (!data.expectedSalary && data.expectedSalary !== 0)
//       e.expectedSalary = "Expected salary is required";
//     else if (expectedSalary < 0) e.expectedSalary = "Must be >= 0";

//     const noticePeriod = Number(data.noticePeriod);
//     if (!data.noticePeriod && data.noticePeriod !== 0)
//       e.noticePeriod = "Notice period is required";
//     else if (noticePeriod < 0) e.noticePeriod = "Must be >= 0";

//     if (data.isOnNoticePeriod === undefined || data.isOnNoticePeriod === null)
//       e.isOnNoticePeriod = "Please select an option";

//     if (!data.jobId) e.jobId = "Please select a job";

//     if (!isEdit && !data.resume) {
//       e.resume = "Resume upload is required";
//     } else if (data.resume) {
//       const allowed = [
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ];
//       if (!allowed.includes(data.resume.type))
//         e.resume = "Only PDF or DOC/DOCX files are allowed";
//       else if (data.resume.size > 5 * 1024 * 1024)
//         e.resume = "Resume size must be less than 5MB";
//     }
//     return e;
//   };

//   const handleCreate = async (data: any) => {
//     const validationErrors = validate(data, false);
//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) return null;

//     try {
//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("email", data.email);
//       formData.append("phone", data.phone);
//       formData.append("totalExperience", String(data.totalExperience));
//       formData.append("currentSalary", String(data.currentSalary));
//       formData.append("expectedSalary", String(data.expectedSalary));
//       formData.append("noticePeriod", String(data.noticePeriod));
//       formData.append("isOnNoticePeriod", String(data.isOnNoticePeriod));
//       if (data.resume) formData.append("resume", data.resume);
//       console.log("FormData entries:", [...formData.entries()], "Job ID:", data.jobId);
//       const response = await JobApplying(formData, data.jobId);

//       if (!response || !response.data) {
//         // setAlert({
//         //   variant: "error",
//         //   title: "Create Failed",
//         //   message: "No response from server",
//         // });
//               showSnackbar("error", "Create Failed");

//         return null;
//       }
//       // setAlert({
//       //   variant: "success",
//       //   title: "Success",
//       //   message: "Candidate created successfully",
//       // });
//             showSnackbar("success","Candidate created successfully");

//     } catch (error: any) {
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.response?.data?.error ||
//         "Something went wrong";
//         showSnackbar("error",errorMessage);

//       return null;
//     }
//   };

//   const handleEdit = async (data: any) => {
//     const validationErrors = validate(data, true);
//     setErrors(validationErrors);
//     if (Object.keys(validationErrors).length > 0) return null;
//     try {
//       const user = JSON.parse(localStorage.getItem("user") ?? "{}");
//       const token = user.token; const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("email", data.email);
//       formData.append("phone", data.phone);
//       formData.append("totalExperience", String(data.totalExperience));
//       formData.append("currentSalary", String(data.currentSalary));
//       formData.append("expectedSalary", String(data.expectedSalary));
//       formData.append("noticePeriod", String(data.noticePeriod));
//       formData.append("isOnNoticePeriod", String(data.isOnNoticePeriod));
//       if (data.resume) formData.append("resume", data.resume);
//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_API_URL}/admin/candidate/${data.id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       // setAlert({
//       //   variant: "success",
//       //   title: "Success",
//       //   message: "Candidate updated successfully",
//       // });
//             showSnackbar("success", "Candidate updated successfully");

//       return response.data.data;
//     } catch (error: any) {
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.response?.data?.error ||
//         "Something went wrong";
//         showSnackbar("error",errorMessage);
//       return null;
//     }
//   };

//   const handleView = async (row: any) => {
//     setSelectedCandidate(row);
//     setIsViewModalOpen(true);
//   }

//   const handleDelete =async (id: string) => {
//     console.log("Delete Candidate:", id);
//     return true
//   };

//   const fetchJobDetails = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") ?? "{}");
//       const token = user.token; const response = await getAllJobsDropDown({ token });
//       setJobDetails(response.data);
//     } catch (error) {
//       console.error("Failed to fetch job details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchJobDetails();
//   }, []);

//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Candidates" />

//       <div className="space-y-6">
//         <BasicTableOne
//           search={search}
//           onSearchChange={setSearch}
//           fetchFunction={(params) => getAllCandidates({ ...params })}
//           handleCreate={handleCreate}
//           handleEdit={handleEdit}
//           handleDelete={handleDelete}
//           handleView={handleView}
//           onModalOpen={() => {
//             clearErrorsRef.current();
//             fetchJobDetails();
//           }}

//           emptyRow={{
//             id: "",
//             name: "",
//             email: "",
//             phone: "",
//             totalExperience: "",
//             currentSalary: "",
//             expectedSalary: "",
//             noticePeriod: "",
//             isOnNoticePeriod: false,
//             jobId: "",
//             resume: null,
//           }}

//           transformRowForEdit={(row) => ({
//             id: row.id,
//             name: row.name,
//             email: row.email,
//             phone: row.phone || "",
//             totalExperience: row.totalExperience || "",
//             currentSalary: row.currentCTC || "",
//             expectedSalary: row.expectedSalary || "",
//             noticePeriod: row.noticePeriod || "",
//             isOnNoticePeriod: row.isOnNoticePeriod || false,
//             jobId: row.jobId || "",
//             resume: null,
//           })}

//           transformCreateResponse={(data) => ({
//             id: data.id,
//             name: data.name,
//             email: data.email,
//             createdAt: data.createdAt,
//             totalExperience: data.totalExperience,
//             currentSalary: data.currentSalary,
//             expectedSalary: data.expectedSalary,
//             noticePeriod: data.noticePeriod,
//             isOnNoticePeriod: data.isOnNoticePeriod,
//             resume: data.resume,
//           })}

//           transformEditResponse={(rows, data) =>
//             rows.map((row) =>
//               row.id !== data.id
//                 ? row
//                 : { ...row, name: data.name, email: data.email }
//             )
//           }

//           modalCreateTitle="Create Candidate"
//           modalEditTitle="Edit Candidate"
//           modalCreateLabel="Create Candidate"
//           modalEditLabel="Update Candidate"

//           modalFields={(selectedRow, setSelectedRow) => (
//             <>
//               <NormalInputField
//                 label="Name"
//                 required
//                 value={selectedRow.name}
//                 error={errors.name}
//                 onChange={(e) =>
//                   setSelectedRow((prev: any) => ({ ...prev, name: e.target.value }))
//                 }
//               />

//               <NormalInputField
//                 label="Email"
//                 required
//                 type="email"
//                 value={selectedRow.email}
//                 error={errors.email}
//                 onChange={(e) =>
//                   setSelectedRow((prev: any) => ({ ...prev, email: e.target.value }))
//                 }
//               />

//               <NormalInputField
//                 label="Phone"
//                 required
//                 value={selectedRow.phone}
//                 error={errors.phone}
//                 onChange={(e) =>
//                   setSelectedRow((prev: any) => ({ ...prev, phone: e.target.value }))
//                 }
//               />

//               <NormalInputField
//                 label="Total Experience"
//                 required
//                 type="number"
//                 value={selectedRow.totalExperience}
//                 error={errors.totalExperience}
//                 onChange={(e) =>
//                   setSelectedRow((prev: any) => ({
//                     ...prev,
//                     totalExperience: e.target.value,
//                   }))
//                 }
//               />

//               <NormalInputField
//                 label="Current Salary"
//                 required
//                 type="number"
//                 value={selectedRow.currentSalary}
//                 error={errors.currentSalary}
//                 onChange={(e) =>
//                   setSelectedRow((prev: any) => ({
//                     ...prev,
//                     currentSalary: e.target.value,
//                   }))
//                 }
//               />

//               <NormalInputField
//                 label="Expected Salary"
//                 required
//                 type="number"
//                 value={selectedRow.expectedSalary}
//                 error={errors.expectedSalary}
//                 onChange={(e) =>
//                   setSelectedRow((prev: any) => ({
//                     ...prev,
//                     expectedSalary: e.target.value,
//                   }))
//                 }
//               />

//               <NormalInputField
//                 label="Notice Period (days)"
//                 required
//                 type="number"
//                 value={selectedRow.noticePeriod}
//                 error={errors.noticePeriod}
//                 onChange={(e) =>
//                   setSelectedRow((prev: any) => ({
//                     ...prev,
//                     noticePeriod: e.target.value,
//                   }))
//                 }
//               />

//               {/* Notice Period Radio */}
//               <div className="md:col-span-1">
//                 <p className="mb-2 text-sm font-medium text-gray-700">
//                   Currently on Notice Period?{" "}
//                   <span className="text-red-500">*</span>
//                 </p>
//                 <div className="flex gap-6">
//                   {[
//                     { label: "Yes", value: true },
//                     { label: "No", value: false },
//                   ].map(({ label, value }) => (
//                     <label
//                       key={label}
//                       className="flex items-center gap-2 cursor-pointer"
//                     >
//                       <input
//                         type="radio"
//                         name="isOnNoticePeriod"
//                         checked={selectedRow.isOnNoticePeriod === value}
//                         onChange={() =>
//                           setSelectedRow((prev: any) => ({
//                             ...prev,
//                             isOnNoticePeriod: value,
//                           }))
//                         }
//                         className="h-4 w-4 accent-brand-500"
//                       />
//                       <span className="text-sm text-gray-700">{label}</span>
//                     </label>
//                   ))}
//                 </div>
//                 {errors.isOnNoticePeriod && (
//                   <p className="mt-1 text-xs text-red-500">
//                     {errors.isOnNoticePeriod}
//                   </p>
//                 )}
//               </div>

//               {/* Job Select — md:col-span-1 keeps it in the same 2-col grid */}
//               <div className="md:col-span-1">
//                 <label className="block mb-2 text-sm font-medium text-gray-700">
//                   Select Job to Apply For{" "}
//                   <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={selectedRow.jobId || ""}
//                   onChange={(e) =>
//                     setSelectedRow((prev: any) => ({
//                       ...prev,
//                       jobId: e.target.value,
//                     }))
//                   }
//                   className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${errors.jobId ? "border-red-500" : "border-gray-300"
//                     }`}
//                 >
//                   <option value="">Select a job</option>
//                   {jobDetails.map((job: any) => (
//                     <option key={job.id} value={job.id}>
//                       {job.title}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.jobId && (
//                   <p className="mt-1 text-xs text-red-500">{errors.jobId}</p>
//                 )}
//               </div>

//               {/* Resume Upload */}
//               <div className="md:col-span-1">
//                 <label className="block text-sm font-medium mb-1">
//                   Resume{" "}
//                   <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   accept=".pdf,.doc,.docx"
//                   className={`w-full cursor-pointer rounded-md border bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.resume ? "border-red-500" : "border-gray-300"
//                     }`}
//                   onChange={(e) =>
//                     setSelectedRow((prev: any) => ({
//                       ...prev,
//                       resume: e.target.files?.[0] || null,
//                     }))
//                   }
//                 />
//                 {errors.resume && (
//                   <p className="mt-1 text-xs text-red-500">{errors.resume}</p>
//                 )}
//                 {selectedRow.id && (
//                   <p className="mt-1 text-xs text-gray-400">
//                     Leave blank to keep the existing resume.
//                   </p>
//                 )}
//               </div>
//             </>
//           )}

//           buttons={(openCreateModal) => (
//             <button
//               className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
//               onClick={openCreateModal}
//             >
//               <Plus size={18} />
//               <span>Create Candidate</span>
//             </button>
//           )}

//           columns={[
//             {
//               key: "name",
//               label: "Name",
//               render: (row) => row.name ?? "—",
//             },
//             {
//               key: "email",
//               label: "Email",
//               render: (row) => row.email ?? "—",
//             },
//             {
//               key: "createdAt",
//               label: "Created At",
//               render: (row) =>
//                 row.createdAt
//                   ? new Date(row.createdAt).toLocaleDateString("en-GB", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                   })
//                   : "—",
//             },
//           ]}
//         />

//         <Modal
//           isOpen={isViewModalOpen}
//           onClose={() => setIsViewModalOpen(false)}
//           title="Candidate Applications"
//           // hideFooter
//           className="max-w-3xl"
//         >
//           <div className="space-y-4">
//             <div>
//               <h3 className="font-semibold">
//                 {selectedCandidate?.name}
//               </h3>
//               <p className="text-sm text-gray-500">
//                 {selectedCandidate?.email}
//               </p>
//             </div>

//             <div className="w-full overflow-hidden rounded-lg border">
//               <table className="w-full table-auto">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="p-3 text-left">Job</th>
//                     <th className="p-3 text-left">Applied Date</th>
//                     <th className="p-3 text-center">Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {selectedCandidate?.applications?.map(
//                     (job: any) => (
//                       <tr
//                         key={job.id}
//                         className="border-t"
//                       >
//                         <td className="p-3">
//                           {job.job?.title}
//                         </td>

//                         <td className="p-3">
//                           {job.createdAt
//                             ? new Date(
//                               job.createdAt
//                             ).toLocaleDateString()
//                             : "N/A"}
//                         </td>

//                         <td className="p-3 text-center">
//                           <button
//                             onClick={() =>
//                               router.push(
//                                 `/applicants/applicant-profile/${job?.id}`
//                               )
//                             }
//                             className="rounded-lg bg-brand-500 px-3 py-1 text-white"
//                           >
//                             View Application
//                           </button>
//                         </td>
//                       </tr>
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </Modal>

//            <Snackbar
//              show={snackbar.show}
//              type={snackbar.variant}
//              message={snackbar.message}
//              onClose={() => setSnackbar((s) => ({ ...s, show: false }))}
//            />
//       </div>
//     </div>
//   );
// }

// "use client";

// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import BasicTableOne from "@/components/tables/BasicTableOne";
// import { getUsers, updateUserStatus } from "@/shared/users";
// import React, { useState } from "react";
// import UserDetailDrawer from "@/components/tables/Userdetaildrawer";
// import Snackbar from "@/components/ui/notification";

// export default function UsersPage() {
//   const [search, setSearch] = useState("");
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const [snackbar, setSnackbar] = useState<{
//     show: boolean;
//     variant: "success" | "error" | "warning" | "info";
//     message: string;
//   }>({ show: false, variant: "info", message: "" });

//   const showSnackbar = (
//     variant: "success" | "error" | "warning" | "info",
//     message: string
//   ) => {
//     setSnackbar({ show: false, variant, message });
//     setTimeout(() => setSnackbar({ show: true, variant, message }), 50);
//   };

//   const handleView = (row: any) => {
//     setSelectedUserId(row.id);
//   };

//   const handleStatusToggle = async (row: any) => {
//     const next = row.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
//     try {
//       await updateUserStatus(row.id, next);
//       showSnackbar(
//         "success",
//         `User ${next === "BLOCKED" ? "blocked" : "activated"} successfully`
//       );
//       return true; // signals BasicTableOne to refetch
//     } catch {
//       showSnackbar("error", "Failed to update user status");
//       return false;
//     }
//   };

//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Users" />

//       <div className="space-y-6">
//         <BasicTableOne
//           search={search}
//           onSearchChange={setSearch}
//           fetchFunction={(params) =>
//             getUsers({ ...params }).then((res) => ({
//               data: res.users,
//               total: res.pagination.total,
//             }))
//           }
//           handleView={handleView}
//           handleDelete={async () => false} // disable delete or wire up later
//           columns={[
//             {
//               key: "name",
//               label: "Name",
//               render: (row) => (
//                 <div className="flex items-center gap-2.5">
//                   <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-cyan-400 text-xs font-bold text-white">
//                     {row.name?.slice(0, 2).toUpperCase() ?? "??"}
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-800">{row.name ?? "—"}</p>
//                     <p className="text-xs text-gray-400">{row.email ?? "—"}</p>
//                   </div>
//                 </div>
//               ),
//             },
//             {
//               key: "role",
//               label: "Role",
//               render: (row) => (
//                 <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                   row.role === "ADMIN"
//                     ? "bg-violet-100 text-violet-700"
//                     : "bg-slate-100 text-slate-500"
//                 }`}>
//                   {row.role ?? "—"}
//                 </span>
//               ),
//             },
//             {
//               key: "status",
//               label: "Status",
//               render: (row) => (
//                 <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                   row.status === "ACTIVE"
//                     ? "bg-emerald-100 text-emerald-700"
//                     : "bg-red-100 text-red-600"
//                 }`}>
//                   <span className={`h-1.5 w-1.5 rounded-full ${
//                     row.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
//                   }`} />
//                   {row.status ?? "—"}
//                 </span>
//               ),
//             },
//             {
//               key: "stats.totalSessions",
//               label: "Tests",
//               render: (row) => (
//                 <span className="text-sm font-medium text-gray-700">
//                   {row.stats?.totalSessions ?? 0}
//                 </span>
//               ),
//             },
//             {
//               key: "stats.submitted",
//               label: "Submitted",
//               render: (row) => (
//                 <span className="text-sm font-medium text-emerald-600">
//                   {row.stats?.submitted ?? 0}
//                 </span>
//               ),
//             },
//             {
//               key: "stats.avgScore",
//               label: "Avg Score",
//               render: (row) => {
//                 const score = row.stats?.avgScore ?? 0;
//                 return (
//                   <span className={`text-sm font-semibold ${
//                     score >= 75 ? "text-emerald-600" :
//                     score >= 50 ? "text-amber-500" : "text-slate-400"
//                   }`}>
//                     {score > 0 ? `${score}%` : "—"}
//                   </span>
//                 );
//               },
//             },
//             {
//               key: "createdAt",
//               label: "Joined",
//               render: (row) =>
//                 row.createdAt
//                   ? new Date(row.createdAt).toLocaleDateString("en-GB", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })
//                   : "—",
//             },
//             {
//               key: "action",
//               label: "Block / Activate",
//               render: (row, _i, refetch) => (
//                 <button
//                   onClick={async (e) => {
//                     e.stopPropagation();
//                     const ok = await handleStatusToggle(row);
//                     if (ok && refetch) refetch();
//                   }}
//                   className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
//                     row.status === "ACTIVE"
//                       ? "bg-red-50 text-red-600 hover:bg-red-100"
//                       : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
//                   }`}
//                 >
//                   {row.status === "ACTIVE" ? "Block" : "Activate"}
//                 </button>
//               ),
//             },
//           ]}
//         />
//       </div>

//       {/* Detail drawer */}
//       <UserDetailDrawer
//         userId={selectedUserId}
//         onClose={() => setSelectedUserId(null)}
//         onStatusChange={(userId, status) => {
//           showSnackbar(
//             "success",
//             `User ${status === "BLOCKED" ? "blocked" : "activated"} successfully`
//           );
//         }}
//       />

//       <Snackbar
//         show={snackbar.show}
//         type={snackbar.variant}
//         message={snackbar.message}
//         onClose={() => setSnackbar((s) => ({ ...s, show: false }))}
//       />
//     </div>
//   );
// }

"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { getUsers, updateUserStatus } from "@/shared/users";
import React, { useState } from "react";
import UserDetailDrawer from "@/components/tables/Userdetaildrawer";
import Snackbar from "@/components/ui/notification";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [snackbar, setSnackbar] = useState<{
    show: boolean;
    variant: "success" | "error" | "warning" | "info";
    message: string;
  }>({ show: false, variant: "info", message: "" });

  const showSnackbar = (
    variant: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setSnackbar({ show: false, variant, message });
    setTimeout(() => setSnackbar({ show: true, variant, message }), 50);
  };

  const handleView = (row: any) => {
    setSelectedUserId(row.id);
  };

  const handleStatusToggle = async (e: React.MouseEvent, row: any) => {
    e.stopPropagation();
    if (statusLoadingId === row.id) return;
    const next = row.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setStatusLoadingId(row.id);
    try {
      await updateUserStatus(row.id, next);
      showSnackbar(
        "success",
        `User ${next === "BLOCKED" ? "blocked" : "activated"} successfully`
      );
      // Trigger refetch by bumping the key
      setRefetchTrigger((n) => n + 1);
    } catch {
      showSnackbar("error", "Failed to update user status");
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleDelete = async (_id: string) => {
    return true;
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />

      <div className="space-y-6">
        <BasicTableOne
          key={refetchTrigger}          // remount to force refetch after status change
          search={search}
          onSearchChange={setSearch}
          fetchFunction={(params) =>
            getUsers({ ...params }).then((res) => ({
              data: res.users,
              total: res.pagination.total,
            }))
          }
          handleView={handleView}
          handleDelete={handleDelete}
          // BasicTableOne requires these even when not using create/edit modal
          emptyRow={{ id: "" }}
          modalFields={() => null}
          modalCreateTitle=""
          modalEditTitle=""
          modalCreateLabel=""
          modalEditLabel=""
          columns={[
            {
              key: "name",
              label: "Name",
              render: (row) => (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-cyan-400 text-xs font-bold text-white">
                    {row.name?.slice(0, 2).toUpperCase() ?? "??"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {row.name ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">{row.email ?? "—"}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "role",
              label: "Role",
              render: (row) => (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    row.role === "ADMIN"
                      ? "bg-violet-100 text-violet-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {row.role ?? "—"}
                </span>
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    row.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      row.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {row.status ?? "—"}
                </span>
              ),
            },
            {
              key: "stats",
              label: "Tests",
              render: (row) => (
                <span className="text-sm font-medium text-gray-700">
                  {row.stats?.totalSessions ?? 0}
                </span>
              ),
            },
            {
              key: "submitted",
              label: "Submitted",
              render: (row) => (
                <span className="text-sm font-medium text-emerald-600">
                  {row.stats?.submitted ?? 0}
                </span>
              ),
            },
            {
              key: "avgScore",
              label: "Avg Score",
              render: (row) => {
                const score = row.stats?.avgScore ?? 0;
                return (
                  <span
                    className={`text-sm font-semibold ${
                      score >= 75
                        ? "text-emerald-600"
                        : score >= 50
                        ? "text-amber-500"
                        : "text-slate-400"
                    }`}
                  >
                    {score > 0 ? `${score}%` : "—"}
                  </span>
                );
              },
            },
            {
              key: "createdAt",
              label: "Joined",
              render: (row) =>
                row.createdAt
                  ? new Date(row.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—",
            },
            {
              key: "blockAction",
              label: "Action",
              render: (row) => (
                <button
                  onClick={(e) => handleStatusToggle(e, row)}
                  disabled={statusLoadingId === row.id}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                    row.status === "ACTIVE"
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {statusLoadingId === row.id
                    ? "..."
                    : row.status === "ACTIVE"
                    ? "Block"
                    : "Activate"}
                </button>
              ),
            },
          ]}
        />
      </div>

      <UserDetailDrawer
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onStatusChange={(userId, status) => {
          showSnackbar(
            "success",
            `User ${status === "BLOCKED" ? "blocked" : "activated"} successfully`
          );
          setRefetchTrigger((n) => n + 1);
        }}
      />

      <Snackbar
        show={snackbar.show}
        type={snackbar.variant}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, show: false }))}
      />
    </div>
  );
}