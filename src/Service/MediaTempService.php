<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class MediaTempService
{
    private ?\Symfony\Component\HttpFoundation\Session\SessionInterface $session;

    public function __construct(
        private string $projectDir,
        private SluggerInterface $slugger,
        RequestStack $requestStack
    ) {
        // Récupère la session si elle existe
        $this->session = $requestStack->getSession();
    }

    public function upload(UploadedFile $file): string
    {
        $safeName = $this->slugger->slug(
            pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)
        );

        $filename = $safeName . '-' . uniqid() . '.' . $file->guessExtension();

        $file->move($this->projectDir . '/public/uploads/tmp', $filename);

        $this->session?->set('temp_image', $filename);

        return $filename;
    }

    public function get(): ?string
    {
        return $this->session?->get('temp_image');
    }

    public function clear(): void
    {
        $this->session?->remove('temp_image');
    }

    public function moveToFinal(string $filename): void
    {
        rename(
            $this->projectDir . '/public/uploads/tmp/' . $filename,
            $this->projectDir . '/public/uploads/images/' . $filename
        );
    }
}
