"use client";

import React, { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Briefcase, GraduationCap, Pencil, Plus, Trash2, User } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type TabType = "basic" | "education" | "experience";

interface EducationItem {
    collegeName: string; degree: string; specialization: string;
    graduationYear: string; cgpa: string;
}

interface ExperienceItem {
    companyName: string; designation: string; totalExperience: string;
    currentCTC: string; expectedCTC: string;
}

interface FormErrors { [key: string]: string }

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_ITEMS = 3;

const initEducation: EducationItem = { collegeName: "", degree: "", specialization: "", graduationYear: "", cgpa: "" };
const initExperience: ExperienceItem = { companyName: "", designation: "", totalExperience: "", currentCTC: "", expectedCTC: "" };

const TABS = [
    { key: "basic", label: "Basic Details", icon: User },
    { key: "education", label: "Education", icon: GraduationCap },
    { key: "experience", label: "Experience", icon: Briefcase },
] as const;

// ─── Field Configs ────────────────────────────────────────────────────────────

const BASIC_FIELDS: { key: string; label: string; placeholder: string; type: string; full?: boolean }[] = [
    { key: "firstName", label: "First Name", placeholder: "John", type: "text" },
    { key: "lastName", label: "Last Name", placeholder: "Doe", type: "text" },
    { key: "email", label: "Email", placeholder: "john@example.com", type: "email" },
    { key: "phone", label: "Phone", placeholder: "9876543210", type: "tel" },
    { key: "location", label: "Location", placeholder: "Bangalore", type: "text", full: true },
];

const EDU_FIELDS = [
    { key: "collegeName", label: "College Name", placeholder: "ABC College", type: "text" },
    { key: "degree", label: "Degree", placeholder: "B.Tech", type: "text" },
    { key: "specialization", label: "Specialization", placeholder: "Computer Science", type: "text" },
    { key: "graduationYear", label: "Graduation Year", placeholder: "2025", type: "number" },
    { key: "cgpa", label: "CGPA", placeholder: "8.5", type: "text" },
] as const;

