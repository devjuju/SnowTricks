<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\Entity\Comments;

class CommentsFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $commentsData = [
            ['content' => "Super trick ! J'adore", 'trick' => 'trick_backflip', 'user' => 'Jimmy'],
            ['content' => "Ici commentaire de Jimmy", 'trick' => 'trick_nos_grab', 'user' => 'Jimmy'],
            ['content' => "Un commentaire anoyme qui apprécie la figure", 'trick' => 'trick_nos_grab', 'user' => 'Anonyme'],
            ['content' => "j'adorai savoir faire ça !", 'trick' => 'trick_nos_grab', 'user' => 'Incognito'],
            ['content' => "Et un commentaire de plus !", 'trick' => 'trick_nos_grab', 'user' => 'Jimmy'],
        ];

        foreach ($commentsData as $data) {
            $comment = new Comments();
            $comment->setContent($data['content']);
            $comment->setTricks($this->getReference($data['trick'], \App\Entity\Tricks::class));
            $comment->setUsers($this->getReference($data['user'], \App\Entity\Users::class));
            $manager->persist($comment);
        }

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
