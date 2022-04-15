import { Model, Sequelize } from "sequelize-typescript";
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "../models/account.model";
import { Transaction } from "../../transaction/models/transaction.model";
import { Category } from "../../category/models/category.model";
import { AnalyticsFilters } from "./analytics-filters";
import { Op } from "sequelize";
import * as moment from "moment";
import { BadRequestException } from "@nestjs/common";

export enum AnalyticsType {
  category = 'category',
  summaryCurrency = 'summaryCurrency',
  summaryDate = 'summaryDate',
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

      case AnalyticsType.summaryCurrency:
        return this.summaryByCurrency().then(items => items.map(item => item.toJSON()));

      case AnalyticsType.summaryDate:
        if (!filters.startDate || !filters.endDate || !filters.transactionType) {
          throw new BadRequestException('Provide all required filters');
        }
        return this.summaryByDate(filters);
    }
    return this.summaryByCategories(filters)
  };

  async summaryByCategories(filters: AnalyticsFilters): Promise<Transaction[]> {
    return this.transactions.findAll({
      where: {
        transactionType: filters.transactionType.toString(),
        transactionDate: {
          [Op.between]: [
            filters.startDate,
            filters.endDate
          ]
        }
      },
      attributes: ["category.id", [Sequelize.col("category.name"), "name"], [Sequelize.fn("sum", Sequelize.col("base_currency_amount")), "sum"]],
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

    const summarizedTransactions: Transaction[] = await this.transactions.findAll({
      where: {
        transactionType: filters.transactionType.toString(),
        transactionDate: {
          [Op.between]: [
            filters.startDate,
            filters.endDate
          ]
        }
      },
      attributes: ['transactionDate', [Sequelize.fn("sum", Sequelize.col("base_currency_amount")), "sum"]],
      group: ["transactionDate"]
    });

    for (const m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
      const formattedDate = m.format('YYYY-MM-DD');
      const valueIndex: number = summarizedTransactions.findIndex(
        item => moment(item.transactionDate).format('YYYY-MM-DD') == formattedDate
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


  async summaryByCurrency(): Promise<Account[]> {
    return this.accounts.findAll({
      attributes: ["currency", [Sequelize.fn("sum", Sequelize.col("amount")), "sum"]],
      group: ["currency"]
    });
  }
}
