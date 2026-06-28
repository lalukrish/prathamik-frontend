

"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { NormalInputField } from "@/components/form/formFields";
import Snackbar from "@/components/ui/notification";
import { getAllMockTests, createMockTest, updateMockTest, deleteMockTest } from "@/shared/mock-test";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuestionBankPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

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

const handleCreate = async (data: any) => {
  try {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("duration", data.duration);
    formData.append("totalMarks", data.totalMarks);
    formData.append("category", data.category ?? "OTHER");
    formData.append("accessMode", data.accessMode ?? "FREE");
    if (data.accessMode === "PAID" && data.price) {
   formData.append("price", data.price);
  }
    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    const response = await createMockTest(formData);

    showSnackbar(
      "success",
      "Question bank created successfully",
    );

    return response.data.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Something went wrong";

    showSnackbar("error", errorMessage);

    return null;
  }
};

const handleEdit = async (data: any) => {
  try {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append(
      "description",
      data.description || "",
    );
    formData.append("duration", data.duration);
    formData.append(
      "totalMarks",
      data.totalMarks,
    );

    if (data.thumbnail instanceof File) {
      formData.append(
        "thumbnail",
        data.thumbnail,
      );
    }
formData.append("category", data.category ?? "OTHER");
formData.append("accessMode", data.accessMode ?? "FREE");
if (data.accessMode === "PAID" && data.price) {
  formData.append("price", data.price);
}
    const response =
      await updateMockTest(
        data.id,
        formData,
      );

    showSnackbar(
      "success",
      "Question bank updated successfully",
    );

    return response.data.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Something went wrong";

    showSnackbar("error", errorMessage);

    return null;
  }
};
  const handleDelete = async (id: string) => {
    try {
      await deleteMockTest(id);
      showSnackbar("success", "Question bank deleted successfully");
      return true;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
      showSnackbar("error", errorMessage);
      return false;
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Question Bank" />

      <div className="space-y-6">
        <BasicTableOne
          onRowClick={(row) => router.push(`/mock-test/${row.id}`)}

          search={search}
          onSearchChange={setSearch}
          fetchFunction={getAllMockTests}
          handleCreate={handleCreate}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          tableTitle="Question Bank Directory"
         emptyRow={{
  id: "",
  title: "",
  description: "",
  durationMinutes: "",
  totalMarks: "",
  thumbnail: null,
  category: "OTHER",
  accessMode: "FREE",
  price: "",
}}

transformRowForEdit={(row) => ({
  id: row.id,
  title: row.title,
  description: row.description ?? "",
  duration: String(row.durationMinutes),
  totalMarks: String(row.totalMarks),
  thumbnail: row.thumbnail ?? "",
  category: row.category ?? "OTHER",
  accessMode: row.accessMode ?? "FREE",
  price: row.price ? String(row.price) : "",
})}

          transformCreateResponse={(data) => ({
            id: data.id,
            title: data.title,
            description: data.description,
            duration: data.durationMinutes,
            totalMarks: data.totalMarks,
            createdAt: data.createdAt,
          })}

          transformEditResponse={(rows, data) =>
            rows.map((row) =>
              row.id !== data.id ? row : {
                ...row,
                title: data.title,
                description: data.description,
                duration: data.durationMinutes,
                totalMarks: data.totalMarks,
              }
            )
          }

          modalCreateTitle="Create Question Bank"
          modalEditTitle="Edit Question Bank"
          modalCreateLabel="Create"
          modalEditLabel="Update"

          modalFields={(selectedRow, setSelectedRow) => (
            <>
              <NormalInputField
                label="Test Title"
                type="text"
                placeholder="React Mock Test"
                value={selectedRow.title}
                required
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({ ...prev, title: e.target.value }))
                }
              />
              <NormalInputField
                label="Description"
                type="text"
                placeholder="Enter description"
                value={selectedRow.description}
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({ ...prev, description: e.target.value }))
                }
              />
              <NormalInputField
                label="Duration (Minutes)"
                type="number"
                placeholder="30"
                value={selectedRow.duration}
                required
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({ ...prev, duration: e.target.value }))
                }
              />
              <NormalInputField
                label="Total Marks"
                type="number"
                placeholder="100"
                value={selectedRow.totalMarks}
                required
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({ ...prev, totalMarks: e.target.value }))
                }
              />

              <div>
  <label className="mb-2 block text-sm font-medium">
    Thumbnail
  </label>

  {selectedRow.thumbnail &&
    typeof selectedRow.thumbnail ===
      "string" && (
      <img
        src={selectedRow.thumbnail}
        alt="thumbnail"
        className="mb-2 h-24 w-24 rounded-lg object-cover"
      />
    )}

  <input
    type="file"
    accept="image/*"
    className="w-full rounded-lg border p-2"
    onChange={(e) =>
      setSelectedRow((prev: any) => ({
        ...prev,
        thumbnail:
          e.target.files?.[0] || null,
      }))
    }
  />
