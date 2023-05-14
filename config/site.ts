type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export const siteConfig: SiteConfig = {
  name: 'Bookmarked',
  description: 'A bookmark manager made for personal use',
  url: 'https://tx.shadcn.com',
  ogImage: 'https://tx.shadcn.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/shadcn',
    github: 'https://github.com/shadcn/taxonomy',
  },
};
