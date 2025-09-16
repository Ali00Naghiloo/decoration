"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSamples, deleteSample } from "@/src/lib/api";
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
    data: samples,
    isLoading,
    isError,
    error,
  } = useQuery<Sample[]>({
    queryKey: ["samples"], // A unique key for this query
    queryFn: getSamples, // The function that fetches the data
  });

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

  // 3. Handling UI states
  if (isLoading) {
    return <div>Loading samples...</div>;
  }

  if (isError) {
    return <div>Error fetching samples: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Samples</h1>
        <Button asChild>
          <Link
            href="/dashboard/samples/new"
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create New Sample
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {samples && samples.length > 0 ? (
              samples.map((sample) => (
                <TableRow key={sample._id}>
                  <TableCell className="font-medium">{sample.title}</TableCell>
                  <TableCell>
                    {new Date(sample.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
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
                <TableCell colSpan={3} className="text-center">
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
