"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { LawFirm } from "@/types/law-firm";

export async function handleFormSubmit(data: Partial<LawFirm>) {
  try {
    await prisma.lawFirm.create({
      data: {
        name: data.name!,
        slug: data.slug!,
        website: data.website!,
        isActive: true,
        metadata: "{}",
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create law firm:", error);
    return { success: false, error: "Failed to create law firm" };
  }
}
