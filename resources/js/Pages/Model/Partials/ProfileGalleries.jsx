import { Link } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import Spinner from "@/Components/Spinner";
import SecondaryButton from "@/Components/SecondaryButton";
import {IoIosPricetags} from "react-icons/io";
import {CgGirl} from "react-icons/cg";
import {BsTagFill} from "react-icons/bs/index.js";

export default function ProfileGalleries({ galleries }) {
  if (!galleries) {
    return (
      <div className="my-3">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="mt-5">
      {galleries?.data?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleries.data.map((item) => (
            <div
              key={item.id}
              className="rounded-lg overflow-hidden shadow bg-white dark:bg-zinc-900"
            >
              <img
                src={
                  item.thumbnail_url ??
                  `${item.image ?? item.thumbnail ?? ""}` ??
                  "/images/placeholder.jpg"
                }
                alt={item.title ?? "Gallery Image"}
                className="w-full h-48 object-cover"
              />
              <div className="p-2 text-center dark:text-white">
                <p className="text-sm truncate">{item.title}</p>
              </div>
              <div className="px-3 py-2">
                <div className="h-auto">
                  <a
                    className="font-semibold dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400 block break-words whitespace-normal"
                    href={route("single.gallery", {
                      slug: item.slug,
                    })}
                    onClick={(e) =>
                      handleLinkClick(
                        e,
                        route("single.gallery", { slug: item.slug })
                      )
                    }
                  >
                    {item.title}
                  </a>
                </div>

                <div className="mt-1.5 mb-1 flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-200 space-y-2">
                  <div className="inline-flex items-center w-full">
                    <BsTagFill className="mr-0.5 text-base" />{" "}
                    {/* Adjusted icon size */}
                    <span className="break-words whitespace-normal">
                      {item.categoryNames}
                    </span>
                  </div>

                  <div className="inline-flex items-center w-full">
                    <IoIosPricetags className="mr-0.5 text-base" />{" "}
                    {/* Adjusted icon size */}
                    <span className="break-words whitespace-normal">
                      {item.tagNames}
                    </span>
                  </div>

                  <div className="inline-flex items-center w-full">
                    <CgGirl className="mr-0.5 text-base" />{" "}
                    {/* Adjusted icon size */}
                    <span className="break-words whitespace-normal">
                      {item.modelNames}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No galleries uploaded</p>
      )}
    </div>
  );
}
