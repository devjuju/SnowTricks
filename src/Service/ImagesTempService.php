<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class ImagesTempService
{
    private ?\Symfony\Component\HttpFoundation\Session\SessionInterface $session;

    public function __construct(
        private string $tempDir,  // ex: public/uploads/featured_images_tmp
        private string $finalDir, // ex: public/uploads/featured_images
        private SluggerInterface $slugger,
        RequestStack $requestStack
    ) {
        $this->session = $requestStack->getSession();
        $this->ensureDirectoryExists($this->tempDir);
        $this->ensureDirectoryExists($this->finalDir);
    }

    /**
     * Upload one file to temp directory and store it in session.
     */
    public function upload(UploadedFile $file): string
    {
        $safeName = $this->slugger->slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = $safeName . '-' . uniqid() . '.' . $file->guessExtension();

        $file->move($this->tempDir, $filename);

        $images = $this->getAll() ?? [];
        $images[] = $filename;
        $this->session?->set('temp_images', $images);

        return $filename;
    }

    /**
     * Get a single image (the first one uploaded, optional).
     */
    public function get(): ?string
    {
        $images = $this->getAll();
        return $images[0] ?? null;
    }

    /**
     * Get all temporary uploaded images.
     */
    public function getAll(): array
    {
        return $this->session?->get('temp_images', []) ?? [];
    }

    /**
     * Clear all temporary images.
     */
    public function clear(): void
    {
        foreach ($this->getAll() as $filename) {
            $path = $this->tempDir . '/' . $filename;
            if (is_file($path)) unlink($path);
        }
        $this->session?->remove('temp_images');
    }

    /**
     * Move all temporary images to final directory.
     */
    public function moveAllToFinal(): array
    {
        $movedFiles = [];
        foreach ($this->getAll() as $filename) {
            $tmpPath = $this->tempDir . '/' . $filename;
            $finalPath = $this->finalDir . '/' . $filename;
            if (is_file($tmpPath)) {
                rename($tmpPath, $finalPath);
                $movedFiles[] = $filename;
            }
        }
        $this->session?->remove('temp_images');
        return $movedFiles;
    }

    private function ensureDirectoryExists(string $dir): void
    {
        if (!is_dir($dir)) mkdir($dir, 0777, true);
    }

    public function delete(string $filename): void
    {
        // Supprimer le fichier physique
        $path = $this->tempDir . '/' . $filename;
        if (file_exists($path)) {
            unlink($path);
        }

        // Supprimer le fichier de la session
        $images = $this->getAll();
        $images = array_filter($images, fn($img) => $img !== $filename);
        $this->session?->set('temp_images', $images);
    }
}
