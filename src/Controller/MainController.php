<?php

namespace App\Controller;

use App\Repository\TricksRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

final class MainController extends AbstractController
{
    #[Route('/', name: 'app_main')]
    public function index(TricksRepository $tricksRepository): Response
    {
        $tricks = $tricksRepository->findBy([], ['id' => 'DESC']);

        return $this->render('main/index.html.twig', [
            'tricks' => $tricks,
        ]);
    }


    #[Route('/load-more', name: 'load_more_tricks', methods: ['GET'])]
    public function loadMore(
        Request $request,
        TricksRepository $tricksRepository
    ): JsonResponse {

        $offset = (int) $request->query->get('offset', 0);
        $limit = 10;

        $tricks = $tricksRepository->findBy([], ['id' => 'DESC'], $limit, $offset);

        $html = $this->renderView('_partials/tricks_item.html.twig', [
            'tricks' => $tricks
        ]);

        return new JsonResponse([
            'html' => $html,
            'hasMore' => count($tricks) === $limit
        ]);
    }
}
