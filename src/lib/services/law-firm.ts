import { prisma } from "@/lib/prisma";
import type { LawFirm } from "@/types/law-firm";

interface PaginatedLawFirms {
  items: LawFirm[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getLawFirms(page = 1, pageSize = 10): Promise<PaginatedLawFirms> {
  const skip = (page - 1) * pageSize;

  const [total, items] = await Promise.all([
    prisma.lawFirm.count(),
    prisma.lawFirm.findMany({
      orderBy: { name: "asc" },
      skip,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    items: items.map((item) => ({
      ...item,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function toggleLawFirmStatus(id: string): Promise<LawFirm> {
  const firm = await prisma.lawFirm.findUnique({ where: { id } });
  if (!firm) throw new Error("Law firm not found");

  const updated = await prisma.lawFirm.update({
    where: { id },
    data: { isActive: !firm.isActive },
  });

  return {
    ...updated,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
}
