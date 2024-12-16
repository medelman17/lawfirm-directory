"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { LawFirm } from "@/types/law-firm";
import { toast } from "sonner";

interface StatusToggleProps {
  firm: LawFirm;
}

export function StatusToggle({ firm: initialFirm }: StatusToggleProps) {
  const [firm, setFirm] = useState(initialFirm);
  const [isPending, setIsPending] = useState(false);

  async function toggleStatus() {
    try {
      setIsPending(true);
      const response = await fetch(`/api/lawfirms/${firm.id}/toggle`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to toggle status");

      const updatedFirm = await response.json();
      setFirm(updatedFirm);
      toast.success(`${firm.name} status updated successfully`);
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Toggle
      variant="outline"
      size="sm"
      pressed={firm.isActive}
      onPressedChange={toggleStatus}
      disabled={isPending}
      className="data-[state=on]:bg-green-50 data-[state=on]:text-green-700 data-[state=on]:border-green-600/20 dark:data-[state=on]:bg-green-500/10"
    >
      {firm.isActive ? "Active" : "Inactive"}
    </Toggle>
  );
}
