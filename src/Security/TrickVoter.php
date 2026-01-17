<?php

namespace App\Security;

use App\Entity\Tricks;
use App\Entity\Images;
use App\Entity\Videos;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class TrickVoter extends Voter
{
    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, ['TRICK_EDIT', 'TRICK_DELETE', 'MEDIA_EDIT', 'MEDIA_DELETE'])
            && ($subject instanceof Tricks || $subject instanceof Images || $subject instanceof Videos);
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof UserInterface) return false;

        switch ($attribute) {
            case 'TRICK_EDIT':
            case 'TRICK_DELETE':
                // Seul le propriétaire de la trick
                return $subject->getUser() === $user;

            case 'MEDIA_EDIT':
            case 'MEDIA_DELETE':
                $trick = $subject->getTrick();
                // Soit le propriétaire de la trick, soit le propriétaire du média
                return $trick && ($trick->getUser() === $user || $subject->getUser() === $user);

            default:
                return false;
        }
    }
}
