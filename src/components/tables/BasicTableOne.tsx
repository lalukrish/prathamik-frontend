"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { EyeIcon, MoreVertical, Pencil, Share2, Trash2 } from "lucide-react";
import Pagination from "./Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { ModalForm } from "../ui/modal/modalForm";
import ComponentCard from "../common/ComponentCard";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}


interface BasicTableOneProps {
  search: string;
  onSearchChange: (value: string) => void;
  fetchFunction: (params: {
    page: number;
    limit: number;
    search: string;
    token: string;
  }) => Promise<any>;
  columns: Column[];
  handleEdit?: (data: any) => Promise<any>;
  handleCreate?: (data: any) => Promise<any>;
  handleDelete?: (id: string) => Promise<any>;
  buttons?: (openCreateModal: () => void) => React.ReactNode;
  emptyRow: any;
  transformRowForEdit?: (row: any) => any;
  modalCreateTitle?: string;
  modalEditTitle?: string;
  modalCreateLabel?: string;
  modalEditLabel?: string;
  modalFields: (
    selectedRow: any,
    setSelectedRow: React.Dispatch<React.SetStateAction<any>>
  ) => React.ReactNode;
  transformCreateResponse?: (data: any) => any;
  transformEditResponse?: (rows: any[], data: any) => any[];
  handleView?: (row: any) => void;
  onModalOpen?: () => void;
  tableTitle?: string;
    onModalClose?: () => void;  // ✅ add this
onRowClick?: (row: any) => void;

}

export default function BasicTableOne({
  search,
  onSearchChange,
  fetchFunction,
  columns = [],
  handleEdit,
  handleCreate,
  handleDelete,
  buttons,
  handleView,
  tableTitle = "Candidate Directory",
  emptyRow,
  transformRowForEdit,
  modalCreateTitle = "Create",
  modalEditTitle = "Edit",
  modalCreateLabel = "Create",
  modalEditLabel = "Update",
  modalFields,
  transformCreateResponse,
  transformEditResponse,
  onModalOpen,
  onModalClose,
  onRowClick
  
}: BasicTableOneProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(emptyRow);
  const [deleteRow, setDeleteRow] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 400);
  const fetchRef = useRef(fetchFunction);

  useEffect(() => { fetchRef.current = fetchFunction; }, [fetchFunction]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
const user = JSON.parse(localStorage.getItem("user") ?? "{}");
const token = user.token;       
 if (!token) return;
        setLoading(true);
        const response = await fetchRef.current({
          page,
          limit,
          search: debouncedSearch,
          token,
        });
        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];
        setRows(data);
        setTotalPages(response?.totalPages ?? 1);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, debouncedSearch]);

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedRow(emptyRow);
    onModalOpen?.();
    setIsModalOpen(true);
  };

  const openEditModal = (row: any) => {
    setIsEditMode(true);
    setSelectedRow(
      transformRowForEdit ? transformRowForEdit(row) : row
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (selectedRow.id) {
              if (!handleEdit) return;

        const updatedData = await handleEdit(selectedRow);
        if (updatedData === null) return;
        if (updatedData && transformEditResponse) {
          setRows((prev) => transformEditResponse(prev, updatedData));
        }
      } else {
              if (!handleCreate) return;

        console.log("Creating with data:", selectedRow);
        const createdData = await handleCreate(selectedRow);
        if (createdData === null) return;
        if (createdData && transformCreateResponse) {
          const newRow = transformCreateResponse(createdData);
          setRows((prev) => [newRow, ...prev]);
        }
      }
      setIsModalOpen(false);
          onModalClose?.();  // ✅ clear errors on success too

    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteRow) return;

    try {
      setIsDeleting(true);

      console.log("sdcsjkdcnskdj")
      if (!handleDelete) return;

      const deletedItem = await handleDelete(deleteRow.id);

      if (deletedItem) {
        setRows((prev) =>
          prev.filter((item) => item.id !== deleteRow.id)
        );
      }

      setDeleteRow(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {buttons && (
        <div className="flex justify-end gap-4">
          {buttons(openCreateModal)}
        </div>
      )}

      {openMenu !== null && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenMenu(null)}
        />
      )}

      <ComponentCard
        title={tableTitle}
        search={search}
        onSearchChange={onSearchChange}
        placeholder="Search candidates..."
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-400"
                    >
                      S.No
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        isHeader
                        className="px-5 py-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-400"
                      >
                        {col.label}
                      </TableCell>
                    ))}
                    <TableCell
                      isHeader
                      className="px-5 py-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {loading ? (
                    <TableRow>
                      <TableCell
                        className="px-5 py-10"
                        colSpan={columns.length + 2}
                      >
                        <div className="flex items-center justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + 2}
                        className="px-5 py-10 text-center text-sm text-gray-500"
                      >
                        No data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row, index) => (
                      <TableRow key={row.id ?? index} onClick={() => onRowClick?.(row)}                                          // ✅ add this
    className={onRowClick ? "cursor-pointer" : ""} >
                        <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {(page - 1) * limit + index + 1}
                        </TableCell>
                        {columns.map((col) => (
                          <TableCell
                            key={col.key}
                            className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300"
                          >
                            {col.render ? col.render(row) : row[col.key] ?? "—"}
                          </TableCell>
                        ))}
                        <TableCell className="relative px-5 py-4">
                          <div className="flex justify-center">
                            <button
                              aria-label="Open actions menu"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenu(
                                  openMenu === row.id ? null : row.id
                                );
                              }}
                              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 transition hover:bg-gray-100 dark:border-white/[0.05] dark:hover:bg-white/[0.05]"
                            >
                              <MoreVertical size={18} />
                            </button>

                            {openMenu === row.id && (
                              <div
                                className="absolute right-10 top-14 z-50 w-40 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-white/[0.05] dark:bg-gray-900"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {handleView && (
                                  <button
                                    onClick={() => {
                                      setOpenMenu(null);
                                      handleView(row);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                                  >
                                    <EyeIcon size={16} />
                                    View
                                  </button>
                                )}
                                <button
onClick={(e) => {
    e.stopPropagation();  // ✅ add this
    openEditModal(row);
  }}                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                                >
                                  <Pencil size={16} />
                                  Edit
                                </button>
                                <button
                                 onClick={(e) => {
    e.stopPropagation();  // ✅ add this
    setOpenMenu(null);
    setDeleteRow(row);
  }}
                                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="mb-7 mr-7 mt-6 flex justify-end">
                <Pagination
                  currentPage={page}
                  onPageChange={setPage}
                  totalPages={totalPages}
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {deleteRow && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Confirmation
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this item?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteRow(null)}
                disabled={isDeleting}
                className="rounded-lg border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalForm
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
onClose={() => {
    setIsModalOpen(false);
    onModalClose?.();  // ✅ call parent's clear function
  }}        onSubmit={handleSubmit}
        title={isEditMode ? modalEditTitle : modalCreateTitle}
        submitLabel={isEditMode ? modalEditLabel : modalCreateLabel}
        
      >
        {modalFields(selectedRow, setSelectedRow)}
      </ModalForm>
    </>
  );
}