<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class CommentsFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $comment = new \App\Entity\Comments();
        $comment->setContent("Super trick ! J'adore");
        $comment->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Utilisateur existant
        $comment->setTricks($this->getReference('trick_backflip', \App\Entity\Tricks::class));

        $manager->persist($comment);
        $manager->flush();
    }



    public function getDependencies(): array
    {
        return [
            TricksFixtures::class,
            UsersFixtures::class,
        ];
    }
}
