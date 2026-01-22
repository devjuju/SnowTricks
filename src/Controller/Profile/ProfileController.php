<?php

namespace App\Controller\Profile;


use App\Repository\TricksRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Form\ProfileFormType;
use App\Service\AvatarUploaderService;
use App\Service\ImageUploaderService;




#[Route('/profile', name: 'app_profile_')]
final class ProfileController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(Request $request, TricksRepository $tricksRepository): Response
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $query = $tricksRepository->createQueryBuilder('t')
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



    #[Route('/edit', name: 'edit')]
    public function edit(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        AvatarUploaderService $avatarUploaderService
    ): Response {
        /** @var \App\Entity\Users $user */
        $user = $this->getUser();

        $form = $this->createForm(ProfileFormType::class, $user);
        $form->handleRequest($request);


        if ($form->isSubmitted() && $form->isValid()) {

            // -----------------
            // Mot de passe
            // -----------------
            $plainPassword = $form->get('plainPassword')->getData();
            if ($plainPassword) {
                $hashedPassword = $passwordHasher->hashPassword($user, $plainPassword);
                $user->setPassword($hashedPassword);
            }

            // -----------------
            // Avatar
            // -----------------
            $avatarImageFile = $form->get('avatar')->getData();
            $deleteAvatar = (bool) $form->get('deleteAvatar')->getData();

            if ($deleteAvatar && $user->getAvatar()) {
                $avatarUploaderService->delete($user->getAvatar());
                $user->setAvatar(null);
            }

            if ($avatarImageFile) {
                if ($user->getAvatar()) {
                    $avatarUploaderService->delete($user->getAvatar());
                }
                $user->setAvatar(
                    $avatarUploaderService->upload($avatarImageFile)
                );
            }

            // -----------------
            // Enregistrement
            // -----------------
            $em->flush();

            $this->addFlash('success', 'Profil mis à jour avec succès !');

            return $this->redirectToRoute('app_profile_index');
        }


        return $this->render('profile/profile/edit.html.twig', [
            'profileForm' => $form->createView(),
            'user' => $user, // ← ici
        ]);
    }
}
