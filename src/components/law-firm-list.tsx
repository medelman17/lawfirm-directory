"use client";

import { useState } from "react";
import Link from "next/link";
import { LawFirm } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { LawFirmForm } from "@/components/law-firm-form";
import { LawFirmFormData } from "@/lib/validations/law-firm";

interface LawFirmListProps {
  initialLawFirms: LawFirm[];
}

type ApiError = {
  message: string;
  code?: string;
  status?: number;
};

export function LawFirmList({ initialLawFirms }: LawFirmListProps) {
  const [lawFirms, setLawFirms] = useState<LawFirm[]>(initialLawFirms);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (data: LawFirmFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/lawfirms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create law firm");
      }

      const newLawFirm = await response.json();
      setLawFirms((prev) => [...prev, newLawFirm]);
      setIsAddingNew(false);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Failed to create law firm",
        status: 500,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<LawFirm>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/lawfirms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update law firm");
      }

      const updatedLawFirm = await response.json();
      setLawFirms((prev) => prev.map((firm) => (firm.id === id ? updatedLawFirm : firm)));
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Failed to update law firm",
        status: 500,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 border border-red-500 rounded-lg bg-red-50">
        <h3 className="text-red-700 font-medium">Error</h3>
        <p className="text-red-600">{error.message}</p>
        <Button variant="outline" className="mt-2" onClick={() => setError(null)}>
          Dismiss
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Law Firms</h2>
        <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew || isLoading}>
          Add New Law Firm
        </Button>
      </div>

      {isAddingNew && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <LawFirmForm onSubmit={handleCreate} onCancel={() => setIsAddingNew(false)} />
        </div>
      )}

      <div className="grid gap-4">
        {lawFirms.map((firm) => (
          <div
            key={firm.id}
            className="border rounded-lg p-4 flex justify-between items-center hover:bg-muted/50 transition-colors"
          >
            <div>
              <Link href={`/lawfirm/${firm.slug}`} className="font-medium hover:underline">
                {firm.name}
              </Link>
              <a
                href={firm.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-500 hover:underline"
              >
                {firm.website}
              </a>
              <div className="text-sm text-muted-foreground mt-1">
                Last scraped: {firm.lastScrapedAt ? new Date(firm.lastScrapedAt).toLocaleDateString() : "Never"}
                {firm.scrapeStatus && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {firm.scrapeStatus}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={firm.active ? "outline" : "default"}
                size="sm"
                onClick={() => handleUpdate(firm.id, { active: !firm.active })}
                disabled={isLoading}
              >
                {firm.active ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>
        ))}

        {lawFirms.length === 0 && (
          <div className="text-center p-8 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">No law firms added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
