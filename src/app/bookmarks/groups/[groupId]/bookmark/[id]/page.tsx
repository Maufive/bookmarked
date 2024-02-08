/* eslint-disable @next/next/no-img-element */
import { getGroupsForUserWithBookmarksCount } from "@/app/groups/actions";
import EditBookmarkForm from "@/components/edit-bookmark-form";
import { db } from "@/lib/db";

export default async function Page({ params }: { params: { id: string } }) {
  const groups = await getGroupsForUserWithBookmarksCount();
  const bookmark = await db.bookmark.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  if (!bookmark) {
    return (
      <section className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl">Bookmark not found</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl">Edit Bookmark</h1>
        <p className="text-lg text-muted-foreground">{bookmark.name}</p>
      </div>
      {bookmark.image ? (
        <div className="flex justify-center">
          <img
            src={bookmark.image}
            alt="Bookmark image"
            className="size-[150px] rounded-full"
          />
        </div>
      ) : (
        <p>Coming soon: Add image</p>
      )}
      <EditBookmarkForm bookmark={bookmark} groups={groups} />
    </section>
  );
}
