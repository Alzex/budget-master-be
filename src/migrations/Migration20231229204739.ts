import { Migration } from '@mikro-orm/migrations';

export class Migration20231229204739 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `category` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `category` add unique `category_name_unique`(`name`);');

    this.addSql('alter table `balances` drop foreign key `balances_limit_id_foreign`;');

    this.addSql('alter table `target` drop index `target_name_unique`;');

    this.addSql('alter table `limits` add `until` datetime not null, add `user_id` int unsigned not null;');
    this.addSql('alter table `limits` add constraint `limits_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');
    this.addSql('alter table `limits` drop `days`;');
    this.addSql('alter table `limits` add index `limits_user_id_index`(`user_id`);');

    this.addSql('alter table `balances` modify `amount` int not null default 0;');
    this.addSql('alter table `balances` add constraint `balances_limit_id_foreign` foreign key (`limit_id`) references `limits` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `transactions` add `ignore_limit` tinyint(1) not null default false;');
    this.addSql('alter table `transactions` modify `type` enum(\'debit\', \'credit\') not null, modify `category_id` int unsigned not null;');
    this.addSql('alter table `transactions` drop `ignore`;');
    this.addSql('alter table `transactions` add constraint `transactions_category_id_foreign` foreign key (`category_id`) references `category` (`id`) on update cascade;');
    this.addSql('alter table `transactions` add index `transactions_category_id_index`(`category_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transactions` drop foreign key `transactions_category_id_foreign`;');

    this.addSql('drop table if exists `category`;');

    this.addSql('alter table `limits` drop foreign key `limits_user_id_foreign`;');

    this.addSql('alter table `balances` drop foreign key `balances_limit_id_foreign`;');

    this.addSql('alter table `limits` add `days` int not null;');
    this.addSql('alter table `limits` drop index `limits_user_id_index`;');
    this.addSql('alter table `limits` drop `until`;');
    this.addSql('alter table `limits` drop `user_id`;');

    this.addSql('alter table `target` add unique `target_name_unique`(`name`);');

    this.addSql('alter table `balances` modify `amount` int not null;');
    this.addSql('alter table `balances` add constraint `balances_limit_id_foreign` foreign key (`limit_id`) references `limits` (`id`) on update cascade;');

    this.addSql('alter table `transactions` add `ignore` tinyint(1) not null;');
    this.addSql('alter table `transactions` modify `type` varchar(255) not null, modify `category_id` int not null;');
    this.addSql('alter table `transactions` drop index `transactions_category_id_index`;');
    this.addSql('alter table `transactions` drop `ignore_limit`;');
  }

}
