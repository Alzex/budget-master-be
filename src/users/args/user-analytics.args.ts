import { IsDateString } from 'class-validator';

export class UserAnalyticsArgs {
  @IsDateString()
  from: Date;
  to: Date;
}
