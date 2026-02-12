<?php

namespace App\Security\Voter;

use App\Entity\Images;
use App\Entity\Videos;
use App\Entity\Users;
use Symfony\Bundle\SecurityBundle\Security as SecurityBundleSecurity;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class MediaVoter extends Voter
{
    const EDIT   = 'MEDIA_EDIT';
    const DELETE = 'MEDIA_DELETE';

    public function __construct(private SecurityBundleSecurity $security) {}

    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::DELETE])
            && ($subject instanceof Images || $subject instanceof Videos);
    }

    protected function voteOnAttribute(string $attribute, $media, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof Users) {
            return false; // non connecté
        }

        // ADMIN peut tout
        if ($this->security->isGranted('ROLE_MEMBER')) {
            return true;
        }

        switch ($attribute) {
            case self::EDIT:
            case self::DELETE:
                // Seul le propriétaire du média peut éditer/supprimer
                return $media->getUsers()?->getId() === $user->getId();
        }

        return false;
    }
}
