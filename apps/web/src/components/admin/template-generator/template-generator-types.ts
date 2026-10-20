export type TemplateStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type TemplateCategory = "WEDDING" | "BIRTHDAY" | "KHITANAN";

export interface TemplateGeneratorItem {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  thumbnail: string;
  previewUrl: string;
  isPremium: boolean;
  price: number;
  isActive: boolean;
  status: TemplateStatus;
  tags: string[];
  defaultSectionsCount: number;
  invitationsCount: number;
  createdBy: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateTemplateFormValues {
  name: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string;
  isPremium: boolean;
  price: number;
  tags: string[];
  basePresetSlug: string;
  status: TemplateStatus;
}

export const DEFAULT_CREATE_TEMPLATE_VALUES: CreateTemplateFormValues = {
  name: "",
  slug: "",
  description: "",
  category: "WEDDING",
  thumbnail:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  isPremium: false,
  price: 0,
  tags: ["Aesthetic", "Modern", "Responsif"],
  basePresetSlug: "kartu-pos-vintage",
  status: "DRAFT",
};

