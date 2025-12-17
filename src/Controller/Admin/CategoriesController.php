<?php

namespace App\Controller\Admin;

use App\Entity\Categories;
use App\Form\AddCategoriesFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;


#[Route('/admin/categories', name: 'app_admin_categories_')]
final class CategoriesController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->render('admin/categories/index.html.twig', [
            'controller_name' => 'CategoriesController',
        ]);
    }

    #[Route('/ajouter', name: 'add')]
    public function addCategorie(
        Request $request,
        EntityManagerInterface $entityManager
    ): Response {
        $category = new Categories();

        $categorieForm = $this->createForm(AddCategoriesFormType::class, $category);

        $categorieForm->handleRequest($request);

        if ($categorieForm->isSubmitted() && $categorieForm->isValid()) {
            $entityManager->persist($category);
            $entityManager->flush();

            $this->addFlash('success', 'Catégorie ajoutée avec succès !');

            return $this->redirectToRoute('app_admin_categories_index');
        }

        return $this->render('admin/categories/add.html.twig', [
            'categorieForm' => $categorieForm->createView(),
        ]);
    }
}
