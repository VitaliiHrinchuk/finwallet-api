import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "../models/account.model";

import { FetchAnalyticsQuery } from "../commands/fetch-analytics.query";
import { InternalServerErrorException } from "@nestjs/common";
import { AnalyticsCreator, AnalyticsType } from "../analytics/analytics-creator";
import { Model } from "sequelize-typescript";
import { TransactionType } from "../../transaction/domain/transaction.entity";
import * as moment from "moment";

@CommandHandler(FetchAnalyticsQuery)
export class FetchAnalyticsQueryHandler implements ICommandHandler<FetchAnalyticsQuery> {

  constructor(
    @InjectModel(Account) private readonly accounts: typeof Account,
    private readonly analytics: AnalyticsCreator
  ) {}

  async execute(command: FetchAnalyticsQuery): Promise<any> {
    try {
      const result: Model[] = await this.analytics.fetch(command.dto.type, {
        startDate: new Date(command.dto.startDate),
        endDate: new Date(command.dto.endDate),
        transactionType: TransactionType.CRE,
        accountId: command.dto.accountId,
        userId: command.dto.userId
      });

      return {
        data: result
      };
    } catch (error) {
      console.log('err', error);
      throw new InternalServerErrorException();
    }

  }

}
