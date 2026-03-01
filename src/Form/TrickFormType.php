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
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class TrickFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            // Titre
            ->add('title', TextType::class, [
                'attr' => ['placeholder' => 'Titre de la figure', 'class' => 'w-full rounded-xl border px-4 py-2'],
                'constraints' => [new NotBlank(['message' => 'Veuillez entrer un titre.'])]
            ])
            // Contenu
            ->add('content', TextareaType::class, [
                'attr' => ['placeholder' => 'Décrivez la figure en détail', 'class' => 'w-full h-28 sm:h-36 rounded-xl border px-4 py-2'],
                'constraints' => [new NotBlank(['message' => 'Veuillez entrer un contenu.'])]
            ])
            // Catégorie
            ->add('category', EntityType::class, [
                'class' => Categories::class,
                'choice_label' => 'name',
                'placeholder' => 'Choisir une catégorie',
                'attr' => ['class' => 'rounded-xl border px-4 py-2 pr-10'],
                'constraints' => [new NotNull(['message' => 'Veuillez choisir une catégorie.'])]
            ])
            // Image mise en avant
            ->add('featuredImage', FileType::class, [
                'mapped' => false,
                'required' => false,
                'constraints' => [
                    new File(
                        maxSize: '2M',
                        mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
                        mimeTypesMessage: 'Veuillez sélectionner une image valide (jpeg, png, webp).'
                    ),
                ],
            ])
            // Champ caché pour suppression de l'image mise en avant
            ->add('deleteFeaturedImage', HiddenType::class, [
                'mapped' => false,
                'required' => false,
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

            // Champs cachés temporaire pour AJAX (images_tmp)
            ->add('images_tmp', CollectionType::class, [
                'entry_type' => HiddenType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'by_reference' => false,
                'prototype' => false,
                'mapped' => false, // Ne lie pas à l'entité
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
            ])
            // Bouton Modifier
            ->add('save', SubmitType::class, [
                'label' => 'Modifier',
                'attr' => [
                    'class' => 'px-4 py-2 bg-[#1b84ff] text-white rounded hover:bg-[#056ee9]'
                ]
            ])
            ->add('delete', SubmitType::class, [
                'label' => 'Supprimer',
                'attr' => [
                    'class' => 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Tricks::class,
        ]);
    }
}
