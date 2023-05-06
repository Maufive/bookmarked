import { PlusIcon } from 'lucide-react';
import PageLayout from '@/components/page-layout';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

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
      <a href={url} target="__blank" className="text-primary">
        {title}
        <span className="text-muted-foreground ml-2 text-sm">{domain}</span>
      </a>
    </li>
  );
}

export default function Home() {
  return (
    <PageLayout>
      <Input
        placeholder="Add link here"
        type="url"
        className="shadow-md mb-3 md:mb-5"
      />
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
