import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DomainEvent, Projector } from "nest-event-sourcing";
import { Transaction } from "../models/transaction.model";
import { TransactionCreated } from "../events/transaction-created.event";
import { TransactionDeleted } from "../events/transaction-deleted.event";
import { TransactionUpdated } from "../events/transaction-updated.event";
import { dateToPgdate } from "../../common/helpers/date-to-pgdate";
import { Category } from "../../category/models/category.model";
import { Tag } from "../../tag/models/tag.model";
import e from "express";
import { TransactionTag } from "../models/transaction-tag.model";
import { v4 as uuidv4 } from 'uuid';
import { TransactionAmountUpdated } from "../events/transaction-amount-updated.event";
@Injectable()
export class TransactionProjector extends Projector {

  constructor(
    @InjectModel(Transaction) private readonly transactions: typeof Transaction,
    @InjectModel(Category) private readonly categories: typeof Category,
    @InjectModel(Tag) private readonly tags: typeof Tag,
    @InjectModel(TransactionTag) private readonly transactionTags: typeof TransactionTag,
  ) {
    super();
  }

  private async loadInstance(event: DomainEvent): Promise<Transaction> {
      const id: string = event.aggregateId;
      return this.transactions.findByPk(id)
  }

  private async getTagsBySlug(slugs: string[]): Promise<Tag[]> {
    return this.tags.findAll({
      where: {
        slug: slugs
      }
    })
  }

  private async setTransactionTags(tags: Tag[], transactionId: string): Promise<TransactionTag[]> {
    const formatted = tags.map(tag => ({
      id: uuidv4(),
      tagId: tag.id,
      transactionId: transactionId
    }));

    return this.transactionTags.bulkCreate(formatted);
  }

  private async clearTransactionTags(transactionId: string): Promise<void> {
    await this.transactionTags.destroy({
      where: {
        transactionId: transactionId
      }
    });
  }

  async applyTransactionCreated(event: TransactionCreated) {

    //const date = dateToPgdate(new Date(event.payload.transactionDate));

    const category = await this.categories.findOne({
      where: {
        slug: event.payload.categorySlug
      }
    });

    await this.transactions.create({
      id: event.aggregateId,
      currency: event.payload.currency,
      amount: event.payload.amount,
      accountCurrencyAmount: event.payload.accountCurrencyAmount,
      baseCurrencyAmount: event.payload.baseCurrencyAmount,
      transactionType: event.payload.transactionType,
      transactionDate: new Date(event.payload.transactionDate),
      note: event.payload.note,
      userId: event.payload.userId,
      accountId: event.payload.accountId,
      categoryId: category.id
    });

    if (event.payload.tags && event.payload.tags.length > 0) {
      const tags = await this.getTagsBySlug(event.payload.tags);
      await this.setTransactionTags(tags, event.aggregateId);
    }


  }

  async applyTransactionDeleted(event: TransactionDeleted) {
    await this.transactions.destroy({
      where: {
        id: event.aggregateId
      }
    });

    await this.transactionTags.destroy({
      where: {
        transactionId: event.aggregateId
      }
    });

  }
  async applyTransactionUpdated(event: TransactionUpdated) {
    const transaction: Transaction = await this.loadInstance(event);

    //const date: string = dateToPgdate(new Date(event.payload.transactionDate));
    const category = await this.categories.findOne({
      where: {
        slug: event.payload.categorySlug
      }
    });

    transaction.note = event.payload.note;
    transaction.transactionDate = new Date(event.payload.transactionDate);
    transaction.categoryId = category.id;

    if (event.payload.tags && event.payload.tags.length > 0) {
      const tags = await this.getTagsBySlug(event.payload.tags);
      await this.clearTransactionTags(event.aggregateId);
      await this.setTransactionTags(tags, event.aggregateId);
    }


    await transaction.save();
  }

  async applyTransactionAmountUpdated(event: TransactionAmountUpdated) {
    const transaction: Transaction = await this.loadInstance(event);

    transaction.amount = event.payload.amount;
    transaction.accountCurrencyAmount = event.payload.accountCurrencyAmount;

    await transaction.save();
  }
}