</div>
 {/* Category */}
    <div>
      <label className="mb-2 block text-sm font-medium">Category</label>
      <select
        value={selectedRow.category}
        onChange={(e) =>
          setSelectedRow((prev: any) => ({ ...prev, category: e.target.value }))
        }
        className="w-full rounded-lg border p-3 text-sm"
      >
        {["UPSC","SSC","IBPS","RRB","NEET","JEE","PSC","OTHER"].map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>

    {/* Access mode */}
    <div>
      <label className="mb-2 block text-sm font-medium">Access Mode</label>
      <div className="flex gap-3">
        {["FREE", "PAID"].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() =>
              setSelectedRow((prev: any) => ({
                ...prev,
                accessMode: mode,
                price: mode === "FREE" ? "" : prev.price,
              }))
            }
            className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
              selectedRow.accessMode === mode
                ? mode === "FREE"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-orange-400 bg-orange-50 text-orange-700"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            {mode === "FREE" ? "🆓 Free" : "💳 Paid"}
          </button>
        ))}
      </div>
    </div>

    {/* Price — only show when PAID */}
    {selectedRow.accessMode === "PAID" && (
      <NormalInputField
        label="Price (₹)"
        type="number"
        placeholder="199"
        value={selectedRow.price}
        required
        onChange={(e) =>
          setSelectedRow((prev: any) => ({ ...prev, price: e.target.value }))
        }
      />
    )}
            </>
          )}

          buttons={(openCreateModal) => (
            <>
              <button
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
                onClick={openCreateModal}
              >
                <Plus size={18} />
                <span>Create Question Bank</span>
              </button>
            </>
          )}

          columns={[
            { key: "title", label: "Title", render: (row) => row.title ?? "—" },
            { key: "duration", label: "Duration (min)", render: (row) => row.durationMinutes ?? "—" },
            { key: "totalMarks", label: "Total Marks", render: (row) => row.totalMarks ?? "—" },
            {
  key: "thumbnail",
  label: "Thumbnail",
  render: (row) =>
    row.thumbnailUrl ? (
      <img
        src={row.thumbnailUrl}
        alt="thumbnail"
        className="h-12 w-12 rounded-lg object-cover"
      />
    ) : (
      "—"
    ),
},
 {
    key: "category",
    label: "Category",
    render: (row) => (
      <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
        {row.category ?? "OTHER"}
      </span>
    ),
  },
  {
    key: "accessMode",
    label: "Access",
    render: (row) =>
      row.accessMode === "PAID" ? (
        <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-600">
          💳 ₹{row.price ?? "—"}
        </span>
      ) : (
        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
          Free
        </span>
      ),
  },
            {

              key: "createdAt",
              label: "Created At",
              render: (row) =>
                row.createdAt
                  ? new Date(row.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—",
            },
          ]}
        />

        <Snackbar
          show={snackbar.show}
          type={snackbar.variant}
          message={snackbar.message}
          onClose={() => setSnackbar((s) => ({ ...s, show: false }))}
        />
      </div>
    </div>
  );
}