import { Migration } from '@mikro-orm/migrations';

export class Migration20231119190603 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `user` (`id` int unsigned not null auto_increment primary key, `email` varchar(255) not null, `username` varchar(255) null, `role` enum('USER', 'ADMIN') not null, `password_hash` varchar(255) not null, `password_salt` varchar(255) not null, `created_at` datetime not null, `updated_at` datetime not null) default character set utf8mb4 engine = InnoDB;",
    );
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);');
  }
}
