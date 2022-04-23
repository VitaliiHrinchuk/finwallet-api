import { TransactionType } from "../../transaction/domain/transaction.entity";

export interface AnalyticsFilters {
  startDate: Date,
  endDate: Date,
  accountId?: string,
  transactionType?: TransactionType,
  userId: string
}
