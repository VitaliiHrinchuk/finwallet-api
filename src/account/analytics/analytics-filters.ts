import { TransactionType } from "../../transaction/domain/transaction.entity";

export interface AnalyticsFilters {
  startDate: Date,
  endDate: Date,
  transactionType?: TransactionType
}
