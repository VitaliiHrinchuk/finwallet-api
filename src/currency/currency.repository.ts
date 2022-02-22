import { CurrencyApiInterface } from "./api/CurrencyApiInterface";
import * as fs from "fs";
import { CurrencyRates } from "./currency.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CurrencyRepository {
  constructor(private readonly currencyApi: CurrencyApiInterface) {}

  private _formatLocalFileName(base: string) {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${base}`;
  }

  private _getLocalFilePath(base: string): string {
    const fileName = this._formatLocalFileName(base) + ".json";
    return process.cwd() + '/currencies/' + fileName;
  }

  private async fetchCurrencies(base: string): Promise<CurrencyRates> {
    const currencies = await this.currencyApi.fetchLatest(base);

    const result: CurrencyRates = {
      base: currencies.base,
      rates: currencies.rates
    };

    return new Promise((resolve, reject) => {
      const filePath = this._getLocalFilePath(base);

      fs.writeFile(filePath, JSON.stringify(result), (err) => {
        if (err) {
          console.log('error is', err);
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  }

  private async getLocalCurrencies(base: string): Promise<CurrencyRates> {
    const filePath = this._getLocalFilePath(base);
    console.log('fetching local:', filePath);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          return reject(err);
        } else {
          const formattedData = JSON.parse(data);

          return resolve({
            base: formattedData.base,
            rates: formattedData.rates
          });
        }
      });
    });
  }


  async getCurrencies(base: string): Promise<CurrencyRates> {
    try {
      console.log("===== Trying to get currencies local");
      const result: CurrencyRates = await this.getLocalCurrencies(base);

      return result;
    } catch (e) {
      console.log("===== Fail. Fetching from api.....");
      const result: CurrencyRates = await this.fetchCurrencies(base);

      return result;
    }
  }
}
