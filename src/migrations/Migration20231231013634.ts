import { Migration } from '@mikro-orm/migrations';

export class Migration20231231013634 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `target` add `current_quantity` int not null default 0, add `created_at` datetime not null default now();',
    );
    this.addSql('alter table `target` modify `until` datetime null;');

    this.addSql(
      'alter table `transactions` add `created_at` datetime not null default now();',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `target` modify `until` datetime not null;');
    this.addSql('alter table `target` drop `current_quantity`;');
    this.addSql('alter table `target` drop `created_at`;');

    this.addSql('alter table `transactions` drop `created_at`;');
  }
}
