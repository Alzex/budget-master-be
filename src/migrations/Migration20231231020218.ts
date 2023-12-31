import { Migration } from '@mikro-orm/migrations';

export class Migration20231231020218 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transactions` drop foreign key `transactions_category_id_foreign`;');

    this.addSql('alter table `transactions` modify `category_id` int unsigned null;');
    this.addSql('alter table `transactions` add constraint `transactions_category_id_foreign` foreign key (`category_id`) references `category` (`id`) on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transactions` drop foreign key `transactions_category_id_foreign`;');

    this.addSql('alter table `transactions` modify `category_id` int unsigned not null;');
    this.addSql('alter table `transactions` add constraint `transactions_category_id_foreign` foreign key (`category_id`) references `category` (`id`) on update cascade;');
  }

}
