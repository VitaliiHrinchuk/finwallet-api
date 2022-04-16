import { CurrencyApiInterface } from "./CurrencyApiInterface";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "nestjs-http-promise";
import { rethrow } from "@nestjs/core/helpers/rethrow";


@Injectable()
export class OXRApi implements CurrencyApiInterface {
  readonly path: string;
  readonly appId: string;

  constructor(
    private config: ConfigService,
    private httpService: HttpService
  ) {
    this.path = config.get<string>('OXR_URL');
    this.appId = config.get<string>('OXR_APP_ID');
  }


  async fetchLatest(baseCurrency: string): Promise<any> {
    try {
      console.log('p', {
        app_id: this.appId,
        base: baseCurrency
      });
      const response = await this.httpService.get(this.path + 'latest.json', {
        params: {
          app_id: this.appId,
          base: baseCurrency
        }
      });

      return response.data;
    } catch (error) {
      console.log('error', error.message);
      throw error;
    }

  }

}
