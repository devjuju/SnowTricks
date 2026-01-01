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

        if ($form->isSubmitted()) {

            // Featured image obligatoire
            $featuredImageFile = $form->get('featuredImage')->getData();
            if (!$featuredImageFile) {
                $form->get('featuredImage')->addError(
                    new \Symfony\Component\Form\FormError('L’image principale est obligatoire.')
                );
            }

            if ($form->isValid()) {
                // Slug et utilisateur
                $trick->setSlug(strtolower($slugger->slug($trick->getTitle())));
                $trick->setUser($this->getUser());

                // Upload image principale
                if ($featuredImageFile) {
                    $filename = $pictureService->square($featuredImageFile, 'tricks', 500);
                    $trick->setFeaturedImage($filename);
                }

                // Images secondaires
                $imageFiles = $request->files->all('images') ?? [];
                $imageFiles = is_array($imageFiles) ? $imageFiles : [$imageFiles];
                foreach ($imageFiles as $file) {
                    if (!$file) continue;
                    try {
                        $filename = $pictureService->square($file, 'tricks', 500);
                        $image = new Images();
                        $image->setContent($filename);
                        $image->setTrick($trick);
                        $trick->getImages()->add($image);
                        $em->persist($image);
                    } catch (\Exception $e) {
                        $this->addFlash('error', 'Erreur upload image secondaire : ' . $e->getMessage());
                    }
                }

                // Vidéos
                $videoUrls = $request->request->all('videos') ?? [];
                $videoUrls = is_array($videoUrls) ? $videoUrls : [$videoUrls];
                foreach ($videoUrls as $url) {
                    if (!$url) continue;
                    $video = new Videos();
                    $video->setContent($url);
                    $video->setTrick($trick);
                    $trick->getVideos()->add($video);
                    $em->persist($video);
                }

                $em->persist($trick);
                $em->flush();

                $this->addFlash('success', 'Figure ajoutée avec succès !');
                return $this->redirectToRoute('app_profile_index');
            }
        }

        return $this->render('profile/tricks/add.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/modifier/{slug}', name: 'app_profile_tricks_edit')]
    public function editTrick(
        string $slug,
        Request $request,
        EntityManagerInterface $em,
        PictureService $pictureService,
        SluggerInterface $slugger,
        TricksRepository $tricksRepository
    ): Response {
        $trick = $tricksRepository->findOneBy(['slug' => $slug]);
        if (!$trick) {
            throw $this->createNotFoundException('Cette figure n\'existe pas');
        }
        if ($trick->getUser() !== $this->getUser()) {
            throw $this->createAccessDeniedException();
        }

        $form = $this->createForm(AddTrickFormType::class, $trick, ['method' => 'POST']);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $trick->setSlug(strtolower($slugger->slug($trick->getTitle())));

            // Featured image
            $featuredImageFile = $form->get('featuredImage')->getData();
            if ($featuredImageFile) {
                if ($trick->getFeaturedImage()) {
                    $pictureService->delete('tricks', $trick->getFeaturedImage());
                }
                $filename = $pictureService->square($featuredImageFile, 'tricks', 500);
                $trick->setFeaturedImage($filename);
            }

            // Suppression images secondaires
            $deleteImages = $request->request->all('delete_images') ?? [];
            $deleteImages = is_array($deleteImages) ? $deleteImages : [$deleteImages];
            foreach ($deleteImages as $id) {
                $image = $trick->getImages()->filter(fn($i) => $i->getId() == $id)->first();
                if ($image) {
                    $pictureService->delete('tricks', $image->getContent());
                    $trick->getImages()->removeElement($image);
                    $em->remove($image);
                }
            }

            // Ajout images secondaires
            $imageFiles = $request->files->all('images') ?? [];
            $imageFiles = is_array($imageFiles) ? $imageFiles : [$imageFiles];
            foreach ($imageFiles as $file) {
                if (!$file) continue;
                try {
                    $filename = $pictureService->square($file, 'tricks', 500);
                    $image = new Images();
                    $image->setContent($filename);
                    $image->setTrick($trick);
                    $trick->getImages()->add($image);
                    $em->persist($image);
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Erreur upload image secondaire : ' . $e->getMessage());
                }
            }

            // Suppression vidéos
            $deleteVideos = $request->request->all('delete_videos') ?? [];
            $deleteVideos = is_array($deleteVideos) ? $deleteVideos : [$deleteVideos];
            foreach ($deleteVideos as $id) {
                $video = $trick->getVideos()->filter(fn($v) => $v->getId() == $id)->first();
                if ($video) {
                    $trick->getVideos()->removeElement($video);
                    $em->remove($video);
                }
            }

            // Ajout vidéos
            $videoUrls = $request->request->all('videos') ?? [];
            $videoUrls = is_array($videoUrls) ? $videoUrls : [$videoUrls];
            foreach ($videoUrls as $url) {
                if (!$url) continue;
                $video = new Videos();
                $video->setContent($url);
                $video->setTrick($trick);
                $trick->getVideos()->add($video);
                $em->persist($video);
            }

            $em->flush();

            $this->addFlash('success', 'Figure modifiée avec succès');
            return $this->redirectToRoute('app_profile_index');
        }

        return $this->render('profile/tricks/edit.html.twig', [
            'form' => $form->createView(),
            'trick' => $trick,
        ]);
    }
}
