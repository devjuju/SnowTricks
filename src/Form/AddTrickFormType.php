<?php

namespace App\Form;

use App\Entity\Tricks;
use App\Entity\Categories;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Image;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use App\Form\VideoType; // On créera ce formulaire
use Symfony\Component\Validator\Constraints\NotNull;

class AddTrickFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'attr' => [
                    'placeholder' => 'Titre de la figure',
                    'class' => 'w-full rounded-xl border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400  px-4 py-2'
                ],
                'constraints' => [
                    new NotBlank([
                        "message" => "Veuillez entrer un titre."
                    ])
                ]
            ])
            ->add('content', TextareaType::class, [
                'attr' => [
                    'placeholder' => 'Décrivez la figure en détail',
                    'class' => 'w-full rounded-xl border border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400 h-28 sm:h-36 px-4 py-2'
                ],
                'constraints' => [
                    new NotBlank([
                        "message" => "Veuillez entrer un contenu."
                    ])
                ]
            ])

            ->add('featuredImage', FileType::class, [
                'label' => 'Image principale',
                'mapped' => false,
                'required' => true, // ⚠️ important
                'attr' => [
                    'accept' => 'image/png, image/jpeg, image/webp'
                ],
                'constraints' => [

                    new Image(
                        minWidth: 200,
                        maxWidth: 4000,
                        minHeight: 200,
                        maxHeight: 4000,
                        mimeTypes: [
                            'image/jpeg',
                            'image/png',
                            'image/webp'
                        ]
                    )
                ]
            ])


            ->add('category', EntityType::class, [
                'class' => Categories::class,
                'choice_label' => 'name',
                'placeholder' => 'Choisir une catégorie',
                'attr' => [
                    'class' => 'rounded-xl border border-gray-300 px-4 pr-10 py-2 shadow-sm focus:border-blue-400 focus:ring-blue-400'
                ],
                'constraints' => [
                    new NotBlank([
                        "message" => "Veuillez choisir une catégorie."
                    ])
                ]
            ])

            ->add('videos', CollectionType::class, [
                'entry_type' => TextType::class, // chaque vidéo = URL
                'allow_add' => true,
                'allow_delete' => true,
                'mapped' => false, // on gère manuellement via JS et contrôleur
                'required' => false,
            ])


            ->add('images', CollectionType::class, [
                'entry_type' => FileType::class, // chaque image = fichier uploadé
                'allow_add' => true,
                'allow_delete' => true,
                'mapped' => false, // on gère manuellement l’upload
                'required' => false,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Tricks::class,
            'is_edit' => false, // 👈 clé
        ]);
    }
}
