<?php

namespace App\Entity;

use App\Repository\TricksRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TricksRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Tricks
{
    use Timestampable;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $content = null;

    #[ORM\Column(length: 255)]
    private ?string $featuredImage = null;

    #[ORM\ManyToOne(inversedBy: 'tricks')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Users $user = null;

    #[ORM\ManyToOne(inversedBy: 'tricks')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Categories $category = null;

    #[ORM\OneToMany(
        mappedBy: 'trick',
        targetEntity: Images::class,
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $images;

    #[ORM\OneToMany(
        mappedBy: 'trick',
        targetEntity: Videos::class,
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $videos;

    #[ORM\OneToMany(
        mappedBy: 'tricks',
        targetEntity: Comments::class,
        orphanRemoval: true
    )]
    private Collection $comments;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    public function __construct()
    {
        $this->images = new ArrayCollection();
        $this->videos = new ArrayCollection();
        $this->comments = new ArrayCollection();
    }

    // -------------------
    // GETTERS / SETTERS
    // -------------------

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;
        return $this;
    }

    public function getFeaturedImage(): ?string
    {
        return $this->featuredImage;
    }

    public function setFeaturedImage(string $featuredImage): self
    {
        $this->featuredImage = $featuredImage;
        return $this;
    }

    public function getUser(): ?Users
    {
        return $this->user;
    }

    public function setUser(?Users $user): self
    {
        if ($this->user === $user) {
            return $this;
        }

        // Retire de l'ancien user
        if ($this->user !== null) {
            $this->user->getTricks()->removeElement($this);
        }

        $this->user = $user;

        // Ajoute au nouveau user
        if ($user !== null && !$user->getTricks()->contains($this)) {
            $user->getTricks()->add($this);
        }

        return $this;
    }

    public function getCategory(): ?Categories
    {
        return $this->category;
    }

    public function setCategory(?Categories $category): self
    {
        $this->category = $category;
        return $this;
    }

    public function getImages(): Collection
    {
        return $this->images;
    }

    public function getVideos(): Collection
    {
        return $this->videos;
    }

    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;
        return $this;
    }
}
