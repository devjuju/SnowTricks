<?php

namespace App\Controller;

use App\Repository\CommentsRepository;
use App\Repository\TricksRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RateLimiter\RequestRateLimiterInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;


#[Route('/tricks', name: 'app_tricks_')]
final class TricksController extends AbstractController
{
    #[Route('/details/{slug}', name: 'details')]
    #[Route('/details/{slug}', name: 'details')]
    public function details($slug, TricksRepository $tricksRepository, CommentsRepository $commentsRepository): Response
    {
        $trick = $tricksRepository->findOneBy(['slug' => $slug]);

        if (!$trick) {
            throw $this->createNotFoundException('Cette figure n\'existe pas');
        }

        $comments = $commentsRepository->findBy(
            ['tricks' => $trick],
            ['createdAt' => 'DESC'],
            5,
            0
        );

        // Calculer les médias à passer à Twig
        $media = array_merge(
            $trick->getImages()->toArray(),
            $trick->getVideos()->toArray()
        );
        usort($media, fn($a, $b) => $a->getId() <=> $b->getId());

        return $this->render('tricks/details.html.twig', [
            'trick' => $trick,
            'comments' => $comments,
            'media' => $media,
        ]);
    }


    #[Route('/{slug}/comments/load', name: 'comments_load')]
    public function loadMoreComments(
        string $slug,
        Request $request, // <-- corrigé
        TricksRepository $tricksRepository,
        CommentsRepository $commentsRepository
    ): Response {
        $offset = $request->query->getInt('offset', 0);

        $trick = $tricksRepository->findOneBy(['slug' => $slug]);

        if (!$trick) {
            return new Response('', 404);
        }

        $comments = $commentsRepository->findBy(
            ['tricks' => $trick],
            ['createdAt' => 'DESC'],
            5,
            $offset
        );

        return $this->render('_partials/comments.html.twig', [
            'comments' => $comments
        ]);
    }
}
