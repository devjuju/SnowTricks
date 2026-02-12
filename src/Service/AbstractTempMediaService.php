<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

abstract class AbstractTempMediaService
{
    protected ?SessionInterface $session = null;

    public function __construct(
        protected string $tmpDir,
        protected SluggerInterface $slugger,
        RequestStack $requestStack
    ) {
        $this->session = $requestStack->getSession();
    }

    abstract protected function getSessionKey(): string;
    abstract protected function moveToFinal(string $filename): void;

    public function upload(UploadedFile $file): string
    {
        $this->ensureDir($this->tmpDir);

        $safeName = $this->slugger->slug(
            pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)
        );

        $filename = $safeName . '-' . uniqid() . '.' . $file->guessExtension();

        $file->move($this->tmpDir, $filename);

        $this->session?->set($this->getSessionKey(), $filename);

        return $filename;
    }

    public function get(): ?string
    {
        return $this->session?->get($this->getSessionKey());
    }

    public function clear(): void
    {
        if ($filename = $this->get()) {
            @unlink($this->tmpDir . '/' . $filename);
        }

        $this->session?->remove($this->getSessionKey());
    }

    protected function ensureDir(string $dir): void
    {
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
    }
}
