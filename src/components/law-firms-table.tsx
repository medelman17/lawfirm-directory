import Link from "next/link";
import { LawFirm } from "@/types/law-firm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { PaginationControls } from "@/components/pagination";
import { StatusToggle } from "@/components/status-toggle";
import { formatDate } from "@/lib/utils";

interface LawFirmsTableProps {
  lawFirms: Promise<{
    items: LawFirm[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;
  baseUrl: string;
  currentPage: string;
}

export async function LawFirmsTable({ lawFirms, baseUrl, currentPage }: LawFirmsTableProps) {
  const data = await lawFirms;

  return (
    <div className="flex flex-col flex-1">
      <div className="rounded-lg border bg-card mb-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead className="w-[400px]">Website</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Scraped</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((firm) => (
              <TableRow key={firm.id}>
                <TableCell className="truncate">
                  <Link href={`/lawfirm/${firm.slug}`} className="font-medium hover:underline block truncate">
                    {firm.name}
                  </Link>
                </TableCell>
                <TableCell className="truncate">
                  <a
                    href={firm.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                  >
                    <span className="truncate">{firm.website}</span>
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  </a>
                </TableCell>
                <TableCell>
                  <StatusToggle firm={firm} />
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
      <div className="py-4">
        <PaginationControls page={data.page} totalPages={data.totalPages} baseUrl={baseUrl} />
      </div>
    </div>
  );
}
