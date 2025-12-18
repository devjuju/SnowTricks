<?php

namespace App\Controller\Profile;


use App\Repository\TricksRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


#[Route('/profile', name: 'app_profile_')]
final class ProfileController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(Request $request, TricksRepository $tricksRepository): Response
    {
        $user = $this->getUser();

        $page = max(1, (int) $request->query->get('page', 1));
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $query = $tricksRepository->createQueryBuilder('t')
            ->andWhere('t.user = :user')
            ->setParameter('user', $user)
            ->orderBy('t.id', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery();

        $tricks = new Paginator($query);

        if ($request->isXmlHttpRequest()) {
            return $this->render('_partials/tricks.html.twig', [
                'tricks' => $tricks,
            ]);
        }

        return $this->render('profile/profile/index.html.twig', [
            'tricks' => $tricks,
            'page' => $page,
        ]);
    }
}
