<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class FeaturedImageUploaderService
{
    public function __construct(private string $targetDirectoryFeaturedImage) {}

    public function upload(?UploadedFile $file, string $type = 'image'): ?string
    {
        if (!$file) return null;

        if (!is_dir($this->targetDirectoryFeaturedImage)) {
            mkdir($this->targetDirectoryFeaturedImage, 0777, true);
        }

        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', $originalName);

        $filename = $type . '_' . $safeName . '_' . uniqid() . '.' . $file->guessExtension();

        $file->move($this->targetDirectoryFeaturedImage, $filename);

        return $filename;
    }

    public function delete(?string $filename): void
    {
        if (!$filename) return;
        $path = $this->targetDirectoryFeaturedImage . '/' . $filename;
        if (file_exists($path) && is_file($path)) {
            unlink($path);
        }
    }
}
