type PageLayoutProps = {
  children: React.ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="background-gradient min-h-screen p-4 md:p-12">
      <section className="mx-auto mt-[56px] flex flex-col gap-4 space-y-6 pb-8 pt-6 md:pb-12 lg:max-w-3xl">
        {children}
      </section>
    </main>
  );
}
