// "use client";

// import { getJobPublicRoute, JobApplying } from "@/shared/jobs";
// import { useEffect, useRef, useState } from "react";


// interface ApplyForm {
//     name: string;
//     email: string;
//     phone: string;
//     totalExperience: string;
//     currentSalary: string;
//     expectedSalary: string;
//     noticePeriod: string;
//     isOnNoticePeriod: boolean;
//     resume: File | null;
// }

// interface FormErrors {
//     name?: string;
//     email?: string;
//     phone?: string;
//     totalExperience?: string;
//     currentSalary?: string;
//     expectedSalary?: string;
//     noticePeriod?: string;
//     resume?: string;
// }


// const validate = (form: ApplyForm): FormErrors => {
//     const e: FormErrors = {};

//     const name = form.name.trim();
//     if (!name) e.name = "Full name is required";
//     else if (name.length < 3) e.name = "Name must be at least 3 characters";
//     else if (name.length > 60) e.name = "Name cannot exceed 60 characters";

//     const email = form.email.trim();
//     if (!email) e.email = "Email address is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
//     else if (email.length > 100) e.email = "Email address is too long";

//     const phone = form.phone.trim().replace(/\s+/g, "");
//     if (!phone) e.phone = "Phone number is required";
//     else if (!/^(?:\+91)?[6-9]\d{9}$/.test(phone)) e.phone = "Enter a valid mobile number";

//     const exp = form.totalExperience.trim();
//     if (!exp) e.totalExperience = "Total experience is required";
//     else {
//         const n = Number(exp);
//         if (isNaN(n)) e.totalExperience = "Experience must be a number";
//         else if (n < 0) e.totalExperience = "Experience cannot be negative";
//         else if (n > 100) e.totalExperience = "Please enter a valid experience";
//     }

//     const cur = form.currentSalary.trim();
//     if (!cur) e.currentSalary = "Current salary is required";
//     else {
//         const n = Number(cur);
//         if (isNaN(n) || n < 0) e.currentSalary = "Enter a valid salary";
//     }

//     const exp2 = form.expectedSalary.trim();
//     if (!exp2) e.expectedSalary = "Expected salary is required";
//     else {
//         const n = Number(exp2);
//         if (isNaN(n) || n < 0) e.expectedSalary = "Enter a valid salary";
//         else if (form.currentSalary && n < Number(form.currentSalary))
//             e.expectedSalary = "Expected salary should be ≥ current salary";
//     }

//     const np = form.noticePeriod.trim();
//     if (!np) e.noticePeriod = "Notice period is required";
//     else {
//         const n = Number(np);
//         if (isNaN(n) || n < 0) e.noticePeriod = "Enter a valid notice period";
//         else if (n > 365) e.noticePeriod = "Notice period seems too long";
//     }

//     if (!form.resume) {
//         e.resume = "Resume upload is required";
//     } else {
//         const allowed = [
//             "application/pdf",
//             "application/msword",
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         ];
//         if (!allowed.includes(form.resume.type)) e.resume = "Only PDF or DOC/DOCX files are allowed";
//         else if (form.resume.size > 5 * 1024 * 1024) e.resume = "Resume size must be less than 5MB";
//     }

//     return e;
// };

// const initForm: ApplyForm = {
//     name: "", email: "", phone: "", totalExperience: "",
//     currentSalary: "", expectedSalary: "", noticePeriod: "",
//     isOnNoticePeriod: false, resume: null,
// };

// const TEXT_FIELDS: { key: keyof ApplyForm; label: string; type: string; placeholder: string }[] = [
//     { key: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
//     { key: "email", label: "Email", type: "email", placeholder: "john@example.com" },
//     { key: "phone", label: "Phone", type: "tel", placeholder: "9876543210" },
//     { key: "totalExperience", label: "Total Experience (yrs)", type: "number", placeholder: "2" },
//     { key: "currentSalary", label: "Current Salary (LPA)", type: "number", placeholder: "300000" },
//     { key: "expectedSalary", label: "Expected Salary (LPA)", type: "number", placeholder: "500000" },
//     { key: "noticePeriod", label: "Notice Period (days)", type: "number", placeholder: "30" },
// ];

// const inputCls = (error?: string) =>
//     `w-full rounded-lg border px-3 py-2 text-sm text-black-900 outline-none transition focus:ring-2 focus:ring-brand-500/20 ${error ? "border-red-400 focus:border-red-400" : "border-black-300 focus:border-brand-500"
//     }`;

