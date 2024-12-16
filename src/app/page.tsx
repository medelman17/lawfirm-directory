import { Suspense } from "react";
import { LawFirmsTable } from "@/components/law-firms-table";
import { getLawFirms } from "@/lib/services/law-firm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "default-cache";

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    per_page?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.per_page) || 10;
  const currentPage = params.page || "1";

  return (
    <div className="container flex flex-col min-h-[calc(100vh-65px)]">
      <div className="flex justify-between items-center py-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Law Firms</h1>
          <p className="text-muted-foreground">A list of law firms and their websites for scraping.</p>
        </div>
        <Button asChild>
          <Link href={`/lawfirm/new?returnPage=${currentPage}`}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Law Firm
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div className="p-4">Loading law firms...</div>}>
        <LawFirmsTable lawFirms={getLawFirms(page, pageSize)} baseUrl="/" currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
