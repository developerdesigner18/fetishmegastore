import { Link } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import Spinner from "@/Components/Spinner";
import SecondaryButton from "@/Components/SecondaryButton";
import ShortVideosLoop from "@/Pages/Videos/Partials/VideosLoopNew";
import VideosLoop from "@/Pages/Videos/Partials/VideosLoop"; // 👈 make sure path is correct

export default function ProfilePreviews({ preview, userLoginID }) {
  if (!preview) {
    return (
      <div className="my-3">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mt-5">
      {/* Show videos */}
      {preview?.data?.length > 0 ? (
        <>
          <ShortVideosLoop videos={preview.data} />

          {/* Added VideosLoop */}
          {/* <VideosLoop videos={preview.data} userLoginID={userLoginID} /> */}
        </>
      ) : (
        <p>No previews uploaded</p>
      )}

      {/* Pagination */}
      {preview.total > preview.per_page && (
        <div className="flex gap-2 mt-3">
          {preview.prev_page_url && (
            <Link href={preview.prev_page_url}>
              <SecondaryButton>{__("Prev")}</SecondaryButton>
            </Link>
          )}

          {preview.next_page_url && (
            <Link href={preview.next_page_url}>
              <SecondaryButton>{__("Next")}</SecondaryButton>
            </Link>
          )}
        </div>
      )}

      {/* Empty state */}
      {preview.total === 0 && (
        <div className="dark:text-white dark:bg-zinc-900 rounded-lg px-3 py-5 text-gray-600 bg-white shadow">
          {__("No previews uploaded by :streamer", {
            streamer: preview?.data?.[0]?.user?.username ?? "",
          })}
        </div>
      )}
    </div>
  );
}
