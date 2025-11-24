<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251124102913 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE categories (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE comments (id INT AUTO_INCREMENT NOT NULL, content LONGTEXT NOT NULL, users_id INT NOT NULL, tricks_id INT NOT NULL, INDEX IDX_5F9E962A67B3B43D (users_id), INDEX IDX_5F9E962A3B153154 (tricks_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE images (id INT AUTO_INCREMENT NOT NULL, content VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE tricks (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, content LONGTEXT NOT NULL, featured_image VARCHAR(255) NOT NULL, users_id INT NOT NULL, INDEX IDX_E1D902C167B3B43D (users_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE tricks_categories (tricks_id INT NOT NULL, categories_id INT NOT NULL, INDEX IDX_CAB447003B153154 (tricks_id), INDEX IDX_CAB44700A21214B7 (categories_id), PRIMARY KEY (tricks_id, categories_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE tricks_images (tricks_id INT NOT NULL, images_id INT NOT NULL, INDEX IDX_D4A857A83B153154 (tricks_id), INDEX IDX_D4A857A8D44F05E5 (images_id), PRIMARY KEY (tricks_id, images_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE tricks_videos (tricks_id INT NOT NULL, videos_id INT NOT NULL, INDEX IDX_1D1D8DF03B153154 (tricks_id), INDEX IDX_1D1D8DF0763C10B2 (videos_id), PRIMARY KEY (tricks_id, videos_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, username VARCHAR(50) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE videos (id INT AUTO_INCREMENT NOT NULL, content VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962A67B3B43D FOREIGN KEY (users_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962A3B153154 FOREIGN KEY (tricks_id) REFERENCES tricks (id)');
        $this->addSql('ALTER TABLE tricks ADD CONSTRAINT FK_E1D902C167B3B43D FOREIGN KEY (users_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE tricks_categories ADD CONSTRAINT FK_CAB447003B153154 FOREIGN KEY (tricks_id) REFERENCES tricks (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tricks_categories ADD CONSTRAINT FK_CAB44700A21214B7 FOREIGN KEY (categories_id) REFERENCES categories (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tricks_images ADD CONSTRAINT FK_D4A857A83B153154 FOREIGN KEY (tricks_id) REFERENCES tricks (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tricks_images ADD CONSTRAINT FK_D4A857A8D44F05E5 FOREIGN KEY (images_id) REFERENCES images (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tricks_videos ADD CONSTRAINT FK_1D1D8DF03B153154 FOREIGN KEY (tricks_id) REFERENCES tricks (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tricks_videos ADD CONSTRAINT FK_1D1D8DF0763C10B2 FOREIGN KEY (videos_id) REFERENCES videos (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE comments DROP FOREIGN KEY FK_5F9E962A67B3B43D');
        $this->addSql('ALTER TABLE comments DROP FOREIGN KEY FK_5F9E962A3B153154');
        $this->addSql('ALTER TABLE tricks DROP FOREIGN KEY FK_E1D902C167B3B43D');
        $this->addSql('ALTER TABLE tricks_categories DROP FOREIGN KEY FK_CAB447003B153154');
        $this->addSql('ALTER TABLE tricks_categories DROP FOREIGN KEY FK_CAB44700A21214B7');
        $this->addSql('ALTER TABLE tricks_images DROP FOREIGN KEY FK_D4A857A83B153154');
        $this->addSql('ALTER TABLE tricks_images DROP FOREIGN KEY FK_D4A857A8D44F05E5');
        $this->addSql('ALTER TABLE tricks_videos DROP FOREIGN KEY FK_1D1D8DF03B153154');
        $this->addSql('ALTER TABLE tricks_videos DROP FOREIGN KEY FK_1D1D8DF0763C10B2');
        $this->addSql('DROP TABLE categories');
        $this->addSql('DROP TABLE comments');
        $this->addSql('DROP TABLE images');
        $this->addSql('DROP TABLE tricks');
        $this->addSql('DROP TABLE tricks_categories');
        $this->addSql('DROP TABLE tricks_images');
        $this->addSql('DROP TABLE tricks_videos');
        $this->addSql('DROP TABLE users');
        $this->addSql('DROP TABLE videos');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
