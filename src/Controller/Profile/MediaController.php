<?php

namespace App\Controller\Profile;

use App\Entity\Images;
use App\Entity\Tricks;
use App\Service\PictureService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

#[Route('/profile/media')]
class MediaController extends AbstractController
{
    #[Route('/image/{id}', name: 'app_media_image_delete', methods: ['DELETE'])]
    public function deleteImage(
        Images $image,
        Request $request,
        EntityManagerInterface $em,
        PictureService $pictureService
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_MEMBER');

        if (!$this->isCsrfTokenValid('delete_image_' . $image->getId(), $request->headers->get('X-CSRF-TOKEN'))) {
            return new JsonResponse(['error' => 'Token invalide'], 403);
        }

        // Sécurité propriétaire
        if ($image->getTrick()->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Accès refusé'], 403);
        }

        // Supprimer le fichier
        $pictureService->delete('tricks', $image->getPicture());

        // Supprimer DB
        $em->remove($image);
        $em->flush();

        return new JsonResponse(['success' => true]);
    }

    #[Route('/featured/replace/{id}', name: 'app_media_featured_replace', methods: ['POST'])]
    public function replaceFeaturedImage(
        Tricks $trick,
        Request $request,
        EntityManagerInterface $em,
        PictureService $pictureService
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_MEMBER');

        if ($trick->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Accès refusé'], 403);
        }

        if (!$this->isCsrfTokenValid('replace_featured_' . $trick->getId(), $request->request->get('_token'))) {
            return new JsonResponse(['error' => 'Token invalide'], 403);
        }

        $file = $request->files->get('image');
        if (!$file) return new JsonResponse(['error' => 'Aucun fichier'], 400);

        // Supprimer ancienne image
        if ($trick->getFeaturedImage()) {
            $pictureService->delete('tricks', $trick->getFeaturedImage());
        }

        // Enregistrer nouvelle image
        $filename = $pictureService->square($file, 'tricks', 500);
        $trick->setFeaturedImage($filename);

        $em->flush();

        return new JsonResponse([
            'success' => true,
            'image' => '/uploads/tricks/' . $filename
        ]);
    }

    #[Route('/featured/{id}', name: 'app_media_featured_delete', methods: ['DELETE'])]
    public function deleteFeaturedImage(
        Tricks $trick,
        Request $request,
        EntityManagerInterface $em,
        PictureService $pictureService
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_MEMBER');

        if (!$this->isCsrfTokenValid(
            'delete_featured_' . $trick->getId(),
            $request->headers->get('X-CSRF-TOKEN')
        )) {
            return new JsonResponse(['error' => 'Token invalide'], 403);
        }

        if ($trick->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Accès refusé'], 403);
        }

        if ($trick->getFeaturedImage()) {
            $pictureService->delete('tricks', $trick->getFeaturedImage());
            $trick->setFeaturedImage(null);
            $em->flush();
        }

        return new JsonResponse(['success' => true]);
    }
}
