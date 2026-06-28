"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { MoreVertical, Pencil, Share2, Trash2 } from "lucide-react";
import Pagination from "./Pagination";
import { useDebounce } from "@/hooks/useDebounce";


interface Column {
    key: string;
    label: string;
    render?: (row: any) => React.ReactNode;
}

interface JobsTableProps {
    search: string;
    fetchFunction: (params: {
        page: number;
        limit: number;
        search: string;
        token: string;
    }) => Promise<any>;
    deleteFunction: (id: string) => Promise<any>;
    handleEdit: (slug: string) => void;
    handleDelete: (id: string) => void;
    handleShare: (slug: string) => void;
    columns: Column[];
    showActions?: boolean;

}

export default function JobsTable({
    search,
    fetchFunction,
    handleEdit,
    handleDelete,
    handleShare,
    columns = [],
    showActions
}: JobsTableProps) {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const debouncedSearch = useDebounce(search, 400);

    const fetchRef = useRef(fetchFunction);
    useEffect(() => {
        fetchRef.current = fetchFunction;
    }, [fetchFunction]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const user = JSON.parse(localStorage.getItem("user") ?? "{}");
                const token = user.token;
                if (!token) {
                    console.warn("No token found in localStorage");
                    return;
                }

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
                console.log("Fetched data:", data);
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

    return (
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
                                rows.map((row, index) => {
                                    return (
                                        <TableRow key={row.id ?? index}>
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
                                                {openMenu === row.id && (
                                                    <div
                                                        className="fixed inset-0 z-40"
                                                        onClick={() => setOpenMenu(null)}
                                                    />
                                                )}

                                                <div className="flex justify-center">
                                                    <button
                                                        type="button"
                                                        aria-label="Open actions menu"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenu(openMenu === row.id ? null : row.id);
                                                        }}
                                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 transition hover:bg-gray-100 dark:border-white/[0.05] dark:hover:bg-white/[0.05]"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>

                                                    {openMenu === row.id && (
                                                        <div className="absolute right-10 top-14 z-50 w-40 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-white/[0.05] dark:bg-gray-900">
                                                            {showActions && <>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setOpenMenu(null);
                                                                        handleEdit(row.slug);
                                                                    }}
                                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                                                                >
                                                                    <Pencil size={16} />
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();

                                                                        const confirmed = window.confirm(
                                                                            "Are you sure you want to " + (row.disabled === false ? "inactivate" : "activate") + " this job?"
                                                                        );

                                                                        if (!confirmed) return;

                                                                        try {
                                                                            await handleDelete(row.slug);

                                                                            setRows((prev) =>
                                                                                prev.map((item) =>
                                                                                    item.id === row.id
                                                                                        ? {
                                                                                            ...item,
                                                                                            disabled: !item.disabled,
                                                                                        }
                                                                                        : item
                                                                                )
                                                                            );

                                                                            setOpenMenu(null);
                                                                        } catch (error) {
                                                                            console.error("Delete failed:", error);
                                                                        }
                                                                    }}
                                                                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                                                                >
                                                                    <Trash2 size={16} />
                                                                    {row.disabled === false ? "Inactivate" : "Activate"}
                                                                </button>
                                                            </>
                                                            }
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenMenu(null);
                                                                    handleShare(row.slug);
                                                                }}
                                                                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.05]"
                                                            >
                                                                <Share2 size={16} />
                                                                share
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
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
    );
}