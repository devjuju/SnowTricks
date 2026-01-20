<?php

namespace App\Security\Voter;

use App\Entity\Tricks;
use App\Entity\Users;
use Symfony\Bundle\SecurityBundle\Security as SecurityBundleSecurity;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class TrickVoter extends Voter
{
    const EDIT   = 'TRICK_EDIT';
    const DELETE = 'TRICK_DELETE';

    public function __construct(private SecurityBundleSecurity $security) {}

    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::DELETE])
            && $subject instanceof Tricks;
    }

    protected function voteOnAttribute(string $attribute, $trick, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof Users) {
            return false; // non connecté
        }

        // ADMIN peut tout
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return true;
        }

        switch ($attribute) {
            case self::EDIT:
            case self::DELETE:
                // Seul le propriétaire peut modifier ou supprimer
                return $trick->getUser()?->getId() === $user->getId();
        }

        return false;
    }
}
