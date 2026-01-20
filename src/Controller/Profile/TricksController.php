<?php

namespace App\Controller\Profile;

use App\Entity\Tricks;
use App\Entity\Images;
use App\Entity\Videos;
use App\Form\TrickContributeType;
use App\Form\TrickFormType;
use App\Repository\TricksRepository;
use App\Service\ImageUploaderService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/profile/tricks')]
class TricksController extends AbstractController
{
    #[Route('/ajouter', name: 'app_profile_tricks_add')]
    public function add(
        Request $request,
        SluggerInterface $slugger,
        EntityManagerInterface $em,
        ImageUploaderService $imageUploader
    ): Response {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $trick = new Tricks();
        $trick->setUser($this->getUser());

        $form = $this->createForm(TrickFormType::class, $trick);
        $form->handleRequest($request);

        $featuredImageFile = $form->get('featuredImage')->getData();
        $deleteFeatured    = $request->request->get('delete_featured_image', 0);

        if (!$featuredImageFile && $deleteFeatured) {
            $form->get('featuredImage')->addError(new FormError("L'image principale est obligatoire."));
        }

        if ($form->isSubmitted() && $form->isValid()) {
            $trick->setSlug(strtolower($slugger->slug($trick->getTitle())));

            if ($featuredImageFile) {
                $trick->setFeaturedImage($imageUploader->upload($featuredImageFile));
            }

            $this->handleMedia($trick, $form, $imageUploader, $request, $em);

            $em->persist($trick);
            $em->flush();

            $this->addFlash('success', 'Figure ajoutée avec succès');
            return $this->redirectToRoute('app_profile_index');
        }

        return $this->render('profile/tricks/add.html.twig', [
            'form'  => $form->createView(),
            'trick' => $trick,
        ]);
    }

    #[Route('/modifier/{slug}', name: 'app_profile_tricks_edit')]
    public function edit(
        string $slug,
        Request $request,
        SluggerInterface $slugger,
        EntityManagerInterface $em,
        ImageUploaderService $imageUploader,
        TricksRepository $repository
    ): Response {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $trick = $repository->findOneBy(['slug' => $slug]);
        if (!$trick) throw $this->createNotFoundException('Figure introuvable');

        // ✅ Vérifie que le user peut modifier le Trick via voter
        $this->denyAccessUnlessGranted('TRICK_EDIT', $trick);

        $form = $this->createForm(TrickFormType::class, $trick);
        $form->handleRequest($request);

        $featuredImageFile = $form->get('featuredImage')->getData();
        $deleteFeatured    = $form->get('deleteFeaturedImage')->getData() ?? 0;

        if ($deleteFeatured && $trick->getFeaturedImage()) {
            $imageUploader->delete($trick->getFeaturedImage());
            $trick->setFeaturedImage(null);
        }

        if (!$trick->getFeaturedImage() && !$featuredImageFile) {
            $form->get('featuredImage')->addError(new FormError('La featured image est obligatoire.'));
        }

        if ($form->isSubmitted() && $form->isValid()) {
            $trick->setSlug(strtolower($slugger->slug($trick->getTitle())));

            if ($featuredImageFile) {
                if ($trick->getFeaturedImage()) {
                    $imageUploader->delete($trick->getFeaturedImage());
                }
                $trick->setFeaturedImage($imageUploader->upload($featuredImageFile));
            }

            $this->handleMedia($trick, $form, $imageUploader, $request, $em);

            $em->flush();

            $this->addFlash('success', 'Figure modifiée avec succès');
            return $this->redirectToRoute('app_profile_index');
        }

        return $this->render('profile/tricks/edit.html.twig', [
            'form'  => $form->createView(),
            'trick' => $trick,
        ]);
    }

