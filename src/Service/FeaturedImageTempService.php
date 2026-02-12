<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FeaturedImageTempService
{
    private ?\Symfony\Component\HttpFoundation\Session\SessionInterface $session;

    public function __construct(
        private string $tempDir, // ex: public/uploads/featured_images_tmp
        private string $finalDir, // ex: public/uploads/featured_images
        private SluggerInterface $slugger,
        RequestStack $requestStack
    ) {
        $this->session = $requestStack->getSession();
        $this->ensureDirectoryExists($this->tempDir);
        $this->ensureDirectoryExists($this->finalDir);
    }

    public function upload(UploadedFile $file): string
    {
        $safeName = $this->slugger->slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = $safeName . '-' . uniqid() . '.' . $file->guessExtension();

        // Déplacement vers dossier temporaire
        $file->move($this->tempDir, $filename);

        $this->session?->set('temp_featured_image', $filename);

        return $filename;
    }

    public function get(): ?string
    {
        return $this->session?->get('temp_featured_image');
    }

    public function clear(): void
    {
        $filename = $this->get();
        if ($filename) {
            $path = $this->tempDir . '/' . $filename;
            if (is_file($path)) unlink($path);
        }
        $this->session?->remove('temp_featured_image');
    }

    public function moveToFinal(string $filename): void
    {
        $tmpPath = $this->tempDir . '/' . $filename;
        $finalPath = $this->finalDir . '/' . $filename;

        if (is_file($tmpPath)) {
            rename($tmpPath, $finalPath);
        }

        $this->session?->remove('temp_featured_image');
    }

    private function ensureDirectoryExists(string $dir): void
    {
        if (!is_dir($dir)) mkdir($dir, 0777, true);
    }
}
