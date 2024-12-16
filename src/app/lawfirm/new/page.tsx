import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { handleFormSubmit } from "@/app/actions";

interface NewLawFirmPageProps {
  searchParams: Promise<{
    returnPage?: string;
  }>;
}

export default async function NewLawFirmPage({ searchParams }: NewLawFirmPageProps) {
  const returnPage = (await searchParams).returnPage || "1";

  async function onSubmit(formData: FormData) {
    "use server";

    const result = await handleFormSubmit(formData);
    if (!result.success) {
      throw new Error(result.error || "Failed to create law firm");
    }

    redirect(`/?page=${returnPage}`);
  }

  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href={`/?page=${returnPage}`} className="text-sm text-muted-foreground hover:underline">
              ← Back to Directory
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Law Firm</h1>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <form action={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Law Firm Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com"
                pattern="https?://.*"
                title="Please enter a valid URL starting with http:// or https://"
                maxLength={2048}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href={`/?page=${returnPage}`}>Cancel</Link>
              </Button>
              <Button type="submit">Create Law Firm</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
