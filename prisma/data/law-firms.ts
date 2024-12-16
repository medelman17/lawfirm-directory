export type Specialty =
  | "Corporate"
  | "Real Estate"
  | "Family Law"
  | "Criminal Defense"
  | "Intellectual Property"
  | "Technology"
  | "Employment"
  | "Labor Law"
  | "Tax Law"
  | "Estate Planning"
  | "Immigration"
  | "Personal Injury"
  | "Medical Malpractice"
  | "Environmental"
  | "International Trade"
  | "Bankruptcy"
  | "Securities"
  | "Healthcare"
  | "Education"
  | "Civil Rights";

export type FirmSize = "Small" | "Medium" | "Large";

export interface LawFirmMetadata {
  specialties: Specialty[];
  yearEstablished: number;
  size: FirmSize;
}

export interface GeneratedLawFirm {
  name: string;
  slug: string;
  website: string;
  active: boolean;
  metadata: string;
}

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

const suffixes = [
  "LLP",
  "& Associates",
  "Law Group",
  "Legal",
  "Partners",
  "Law Firm",
  "Attorneys",
  "Law Office",
  "Legal Group",
  "& Partners",
] as const;

function getRandomSpecialties(count: number = 2): Specialty[] {
  const shuffled = [...specialties].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateSlug(name: string, usedSlugs: Set<string>): string {
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!usedSlugs.has(slug)) {
    return slug;
  }

  let counter = 1;
  let newSlug = `${slug}-${counter}`;
  while (usedSlugs.has(newSlug)) {
    counter++;
    newSlug = `${slug}-${counter}`;
  }

  return newSlug;
}

function generateLawFirms(count: number): GeneratedLawFirm[] {
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

  const firms: GeneratedLawFirm[] = [];
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
      active: Math.random() > 0.1,
      metadata: JSON.stringify(metadata),
    });
  }

  return firms;
}

export const lawFirms = generateLawFirms(205);
