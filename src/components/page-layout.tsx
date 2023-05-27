type PageLayoutProps = {
  children: React.ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="mx-auto flex min-h-screen flex-col gap-3 p-4 md:gap-5 md:p-12 lg:max-w-3xl">
      {children}
    </main>
  );
}
