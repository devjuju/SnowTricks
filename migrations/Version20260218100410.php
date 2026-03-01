<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260218100410 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE images CHANGE users_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE images ADD CONSTRAINT FK_E01FBE6AA76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('CREATE INDEX IDX_E01FBE6AA76ED395 ON images (user_id)');
        $this->addSql('ALTER TABLE videos DROP FOREIGN KEY `FK_29AA643267B3B43D`');
        $this->addSql('DROP INDEX IDX_29AA643267B3B43D ON videos');
        $this->addSql('ALTER TABLE videos CHANGE users_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE videos ADD CONSTRAINT FK_29AA6432A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('CREATE INDEX IDX_29AA6432A76ED395 ON videos (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE images DROP FOREIGN KEY FK_E01FBE6AA76ED395');
        $this->addSql('DROP INDEX IDX_E01FBE6AA76ED395 ON images');
        $this->addSql('ALTER TABLE images CHANGE user_id users_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE videos DROP FOREIGN KEY FK_29AA6432A76ED395');
        $this->addSql('DROP INDEX IDX_29AA6432A76ED395 ON videos');
        $this->addSql('ALTER TABLE videos CHANGE user_id users_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE videos ADD CONSTRAINT `FK_29AA643267B3B43D` FOREIGN KEY (users_id) REFERENCES users (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_29AA643267B3B43D ON videos (users_id)');
    }
}
