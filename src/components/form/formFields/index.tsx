"use client";
import React, { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
// FieldWrapper — shared label + error wrapper
// ─────────────────────────────────────────────

interface FieldWrapperProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  error,
  required,
  children,
}) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    )}
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// ─────────────────────────────────────────────
// NormalInputField
// ─────────────────────────────────────────────
interface NormalInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

// export const NormalInputField: React.FC<NormalInputFieldProps> = ({
//   label, error, required, className, ...props
// }) => (
//   <FieldWrapper label={label} error={error} required={required}>
//     <input
//       {...props}
//       className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 outline-none transition
//         placeholder:text-gray-400
//         dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
//         ${error
//           ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
//           : "border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/[0.1]"
//         }
//         ${className ?? ""}`}
//     />
//   </FieldWrapper>
// );

export const NormalInputField: React.FC<NormalInputFieldProps> = ({
  label, error, required, className, ...props
}) => (
  <FieldWrapper label={label} error={error} required={required}>
    <input
      {...props}
      className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition
        placeholder:text-gray-400
        dark:placeholder:text-gray-500
        ${props.readOnly
          ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 dark:border-white/[0.05] dark:bg-gray-800/50 dark:text-gray-500"
          : `text-gray-800 dark:bg-gray-800 dark:text-white ${error
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/[0.1]"
            }`
        }
        ${className ?? ""}`}
    />
  </FieldWrapper>
);

// ─────────────────────────────────────────────
// PasswordInputField
// ─────────────────────────────────────────────
interface PasswordInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  label, error, required, className, ...props
}) => {
  const [show, setShow] = useState(false);
  return (
    <FieldWrapper label={label} error={error} required={required}>
      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className={`w-full rounded-lg border px-4 py-2.5 pr-11 text-sm text-gray-800 outline-none transition
            placeholder:text-gray-400
            dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
            ${error
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/[0.1]"
            }
            ${className ?? ""}`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </FieldWrapper>
  );
};

// ─────────────────────────────────────────────
// SelectField — dropdown
// ─────────────────────────────────────────────
interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label, error, required, options, placeholder, className, ...props
}) => (
  <FieldWrapper label={label} error={error} required={required}>
    <div className="relative">
      <select
        {...props}
        className={`w-full appearance-none rounded-lg border px-4 py-2.5 text-sm text-gray-800 outline-none transition
          dark:bg-gray-800 dark:text-white
          ${error
            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/[0.1]"
          }
          ${className ?? ""}`}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  </FieldWrapper>
);


interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label, error, required, className, ...props
}) => (
  <FieldWrapper label={label} error={error} required={required}>
    <textarea
      {...props}
      rows={props.rows ?? 3}
      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 outline-none transition
        placeholder:text-gray-400 resize-none
        dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
        ${error
          ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/[0.1]"
        }
        ${className ?? ""}`}
    />
  </FieldWrapper>
);

interface SearchableSelectFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const SearchableSelectField: React.FC<SearchableSelectFieldProps> = ({
  label, error, required, options, placeholder = "Search...", value, onChange, className,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );
  const selectedLabel = options.find((o) => o.value.toString() === value)?.label || "";

  return (
    <FieldWrapper label={label} error={error} required={required}>
      <div className="relative">
        <input
          type="text"
          value={open ? query : selectedLabel}
          placeholder={placeholder}
          onFocus={() => { setOpen(true); setQuery(""); }}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 outline-none transition
            placeholder:text-gray-400
            dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
            ${error
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/[0.1]"
            }
            ${className ?? ""}`}
        />
        {open && (
          <div className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-white/[0.1] dark:bg-gray-900">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => { onChange?.(opt.value.toString()); setQuery(opt.label); setOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {opt.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400">No results found</div>
            )}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
};

// ─────────────────────────────────────────────
// RadioField — radio button group
// ─────────────────────────────────────────────
interface RadioOption {
  label: string;
  value: string | number;
}

interface RadioFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  options: RadioOption[];
  value?: string | number;
  onChange?: (value: string) => void;
  name: string;
  className?: string;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  label, error, required, options, value, onChange, name, className,
}) => (
  <FieldWrapper label={label} error={error} required={required}>
    <div className={`flex flex-wrap gap-4 ${className ?? ""}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            className="h-4 w-4 border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-white/[0.1]"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </FieldWrapper>
);


interface TagsInputFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  value: string[];                       
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const TagsInputField: React.FC<TagsInputFieldProps> = ({
  label,
  error,
  required,
  value: tags,
  onChange,
  placeholder = "Type a tag and press Enter or comma…",
  className,
}) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const trimmed = raw.trim().replace(/,+$/, "").trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // auto-add on comma
    if (val.endsWith(",")) {
      addTag(val.slice(0, -1));
    } else {
      setInput(val);
    }
  };

  return (
    <FieldWrapper label={label} error={error} required={required}>
      {/* Input box */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 outline-none transition
          placeholder:text-gray-400
          dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
          ${error
            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-gray-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-white/[0.1]"
          }
          ${className ?? ""}`}
      />

      {/* Tag chips — shown only when there are tags */}
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700
                         dark:bg-slate-700 dark:text-slate-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </FieldWrapper>
  );
};



// ─────────────────────────────────────────────
// FileUploadField — file input with drag & drop
// ─────────────────────────────────────────────
interface FileUploadFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  accept?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  placeholder?: string;
  className?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  error,
  required,
  accept = ".pdf,.doc,.docx",
  value,
  onChange,
  placeholder = "Drag & drop or click to upload",
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File | null) => {
    if (file) onChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <FieldWrapper label={label} error={error} required={required}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition
          ${dragging
            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
            : error
              ? "border-red-400 bg-red-50 dark:bg-red-900/10"
              : "border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-gray-100 dark:border-white/[0.1] dark:bg-gray-800/50 dark:hover:bg-gray-800"
          }
          ${className ?? ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />

        {value ? (
          /* ── File selected state ── */
          <div className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-white/[0.1] dark:bg-gray-900">
            {/* File icon */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            {/* File info */}
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-800 dark:text-white">{value.name}</p>
              <p className="text-xs text-gray-400">{(value.size / 1024).toFixed(1)} KB</p>
            </div>
            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700 transition"
              aria-label="Remove file"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          /* ── Empty state ── */
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{placeholder}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {accept.split(",").join(", ")} supported
              </p>
            </div>
          </>
        )}
      </div>
    </FieldWrapper>
  );
};