// export default function JobDetailsViewer({ job }: { job: string }) {
//     const [jobDetails, setJobDetails] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [form, setForm] = useState<ApplyForm>(initForm);
//     const [errors, setErrors] = useState<FormErrors>({});
//     const [submitting, setSubmitting] = useState(false);
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     useEffect(() => {
//         const fetch = async () => {
//             console.log(job)
//             setLoading(true);
//             const data = await getJobPublicRoute(job);
//             setJobDetails(data.data);
//             setLoading(false);
//         };
//         fetch();
//     }, [job]);

//     if (loading) return (
//         <div className="flex min-h-screen items-center justify-center p-10">
//             <p className="text-lg font-medium text-black-500">Loading...</p>
//         </div>
//     );

//     if (!jobDetails) return (
//         <div className="flex min-h-screen items-center justify-center p-10">
//             <p className="text-lg font-medium text-black-500">Job not found.</p>
//         </div>
//     );

//     // ─── Handlers ────────────────────────────────────────────────────────────

//     const setField = (key: keyof ApplyForm, value: string | boolean) => {
//         setForm(p => ({ ...p, [key]: value }));
//         setErrors(p => ({ ...p, [key]: undefined }));
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] ?? null;
//         setForm(p => ({ ...p, resume: file }));
//         setErrors(p => ({ ...p, resume: undefined }));
//     };

//     const handleSubmit = async () => {
//         const errs = validate(form);
//         if (Object.keys(errs).length) { setErrors(errs); return; }
//         try {
//             setSubmitting(true);
//             console.log({ ...form, jobSlug: jobDetails.slug });
//             const formData = new FormData();
//             formData.append("name", form.name);
//             formData.append("email", form.email);
//             formData.append("phone", form.phone);
//             formData.append("totalExperience", form.totalExperience);
//             formData.append("currentSalary", form.currentSalary);
//             formData.append("expectedSalary", form.expectedSalary);
//             formData.append("noticePeriod", form.noticePeriod);
//             formData.append("isOnNoticePeriod", form.isOnNoticePeriod ? "true" : "false");
//             if (form.resume) formData.append("resume", form.resume);

//             const result = await JobApplying(formData, jobDetails.id);
//             console.log("result", result);
//             if (result.success) {
//                 alert("Application submitted successfully!");
//                 setForm(initForm);
//                 if (fileInputRef.current) fileInputRef.current.value = "";
//             } else {
//                 alert("Failed to submit application. Please try again later.");
//             }
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // ─── Render ──────────────────────────────────────────────────────────────

//     return (
//         <div className="mx-auto w-full px-4 py-8 md:px-6 xl:px-24 md:py-10">
//             <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

//                 {/* ── Left: Job Details ── */}
//                 <div className="flex-1 overflow-hidden rounded-2xl border border-black-200 bg-white shadow-sm">
//                     <div className="border-b border-black p-6 md:p-8">
//                         <h1 className="text-2xl font-bold text-black-900 md:text-3xl">{jobDetails.title}</h1>

//                         <div className="mt-3 flex flex-wrap gap-2">
//                             {jobDetails.employmentType && (
//                                 <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-black-600">
//                                     {jobDetails.employmentType}
//                                 </span>
//                             )}
//                         </div>

//                         {jobDetails.requiredSkills?.length > 0 && (
//                             <div className="mt-4">
//                                 <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black-400">Skills</p>
//                                 <div className="flex flex-wrap gap-2">
//                                     {jobDetails.requiredSkills.map((skill: string) => (
//                                         <span key={skill} className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
//                                             {skill}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
//                             {[
//                                 { label: "Work Mode", value: jobDetails.workMode },
//                                 { label: "Experience", value: `${jobDetails.experienceMin}–${jobDetails.experienceMax} yrs` },
//                                 { label: "Place", value: jobDetails.location, span: true },
//                             ].map(({ label, value, span }) => (
//                                 <div key={label} className={span ? "col-span-2" : ""}>
//                                     <p className="text-xs font-semibold uppercase tracking-wide text-black-400">{label}</p>
//                                     <p className="mt-0.5 text-black-600">{value}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="p-6 md:p-8">
//                         <h2 className="mb-4 text-lg font-semibold text-black-900">Job Description</h2>
//                         <div dangerouslySetInnerHTML={{ __html: jobDetails.jdHtml }} className="prose max-w-none" />
//                     </div>
//                 </div>

//                 {/* ── Right: Apply Card ── */}
//                 <div className="w-full lg:w-[300px] xl:w-[340px]">
//                     <div className="rounded-2xl border border-black-200 bg-white p-6 shadow-sm">
//                         <h2 className="mb-5 text-lg font-semibold text-black-900">Apply Now</h2>

//                         <div className="space-y-4">

//                             {/* Text / Number fields */}
//                             {TEXT_FIELDS.map(({ key, label, type, placeholder }) => (
//                                 <div key={key}>
//                                     <label className="mb-1 block text-sm font-medium text-black-700">{label}</label>
//                                     <input
//                                         type={type}
//                                         placeholder={placeholder}
//                                         value={form[key] as string}
//                                         onChange={e => setField(key, e.target.value)}
//                                         className={inputCls(errors[key as keyof FormErrors])}
//                                     />
//                                     {errors[key as keyof FormErrors] && (
//                                         <p className="mt-1 text-xs text-red-500">{errors[key as keyof FormErrors]}</p>
//                                     )}
//                                 </div>
//                             ))}

//                             {/* On Notice Period — radio */}
//                             <div>
//                                 <p className="mb-2 text-sm font-medium text-black-700">Currently on Notice Period?</p>
//                                 <div className="flex gap-6">
//                                     {[
//                                         { label: "Yes", value: true },
//                                         { label: "No", value: false },
//                                     ].map(({ label, value }) => (
//                                         <label key={label} className="flex cursor-pointer items-center gap-2">
//                                             <input
//                                                 type="radio"
//                                                 name="isOnNoticePeriod"
//                                                 checked={form.isOnNoticePeriod === value}
//                                                 onChange={() => setField("isOnNoticePeriod", value)}
//                                                 className="h-4 w-4 accent-brand-500"
//                                             />
//                                             <span className="text-sm text-black-700">{label}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Resume Upload */}
//                             <div>
//                                 <label className="mb-1 block text-sm font-medium text-black-700">Resume</label>
//                                 <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${errors.resume
//                                     ? "border-red-400 bg-red-50"
//                                     : "border-black-300 hover:border-brand-400 hover:bg-brand-50"
//                                     }`}>
//                                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${errors.resume ? "text-red-400" : "text-black-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" />
//                                     </svg>
//                                     <span className={`text-xs ${errors.resume ? "text-red-500" : "text-black-500"}`}>
//                                         {form.resume ? form.resume.name : "Resume (pdf, docx) · max 5MB"}
//                                     </span>
//                                     <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
//                                 </label>
//                                 {errors.resume && <p className="mt-1 text-xs text-red-500">{errors.resume}</p>}
//                             </div>

//                         </div>

//                         <button
//                             onClick={handleSubmit}
//                             disabled={submitting}
//                             className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-brand-500 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             {submitting ? "Submitting..." : "Apply Now"}
//                         </button>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// }

"use client";

import { getJobPublicRoute, JobApplying } from "@/shared/jobs";
import { useEffect, useRef, useState } from "react";
import { X, Paperclip, ArrowRight, Briefcase, MapPin, Clock } from "lucide-react";

interface ApplyForm {
    name: string;
    email: string;
    phone: string;
    totalExperience: string;
    currentSalary: string;
    expectedSalary: string;
    noticePeriod: string;
    isOnNoticePeriod: boolean;
    resume: File | null;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    totalExperience?: string;
    currentSalary?: string;
    expectedSalary?: string;
    noticePeriod?: string;
    resume?: string;
}

const validate = (form: ApplyForm): FormErrors => {
    const e: FormErrors = {};
    const name = form.name.trim();
    if (!name) e.name = "Full name is required";
    else if (name.length < 3) e.name = "Name must be at least 3 characters";
    else if (name.length > 60) e.name = "Name cannot exceed 60 characters";

    const email = form.email.trim();
    if (!email) e.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    else if (email.length > 100) e.email = "Email address is too long";

    const phone = form.phone.trim().replace(/\s+/g, "");
    if (!phone) e.phone = "Phone number is required";
    else if (!/^(?:\+91)?[6-9]\d{9}$/.test(phone)) e.phone = "Enter a valid mobile number";

    const exp = form.totalExperience.trim();
    if (!exp) e.totalExperience = "Total experience is required";
    else { const n = Number(exp); if (isNaN(n)) e.totalExperience = "Must be a number"; else if (n < 0) e.totalExperience = "Cannot be negative"; else if (n > 100) e.totalExperience = "Enter a valid value"; }

    const cur = form.currentSalary.trim();
    if (!cur) e.currentSalary = "Current salary is required";
    else { const n = Number(cur); if (isNaN(n) || n < 0) e.currentSalary = "Enter a valid salary"; }

    const exp2 = form.expectedSalary.trim();
    if (!exp2) e.expectedSalary = "Expected salary is required";
    else { const n = Number(exp2); if (isNaN(n) || n < 0) e.expectedSalary = "Enter a valid salary"; else if (form.currentSalary && n < Number(form.currentSalary)) e.expectedSalary = "Expected salary should be ≥ current salary"; }

    const np = form.noticePeriod.trim();
    if (!np) e.noticePeriod = "Notice period is required";
    else { const n = Number(np); if (isNaN(n) || n < 0) e.noticePeriod = "Enter a valid notice period"; else if (n > 365) e.noticePeriod = "Notice period seems too long"; }

    if (!form.resume) {
        e.resume = "Resume upload is required";
    } else {
        const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!allowed.includes(form.resume.type)) e.resume = "Only PDF or DOC/DOCX files are allowed";
        else if (form.resume.size > 5 * 1024 * 1024) e.resume = "Resume size must be less than 5MB";
    }
    return e;
};

