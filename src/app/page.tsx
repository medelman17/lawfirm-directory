import { Suspense } from "react";
import { LawFirmsTable } from "@/components/law-firms-table";
import { LawFirmForm } from "@/components/law-firm-form";
import { getLawFirms } from "@/lib/services/law-firm";
import { handleFormSubmit } from "./actions";

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
  const lawFirms = await getLawFirms(page, pageSize);

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Law Firms</h1>
        <p className="text-muted-foreground">A list of law firms and their websites for scraping.</p>
      </div>

      <div className="rounded-lg border bg-card">
        <Suspense fallback={<div>Loading...</div>}>
          <LawFirmsTable lawFirms={lawFirms} baseUrl="/" />
        </Suspense>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Law Firm</h2>
        {/* <LawFirmForm onSubmit={handleFormSubmit} onCancel={() => {}} /> */}
      </div>
    </div>
  );
}
