import { type LawFirmMetadata, type Specialty, type FirmSize } from "@/types/law-firm";

const suffixes = [
  "Law Firm",
  "Legal Group",
  "& Associates",
  "& Partners",
  "Attorneys at Law",
  "Legal Services",
  "Law Office",
  "& Co.",
  "Law Practice",
  "Legal Advisors",
] as const;

function generateSlug(name: string, usedSlugs: Set<string>): string {
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!usedSlugs.has(slug)) return slug;

  let counter = 1;
  let newSlug = `${slug}-${counter}`;
  while (usedSlugs.has(newSlug)) {
    counter++;
    newSlug = `${slug}-${counter}`;
  }
  return newSlug;
}

function getRandomSpecialties(count: number): Specialty[] {
  const specialties: Specialty[] = [
    "Corporate",
    "Real Estate",
    "Family Law",
    "Criminal Defense",
    "Intellectual Property",
    "Technology",
    "Employment",
    "Labor Law",
    "Tax Law",
    "Estate Planning",
    "Immigration",
    "Personal Injury",
    "Medical Malpractice",
    "Environmental",
    "International Trade",
    "Bankruptcy",
    "Securities",
    "Healthcare",
    "Education",
    "Civil Rights",
  ];

  return [...specialties].sort(() => Math.random() - 0.5).slice(0, count);
}

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
] as const;

interface SeedLawFirm {
  name: string;
  slug: string;
  website: string;
  metadata: string;
  isActive: boolean;
}

function generateLawFirms(count: number): SeedLawFirm[] {
  const firms: SeedLawFirm[] = [];
  const usedNames = new Set<string>();
  const usedSlugs = new Set<string>();

  for (let i = 0; i < count; i++) {
    let name: string;
    let slug: string;
    do {
      const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];
      const lastName2 = Math.random() > 0.5 ? lastNames[Math.floor(Math.random() * lastNames.length)] : null;
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

      name = lastName2 ? `${lastName1}, ${lastName2} ${suffix}` : `${lastName1} ${suffix}`;
      slug = generateSlug(name, usedSlugs);
    } while (usedNames.has(name) || usedSlugs.has(slug));

    usedNames.add(name);
    usedSlugs.add(slug);

    const domain = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .replace(/^-+|-+$/g, "");

    const metadata: LawFirmMetadata = {
      specialties: getRandomSpecialties(Math.floor(Math.random() * 3) + 1),
      yearEstablished: Math.floor(Math.random() * (2023 - 1950) + 1950),
      size: ["Small", "Medium", "Large"][Math.floor(Math.random() * 3)] as FirmSize,
    };

    firms.push({
      name,
      slug,
      website: `https://${domain}.example.com`,
      metadata: JSON.stringify(metadata),
      isActive: Math.random() > 0.1,
    });
  }

  return firms;
}

export const lawFirms = generateLawFirms(50);
