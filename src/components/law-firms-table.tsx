"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LawFirm } from "@/types/law-firm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ExternalLink } from "lucide-react";
import { PaginationControls } from "@/components/pagination";

interface LawFirmsTableProps {
  lawFirms: {
    items: LawFirm[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  baseUrl: string;
}

function formatDate(date: Date | null): string {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LawFirmsTable({ lawFirms, baseUrl }: LawFirmsTableProps) {
  const [firms, setFirms] = useState(lawFirms.items);

  useEffect(() => {
    setFirms(lawFirms.items);
  }, [lawFirms.items]);

  async function toggleStatus(firm: LawFirm) {
    try {
      const response = await fetch(`/api/lawfirms/${firm.id}/toggle`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to toggle status");

      const updatedFirm = await response.json();
      setFirms((prev) => prev.map((f) => (f.id === firm.id ? updatedFirm : f)));
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Scraped</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {firms.map((firm) => (
              <TableRow key={firm.id}>
                <TableCell>
                  <Link href={`/lawfirm/${firm.slug}`} className="font-medium hover:underline">
                    {firm.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <a
                    href={firm.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                  >
                    {firm.website}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </TableCell>
                <TableCell>
                  <Toggle
                    variant="outline"
                    size="sm"
                    pressed={firm.isActive}
                    onPressedChange={() => toggleStatus(firm)}
                    className="data-[state=on]:bg-green-50 data-[state=on]:text-green-700 data-[state=on]:border-green-600/20 dark:data-[state=on]:bg-green-500/10"
                  >
                    {firm.isActive ? "Active" : "Inactive"}
                  </Toggle>
                </TableCell>
                <TableCell>{formatDate(firm.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/lawfirm/${firm.slug}`}>View Details</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationControls page={lawFirms.page} totalPages={lawFirms.totalPages} baseUrl={baseUrl} />
    </div>
  );
}
