import { Model, Sequelize } from "sequelize-typescript";
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "../models/account.model";
import { Transaction } from "../../transaction/models/transaction.model";
import { Category } from "../../category/models/category.model";
import { AnalyticsFilters } from "./analytics-filters";
import { Op, WhereOptions } from "sequelize";
import * as moment from "moment";
import { BadRequestException } from "@nestjs/common";

export enum AnalyticsType {
  category = 'category',
  currency = 'currency',
  date = 'date',
};

export class AnalyticsCreator {
  constructor(
    @InjectModel(Account) private readonly accounts: typeof Account,
    @InjectModel(Transaction) private readonly transactions: typeof Transaction
  ) {
  }

  public fetch(type: AnalyticsType, filters: AnalyticsFilters): Promise<any[]> {
    switch (type) {
      case AnalyticsType.category:
        if (!filters.startDate || !filters.endDate || !filters.transactionType) {
          throw new BadRequestException('Provide all required filters');
        }
        return this.summaryByCategories(filters).then(items => items.map(item => item.toJSON()));

      case AnalyticsType.currency:
        return this.summaryByCurrency(filters).then(items => items.map(item => item.toJSON()));

      case AnalyticsType.date:
        if (!filters.startDate || !filters.endDate || !filters.transactionType) {
          throw new BadRequestException('Provide all required filters');
        }
        return this.summaryByDate(filters);
    }
    return this.summaryByCategories(filters)
  };

  async summaryByCategories(filters: AnalyticsFilters): Promise<Transaction[]> {

    const where: WhereOptions  = {
      transactionType: filters.transactionType.toString(),
      userId: filters.userId,
      transactionDate: {
        [Op.between]: [
          filters.startDate,
          filters.endDate
        ]
      }
    };

    if (filters.accountId) {
      where['accountId'] = filters.accountId;
    }

    return this.transactions.findAll({
      where: where,
      attributes: [
        "category.id",
        [Sequelize.col("category.name"), "name"],
        [Sequelize.col("category.slug"), "slug"],
        [Sequelize.fn("sum", Sequelize.col("base_currency_amount")), "sum"],
      ],
      include: [
        Category
      ],
      group: ["category.id"]
    });
  }

  async summaryByDate(filters: AnalyticsFilters): Promise<Transaction[]> {
    const startDate = moment(filters.startDate);
    const endDate = moment(filters.endDate);
    const result = [];

    const where: WhereOptions  = {
      transactionType: filters.transactionType.toString(),
      userId: filters.userId,
      transactionDate: {
        [Op.between]: [
          filters.startDate,
          filters.endDate
        ]
      }
    };

    if (filters.accountId) {
      where['accountId'] = filters.accountId;
    }

    const summarizedTransactions: Transaction[] = await this.transactions.findAll({
      where: where,
      attributes: [
        [Sequelize.fn('date_trunc', 'day', Sequelize.col('transaction_date')), 'date'],
        [Sequelize.fn("sum", Sequelize.col("base_currency_amount")), "sum"]
      ],
      group: [Sequelize.fn('date_trunc', 'day', Sequelize.col('transaction_date'))]
    });

    for (const m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
      const formattedDate = m.format('YYYY-MM-DD');
      const valueIndex: number = summarizedTransactions.findIndex(
        item => moment(item.getDataValue('date')).format('YYYY-MM-DD') == formattedDate
      );

      if (valueIndex != -1) {
        const groupItem: Transaction = summarizedTransactions[valueIndex];
        result.push({
          sum: groupItem.getDataValue('sum'),
          date: m.toDate()
        });
      } else {
        result.push({
          sum: 0,
          date: m.toDate()
        });
      }
    }

    return result;
  }


  async summaryByCurrency(filters: AnalyticsFilters): Promise<Account[]> {
    return this.accounts.findAll({
      where: {
        createdBy: filters.userId,
      },
      attributes: ["currency", [Sequelize.fn("sum", Sequelize.col("amount")), "sum"]],
      group: ["currency"]
    });
  }
}
