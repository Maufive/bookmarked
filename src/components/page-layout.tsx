type PageLayoutProps = {
  children: React.ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="background-gradient mx-auto flex min-h-screen flex-col gap-3 p-4 md:gap-5 md:p-12">
      <section className="mt-[56px] flex flex-col gap-4 space-y-6 pb-8 pt-6 md:pb-12 lg:max-w-3xl">
        {children}
      </section>
    </main>
  );
}
