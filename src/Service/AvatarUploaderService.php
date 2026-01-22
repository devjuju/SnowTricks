<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class AvatarUploaderService
{
    private string $targetDirectory;

    public function __construct(string $targetDirectory)
    {
        $this->targetDirectory = $targetDirectory;
    }

    // 1️⃣ Vérifier que le répertoire existe
    // Pour éviter les erreurs si le dossier n’existe pas :
    public function upload(?UploadedFile $file, string $type = 'image'): ?string
    {
        if (!$file) return null;

        if (!is_dir($this->targetDirectory)) {
            mkdir($this->targetDirectory, 0777, true);
        }

        // Récupérer le nom original et le "nettoyer"
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', $originalName);

        // Générer un nom unique lisible
        $filename = $type . '_' . $safeName . '_' . uniqid() . '.' . $file->guessExtension();

        $file->move($this->targetDirectory, $filename);

        return $filename;
    }


    // 2️⃣ Gestion sécurisée des fichiers
    // Pour éviter des erreurs si le fichier a déjà été supprimé ou est introuvable:
    public function delete(?string $filename): void
    {
        if (!$filename) return;
        $path = $this->targetDirectory . '/' . $filename;
        if (file_exists($path) && is_file($path)) {
            unlink($path);
        }
    }
}
