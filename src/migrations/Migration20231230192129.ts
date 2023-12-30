import { Migration } from '@mikro-orm/migrations';

export class Migration20231230192129 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transactions` drop foreign key `transactions_target_id_foreign`;');

    this.addSql('alter table `transactions` modify `target_id` int unsigned null;');
    this.addSql('alter table `transactions` add constraint `transactions_target_id_foreign` foreign key (`target_id`) references `target` (`id`) on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transactions` drop foreign key `transactions_target_id_foreign`;');

    this.addSql('alter table `transactions` modify `target_id` int unsigned not null;');
    this.addSql('alter table `transactions` add constraint `transactions_target_id_foreign` foreign key (`target_id`) references `target` (`id`) on update cascade;');
  }

}
