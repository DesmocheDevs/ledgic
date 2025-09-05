export interface Purchase {
  id: string;
  companyId: string;
  supplierId: string;
  invoiceNumber?: string | null;
  totalAmount: string; // Decimal as string
  status: "PENDING" | "COMPLETED" | "CANCELED";
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  materialId: string;
  quantity: string; // Decimal as string
  unitPrice: string; // Decimal as string
  itemTotal: string; // Decimal as string
}
