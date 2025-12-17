<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;

class VideoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // champ non mappé : on récupérera l'URL dans le controller
        $builder->add('url', UrlType::class, [
            'label' => false,
            'required' => false,
            'mapped' => false,
            'attr' => [
                'placeholder' => 'https://youtu.be/… ou https://vimeo.com/…',
                'class' => 'video-input w-full border rounded p-2'
            ],
        ]);
    }
}
