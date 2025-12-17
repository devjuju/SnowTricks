<?php

namespace App\Controller\Profile;

use App\Entity\Tricks;
use App\Entity\Images;
use App\Entity\Videos;
use App\Form\AddTrickFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/profile/tricks')]
class TricksController extends AbstractController
{
    #[Route('/ajouter', name: 'app_profile_tricks_add')]
    public function addTrick(Request $request, SluggerInterface $slugger, EntityManagerInterface $em): Response
    {
        $trick = new Tricks();
        $form = $this->createForm(AddTrickFormType::class, $trick);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            // ------------------------------
            // 1. Génération du slug
            // ------------------------------
            $trick->setSlug(strtolower($slugger->slug($trick->getTitle())));

            // ------------------------------
            // 2. Image principale
            // ------------------------------
            $featuredImageFile = $form->get('featuredImage')->getData();
            if ($featuredImageFile) {
                $filename = uniqid() . '.' . $featuredImageFile->guessExtension();
                $featuredImageFile->move($this->getParameter('uploads_directory'), $filename);
                $trick->setFeaturedImage($filename);
            }

            // ------------------------------
            // 3. Images secondaires (JS)
            // ------------------------------
            $images = $request->files->get('images');
            if (!$images) {
                $images = [];
            } elseif (!is_array($images)) {
                $images = [$images];
            }

            foreach ($images as $imgFile) {
                if ($imgFile) {
                    $filename = uniqid() . '.' . $imgFile->guessExtension();
                    $imgFile->move($this->getParameter('uploads_directory'), $filename);

                    $image = new Images();
                    $image->setContent($filename);
                    $image->setTrick($trick);

                    $em->persist($image);
                }
            }

            // ------------------------------
            // 4. Vidéos (JS)
            // ------------------------------
            $videos = $request->request->get('videos');
            if (!$videos) {
                $videos = [];
            } elseif (!is_array($videos)) {
                $videos = [$videos];
            }

            foreach ($videos as $url) {
                if (!empty($url)) {
                    $video = new Videos();
                    $video->setContent($url);
                    $video->setTrick($trick);

                    $em->persist($video);
                }
            }

            // ------------------------------
            // 5. Enregistrement en BDD
            // ------------------------------
            $em->persist($trick);
            $em->flush();

            $this->addFlash('success', 'Figure ajoutée avec succès !');

            return $this->redirectToRoute('app_profile_tricks_add');
        }

        return $this->render('profile/tricks/add.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
