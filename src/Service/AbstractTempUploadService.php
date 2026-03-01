<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

abstract class AbstractTempUploadService
{
    protected ?SessionInterface $session;

    public function __construct(
        protected string $tempDir,
        protected string $finalDir,
        protected SluggerInterface $slugger,
        RequestStack $requestStack
    ) {
        $this->session = $requestStack->getSession();

        $this->ensureDirectoryExists($this->tempDir);
        $this->ensureDirectoryExists($this->finalDir);
    }

    // -----------------------------
    // SESSION KEY
    // -----------------------------
    abstract protected function getBaseSessionKey(): string;

    protected function isMultiple(): bool
    {
        return true;
    }

    protected function getSessionKey(?string $context = null): string
    {
        return $this->getBaseSessionKey() . ($context ? '_' . $context : '');
    }

    // -----------------------------
    // UPLOAD
    // -----------------------------
    public function upload(UploadedFile $file, ?string $context = null): string
    {
        $safeName = $this->slugger->slug(
            pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)
        );

        $filename = $safeName . '-' . uniqid() . '.' . $file->guessExtension();
        $file->move($this->tempDir, $filename);

        $key = $this->getSessionKey($context);

        if ($this->isMultiple()) {
            $files = $this->session?->get($key, []);
            $files[] = $filename;
            $this->session?->set($key, $files);
        } else {
            $this->clear($context);
            $this->session?->set($key, [$filename]);
        }

        return $filename;
    }

    // -----------------------------
    // GET
    // -----------------------------
    public function getAll(?string $context = null): array
    {
        return $this->session?->get(
            $this->getSessionKey($context),
            []
        ) ?? [];
    }

    public function get(?string $context = null): ?string
    {
        return $this->getAll($context)[0] ?? null;
    }

    // -----------------------------
    // MOVE TO FINAL
    // -----------------------------
    public function moveAllToFinal(?string $context = null): array
    {
        $key = $this->getSessionKey($context);
        $files = $this->getAll($context);

        $moved = [];
        $remaining = [];

        foreach ($files as $filename) {
            $tmpPath = $this->tempDir . '/' . $filename;
            $finalPath = $this->finalDir . '/' . $filename;

            if (!is_file($tmpPath)) continue;

            if (@rename($tmpPath, $finalPath)) {
                $moved[] = $filename;
            } else {
                $remaining[] = $filename;
            }
        }

        if ($remaining) {
            $this->session?->set($key, $remaining);
        } else {
            $this->session?->remove($key);
        }

        return $moved;
    }

    // -----------------------------
    // DELETE ONE
    // -----------------------------
    public function delete(string $filename, ?string $context = null): void
    {
        $key = $this->getSessionKey($context);
        $path = $this->tempDir . '/' . $filename;

        if (is_file($path)) unlink($path);

        $files = array_filter(
            $this->getAll($context),
            fn($f) => $f !== $filename
        );

        $this->session?->set($key, $files);
    }

    // -----------------------------
    // CLEAR
    // -----------------------------
    public function clear(?string $context = null): void
    {
        $key = $this->getSessionKey($context);

        foreach ($this->getAll($context) as $filename) {
            $path = $this->tempDir . '/' . $filename;
            if (is_file($path)) unlink($path);
        }

        $this->session?->remove($key);
    }

    private function ensureDirectoryExists(string $dir): void
    {
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
    }
}
