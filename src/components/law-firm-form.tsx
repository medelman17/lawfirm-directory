"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LawFirm } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { lawFirmSchema, type LawFirmFormData } from "@/lib/validations/law-firm";

type FormState = {
  error: string | null;
  success: boolean;
};

interface LawFirmFormProps {
  lawFirm?: LawFirm;
  onSubmit: (data: LawFirmFormData) => Promise<void>;
  onCancel: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

export function LawFirmForm({ lawFirm, onSubmit, onCancel }: LawFirmFormProps) {
  const [state, formAction] = useActionState(
    async (_prevState: FormState, formData: FormData) => {
      try {
        const rawData = {
          name: formData.get("name"),
          website: formData.get("website"),
          active: true,
        };

        const validatedData = lawFirmSchema.parse(rawData);
        await onSubmit(validatedData);
        return { error: null, success: true };
      } catch (error) {
        if (error instanceof Error) {
          return {
            error: error.message,
            success: false,
          };
        }
        return {
          error: "Something went wrong",
          success: false,
        };
      }
    },
    { error: null, success: false }
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Law Firm Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={lawFirm?.name}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter law firm name"
          maxLength={255}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="website" className="text-sm font-medium">
          Website URL
        </label>
        <input
          id="website"
          name="website"
          type="url"
          required
          defaultValue={lawFirm?.website}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://example.com"
          pattern="https?://.*"
          title="Please enter a valid URL starting with http:// or https://"
          maxLength={2048}
        />
      </div>

      {state.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">{state.error}</div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}
