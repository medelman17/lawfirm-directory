"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { lawFirmSchema } from "@/lib/validations/law-firm";

async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug;
  let counter = 0;

  while (true) {
    const existing = await prisma.lawFirm.findUnique({
      where: { slug },
    });

    if (!existing) return slug;

    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function handleFormSubmit(formData: FormData) {
  try {
    const data = {
      name: formData.get("name"),
      website: formData.get("website"),
      active: true,
    };

    const validated = lawFirmSchema.parse(data);
    const slug = await generateUniqueSlug(validated.name);

    await prisma.lawFirm.create({
      data: {
        name: validated.name,
        slug,
        website: validated.website,
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
