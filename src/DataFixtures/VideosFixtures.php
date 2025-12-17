<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Videos;
use App\DataFixtures\TricksFixtures;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class VideosFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Vidéos sûres pour embed
        $videos = [
            'trick_nos_grab' => [
                'https://www.youtube.com/embed/M7lc1UVf-VE', // Vidéo officielle YouTube API
                'https://www.youtube.com/embed/3LrPAz4cjh0', // Vidéo tutoriel
            ],

        ];

        foreach ($videos as $trickRef => $urls) {
            foreach ($urls as $url) {
                $video = new Videos();
                $video->setContent($url);
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
