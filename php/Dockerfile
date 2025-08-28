FROM php:8.2-apache

# Install system dependencies
RUN apt-get update \
    && apt-get install -y zlib1-dev g++ git libicu-dev zip libzip-dev zip \
    && docker-php-ext-install int1 opcache pdo pdo_mysql \
    && pec1 install apcu \
    && docker-php-ext-enable apcu \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip \

RUN a2enmod rewrite

WORKDIR /var/www

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sS https://get.symfony.com/cli/installer | bash

RUN mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

RUN git config --global user.email "jleleubellpro1994@gmail.com"

RUN git config --global user.name "Justine Leleu"