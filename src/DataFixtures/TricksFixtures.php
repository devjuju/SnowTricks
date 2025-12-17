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
        // Backflip
        $backflip = new Tricks();
        $backflip->setTitle('Backflip');
        $backflip->setSlug(strtolower($this->slugger->slug($backflip->getTitle())));
        $backflip->setContent('Description du trick Backflip');
        $backflip->setFeaturedImage('backflip.jpg');

        // Association avec catégorie et utilisateur
        $backflip->setCategory($this->getReference('Flips', \App\Entity\Categories::class));
        $backflip->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($backflip);
        $this->addReference('trick_backflip', $backflip);

        // Buntslide
        $buntslide = new Tricks();
        $buntslide->setTitle('Buntslide');
        $buntslide->setSlug(strtolower($this->slugger->slug($buntslide->getTitle())));
        $buntslide->setContent('Description du trick Buntslide');
        $buntslide->setFeaturedImage('buntslide.jpg');

        // Association avec catégorie et utilisateur
        $buntslide->setCategory($this->getReference('Rails', \App\Entity\Categories::class));
        $buntslide->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($buntslide);
        $this->addReference('trick_buntslide', $buntslide);

        // Rodeo
        $rodeo = new Tricks();
        $rodeo->setTitle('Rodeo');
        $rodeo->setSlug(strtolower($this->slugger->slug($rodeo->getTitle())));
        $rodeo->setContent('Description du trick Rodeo');
        $rodeo->setFeaturedImage('rodeo.jpg');

        // Association avec catégorie et utilisateur
        $rodeo->setCategory($this->getReference('Flips', \App\Entity\Categories::class));
        $rodeo->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($rodeo);
        $this->addReference('trick_rodeo', $rodeo);

        // Frontflip
        $frontflip = new Tricks();
        $frontflip->setTitle('Frontflip');
        $frontflip->setSlug(strtolower($this->slugger->slug($frontflip->getTitle())));
        $frontflip->setContent('Description du trick Frontflip');
        $frontflip->setFeaturedImage('frontflip.jpg');

        // Association avec catégorie et utilisateur
        $frontflip->setCategory($this->getReference('Flips', \App\Entity\Categories::class));
        $frontflip->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($frontflip);
        $this->addReference('trick_frontflip', $frontflip);


        // Frontside
        $frontside = new Tricks();
        $frontside->setTitle('Frontside');
        $frontside->setSlug(strtolower($this->slugger->slug($frontside->getTitle())));
        $frontside->setContent('Description du trick Frontside');
        $frontside->setFeaturedImage('frontside.jpg');

        // Association avec catégorie et utilisateur
        $frontside->setCategory($this->getReference('Spins', \App\Entity\Categories::class));
        $frontside->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($frontside);
        $this->addReference('trick_frontside', $frontside);

        // Indy
        $indy = new Tricks();
        $indy->setTitle('Indy');
        $indy->setSlug(strtolower($this->slugger->slug($indy->getTitle())));
        $indy->setContent('Description du trick Indy');
        $indy->setFeaturedImage('indy.jpg');

        // Association avec catégorie et utilisateur
        $indy->setCategory($this->getReference('Grabs', \App\Entity\Categories::class));
        $indy->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($indy);
        $this->addReference('trick_indy', $indy);

        // Nose grab
        $noseGrab = new Tricks();
        $noseGrab->setTitle('Nose grab');
        $noseGrab->setSlug(strtolower($this->slugger->slug($noseGrab->getTitle())));
        $noseGrab->setContent('Description du trick Nose grab');
        $noseGrab->setFeaturedImage('nose_grab.jpg');

        // Association avec catégorie et utilisateur
        $noseGrab->setCategory($this->getReference('Grabs', \App\Entity\Categories::class));
        $noseGrab->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($noseGrab);
        $this->addReference('trick_nose_grab', $noseGrab);


        // Cork
        $cork = new Tricks();
        $cork->setTitle('Cork');
        $cork->setSlug(strtolower($this->slugger->slug($cork->getTitle())));
        $cork->setContent('Description du trick Cork');
        $cork->setFeaturedImage('cork.jpg');

        // Association avec catégorie et utilisateur
        $cork->setCategory($this->getReference('Rails', \App\Entity\Categories::class));
        $cork->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($cork);
        $this->addReference('trick_cork', $cork);

        // Corce
        $corce = new Tricks();
        $corce->setTitle('Corce');
        $corce->setSlug(strtolower($this->slugger->slug($corce->getTitle())));
        $corce->setContent('Description du trick Corce');
        $corce->setFeaturedImage('corce.jpg');

        // Association avec catégorie et utilisateur
        $corce->setCategory($this->getReference('Spins', \App\Entity\Categories::class));
        $corce->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($corce);
        $this->addReference('trick_corce', $corce);

        // Tail grab
        $tailGrab = new Tricks();
        $tailGrab->setTitle('Tail grab');
        $tailGrab->setSlug(strtolower($this->slugger->slug($tailGrab->getTitle())));
        $tailGrab->setContent('Description du trick Tail grab');
        $tailGrab->setFeaturedImage('tail_grab.jpg');

        // Association avec catégorie et utilisateur
        $tailGrab->setCategory($this->getReference('Grabs', \App\Entity\Categories::class));
        $tailGrab->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($tailGrab);
        $this->addReference('trick_tail_grab', $tailGrab);

        // Stalefish
        $stalefish = new Tricks();
        $stalefish->setTitle('Stalefish');
        $stalefish->setSlug(strtolower($this->slugger->slug($stalefish->getTitle())));
        $stalefish->setContent('Description du trick Stalefish');
        $stalefish->setFeaturedImage('stalefish.jpg');

        // Association avec catégorie et utilisateur
        $stalefish->setCategory($this->getReference('Spins', \App\Entity\Categories::class));
        $stalefish->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($stalefish);
        $this->addReference('trick_stalefish', $stalefish);


        // Backside
        $backside = new Tricks();
        $backside->setTitle('Backside');
        $backside->setSlug(strtolower($this->slugger->slug($backside->getTitle())));
        $backside->setContent('Description du trick Backside');
        $backside->setFeaturedImage('backside.jpg');

        // Association avec catégorie et utilisateur
        $backside->setCategory($this->getReference('Spins', \App\Entity\Categories::class));
        $backside->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($backside);
        $this->addReference('trick_backside', $backside);


        // Melon
        $melon = new Tricks();
        $melon->setTitle('Melon');
        $melon->setSlug(strtolower($this->slugger->slug($melon->getTitle())));
        $melon->setContent('Description du trick Melon');
        $melon->setFeaturedImage('melon.jpg');

        // Association avec catégorie et utilisateur
        $melon->setCategory($this->getReference('Spins', \App\Entity\Categories::class));
        $melon->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($melon);
        $this->addReference('trick_melon', $melon);


        // Mute
        $mute = new Tricks();
        $mute->setTitle('Mute');
        $mute->setSlug(strtolower($this->slugger->slug($mute->getTitle())));
        $mute->setContent('Description du trick Mute');
        $mute->setFeaturedImage('mute.jpg');

        // Association avec catégorie et utilisateur
        $mute->setCategory($this->getReference('Spins', \App\Entity\Categories::class));
        $mute->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($mute);
        $this->addReference('trick_mute', $mute);

        // Nos grab
        $nosGrab = new Tricks();
        $nosGrab->setTitle('Nos grab');
        $nosGrab->setSlug(strtolower($this->slugger->slug($nosGrab->getTitle())));
        $nosGrab->setContent('Description du trick Nos grab');
        $nosGrab->setFeaturedImage('nos_grab.jpg');

        // Association avec catégorie et utilisateur
        $nosGrab->setCategory($this->getReference('Spins', \App\Entity\Categories::class));
        $nosGrab->setUsers($this->getReference('Jimmy', \App\Entity\Users::class)); // Jimmy a été créé

        $manager->persist($nosGrab);
        $this->addReference('trick_nos_grab', $nosGrab);



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
