<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImagesUploaderService
{
    public function __construct(private string $targetDirectoryImages) {}

    public function upload(?UploadedFile $file, string $type = 'image'): ?string
    {
        if (!$file) return null;

        if (!is_dir($this->targetDirectoryImages)) {
            mkdir($this->targetDirectoryImages, 0777, true);
        }

        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', $originalName);

        $filename = $type . '_' . $safeName . '_' . uniqid() . '.' . $file->guessExtension();

        $file->move($this->targetDirectoryImages, $filename);

        return $filename;
    }

    /**
     * Upload multiple files.
     *
     * @param UploadedFile[]|null $files
     * @param string $type
     * @return string[] List of uploaded filenames
     */
    public function uploadMultiple(?array $files, string $type = 'image'): array
    {
        $uploadedFiles = [];

        if (!$files) {
            return $uploadedFiles;
        }

        foreach ($files as $file) {
            $filename = $this->upload($file, $type);
            if ($filename) {
                $uploadedFiles[] = $filename;
            }
        }

        return $uploadedFiles;
    }

    public function delete(?string $filename): void
    {
        if (!$filename) return;
        $path = $this->targetDirectoryImages . '/' . $filename;
        if (file_exists($path) && is_file($path)) {
            unlink($path);
        }
    }

    /**
     * Delete multiple files.
     *
     * @param string[]|null $filenames
     */
    public function deleteMultiple(?array $filenames): void
    {
        if (!$filenames) return;
        foreach ($filenames as $filename) {
            $this->delete($filename);
        }
    }
}
