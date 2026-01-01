<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Validator\Constraints\Image;
use Symfony\Component\Validator\Constraints\NotBlank;

class ImageType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('file', FileType::class, [
            'label' => false,
            'mapped' => false,
            'attr' => ['accept' => 'image/png, image/jpeg, image/webp'],
            'constraints' => [
                new Image(
                    minWidth: 200,
                    maxWidth: 4000,
                    minHeight: 200,
                    maxHeight: 4000,
                    allowPortrait: false,
                    mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
                )
            ]
        ]);
    }
}