    #[Route('/supprimer/{slug}', name: 'app_profile_tricks_delete', methods: ['POST'])]
    public function delete(
        string $slug,
        Request $request,
        TricksRepository $repository,
        EntityManagerInterface $em,
        ImageUploaderService $imageUploader
    ): Response {
        $trick = $repository->findOneBy(['slug' => $slug]);
        if (!$trick) throw $this->createNotFoundException('Figure introuvable');

        // ✅ Vérifie que le user peut supprimer le Trick via voter
        $this->denyAccessUnlessGranted('TRICK_DELETE', $trick);

        if (!$this->isCsrfTokenValid('delete-trick-' . $trick->getId(), $request->request->get('_token'))) {
            $this->addFlash('error', 'Token invalide.');
            return $this->redirectToRoute('app_profile_index');
        }

        if ($trick->getFeaturedImage()) {
            $imageUploader->delete($trick->getFeaturedImage());
        }

        foreach ($trick->getImages() as $image) {
            $imageUploader->delete($image->getPicture());
            $em->remove($image);
        }

        foreach ($trick->getVideos() as $video) {
            $em->remove($video);
        }

        $em->remove($trick);
        $em->flush();

        $this->addFlash('success', 'Figure supprimée avec succès');
        return $this->redirectToRoute('app_profile_index');
    }

    /* ==========================================================
       MEDIA HANDLER
       ========================================================== */

    private function handleMedia(
        Tricks $trick,
        $form,
        ImageUploaderService $imageUploader,
        Request $request,
        EntityManagerInterface $em
    ): void {
        $currentUser = $this->getUser();

        // ---------- SUPPRESSION DES IMAGES ----------
        $removedImages = $request->request->all('removed_images', []);
        foreach ($removedImages as $filename) {
            if (!$filename || $filename === 'new') continue;

            foreach ($trick->getImages() as $image) {
                if ($image->getPicture() === $filename) {
                    // ✅ Vérifie que le user peut supprimer cette image
                    if ($this->isGranted('MEDIA_DELETE', $image)) {
                        $imageUploader->delete($filename);
                        $trick->removeImage($image);
                        $em->remove($image);
                    }
                    break;
                }
            }
        }

        // ---------- AJOUT / UPDATE DES IMAGES ----------
        foreach ($form->get('images') as $imageForm) {
            $image = $imageForm->getData();
            $file  = $imageForm->get('file')->getData();

            if (!$file) continue;

            if ($image->getPicture()) {
                $imageUploader->delete($image->getPicture());
            }

            $filename = $imageUploader->upload($file, 'image');
            $image->setPicture($filename);
            $image->setTrick($trick);

            // ✅ Définit le propriétaire du média
            $image->setUsers($currentUser);

            if (!$trick->getImages()->contains($image)) {
                $trick->addImage($image);
            }

            $em->persist($image);
        }

        // ---------- SUPPRESSION DES VIDÉOS ----------
        $removedVideos = $request->request->all('removed_videos', []);
        foreach ($removedVideos as $id) {
            if (!ctype_digit((string)$id)) continue;

            $video = $em->getRepository(Videos::class)->find($id);
            if ($video && $this->isGranted('MEDIA_DELETE', $video)) {
                $trick->removeVideo($video);
                $em->remove($video);
            }
        }

        // ---------- AJOUT DES VIDÉOS ----------
        foreach ($form->get('videos') as $videoForm) {
            $video = $videoForm->getData();
            if (!$video || !$video->getUrl()) continue;

            $exists = false;
            foreach ($trick->getVideos() as $existing) {
                if ($existing->getUrl() === $video->getUrl()) {
                    $exists = true;
                    break;
                }
            }
            if ($exists) continue;

            $video->setTrick($trick);
            $video->setUsers($currentUser); // propriétaire de la vidéo
            $trick->addVideo($video);
            $em->persist($video);
        }
    }


