import { FetchAnalyticsDto } from "../dto/fetch-analytics.dto";

export class FetchAnalyticsQuery {
  constructor(
    public readonly dto: FetchAnalyticsDto
  ) {
  }
}
