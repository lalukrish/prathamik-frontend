"use client";

import React, { useEffect, useState, KeyboardEvent } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { createJob, updateJob } from "@/shared/jobs";
import { useRouter } from "next/navigation";
import { getRecruitersByOrg } from "@/shared/user";
import DatePicker from "../form/date-picker";

const JobEditor = dynamic(() => import("./jobEditor"), {
    ssr: false,
});


const MAX_SKILLS = 5;

interface JobFormSectionProps {
    initialData?: {
        id?: string;
        title?: string;
        jdHtml?: string;
        requiredSkills?: string[];
        niceToHave?: string[];
        experienceMin?: number;
        experienceMax?: number;

        lastDate?: string;
        workMode?: string;
        location?: string;
        recruiters?: string[]
    };
    isEdit?: boolean;
}

interface FormData {
    title: string;
    description: string;
    requiredSkills: string[];
    niceToHave: string[];
    experienceMin: string;
    experienceMax: string;

    lastDate: string;
    workMode: string;
    location: string;
    recruiters: string[]
}

interface FormErrors {
    title?: string;
    description?: string;
    requiredSkills?: string;
    niceToHave?: string;
    experienceMin?: string;
    experienceMax?: string;
    lastDate?: string;
    workMode?: string;
    location?: string;
    recruiters?: string;

}

function TagInput({
    placeholder,
    tags,
    onAdd,
    onRemove,
}: {
    placeholder: string;
    tags: string[];
    onAdd: (tag: string) => void;
    onRemove: (index: number) => void;
}) {
    const [input, setInput] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();

            const trimmed = input.trim().replace(/,$/, "");

            if (
                trimmed &&
                tags.length < MAX_SKILLS &&
                !tags.includes(trimmed)
            ) {
                onAdd(trimmed);
                setInput("");
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                    tags.length >= MAX_SKILLS
                        ? `Max ${MAX_SKILLS} items`
                        : placeholder
                }
                disabled={tags.length >= MAX_SKILLS}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30"
            />

            {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                        >
                            {tag}

                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="flex items-center justify-center rounded-full hover:text-brand-800 dark:hover:text-brand-200"
                                aria-label={`Remove ${tag}`}
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <p className="mt-1 text-xs text-gray-400">
                {tags.length}/{MAX_SKILLS} — Press Enter or comma to add
            </p>
        </div>
    );
}

