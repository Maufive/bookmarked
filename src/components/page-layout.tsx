type PageLayoutProps = {
  children: React.ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col gap-3 md:gap-5 p-4 md:p-12 lg:max-w-3xl mx-auto">
      {children}
    </main>
  );
}
