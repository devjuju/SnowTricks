<?php

namespace App\DataFixtures;

use App\Entity\Tricks;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

class TricksFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(private SluggerInterface $slugger) {}

    public function load(ObjectManager $manager): void
    {
        $tricksData = [
            ['title' => 'Backflip',    'content' => 'Description du trick Backflip',    'image' => 'backflip.jpg',    'category' => 'Flips',  'user' => 'Jimmy'],
            ['title' => 'Buntslide',   'content' => 'Description du trick Buntslide',   'image' => 'buntslide.jpg',   'category' => 'Rails',  'user' => 'Jimmy'],
            ['title' => 'Rodeo',       'content' => 'Description du trick Rodeo',       'image' => 'rodeo.jpg',       'category' => 'Flips',  'user' => 'Jimmy'],
            ['title' => 'Frontflip',   'content' => 'Description du trick Frontflip',   'image' => 'frontflip.jpg',   'category' => 'Flips',  'user' => 'Jimmy'],
            ['title' => 'Frontside',   'content' => 'Description du trick Frontside',   'image' => 'frontside.jpg',   'category' => 'Spins',  'user' => 'Jimmy'],
            ['title' => 'Indy',        'content' => 'Description du trick Indy',        'image' => 'indy.jpg',        'category' => 'Grabs',  'user' => 'Jimmy'],
            ['title' => 'Nose grab',   'content' => 'Description du trick Nose grab',   'image' => 'nose_grab.jpg',   'category' => 'Grabs',  'user' => 'Jimmy'],
            ['title' => 'Cork',        'content' => 'Description du trick Cork',        'image' => 'cork.jpg',        'category' => 'Rails',  'user' => 'Jimmy'],
            ['title' => 'Corce',       'content' => 'Description du trick Corce',       'image' => 'corce.jpg',       'category' => 'Spins',  'user' => 'Jimmy'],
            ['title' => 'Tail grab',   'content' => 'Description du trick Tail grab',   'image' => 'tail_grab.jpg',   'category' => 'Grabs',  'user' => 'Jimmy'],
            ['title' => 'Stalefish',   'content' => 'Description du trick Stalefish',   'image' => 'stalefish.jpg',   'category' => 'Spins',  'user' => 'Jimmy'],
            ['title' => 'Backside',    'content' => 'Description du trick Backside',    'image' => 'backside.jpg',    'category' => 'Spins',  'user' => 'Jimmy'],
            ['title' => 'Melon',       'content' => 'Description du trick Melon',       'image' => 'melon.jpg',       'category' => 'Spins',  'user' => 'Jimmy'],
            ['title' => 'Mute',        'content' => 'Description du trick Mute',        'image' => 'mute.jpg',        'category' => 'Spins',  'user' => 'Jimmy'],
            ['title' => 'Nos grab',    'content' => 'Description du trick Nos grab',    'image' => 'nos_grab.jpg',    'category' => 'Spins',  'user' => 'Jimmy'],
        ];

        foreach ($tricksData as $data) {
            $trick = new Tricks();
            $trick->setTitle($data['title']);
            $trick->setSlug(strtolower($this->slugger->slug($data['title'])));
            $trick->setContent($data['content']);
            $trick->setFeaturedImage($data['image']);
            $trick->setCategory($this->getReference(
                $data['category'],
                \App\Entity\Categories::class
            ));
            $trick->setUser($this->getReference(
                $data['user'],
                \App\Entity\Users::class
            ));

            $manager->persist($trick);

            $ref = 'trick_' . strtolower(str_replace(' ', '_', $data['title']));
            $this->addReference($ref, $trick);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UsersFixtures::class,
            CategoriesFixtures::class,
        ];
    }
}
