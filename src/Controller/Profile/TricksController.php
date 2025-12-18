<?php

namespace App\Controller\Profile;

use App\Entity\Tricks;
use App\Entity\Images;
use App\Entity\Videos;
use App\Form\AddTrickFormType;
use App\Repository\TricksRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;
use App\Service\PictureService;

#[Route('/profile/tricks')]
class TricksController extends AbstractController
{
    #[Route('/ajouter', name: 'app_profile_tricks_add')]
    public function addTrick(
        Request $request,
        SluggerInterface $slugger,
        EntityManagerInterface $em,
        PictureService $pictureService
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_MEMBER');
        $trick = new Tricks();
        $form = $this->createForm(AddTrickFormType::class, $trick);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            // ------------------------------
            // 1️⃣ Génération du slug
            // ------------------------------
            $trick->setSlug(strtolower($slugger->slug($trick->getTitle())));

            // ------------------------------
            // 2️⃣ Featured Image
            // ------------------------------
            // Image principale avec PictureService
            $imageFile = $form->get('featuredImage')->getData();
            if ($imageFile) {
                $filename = $pictureService->square(
                    $imageFile,
                    '/tricks',
                    500
                );
                $trick->setFeaturedImage($filename);
            }

            $trick->setUser($this->getUser());

            // ------------------------------
            // 3️⃣ Images secondaires (JS)
            // ------------------------------
            foreach ($request->files->all('images', []) as $file) {

                if (!$file) {
                    continue;
                }

                $image = new Images();

                $filename = $pictureService->square(
                    $file,
                    '/tricks',
                    500
                );

                $image->setContent($filename);
                $image->setTrick($trick);

                $trick->getImages()->add($image);
            }


            // ------------------------------
            // 4️⃣ Vidéos (JS)
            // ------------------------------

            foreach ($request->request->all('videos', []) as $url) {

                if (!$url) {
                    continue;
                }

                $video = new Videos();
                $video->setContent($url);
                $video->setTrick($trick);

                $trick->getVideos()->add($video);
            }


            // ------------------------------
            // 5️⃣ Enregistrement en BDD
            // ------------------------------
            $em->persist($trick);
            $em->flush();

            $this->addFlash('success', 'Figure ajoutée avec succès !');

            return $this->redirectToRoute('app_profile_index');
        }

        return $this->render('profile/tricks/add.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/modifier/{id}', name: 'app_profile_tricks_edit')]
    public function editTrick(
        Tricks $trick,
        Request $request,
        EntityManagerInterface $em,
        PictureService $pictureService,
        SluggerInterface $slugger
    ): Response {

        // 🔐 Sécurité
        if ($trick->getUser() !== $this->getUser()) {
            throw $this->createAccessDeniedException();
        }

        $form = $this->createForm(AddTrickFormType::class, $trick, [
            'method' => 'POST'
        ]);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            // ------------------------------
            // 1️⃣ Slug (si titre modifié)
            // ------------------------------
            $trick->setSlug(strtolower($slugger->slug($trick->getTitle())));

            // ------------------------------
            // 2️⃣ Image principale
            // ------------------------------
            $imageFile = $form->get('featuredImage')->getData();

            if ($imageFile) {

                // 🗑️ suppression ancienne image (optionnel mais recommandé)
                if ($trick->getFeaturedImage()) {
                    @unlink($this->getParameter('uploads_directory') . '/tricks/' . $trick->getFeaturedImage());
                }

                $filename = $pictureService->square($imageFile, '/tricks', 500);
                $trick->setFeaturedImage($filename);
            }

            // ------------------------------
            // 3️⃣ Images secondaires (AJOUT)
            // ------------------------------
            foreach ($request->files->all('images', []) as $file) {

                if (!$file) continue;

                $image = new Images();
                $filename = $pictureService->square($file, '/tricks', 500);

                $image->setContent($filename);
                $image->setTrick($trick);

                $trick->getImages()->add($image);
            }

            // ------------------------------
            // 4️⃣ Vidéos (AJOUT)
            // ------------------------------
            foreach ($request->request->all('videos', []) as $url) {

                if (!$url) continue;

                $video = new Videos();
                $video->setContent($url);
                $video->setTrick($trick);

                $trick->getVideos()->add($video);
            }

            // ------------------------------
            // 5️⃣ Sauvegarde
            // ------------------------------
            $em->flush();

            $this->addFlash('success', 'Figure modifiée avec succès');

            return $this->redirectToRoute('app_profile_tricks_edit', [
                'id' => $trick->getId()
            ]);
        }

        return $this->render('profile/tricks/edit.html.twig', [
            'form' => $form->createView(),
            'trick' => $trick
        ]);
    }


    #[Route('/supprimer/{id}', name: 'app_profile_tricks_delete', methods: ['POST'])]
    public function deleteTrick(
        Tricks $trick,
        EntityManagerInterface $em,
        Request $request
    ): Response {

        // 🔐 Sécurité : seul le propriétaire peut supprimer
        if ($trick->getUser() !== $this->getUser()) {
            throw $this->createAccessDeniedException();
        }

        // Vérification CSRF
        if (!$this->isCsrfTokenValid('delete_trick_' . $trick->getId(), $request->request->get('_token'))) {
            throw $this->createAccessDeniedException('CSRF invalide');
        }

        // Supprimer les fichiers images
        if ($trick->getFeaturedImage()) {
            @unlink($this->getParameter('uploads_directory') . '/tricks/' . $trick->getFeaturedImage());
        }

        foreach ($trick->getImages() as $image) {
            @unlink($this->getParameter('uploads_directory') . '/tricks/' . $image->getContent());
        }

        $em->remove($trick);
        $em->flush();

        $this->addFlash('success', 'Figure supprimée avec succès !');

        return $this->redirectToRoute('app_profile_tricks_list'); // liste de tricks
    }
}
