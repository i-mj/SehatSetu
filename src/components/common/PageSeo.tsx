/**
 * Nurse Care - Advanced SEO & Social Metadata Manager
 * Complies with Google AI Studio Applet SEO Skill:
 * - Dynamic <title> and <meta name="description">
 * - OpenGraph (og:title, og:description, og:site_name, og:url, og:type, og:image, og:image:alt, og:image:width, og:image:height)
 * - Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image, twitter:image:alt, twitter:site, twitter:creator)
 * - Canonical link resolution
 * - Schema.org JSON-LD Structured Data injection (MedicalBusiness, HomeHealthCareService, FAQPage)
 */

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export interface PageSeoProps {
  title: string;
  description?: string;
  ogType?: 'website' | 'article';
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: 'summary_large_image' | 'summary';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  canonicalUrl?: string;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

export const PageSeo: React.FC<PageSeoProps> = ({
  title,
  description,
  ogType = 'website',
  ogTitle,
  ogDescription,
  ogImage,
  ogImageAlt,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterImageAlt,
  canonicalUrl,
  schema
}) => {
  const { settings, services } = useApp();

  useEffect(() => {
    // 1. Page Title
    const fullTitle = `${title} | ${settings.siteName}`;
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMetaTag = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let tag = document.querySelector(selector);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    const descContent = description || settings.defaultSeoDescription;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nursecare.org';
    const resolvedUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : origin);

    // Resolve Image URLs to full absolute URLs
    const defaultImage = `${origin}/images/og-default.svg`;
    const resolvedOgImage = ogImage
      ? ogImage.startsWith('http')
        ? ogImage
        : `${origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`
      : defaultImage;

    const resolvedTwitterImage = twitterImage
      ? twitterImage.startsWith('http')
        ? twitterImage
        : `${origin}${twitterImage.startsWith('/') ? '' : '/'}${twitterImage}`
      : resolvedOgImage;

    const finalOgTitle = ogTitle || fullTitle;
    const finalOgDesc = ogDescription || descContent;
    const finalTwitterTitle = twitterTitle || finalOgTitle;
    const finalTwitterDesc = twitterDescription || finalOgDesc;
    const imageAlt = ogImageAlt || twitterImageAlt || `${settings.siteName} - ${title}`;

    // 2. Standard Meta Description & Robots
    setMetaTag('meta[name="description"]', 'name', 'description', descContent);
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow');

    // 3. OpenGraph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', finalOgTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', finalOgDesc);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', settings.siteName);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', resolvedUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', resolvedOgImage);
    setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', resolvedOgImage);
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', imageAlt);
    setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMetaTag('meta[property="og:image:type"]', 'property', 'og:image:type', resolvedOgImage.endsWith('.svg') ? 'image/svg+xml' : 'image/png');

    // 4. Twitter / X Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', twitterCard);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', finalTwitterTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', finalTwitterDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', resolvedTwitterImage);
    setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', imageAlt);
    setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', '@nursecarehome');
    setMetaTag('meta[name="twitter:creator"]', 'name', 'twitter:creator', '@nursecarehome');

    // 5. Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', resolvedUrl);
    } else {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      canonicalTag.setAttribute('href', resolvedUrl);
      document.head.appendChild(canonicalTag);
    }

    // 6. Schema.org JSON-LD Structured Data
    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': ['MedicalBusiness', 'HomeHealthCareService', 'LocalBusiness'],
      name: settings.siteName,
      description: descContent,
      url: origin,
      telephone: settings.phone,
      email: settings.email,
      image: resolvedOgImage,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressCountry: 'IN'
      },
      medicalSpecialty: [
        'Geriatrics',
        'PostSurgicalNursing',
        'PalliativeCare',
        'HomeNursing'
      ],
      availableService: services.map((s) => ({
        '@type': 'MedicalProcedure',
        name: s.title,
        description: s.shortDescription
      })),
      priceRange: '₹₹'
    };

    const targetSchema = schema || defaultSchema;

    let scriptTag = document.getElementById('json-ld-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-structured-data';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(targetSchema, null, 2);

    return () => {
      // Optional cleanup
    };
  }, [
    title,
    description,
    ogType,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageAlt,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterImageAlt,
    canonicalUrl,
    schema,
    settings,
    services
  ]);

  return null;
};
