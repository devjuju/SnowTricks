<?php
// src/Form/TrickFormType.php
namespace App\Form;

use App\Entity\Tricks;
use App\Entity\Categories;
use App\Form\ImageType;
use App\Form\VideoType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Image as ImageConstraint;

class TrickFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'attr' => ['placeholder' => 'Titre de la figure', 'class' => 'w-full rounded-xl border px-4 py-2'],
                'constraints' => [new NotBlank(['message' => 'Veuillez entrer un titre.'])]
            ])
            ->add('content', TextareaType::class, [
                'attr' => ['placeholder' => 'Décrivez la figure en détail', 'class' => 'w-full h-28 sm:h-36 rounded-xl border px-4 py-2'],
                'constraints' => [new NotBlank(['message' => 'Veuillez entrer un contenu.'])]
            ])
            ->add('category', EntityType::class, [
                'class' => Categories::class,
                'choice_label' => 'name',
                'placeholder' => 'Choisir une catégorie',
                'attr' => ['class' => 'rounded-xl border px-4 py-2 pr-10'],
                'constraints' => [new NotNull(['message' => 'Veuillez choisir une catégorie.'])]
            ])
            // Featured image
            ->add('featuredImage', FileType::class, [
                'label' => 'Image principale',
                'mapped' => false,
                'required' => false, // gestion obligation côté contrôleur
                'attr' => ['accept' => 'image/png,image/jpeg,image/webp'],
                'constraints' => [
                    new ImageConstraint([
                        'maxSize' => '5M',
                        'mimeTypes' => ['image/jpeg', 'image/png', 'image/webp'],
                        'mimeTypesMessage' => 'Formats autorisés : JPEG, PNG, WebP',
                    ]),
                ]
            ])
            // Champ caché pour suppression côté frontend/backend
            ->add('deleteFeaturedImage', HiddenType::class, [
                'mapped' => false,
                'data' => 0,
            ])
            // Images secondaires
            ->add('images', CollectionType::class, [
                'entry_type' => ImageType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'prototype' => true,
                'prototype_name' => '__image__',
                'required' => false,
                'label' => false,
            ])
            // Vidéos
            ->add('videos', CollectionType::class, [
                'entry_type' => VideoType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'prototype' => true,
                'prototype_name' => '__video__',
                'required' => false,
                'label' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Tricks::class,
        ]);
    }
}
