<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Images;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ImagesFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Tableau des images par trick
        $images = [
            'trick_nos_grab' => [
                'nos_grab_1.jpg',
                'nos_grab_2.jpg',
                'nos_grab_3.jpg',
            ],
            'trick_mute' => [
                'mute_1.jpg',
                'mute_2.jpg',
            ],



        ];

        foreach ($images as $trickReference => $files) {
            foreach ($files as $file) {
                $image = new Images();
                $image->setContent($file);
                $image->setTrick($this->getReference($trickReference, \App\Entity\Tricks::class));

                $manager->persist($image);
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
