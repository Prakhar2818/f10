export interface RecordFilters {
  type?: "INCOME" | "EXPENSE";
  category?: string;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
  search?: string;
}

export interface CreateRecordInput {
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  recordDate: Date;
  description?: string;
}

export interface UpdateRecordInput {
  amount?: number;
  type?: "INCOME" | "EXPENSE";
  category?: string;
  recordDate?: Date;
  description?: string;
}
