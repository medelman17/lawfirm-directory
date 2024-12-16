import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container py-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Law Firm Not Found</h1>
        <p className="text-muted-foreground">The law firm you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Law Firm Directory
        </Link>
      </div>
    </main>
  );
}
