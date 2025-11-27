<?php

namespace App\Controller;

use App\Form\ResetPasswordFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use App\Form\ResetPasswordRequestType;
use App\Repository\UsersRepository;
use Symfony\Component\HttpFoundation\Request;
use App\Service\JWTService;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use App\Service\SendEmailService;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;


class SecurityController extends AbstractController
{
    #[Route(path: '/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // if ($this->getUser()) {
        //     return $this->redirectToRoute('target_path');
        // }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route(path: '/mot-de-passe-oublie', name: 'forgotten_password')]
    public function forgottenPassword(
        Request $request,
        UsersRepository $usersRepository,
        JWTService $jwtService,
        SendEmailService $sendEmailService
    ): Response {
        $form = $this->createForm(ResetPasswordRequestType::class);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Le formulaire est soumis et valide, vous pouvez traiter la demande de réinitialisation de mot de passe ici
            // On va chercher l'utilisateur par son email
            $user = $usersRepository->findOneByEmail(
                $form->get('email')->getData()
            );

            // On vérifie si l'utilisateur existe
            if ($user) {
                // Si l'utilisateur existe, vous pouvez générer un token de réinitialisation et envoyer un email
                // On génère un JWT ou un token unique
                $header = [
                    'alg' => 'HS256',
                    'typ' => 'JWT'
                ];

                //payload
                $payload = [
                    'user_id' => $user->getId(),
                ];

                //On génère le token
                $token = $jwtService->generate($header, $payload, $this->getParameter('app.jwtsecret'));

                // On génère le lien de réinitialisation du mot de passe
                $url = $this->generateUrl('reset_password', ['token' => $token], UrlGeneratorInterface::ABSOLUTE_URL);

                // Envoyer l'email avec le lien de réinitialisation 
                $sendEmailService->send(
                    'no-reply@snowtricks.test',
                    $user->getEmail(),
                    'Récupération de votre mot de passe',
                    'reset_password',
                    compact('user', 'url')
                );
                $this->addFlash('success', 'E-mail de réinitialisation du mot de passe envoyé !');
                return $this->redirectToRoute('app_login');
            }

            // $user est null
            $this->addFlash('danger', 'Un problème est survenu.');
            return $this->redirectToRoute('app_login');
        }

        return $this->render('security/reset_password_request.html.twig', [
            'requestPasswordForm' => $form->createView(),
        ]);
    }

    #[Route(path: '/mot-de-passe-oublie/{token}', name: 'reset_password')]
    public function resetPassword(
        $token,
        JWTService $jwt,
        UsersRepository $usersRepository,
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManagerInterface

    ): Response {
        // On vérifie si le token est valide (cohérent, pas expiré et signature correcte)
        if ($jwt->isValid($token) && !$jwt->isExpired($token) && $jwt->check($token, $this->getParameter('app.jwtsecret'))) {
            // Le token est valide
            // On récupère les données (payload)
            $payload = $jwt->getPayload($token);

            // On récupère le user
            $user = $usersRepository->find($payload['user_id']);

            if ($user) {
                $form = $this->createForm(ResetPasswordFormType::class);
                $form->handleRequest($request);

                if ($form->isSubmitted() && $form->isValid()) {
                    $user->setPassword(
                        $passwordHasher->hashPassword(
                            $user,
                            $form->get('password')->getData()
                        )
                    );

                    $entityManagerInterface->flush();

                    $this->addFlash('success', 'Mot de passe mis à jour avec succès ! Vous pouvez maintenant vous connecter.');
                    return $this->redirectToRoute('app_login');
                }
                return $this->render('security/reset_password.html.twig', [
                    'passForm' => $form->createView(),
                ]);
            }
        }
        $this->addFlash('danger', 'Le token est invalide ou a expiré');
        return $this->redirectToRoute('app_login');
    }
}
