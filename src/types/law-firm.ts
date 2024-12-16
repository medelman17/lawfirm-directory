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

export interface LawFirm {
  id: string;
  name: string;
  slug: string;
  website: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
