<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\Entity\Images;

class ImagesFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $imagesData = [
            'trick_nos_grab' => ['nos_grab_1.jpg', 'nos_grab_2.jpg', 'nos_grab_3.jpg'],
            'trick_mute'     => ['mute_1.jpg', 'mute_2.jpg', 'mute_3.jpg'],
            'trick_melon' => ['nos_grab_1.jpg', 'nos_grab_2.jpg', 'nos_grab_3.jpg'],
            'trick_backside'     => ['mute_1.jpg', 'mute_2.jpg', 'mute_3.jpg'],
            'trick_stalefish'     => ['mute_1.jpg', 'mute_2.jpg', 'mute_3.jpg'],
            'trick_corce' => ['nos_grab_1.jpg', 'nos_grab_2.jpg', 'nos_grab_3.jpg'],
        ];

        foreach ($imagesData as $trickRef => $files) {
            foreach ($files as $file) {
                $image = new Images();
                $image->setPicture($file);
                $image->setTrick($this->getReference($trickRef, \App\Entity\Tricks::class));
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
