import React from 'react';
import { Link } from 'react-router-dom';

export const isExternalLink = (href: string): boolean => /^https?:\/\//.test(href);

interface NewsArticleLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

/**
 * Wraps a NewsItem's `link` in the right kind of anchor: an internal
 * react-router `<Link>` for GPAA's own pages (e.g. a conference gallery), or
 * an external `<a target="_blank">` for an outside publication.
 */
const NewsArticleLink: React.FC<NewsArticleLinkProps> = ({ href, children, ...rest }) => {
  if (isExternalLink(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} {...rest}>
      {children}
    </Link>
  );
};

export default NewsArticleLink;
