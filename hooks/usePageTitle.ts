import { useEffect } from 'react';

const SITE_NAME = 'GPAA - Ghana Physician Assistants Association';
const DEFAULT_DESCRIPTION =
  'The official professional association for Physician Assistants in Ghana. Advancing clinical excellence, professional development, and quality healthcare delivery nationwide since 1980.';

/**
 * Sets a distinct browser tab title and meta description per route. Without
 * this every page shares the same static <title>/<meta description> from
 * index.html, which hurts SEO, makes multiple open tabs indistinguishable,
 * and gives screen reader users no confirmation that SPA navigation
 * actually succeeded.
 */
export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | GPAA` : SITE_NAME;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', description || DEFAULT_DESCRIPTION);
    }

    return () => {
      document.title = SITE_NAME;
      if (meta) meta.setAttribute('content', DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
}