const initForm: ApplyForm = {
    name: "", email: "", phone: "", totalExperience: "",
    currentSalary: "", expectedSalary: "", noticePeriod: "",
    isOnNoticePeriod: false, resume: null,
};

const inputCls = (error?: string) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-black outline-none transition focus:ring-2 focus:ring-blue-500/20 ${error ? "border-red-400 focus:border-red-400" : "border-black focus:border-blue-600"}`;


interface ApplyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    jobSlug: string;
    jobTitle: string;
}

function ApplyDrawer({ isOpen, onClose, jobId, jobSlug, jobTitle }: ApplyDrawerProps) {
    const [form, setForm] = useState<ApplyForm>(initForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const setField = (key: keyof ApplyForm, value: string | boolean) => {
        setForm(p => ({ ...p, [key]: value }));
        setErrors(p => ({ ...p, [key]: undefined }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setForm(p => ({ ...p, resume: file }));
        setErrors(p => ({ ...p, resume: undefined }));
    };

    const handleSubmit = async () => {
        const errs = validate(form);
        if (Object.keys(errs).length) { setErrors(errs); return;  }
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("phone", form.phone);
            formData.append("totalExperience", form.totalExperience);
            formData.append("currentSalary", form.currentSalary);
            formData.append("expectedSalary", form.expectedSalary);
            formData.append("noticePeriod", form.noticePeriod);
            formData.append("isOnNoticePeriod", form.isOnNoticePeriod ? "true" : "false");
            if (form.resume) formData.append("resume", form.resume);

            const result = await JobApplying(formData, jobId);
            if (result.success) {
                alert("Application submitted successfully!");
                setForm(initForm);
                if (fileInputRef.current) fileInputRef.current.value = "";
                onClose();
            } else {
                alert("Failed to submit application. Please try again later.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${isOpen ? "opacity" : "opacity-0 pointer-events-none"}`}
            />

            <div
                className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-start justify-between border-b border-black px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-black">Apply Now</h2>
                        <p className="mt-0.5 text-sm text-black">{jobTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 rounded-lg p-1.5 text-black transition hover:bg-gray-300 hover:text-black"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <div className="space-y-4">

                        <div>
                            <label className="mb-1 block text-sm font-medium text-black">Full Name</label>
                            <input type="text" placeholder="John Doe" value={form.name}
                                onChange={e => setField("name", e.target.value)} className={inputCls(errors.name)} />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">Email</label>
                                <input type="email" placeholder="john@example.com" value={form.email}
                                    onChange={e => setField("email", e.target.value)} className={inputCls(errors.email)} />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">Phone</label>
                                <input type="tel" placeholder="9876543210" value={form.phone}
                                    onChange={e => setField("phone", e.target.value)} className={inputCls(errors.phone)} />
                                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">Experience (yrs)</label>
                                <input type="number" placeholder="2" value={form.totalExperience}
                                    onChange={e => setField("totalExperience", e.target.value)} className={inputCls(errors.totalExperience)} />
                                {errors.totalExperience && <p className="mt-1 text-xs text-red-500">{errors.totalExperience}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">Notice Period (days)</label>
                                <input type="number" placeholder="30" value={form.noticePeriod}
                                    onChange={e => setField("noticePeriod", e.target.value)} className={inputCls(errors.noticePeriod)} />
                                {errors.noticePeriod && <p className="mt-1 text-xs text-red-500">{errors.noticePeriod}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">Current Salary (LPA)</label>
                                <input type="number" placeholder="300000" value={form.currentSalary}
                                    onChange={e => setField("currentSalary", e.target.value)} className={inputCls(errors.currentSalary)} />
                                {errors.currentSalary && <p className="mt-1 text-xs text-red-500">{errors.currentSalary}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black">Expected Salary (LPA)</label>
                                <input type="number" placeholder="500000" value={form.expectedSalary}
                                    onChange={e => setField("expectedSalary", e.target.value)} className={inputCls(errors.expectedSalary)} />
                                {errors.expectedSalary && <p className="mt-1 text-xs text-red-500">{errors.expectedSalary}</p>}
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-black">Currently on Notice Period?</p>
                            <div className="flex gap-6">
                                {([{ label: "Yes", value: true }, { label: "No", value: false }] as const).map(({ label, value }) => (
                                    <label key={label} className="flex cursor-pointer items-center gap-2">
                                        <input type="radio" name="isOnNoticePeriod"
                                            checked={form.isOnNoticePeriod === value}
                                            onChange={() => setField("isOnNoticePeriod", value)}
                                            className="h-4 w-4 accent-blue-600" />
                                        <span className="text-sm text-black">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-black">Resume</label>
                            <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${errors.resume ? "border-red-400 bg-red-50" : "border-black hover:border-blue-500 hover:bg-blue-50"}`}>
                                <Paperclip size={22} className={errors.resume ? "text-red-400" : "text-black-400"} />
                                <span className={`text-xs ${errors.resume ? "text-red-500" : "text-black-500"}`}>
                                    {form.resume ? form.resume.name : "Attach resume (PDF, DOC, DOCX · max 5 MB)"}
                                </span>
                                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                            </label>
                            {errors.resume && <p className="mt-1 text-xs text-red-500">{errors.resume}</p>}
                        </div>

                    </div>
                </div>

                <div className="border-t border-black px-6 py-4">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Submitting..." : (
                            <> Submit Application <ArrowRight size={16} /> </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}


export default function JobDetailsViewer({ job }: { job: string }) {
    const [jobDetails, setJobDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await getJobPublicRoute(job);
            setJobDetails(data.data);
            setLoading(false);
        };
        fetch();
    }, [job]);

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center p-10">
            <p className="text-lg font-medium text-black">Loading...</p>
        </div>
    );

    if (!jobDetails) return (
        <div className="flex min-h-screen items-center justify-center p-10">
            <p className="text-lg font-medium text-black">Job not found.</p>
        </div>
    );

    return (
        <>
            <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-10">

                <div className="overflow-hidden rounded-2xl  bg-white shadow-sm">
                    <div className="border-b border-black p-6 md:p-8">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <h1 className="text-2xl font-bold text-black md:text-3xl">
                                {jobDetails.title}
                            </h1>
                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="hidden sm:flex shrink-0 items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                            >
                                Apply Now <ArrowRight size={15} />
                            </button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {jobDetails.employmentType && (
                                <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-black">
                                    {jobDetails.employmentType}
                                </span>
                            )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-black">
                            {jobDetails.workMode && (
                                <span className="flex items-center gap-1.5">
                                    <Briefcase size={14} /> {jobDetails.workMode}
                                </span>
                            )}
                            {jobDetails.experienceMin != null && (
                                <span className="flex items-center gap-1.5">
                                    <Clock size={14} /> {jobDetails.experienceMin}–{jobDetails.experienceMax} yrs
                                </span>
                            )}
                            {jobDetails.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} /> {jobDetails.location}
                                </span>
                            )}
                        </div>

                        {jobDetails.requiredSkills?.length > 0 && (
                            <div className="mt-4">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {jobDetails.requiredSkills.map((skill: string) => (
                                        <span key={skill} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-8">
                        <h2 className="mb-4 text-lg font-semibold text-black">Job Description</h2>
                        <div
                            dangerouslySetInnerHTML={{ __html: jobDetails.jdHtml }}
                            className="prose max-w-none text-black"
                        />
                    </div>

                    <div className="border-t border-black p-6 md:p-8">
                        <section className="space-y-4 !mb-10">
                            <h3 className="text-3xl !font-semibold color-[#2a4448] mb-5">
                                Join the team
                            </h3>
                            <p className="leading-relaxed color-[#2a4448]">
                                Thank you for your keen interest in becoming a part of Irish Expert. We're eagerly looking forward to gaining deeper insights
                                into your candidacy through this application.
                            </p>
                        </section>
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                        >
                            Apply for this role <ArrowRight size={15} />
                        </button>
                    </div>
                </div>

            </div>

            <ApplyDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                jobId={jobDetails.id}
                jobSlug={jobDetails.slug}
                jobTitle={jobDetails.title}
            />
        </>
    );
}