export abstract class CurrencyApiInterface {
  path: string;

  abstract fetchLatest(baseCurrency: string): Promise<any>;
}