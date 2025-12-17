<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;

class ImageType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // champ non mappé : on récupérera le UploadedFile dans le controller
        $builder->add('file', FileType::class, [
            'label' => false,
            'mapped' => false,
            'required' => false,
            'attr' => [
                'class' => 'image-input w-full border rounded p-2 mb-2'
            ],
        ]);
    }
}
