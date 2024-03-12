import "./globals.css";
import { Inter } from "next/font/google";
import Navigation from "@/components/nav";
import { db } from "@/lib/db";
import PageLayout from "@/components/page-layout";
import { Toaster } from "@/components/toaster";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bookmarked",
  description: "Save and share bookmarks between devices and browsers",
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const totalBookmarksCount = await db.bookmark.count({
    where: { userId: user?.id },
  });

  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "relative min-h-screen bg-background antialiased"
        )}
      >
        <Navigation user={user} totalBookmarksCount={totalBookmarksCount} />
        <PageLayout>{children}</PageLayout>
        <Toaster />
        {modal}
      </body>
    </html>
  );
}
