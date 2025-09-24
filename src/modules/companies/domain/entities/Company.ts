export interface Company {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  contact?: string | null;
  email?: string | null;
  type: "ORGANIZATION" | "SUPPLIER" | "BOTH";
  createdAt: Date;
  updatedAt: Date;
}