function JobFormSection({
    initialData,
    isEdit = false,
}: JobFormSectionProps) {
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        requiredSkills: [],
        niceToHave: [],
        experienceMin: "",
        experienceMax: "",

        lastDate: "",
        workMode: "",
        location: "",
        recruiters: [],

    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [recruiters, setRecruiters] = useState<{ id: string; name: string }[]>([]);
    const [selectedRecruiters, setSelectedRecruiters] = useState<string[]>([]);

    useEffect(() => {
        const fetchRecruiters = async () => {
            try {
                const res = await getRecruitersByOrg();
                setRecruiters(res.data);
            } catch (err) {
                console.error("Failed to fetch recruiters", err);
            }
        };
        fetchRecruiters();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                description: initialData.jdHtml || "",
                requiredSkills: initialData.requiredSkills || [],
                niceToHave: initialData.niceToHave || [],
                experienceMin:
                    initialData.experienceMin?.toString() || "",
                experienceMax:
                    initialData.experienceMax?.toString() || "",

                lastDate: initialData.lastDate
                    ? new Date(initialData.lastDate)
                        .toISOString()
                        .split("T")[0]
                    : "",

                workMode: initialData.workMode || "",
                location: initialData.location || "",
                recruiters: initialData.recruiters ?? [],

            });
        }
    }, [initialData]);

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Job title is required";
        } else if (formData.title.trim().length < 2) {
            newErrors.title =
                "Job title must be at least 2 characters";
        } else if (formData.title.trim().length > 150) {
            newErrors.title =
                "Job title cannot exceed 150 characters";
        }

        const plainText = formData.description
            .replace(/<[^>]*>/g, "")
            .trim();

        if (!plainText) {
            newErrors.description =
                "Job description is required";
        } else if (plainText.length < 10) {
            newErrors.description =
                "Job description must be at least 10 characters";
        }

        const min = Number(formData.experienceMin);
        const max = Number(formData.experienceMax);

        if (formData.experienceMin === "") {
            newErrors.experienceMin =
                "Minimum experience is required";
        } else if (min < 0) {
            newErrors.experienceMin =
                "Minimum experience cannot be negative";
        } else if (min > 100) {
            newErrors.experienceMin =
                "Minimum experience cannot exceed 100 years";
        }

        if (formData.experienceMax === "") {
            newErrors.experienceMax =
                "Maximum experience is required";
        } else if (max < 0) {
            newErrors.experienceMax =
                "Maximum experience cannot be negative";
        } else if (max > 100) {
            newErrors.experienceMax =
                "Maximum experience cannot exceed 100 years";
        } else if (
            formData.experienceMin !== "" &&
            max < min
        ) {
            newErrors.experienceMax =
                "Maximum must be greater than minimum";
        }

        if (formData.requiredSkills.length === 0) {
            newErrors.requiredSkills =
                "At least one required skill is needed";
        }

        if (formData.niceToHave.length === 0) {
            newErrors.niceToHave =
                "At least one skill is needed in nice to have";
        }

        if (!formData.lastDate) {
            newErrors.lastDate =
                "Application deadline is required";
        } else {
            const dateRegex =
                /^\d{4}-\d{2}-\d{2}$/;

            if (!dateRegex.test(formData.lastDate)) {
                newErrors.lastDate =
                    "Invalid date format";
            } else {
                const selectedDate = new Date(
                    formData.lastDate
                );

                const today = new Date();

                today.setHours(0, 0, 0, 0);

                if (isNaN(selectedDate.getTime())) {
                    newErrors.lastDate =
                        "Please enter a valid date";
                } else if (selectedDate < today) {
                    newErrors.lastDate =
                        "Application deadline cannot be in the past";
                } else {
                    const year =
                        selectedDate.getFullYear();

                    if (
                        year < 2000 ||
                        year > 2100
                    ) {
                        newErrors.lastDate =
                            "Please enter a valid year";
                    }
                }
            }
        }

        if (!formData.workMode.trim()) {
            newErrors.workMode = "Work mode is required";
        } else {
            const allowedModes = [
                "Remote",
                "Hybrid",
                "Onsite",
            ];

            if (
                !allowedModes.includes(
                    formData.workMode.trim()
                )
            ) {
                newErrors.workMode =
                    "Please select a valid work mode";
            }
        }

        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
        } else if (
            formData.location.trim().length < 2
        ) {
            newErrors.location =
                "Location must be at least 2 characters";
        } else if (
            formData.location.trim().length > 100
        ) {
            newErrors.location =
                "Location cannot exceed 100 characters";
        }
        if (formData.recruiters.length === 0) {
            newErrors.recruiters = "At least one recruiter must be assigned";
        }
        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const payload = {
                title: formData.title.trim(),
                jdHtml: formData.description,
                requiredSkills: formData.requiredSkills,
                niceToHave: formData.niceToHave,

                experienceMin:
                    formData.experienceMin !== ""
                        ? Number(formData.experienceMin)
                        : undefined,

                experienceMax:
                    formData.experienceMax !== ""
                        ? Number(formData.experienceMax)
                        : undefined,

                lastDate: new Date(formData.lastDate).toISOString(),
                workMode: formData.workMode,
                location: formData.location,
                recruiters: formData.recruiters, // array of ids

            };

            let response;
            console.log(payload, "sjkcndsc")

            if (isEdit && initialData?.id) {
                response = await updateJob(
                    initialData.id,
                    payload
                );
            } else {
                response = await createJob(payload);
            }

            if (response.success) {
                router.push("/jobs");
            }
        } catch (error) {
            console.error(
                isEdit
                    ? "Failed to update job:"
                    : "Failed to create job:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const addTag =
        (key: "requiredSkills" | "niceToHave") =>
            (tag: string) => {
                setFormData((prev) => ({
                    ...prev,
                    [key]: [...prev[key], tag],
                }));
            };

    const removeTag =
        (key: "requiredSkills" | "niceToHave") =>
            (index: number) => {
                setFormData((prev) => ({
                    ...prev,
                    [key]: prev[key].filter((_, i) => i !== index),
                }));
            };

    const handleExperienceChange = (
        key: "experienceMin" | "experienceMax",
        val: string
    ) => {
        if (val === "") {
            setFormData((prev) => ({
                ...prev,
                [key]: "",
            }));

            setErrors((prev) => ({
                ...prev,
                [key]: "",
            }));

            return;
        }

        const num = Number(val);

        if (num < 0) {
            setErrors((prev) => ({
                ...prev,
                [key]: "Experience cannot be negative",
            }));

            return;
        }

        if (num > 100) {
            setErrors((prev) => ({
                ...prev,
                [key]: "Experience cannot exceed 100 years",
            }));

            return;
        }

        if (
            key === "experienceMin" &&
            formData.experienceMax !== "" &&
            num > Number(formData.experienceMax)
        ) {
            setErrors((prev) => ({
                ...prev,
                experienceMin:
                    "Min cannot be greater than max",
            }));

            setFormData((prev) => ({
                ...prev,
                experienceMin: val,
            }));

            return;
        }

        if (
            key === "experienceMax" &&
            formData.experienceMin !== "" &&
            num < Number(formData.experienceMin)
        ) {
            setErrors((prev) => ({
                ...prev,
                experienceMax:
                    "Max cannot be less than min",
            }));

            setFormData((prev) => ({
                ...prev,
                experienceMax: val,
            }));

            return;
        }

        setFormData((prev) => ({
            ...prev,
            [key]: val,
        }));

        setErrors((prev) => ({
            ...prev,
            [key]: "",
            experienceMin: "",
            experienceMax: "",
        }));
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <span className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6 block text-center md:text-left md:text-xl">
                {isEdit ? "Edit Job" : "Create Job"}
            </span>
            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 space-y-6 md:space-y-8">
                {/* Title */}
                <div>
                    <Label>
                        Title{" "}
                        <span className="text-error-500">*</span>
                    </Label>

                    <Input
                        placeholder="Job Title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                            setFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }));

                            setErrors((prev) => ({
                                ...prev,
                                title: "",
                            }));
                        }}
                    />

                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.title}
                        </p>
                    )}
                </div>
                {/* Assign Recruiters */}
                <div>
                    <Label>
                        Assign Recruiters
                        <span className="text-error-500">*</span>
                    </Label>

                    <div className="relative">
                        <div className="min-h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 dark:border-gray-700 dark:text-white">
                            {/* Selected tags */}
                            <div className="flex flex-wrap gap-2 mb-1">
                                {formData.recruiters.map((id) => {
                                    const r = recruiters.find((rec) => rec.id === id);
                                    return r ? (
                                        <span key={id} className="flex items-center gap-1 rounded-full bg-brand-50  px-3 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                                            {r.name}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        recruiters: prev.recruiters.filter((rid) => rid !== id),
                                                    }))

                                                }
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                            </div>

                            {/* Dropdown select */}
                            <select
                                value=""
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val && !formData.recruiters.includes(val)) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            recruiters: [...prev.recruiters, val],
                                        }));
                                        setErrors((prev) => ({ ...prev, recruiters: "" })); // ✅ clear error

                                    }
                                }}
                                className="w-full bg-transparent dark:bg-gray-900 text-md text-gray-500 focus:outline-none dark:text-white/200"
                            >
                                <option value="">Select recruiter...</option>
                                {recruiters
                                    .filter((r) => !formData.recruiters.includes(r.id))
                                    .map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                            </select>

                        </div>
                        {errors.recruiters && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.recruiters}
                            </p>
                        )}

                    </div>
                </div>
                {/* Description */}
                <div>
                    <Label>
                        Description{" "}
                        <span className="text-error-500">*</span>
                    </Label>

                    <JobEditor
                        value={formData.description}
                        onChange={(val) => {
                            setFormData((prev) => ({
                                ...prev,
                                description: val,
                            }));

                            setErrors((prev) => ({
                                ...prev,
                                description: "",
                            }));
                        }}
                    />

                    {errors.description && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Required Skills */}
                    <div>
                        <Label>
                            Required Skills
                            <span className="text-error-500">*</span>
                        </Label>

                        <TagInput
                            placeholder="e.g. React, Node.js..."
                            tags={formData.requiredSkills}
                            onAdd={addTag("requiredSkills")}
                            onRemove={removeTag("requiredSkills")}
                        />

                        {errors.requiredSkills && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.requiredSkills}
                            </p>
                        )}
                    </div>

                    {/* Nice to Have */}
                    <div>
                        <Label>
                            Nice to Have
                            <span className="text-error-500">*</span>
                        </Label>

                        <TagInput
                            placeholder="e.g. Docker, AWS..."
                            tags={formData.niceToHave}
                            onAdd={addTag("niceToHave")}
                            onRemove={removeTag("niceToHave")}
                        />

                        {errors.niceToHave && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.niceToHave}
                            </p>
                        )}
                    </div>

                    {/* Min Experience */}
                    <div>
                        <Label>
                            Min Experience (years)
                            <span className="text-error-500">*</span>
                        </Label>

                        <Input
                            placeholder="e.g. 2"
                            type="number"
                            min="0"
                            max="100"
                            step={1}
                            value={formData.experienceMin}
                            onChange={(e) =>
                                handleExperienceChange(
                                    "experienceMin",
                                    e.target.value
                                )
                            }
                        />

                        {errors.experienceMin && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.experienceMin}
                            </p>
                        )}
                    </div>

                    {/* Max Experience */}
                    <div>
                        <Label>
                            Max Experience (years)
                            <span className="text-error-500">*</span>
                        </Label>

                        <Input
                            placeholder="e.g. 5"
                            type="number"
                            min="0"
                            max="100"
                            step={1}
                            value={formData.experienceMax}
                            onChange={(e) =>
                                handleExperienceChange(
                                    "experienceMax",
                                    e.target.value
                                )
                            }
                        />

                        {errors.experienceMax && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.experienceMax}
                            </p>
                        )}
                    </div>
                </div>

                {/* New Fields */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Last Date */}
                    <div>
                        <Label>
                            Last Date <span className="text-error-500">*</span>
                        </Label>

                        <DatePicker
                            id="last-date"
                            placeholder="Select Last Date"
                            defaultDate={formData.lastDate || undefined}
                            minDate={new Date()}
                            onChange={(selectedDates) => {
                                if (selectedDates[0]) {
                                    const date = selectedDates[0];
                                    const yyyy = date.getFullYear();
                                    const mm = String(date.getMonth() + 1).padStart(2, "0");
                                    const dd = String(date.getDate()).padStart(2, "0");
                                    const localDate = `${yyyy}-${mm}-${dd}`;

                                    setFormData((prev) => ({
                                        ...prev,
                                        lastDate: localDate,
                                    }));

                                    setErrors((prev) => ({
                                        ...prev,
                                        lastDate: "",
                                    }));
                                }
                            }}
                        />

                        {errors.lastDate && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.lastDate}
                            </p>
                        )}
                    </div>

                    {/* Work Mode */}
                    <div>
                        <Label>
                            Work Mode{" "}
                            <span className="text-error-500">*</span>
                        </Label>

                        <select
                            value={formData.workMode}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    workMode: e.target.value,
                                }));

                                setErrors((prev) => ({
                                    ...prev,
                                    workMode: "",
                                }));
                            }}
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white"
                        >
                            <option value="">Select Work Mode</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Onsite">Onsite</option>
                        </select>

                        {errors.workMode && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.workMode}
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <Label>
                            Location{" "}
                            <span className="text-error-500">*</span>
                        </Label>

                        <Input
                            type="text"
                            placeholder="e.g. Bangalore"
                            value={formData.location}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    location: e.target.value,
                                }));

                                setErrors((prev) => ({
                                    ...prev,
                                    location: "",
                                }));
                            }}
                        />

                        {errors.location && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.location}
                            </p>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : isEdit ? (
                            "Update Job"
                        ) : (
                            "Add Job"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JobFormSection;