import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { LawFirmMetadata } from "@/types/law-firm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const lawFirm = await prisma.lawFirm.findUnique({
    where: { slug: (await params).slug },
  });

  if (!lawFirm) {
    return {
      title: "Law Firm Not Found",
    };
  }

  return {
    title: lawFirm.name,
    description: `Details about ${lawFirm.name}, including specialties and contact information.`,
  };
}

export default async function LawFirmPage({ params }: { params: Promise<{ slug: string }> }) {
  const lawFirm = await prisma.lawFirm.findUnique({
    where: { slug: (await params).slug },
  });

  if (!lawFirm) {
    notFound();
  }

  const metadata = JSON.parse(lawFirm.metadata as string) as LawFirmMetadata;

  return (
    <main className="container py-6">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link href="/" className="text-sm text-muted-foreground hover:underline">
                  ← Back to Directory
                </Link>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{lawFirm.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  lawFirm.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {lawFirm.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <p className="mt-2">
            <a
              href={lawFirm.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {lawFirm.website}
            </a>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Specialties</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {metadata.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Firm Details</h2>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Size</dt>
                  <dd className="text-sm text-gray-900">{metadata.size}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Year Established</dt>
                  <dd className="text-sm text-gray-900">{metadata.yearEstablished}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Scraping Status</h2>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Scraped</dt>
                  <dd className="text-sm text-gray-900">
                    {lawFirm.lastScrapedAt ? new Date(lawFirm.lastScrapedAt).toLocaleDateString() : "Never"}
                  </dd>
                </div>
                {lawFirm.scrapeStatus && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900">{lawFirm.scrapeStatus}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
