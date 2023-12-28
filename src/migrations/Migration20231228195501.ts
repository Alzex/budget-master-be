import { Migration } from '@mikro-orm/migrations';

export class Migration20231228195501 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `currencies` (`id` int unsigned not null auto_increment primary key, `code` varchar(3) not null, `name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `currencies` add unique `currencies_code_unique`(`code`);');

    this.addSql('create table `limits` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `max_loss` int not null, `days` int not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `target` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `description` varchar(255) null, `until` datetime not null, `target_quantity` int not null, `user_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `target` add unique `target_name_unique`(`name`);');
    this.addSql('alter table `target` add index `target_user_id_index`(`user_id`);');

    this.addSql('create table `balances` (`id` int unsigned not null auto_increment primary key, `amount` int not null, `currency_id` int unsigned not null, `user_id` int unsigned not null, `limit_id` int unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `balances` add index `balances_user_id_index`(`user_id`);');
    this.addSql('alter table `balances` add index `balances_limit_id_index`(`limit_id`);');
    this.addSql('alter table `balances` add index `balances_currency_id_index`(`currency_id`);');

    this.addSql('create table `transactions` (`id` int unsigned not null auto_increment primary key, `type` varchar(255) not null, `amount` int not null, `balance_id` int unsigned not null, `user_id` int unsigned not null, `target_id` int unsigned not null, `category_id` int not null, `ignore` tinyint(1) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `transactions` add index `transactions_balance_id_index`(`balance_id`);');
    this.addSql('alter table `transactions` add index `transactions_user_id_index`(`user_id`);');
    this.addSql('alter table `transactions` add index `transactions_target_id_index`(`target_id`);');

    this.addSql('alter table `target` add constraint `target_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');

    this.addSql('alter table `balances` add constraint `balances_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');
    this.addSql('alter table `balances` add constraint `balances_limit_id_foreign` foreign key (`limit_id`) references `limits` (`id`) on update cascade;');
    this.addSql('alter table `balances` add constraint `balances_currency_id_foreign` foreign key (`currency_id`) references `currencies` (`id`) on update cascade;');

    this.addSql('alter table `transactions` add constraint `transactions_balance_id_foreign` foreign key (`balance_id`) references `balances` (`id`) on update cascade;');
    this.addSql('alter table `transactions` add constraint `transactions_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');
    this.addSql('alter table `transactions` add constraint `transactions_target_id_foreign` foreign key (`target_id`) references `target` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `balances` drop foreign key `balances_currency_id_foreign`;');

    this.addSql('alter table `balances` drop foreign key `balances_limit_id_foreign`;');

    this.addSql('alter table `transactions` drop foreign key `transactions_target_id_foreign`;');

    this.addSql('alter table `transactions` drop foreign key `transactions_balance_id_foreign`;');

    this.addSql('drop table if exists `currencies`;');

    this.addSql('drop table if exists `limits`;');

    this.addSql('drop table if exists `target`;');

    this.addSql('drop table if exists `balances`;');

    this.addSql('drop table if exists `transactions`;');
  }

}
