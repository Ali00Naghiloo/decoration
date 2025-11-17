"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSamples, deleteSample } from "@/src/lib/api";
import { updateSampleStatus } from "@/src/lib/api";
import { Sample } from "@/src/types";
import Link from "next/link";
import { Plus, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";

export default function SamplesPage() {
  const queryClient = useQueryClient();

  // 1. Fetching data with useQuery
  const {
    data: samplesData,
    isLoading,
    isError,
    error,
  } = useQuery<{ items: Sample[] }>({
    queryKey: ["samples"], // A unique key for this query
    queryFn: getSamples, // The function that fetches the data
  });

  const samples = samplesData?.items || [];

  // Helper: parse a stored translated field which may be:
  // - an object { fa, en }
  // - a JSON-stringified object
  // - a legacy single-language string (assume fa)
  const parseTranslated = (v: unknown): { fa: string; en: string } => {
    const empty = { fa: "", en: "" };
    if (v == null) return empty;
    if (typeof v === "object") {
      const o = v as Record<string, unknown>;
      return { fa: String(o.fa || ""), en: String(o.en || "") };
    }
    if (typeof v === "string") {
      const t0 = v.trim();
      if (!t0) return empty;
      // try parse JSON (handle double-encoded too)
      let t: string = t0;
      for (let i = 0; i < 2; i++) {
        if (t.startsWith("{")) {
          try {
            const parsed = JSON.parse(t);
            if (typeof parsed === "object" && parsed !== null) {
              const p = parsed as Record<string, unknown>;
              return { fa: String(p.fa || ""), en: String(p.en || "") };
            }
            if (typeof parsed === "string") {
              t = parsed.trim();
              continue;
            }
          } catch {
            // not JSON - treat as legacy
          }
        }
        break;
      }
      // legacy single-language string -> treat as fa
      return { fa: v, en: "" };
    }
    return empty;
  };

  const getTitleString = (v: unknown) => {
    const p = parseTranslated(v);
    return p.fa || p.en || "";
  };

  const formatDate = (value: unknown) => {
    try {
      const d = new Date(String(value));
      if (isNaN(d.getTime())) return "";
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d);
    } catch {
      return "";
    }
  };

  // 2. Setting up the mutation for deleting a sample
  const deleteMutation = useMutation({
    mutationFn: deleteSample,
    onSuccess: () => {
      toast.success("Sample deleted successfully!");
      // When a delete is successful, invalidate the 'samples' query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["samples"] });
    },
    onError: (error) => {
      toast.error(`Error deleting sample: ${error.message}`);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this sample?")) {
      deleteMutation.mutate(id);
    }
  };

  // Mutation for updating sample status
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: number }) =>
      updateSampleStatus(id, status),
    onSuccess: () => {
      toast.success("وضعیت نمونه با موفقیت تغییر کرد!");
      queryClient.invalidateQueries({ queryKey: ["samples"] });
    },
    onError: (error: unknown) => {
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        toast.error(
          `خطا در تغییر وضعیت: ${(error as { message: string }).message}`
        );
      } else {
        toast.error("خطا در تغییر وضعیت");
      }
    },
  });

  // 3. Handling UI states
  if (isLoading) {
    return <div>بارگذاری نمونه ها...</div>;
  }

  if (isError) {
    return <div>Error fetching samples: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">مدیریت نمونه‌کارها</h1>
        <Button asChild>
          <Link
            href="/dashboard/samples/new"
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            ایجاد نمونه‌کار جدید
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">عنوان</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {samples && samples.length > 0 ? (
              samples.map((sample: Sample) => (
                <TableRow key={sample._id}>
                  <TableCell className="font-medium">
                    {getTitleString(sample.title)}
                  </TableCell>
                  <TableCell>{formatDate(sample.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={sample.status === 1 ? "default" : "outline"}
                      disabled={
                        statusMutation.isPending &&
                        statusMutation.variables?.id === sample._id
                      }
                      onClick={() => {
                        const newStatus = sample.status === 1 ? 0 : 1;
                        statusMutation.mutate({
                          id: sample._id,
                          status: newStatus,
                        });
                      }}
                    >
                      {statusMutation.isPending &&
                      statusMutation.variables?.id === sample._id ? (
                        <span className="flex items-center gap-1">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          در حال تغییر...
                        </span>
                      ) : sample.status === 1 ? (
                        "فعال"
                      ) : (
                        "غیرفعال"
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={`/dashboard/samples/${sample._id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(sample._id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No samples found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