const EXP_FIELDS = [
    { key: "companyName", label: "Company Name", placeholder: "Google", type: "text" },
    { key: "designation", label: "Designation", placeholder: "Frontend Developer", type: "text" },
    { key: "totalExperience", label: "Total Experience", placeholder: "2", type: "number" },
    { key: "currentCTC", label: "Current CTC", placeholder: "5 LPA", type: "text" },
    { key: "expectedCTC", label: "Expected CTC", placeholder: "8 LPA", type: "text" },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

function JobApplyingForm() {
    const [activeTab, setActiveTab] = useState<TabType>("basic");
    const [loading, setLoading] = useState(false);
    const [editEduIdx, setEditEduIdx] = useState<number | null>(null);
    const [editExpIdx, setEditExpIdx] = useState<number | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});

    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", phone: "", location: "",
        education: [] as EducationItem[],
        experiences: [] as ExperienceItem[],
        currentEducation: initEducation,
        currentExperience: initExperience,
    });

    // ─── Field Updates ──────────────────────────────────────────────────────────

    const setField = (key: string, value: string) => {
        setForm(p => ({ ...p, [key]: value }));
        setErrors(p => ({ ...p, [key]: "" }));
    };

    const setEduField = (key: keyof EducationItem, value: string) =>
        setForm(p => ({ ...p, currentEducation: { ...p.currentEducation, [key]: value } }));

    const setExpField = (key: keyof ExperienceItem, value: string) =>
        setForm(p => ({ ...p, currentExperience: { ...p.currentExperience, [key]: value } }));

    // ─── Validations ────────────────────────────────────────────────────────────

    const validateBasic = () => {
        const e: FormErrors = {};
        if (!form.firstName.trim()) e.firstName = "First name is required";
        if (!form.lastName.trim()) e.lastName = "Last name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
        if (!form.phone.trim()) e.phone = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(form.phone)) e.phone = "Enter a valid 10 digit number";
        if (!form.location.trim()) e.location = "Location is required";
        return e;
    };

    const validateEducation = () => {
        const d = form.currentEducation;
        const e: FormErrors = {};
        if (!d.collegeName.trim()) e.collegeName = "College name is required";
        if (!d.degree.trim()) e.degree = "Degree is required";
        if (!d.specialization.trim()) e.specialization = "Specialization is required";
        if (!d.graduationYear.trim()) e.graduationYear = "Graduation year is required";
        else {
            const y = Number(d.graduationYear), cur = new Date().getFullYear();
            if (y < 1980 || y > cur + 10) e.graduationYear = "Enter a valid year";
        }
        return e;
    };

    const validateExperience = () => {
        const d = form.currentExperience;
        const e: FormErrors = {};
        if (!d.companyName.trim()) e.companyName = "Company name is required";
        if (!d.designation.trim()) e.designation = "Designation is required";
        if (!d.totalExperience.trim()) e.totalExperience = "Experience is required";
        return e;
    };

    // ─── Add / Edit / Delete (generic) ──────────────────────────────────────────

    const handleAdd = (
        type: "education" | "experiences",
        current: EducationItem | ExperienceItem,
        init: typeof initEducation | typeof initExperience,
        validate: () => FormErrors,
        editIdx: number | null,
        setEditIdx: (v: number | null) => void
    ) => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setForm(p => {
            const list = [...p[type]] as any[];
            if (editIdx !== null) list[editIdx] = current;
            else if (list.length < MAX_ITEMS) list.push(current);
            return {
                ...p,
                [type]: list,
                [type === "education" ? "currentEducation" : "currentExperience"]: init,
            };
        });

        setEditIdx(null);
        setErrors({});
    };

    const handleEdit = (
        type: "education" | "experiences",
        index: number,
        setEditIdx: (v: number) => void
    ) => {
        const key = type === "education" ? "currentEducation" : "currentExperience";
        setForm(p => ({ ...p, [key]: (p[type] as any[])[index] }));
        setEditIdx(index);
    };

    const handleDelete = (
        type: "education" | "experiences",
        index: number,
        editIdx: number | null,
        setEditIdx: (v: number | null) => void,
        init: typeof initEducation | typeof initExperience
    ) => {
        setForm(p => ({ ...p, [type]: (p[type] as any[]).filter((_, i) => i !== index) }));
        if (editIdx === index) {
            setEditIdx(null);
            const key = type === "education" ? "currentEducation" : "currentExperience";
            setForm(p => ({ ...p, [key]: init }));
        }
    };

    // ─── Navigation ─────────────────────────────────────────────────────────────

    const handleNext = () => {
        if (activeTab === "basic") {
            const errs = validateBasic();
            if (Object.keys(errs).length) { setErrors(errs); return; }
            setActiveTab("education");
        } else if (activeTab === "education") {
            if (!form.education.length) { setErrors({ education: "Add at least one education" }); return; }
            setActiveTab("experience");
        }
        setErrors({});
    };

    const handleBack = () => {
        if (activeTab === "education") setActiveTab("basic");
        else if (activeTab === "experience") setActiveTab("education");
    };

    // ─── Submit ──────────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!form.experiences.length) { setErrors({ experience: "Add at least one experience" }); return; }
        try {
            setLoading(true);
            const { currentEducation: _ce, currentExperience: _cx, ...payload } = form;
            console.log(payload, "APPLICATION PAYLOAD");
            // API CALL HERE
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ─── Render ──────────────────────────────────────────────────────────────────

    const btnBase = "flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition";

    return (
        <div className="mx-auto w-full max-w-[75rem] px-4 py-6 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[clamp(1.875rem,4vw,3rem)] font-bold text-gray-900">Job Application</h1>
                    <p className="mt-2 text-sm text-gray-500 sm:text-base">Complete all steps to submit your application.</p>
                </div>

                {/* Tabs */}
                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {TABS.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key} type="button"
                            onClick={() => setActiveTab(key as TabType)}
                            className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${activeTab === key ? "border-brand-500 bg-brand-500 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-brand-300"}`}
                        >
                            <Icon size={18} /> {label}
                        </button>
                    ))}
                </div>

                {/* Basic Tab */}
                {activeTab === "basic" && (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {BASIC_FIELDS.map(({ key, label, placeholder, type, full }) => (
                            <div key={key} className={full ? "sm:col-span-2" : ""}>
                                <Label>{label}</Label>
                                <Input type={type} placeholder={placeholder} value={(form as any)[key]}
                                    onChange={e => setField(key, e.target.value)} />
                                {errors[key] && <p className="mt-1 text-sm text-red-500">{errors[key]}</p>}
                            </div>
                        ))}
                    </div>
                )}

                {/* Education Tab */}
                {activeTab === "education" && (
                    <div className="space-y-8">
                        <div className="grid gap-6 sm:grid-cols-2">
                            {EDU_FIELDS.map(({ key, label, placeholder, type }) => (
                                <div key={key}>
                                    <Label>{label}</Label>
                                    <Input type={type} placeholder={placeholder}
                                        value={(form.currentEducation as any)[key]}
                                        onChange={e => setEduField(key as keyof EducationItem, e.target.value)} />
                                    {errors[key] && <p className="mt-1 text-sm text-red-500">{errors[key]}</p>}
                                </div>
                            ))}
                        </div>

                        <button type="button"
                            onClick={() => handleAdd("education", form.currentEducation, initEducation, validateEducation, editEduIdx, setEditEduIdx)}
                            disabled={form.education.length >= MAX_ITEMS && editEduIdx === null}
                            className={`${btnBase} bg-brand-500 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                        <Plus size={18} /> {editEduIdx !== null ? "Update Education" : "Add Education"}
                        </button>
                        {errors.education && <p className="text-sm text-red-500">{errors.education}</p>}

                        <div className="space-y-4">
                            {form.education.map((item, i) => (
                                <ItemCard key={i}
                                    title={`${item.degree} - ${item.specialization}`}
                                    subtitle={item.collegeName}
                                    meta={`Graduation: ${item.graduationYear}`}
                                    onEdit={() => handleEdit("education", i, setEditEduIdx)}
                                    onDelete={() => handleDelete("education", i, editEduIdx, setEditEduIdx, initEducation)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience Tab */}
                {activeTab === "experience" && (
                    <div className="space-y-8">
                        <div className="grid gap-6 sm:grid-cols-2">
                            {EXP_FIELDS.map(({ key, label, placeholder, type }) => (
                                <div key={key}>
                                    <Label>{label}</Label>
                                    <Input type={type} placeholder={placeholder}
                                        value={(form.currentExperience as any)[key]}
                                        onChange={e => setExpField(key as keyof ExperienceItem, e.target.value)} />
                                    {errors[key] && <p className="mt-1 text-sm text-red-500">{errors[key]}</p>}
                                </div>
                            ))}
                        </div>

                        <button type="button"
                            onClick={() => handleAdd("experiences", form.currentExperience, initExperience, validateExperience, editExpIdx, setEditExpIdx)}
                            disabled={form.experiences.length >= MAX_ITEMS && editExpIdx === null}
                            className={`${btnBase} bg-brand-500 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            <Plus size={18} /> {editExpIdx !== null ? "Update Experience" : "Add Experience"}
                        </button>

                        {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}

                        <div className="space-y-4">
                            {form.experiences.map((item, i) => (
                                <ItemCard key={i}
                                    title={item.designation}
                                    subtitle={item.companyName}
                                    meta={`${item.totalExperience} years experience`}
                                    onEdit={() => handleEdit("experiences", i, setEditExpIdx)}
                                    onDelete={() => handleDelete("experiences", i, editExpIdx, setEditExpIdx, initExperience)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={handleBack} disabled={activeTab === "basic"}
                        className="flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                        Back
                    </button>

                    {activeTab !== "experience" ? (
                        <button type="button" onClick={handleNext}
                            className="flex min-h-[44px] items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600">
                            Next
                        </button>
                    ) : (
                        <button type="button" onClick={handleSubmit} disabled={loading}
                            className="flex min-h-[44px] items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
                            {loading ? "Submitting..." : "Submit Application"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── ItemCard ─────────────────────────────────────────────────────────────────

function ItemCard({ title, subtitle, meta, onEdit, onDelete }: {
    title: string; subtitle: string; meta: string;
    onEdit: () => void; onDelete: () => void;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                    <p className="mt-1 text-sm text-gray-500">{meta}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={onEdit} aria-label="Edit"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100">
                        <Pencil size={16} />
                    </button>
                    <button type="button" onClick={onDelete} aria-label="Delete"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JobApplyingForm;