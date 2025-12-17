<?php

namespace App\Entity;

use App\Repository\VideosRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VideosRepository::class)]
class Videos
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $content = null;

    #[ORM\ManyToOne(inversedBy: 'videos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Tricks $trick = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;
        return $this;
    }

    public function getTrick(): ?Tricks
    {
        return $this->trick;
    }

    public function setTrick(?Tricks $trick): static
    {
        $this->trick = $trick;
        return $this;
    }

    // Dans Videos pour le carousel
    public function getType(): string
    {
        return 'video';
    }


    public function getYoutubeId(): ?string
    {
        // youtube.com/watch?v=XXXX
        if (str_contains($this->content, 'youtube.com')) {
            parse_str(parse_url($this->content, PHP_URL_QUERY), $vars);
            return $vars['v'] ?? null;
        }

        // youtu.be/XXXX
        if (str_contains($this->content, 'youtu.be')) {
            return basename($this->content);
        }

        return null;
    }

    public function getEmbedUrl(): ?string
    {
        $id = $this->getYoutubeId();

        if (!$id) {
            return null;
        }

        return 'https://www.youtube.com/embed/' . $id;
    }
}
