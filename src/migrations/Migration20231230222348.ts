import { Migration } from '@mikro-orm/migrations';

export class Migration20231230222348 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `limits` modify `until` datetime null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `limits` modify `until` datetime not null;');
  }

}
