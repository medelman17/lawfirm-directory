"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  baseUrl: string;
}

export function PaginationControls({ page, totalPages, baseUrl }: PaginationControlsProps) {
  const searchParams = useSearchParams();

  function getPageUrl(pageNumber: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getPageUrl(page - 1)}
            aria-disabled={page <= 1}
            className={cn(page <= 1 && "pointer-events-none opacity-50")}
          />
        </PaginationItem>

        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          const isCurrentPage = pageNumber === page;
          const isWithinRange = pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - page) <= 1;

          if (!isWithinRange) {
            if (pageNumber === 2 || pageNumber === totalPages - 1) {
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          }

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={getPageUrl(pageNumber)}
                isActive={isCurrentPage}
                aria-current={isCurrentPage ? "page" : undefined}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={getPageUrl(page + 1)}
            aria-disabled={page >= totalPages}
            className={cn(page >= totalPages && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  return (
    <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center">
      <ul className="flex flex-row items-center gap-1">
        <li>
          <Link
            href={getPageUrl(page - 1)}
            aria-label="Go to previous page"
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              "gap-1 pl-2.5",
              page <= 1 && "pointer-events-none opacity-50"
            )}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : 0}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Link>
        </li>

        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          const isCurrentPage = pageNumber === page;
          const isWithinRange = pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - page) <= 1;

          if (!isWithinRange) {
            if (pageNumber === 2 || pageNumber === totalPages - 1) {
              return (
                <li key={pageNumber}>
                  <span aria-hidden className="flex h-9 w-9 items-center justify-center">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More pages</span>
                  </span>
                </li>
              );
            }
            return null;
          }

          return (
            <li key={pageNumber}>
              <Link
                href={getPageUrl(pageNumber)}
                aria-label={`Page ${pageNumber}`}
                aria-current={isCurrentPage ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: isCurrentPage ? "outline" : "ghost",
                    size: "icon",
                  })
                )}
              >
                {pageNumber}
              </Link>
            </li>
          );
        })}

        <li>
          <Link
            href={getPageUrl(page + 1)}
            aria-label="Go to next page"
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              "gap-1 pr-2.5",
              page >= totalPages && "pointer-events-none opacity-50"
            )}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : 0}
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
