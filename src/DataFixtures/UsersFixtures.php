<?php

namespace App\DataFixtures;

use App\Entity\Users;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UsersFixtures extends Fixture
{
    public function __construct(private readonly UserPasswordHasherInterface $hasher) {}

    public function load(ObjectManager $manager): void
    {
        // Admin
        $admin = new Users();
        $admin->setUsername('Admin');
        $admin->setEmail('admin@example.com');
        $admin->setPassword($this->hasher->hashPassword($admin, 'motdepasse'));
        $admin->setIsVerified(true);
        $admin->setRoles(['ROLE_ADMIN']);
        $manager->persist($admin);
        $this->setReference('Admin', $admin);

        // Jimmy
        $jimmy = new Users();
        $jimmy->setUsername('Jimmy');
        $jimmy->setEmail('jimmy@example.com');
        $jimmy->setPassword($this->hasher->hashPassword($jimmy, 'motdepasse'));
        $jimmy->setIsVerified(true);
        $jimmy->setRoles(['ROLE_MEMBER']);
        $manager->persist($jimmy);
        $this->setReference('Jimmy', $jimmy);

        $manager->flush();
    }
}
