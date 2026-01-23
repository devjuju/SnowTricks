<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Twig\Environment;

class ExceptionSubscriber implements EventSubscriberInterface
{
    private Environment $twig;

    public function __construct(Environment $twig)
    {
        $this->twig = $twig;
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        // Récupère le code HTTP si c'est une HttpException, sinon 500
        $statusCode = $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : 500;

        // Choisit le template correspondant : error404.html.twig, error500.html.twig, etc.
        $template = sprintf('bundles/TwigBundle/Exception/error%s.html.twig', $statusCode);

        // Fallback sur error.html.twig si le fichier n'existe pas
        if (!file_exists($this->twig->getLoader()->getSourceContext($template)->getPath())) {
            $template = 'bundles/TwigBundle/Exception/error.html.twig';
        }

        $content = $this->twig->render($template, [
            'status_code' => $statusCode,
            'message'     => $exception->getMessage(),
        ]);

        $response = new Response($content, $statusCode);
        $event->setResponse($response);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => 'onKernelException',
        ];
    }
}
