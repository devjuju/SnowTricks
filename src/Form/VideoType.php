<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\OptionsResolver\OptionsResolver;

class VideoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('content', TextType::class, [
            'label' => false,
            'attr' => [
                'placeholder' => 'URL de la vidéo (YouTube)',
                'class' => 'w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-400 focus:ring-blue-400'
            ],
            'constraints' => [
                new NotBlank(['message' => 'Veuillez entrer l’URL de la vidéo.'])
            ]
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([]);
    }
}
