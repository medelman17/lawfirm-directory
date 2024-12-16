import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { lawFirmSchema, lawFirmUpdateSchema } from "@/lib/validations/law-firm";
import type { LawFirm, Prisma } from "@prisma/client";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(name: string): Promise<string> {
  let slug = generateSlug(name);
  let counter = 0;
  let uniqueSlug = slug;

  while (true) {
    const existing = await prisma.lawFirm.findUnique({
      where: { slug: uniqueSlug },
    });

    if (!existing) {
      return uniqueSlug;
    }

    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }
}

type ApiResponse<T> = NextResponse<{
  data?: T;
  error?: string | { message: string; details?: unknown };
}>;

export async function GET(): Promise<ApiResponse<LawFirm[]>> {
  try {
    const lawFirms = await prisma.lawFirm.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: lawFirms });
  } catch (error) {
    console.error("Failed to fetch law firms:", error);
    return NextResponse.json({ error: "Failed to fetch law firms" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<ApiResponse<LawFirm>> {
  try {
    const json = await request.json();
    const data = lawFirmSchema.parse(json);
    const slug = await generateUniqueSlug(data.name);

    const lawFirm = await prisma.lawFirm.create({
      data: {
        name: data.name,
        slug,
        website: data.website,
        active: data.active,
        metadata: data.metadata ? JSON.stringify(data.metadata) : "{}",
        lastScrapedAt: null,
        scrapeStatus: null,
      },
    });

    return NextResponse.json({ data: lawFirm }, { status: 201 });
  } catch (error) {
    console.error("Failed to create law firm:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { message: "Validation failed", details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create law firm" }, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<ApiResponse<LawFirm>> {
  try {
    const json = await request.json();
    const { id, ...updateData } = json;

    if (!id) {
      return NextResponse.json({ error: "Law firm ID is required" }, { status: 400 });
    }

    const validatedData = lawFirmUpdateSchema.parse(updateData);
    let updateInput: Prisma.LawFirmUpdateInput = {
      ...validatedData,
      metadata: validatedData.metadata ? JSON.stringify(validatedData.metadata) : undefined,
    };

    if (validatedData.name) {
      const slug = await generateUniqueSlug(validatedData.name);
      updateInput = {
        ...updateInput,
        slug,
      };
    }

    const lawFirm = await prisma.lawFirm.update({
      where: { id },
      data: updateInput,
    });

    return NextResponse.json({ data: lawFirm });
  } catch (error) {
    console.error("Failed to update law firm:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: { message: "Validation failed", details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update law firm" }, { status: 500 });
  }
}
