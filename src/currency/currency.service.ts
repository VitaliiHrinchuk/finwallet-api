import { Injectable, StreamableFile } from "@nestjs/common";
import { CurrencyRepository } from "./currency.repository";
import { CurrencyRates } from "./currency.types";

@Injectable()
export class CurrencyService {
  constructor(private readonly repository: CurrencyRepository) {}

  async convert(baseCurrency: string, resultCurrency: string, amount: number): Promise<number> {
    const currency: CurrencyRates = await this.repository.getCurrencies(baseCurrency);
    const resultCurrencyRate = currency.rates[resultCurrency];

    return amount / resultCurrencyRate;
  }

}
