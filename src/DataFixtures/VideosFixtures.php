<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\Entity\Videos;

class VideosFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $videosData = [
            'trick_nos_grab' => [
                'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'https://www.youtube.com/watch?v=9bZkp7q19f0',
            ],
            'trick_mute' => [
                'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
                'https://www.youtube.com/watch?v=L_jWHffIx5E',
            ],
            'trick_melon' => [
                'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
                'https://www.youtube.com/watch?v=oRdxUFDoQe0',
            ],
            'trick_backside' => [
                'https://www.youtube.com/watch?v=ZZ5LpwO-An4',
                'https://www.youtube.com/watch?v=OPf0YbXqDm0',
            ],
        ];

        foreach ($videosData as $trickRef => $urls) {
            foreach ($urls as $url) {
                $video = new Videos();
                $video->setUrl($url);
                $video->setTrick($this->getReference($trickRef, \App\Entity\Tricks::class));
                $manager->persist($video);
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            TricksFixtures::class,
        ];
    }
}
