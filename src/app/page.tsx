import Image from 'next/image';
import PageLayout from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import UrlInput from '@/components/url-input';

type ListItemProps = {
  children?: React.ReactNode;
  title: string;
  domain: string;
  url: string;
  image?: string;
};

function ListItem({ title, domain, url, image, children }: ListItemProps) {
  return (
    <li className="py-2">
      <a
        href={url}
        target="__blank"
        className="text-primary flex items-center gap-2"
      >
        <Image
          alt="Favicon"
          src={`https://www.google.com/s2/favicons?domain=${domain}`}
          width="16"
          height="16"
        />
        {title}
        <span className="text-muted-foreground text-sm">{domain}</span>
      </a>
    </li>
  );
}

export default function Home() {
  return (
    <PageLayout>
      <div className="mb-3 md:mb-5">
        <UrlInput />
      </div>
      <div className="space-y-2">
        <h2 className="text-muted-foreground">Title</h2>
        <Separator />
        <ul className="space-y-2">
          <ListItem
            title="My Second Link"
            domain="aftonbladet.se"
            url="https://www.example.com"
          />
          <ListItem
            title="My First Link"
            domain="twitter.com"
            url="https://www.example.com"
          />
        </ul>
      </div>
    </PageLayout>
  );
}
