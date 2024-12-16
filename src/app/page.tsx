import { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { LawFirmList } from "@/components/law-firm-list";

export const dynamic = "force-dynamic";
export const fetchCache = "default-cache";

export const metadata: Metadata = {
  title: "Law Firm Directory",
  description: "Manage and track law firm websites for scraping.",
};

async function LawFirmData() {
  try {
    const lawFirms = await prisma.lawFirm.findMany({
      orderBy: { name: "asc" },
    });
    return <LawFirmList initialLawFirms={lawFirms} />;
  } catch (error) {
    console.error("Failed to fetch law firms:", error);
    return (
      <div className="p-4 border border-red-500 rounded-lg bg-red-50">
        <h3 className="text-red-700 font-medium">Error</h3>
        <p className="text-red-600">Failed to load law firms. Please try again later.</p>
      </div>
    );
  }
}

export default function HomePage() {
  return (
    <main className="container py-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Law Firm Directory</h1>
          <p className="text-muted-foreground">Manage and track law firm websites for scraping.</p>
        </div>
        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="h-32 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
            </div>
          }
        >
          <LawFirmData />
        </Suspense>
      </div>
    </main>
  );
}