    #[Route('/tricks/{slug}/edit-or-contribute', name: 'app_profile_tricks_edit_or_contribute')]
    public function editOrContribute(
        string $slug,
        Request $request,
        TricksRepository $repository,
        EntityManagerInterface $em,
        ImageUploaderService $imageUploader,
        SluggerInterface $slugger
    ): Response {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $trick = $repository->findOneBy(['slug' => $slug]);
        if (!$trick) {
            throw $this->createNotFoundException('Figure introuvable');
        }

        $currentUser = $this->getUser();

        if ($trick->getUser() === $currentUser) {
            // --- PROPRIÉTAIRE : Edition complète ---
            $form = $this->createForm(TrickContributeType::class, $trick);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $trick->setSlug(strtolower($slugger->slug($trick->getTitle())));

                // Featured image
                $featuredFile = $form->get('featuredImage')->getData();
                if ($featuredFile) {
                    if ($trick->getFeaturedImage()) {
                        $imageUploader->delete($trick->getFeaturedImage());
                    }
                    $trick->setFeaturedImage($imageUploader->upload($featuredFile));
                }

                // Gestion médias
                $this->handleMedia($trick, $form, $imageUploader, $request, $em);

                $em->flush();
                $this->addFlash('success', 'Figure modifiée avec succès.');
                return $this->redirectToRoute('app_profile_index');
            }

            return $this->render('profile/tricks/edit.html.twig', [
                'form' => $form->createView(),
                'trick' => $trick,
            ]);
        }

        // --- CONTRIBUTEUR : ajout / suppression médias ---
        $form = $this->createForm(TrickContributeType::class, $trick);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->handleMediaContributor($trick, $form, $imageUploader, $request, $em, $currentUser);
            $em->flush();
            $this->addFlash('success', 'Vos contributions ont été enregistrées.');
            return $this->redirectToRoute('app_profile_index');
        }

        return $this->render('profile/tricks/contribute.html.twig', [
            'form' => $form->createView(),
            'trick' => $trick,
        ]);
    }

    private function handleMediaContributor(
        Tricks $trick,
        $form,
        ImageUploaderService $imageUploader,
        Request $request,
        EntityManagerInterface $em,
        $currentUser
    ): void {
        // ---------- SUPPRESSION DES IMAGES ----------
        $removedImages = $request->request->all('removed_images', []);
        foreach ($removedImages as $filename) {
            foreach ($trick->getImages() as $image) {
                // L'utilisateur ne peut supprimer que **ses propres images**
                if ($image->getPicture() === $filename && $image->getUsers() === $currentUser) {
                    $imageUploader->delete($filename);
                    $trick->removeImage($image);
                    $em->remove($image);
                }
            }
        }

        // ---------- AJOUT DES IMAGES ----------
        foreach ($form->get('images') as $imageForm) {
            $image = $imageForm->getData();
            $file  = $imageForm->get('file')->getData();
            if (!$file) continue;

            $filename = $imageUploader->upload($file, 'image');
            $image->setPicture($filename);
            $image->setTrick($trick);
            $image->setUsers($currentUser); // attribution du contributeur

            if (!$trick->getImages()->contains($image)) {
                $trick->addImage($image);
            }

            $em->persist($image);
        }

        // ---------- SUPPRESSION DES VIDÉOS ----------
        $removedVideos = $request->request->all('removed_videos', []);
        foreach ($removedVideos as $id) {
            $video = $em->getRepository(Videos::class)->find($id);
            if ($video && $video->getUsers() === $currentUser) {
                $trick->removeVideo($video);
                $em->remove($video);
            }
        }

        // ---------- AJOUT DES VIDÉOS ----------
        foreach ($form->get('videos') as $videoForm) {
            $video = $videoForm->getData();
            if (!$video || !$video->getUrl()) continue;

            // Évite les doublons
            $exists = false;
            foreach ($trick->getVideos() as $existing) {
                if ($existing->getUrl() === $video->getUrl()) {
                    $exists = true;
                    break;
                }
            }
            if ($exists) continue;

            $video->setTrick($trick);
            $video->setUsers($currentUser);
            $trick->addVideo($video);
            $em->persist($video);
        }
    }
}
