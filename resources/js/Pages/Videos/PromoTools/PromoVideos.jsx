import __ from "@/Functions/Translate";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";

export default function PromoVideos({ promo_videos, affiliateCode,videos, links }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [hoveredVideoId, setHoveredVideoId] = useState(null);
    const [hoveredVideo, setHoveredVideo] = useState(null);
    return (
        <>
            <Head title={__("Promo Preview Videos")} />

            <div className="p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    {__("Promo Preview Videos")}
                </h2>

                {/* Video Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {promo_videos?.data?.length > 0 ? (
                        promo_videos.data.map((video) => (
                            <div
                            key={video.id}
                            className="bg-gray-50 dark:bg-zinc-800 p-4 rounded shadow hover:shadow-md transition relative cursor-pointer"
                            onMouseEnter={() => setHoveredVideo(video.id)}
                            onMouseLeave={() => setHoveredVideo(null)}
                            onClick={() =>
                                Inertia.visit(`${route("singlePage.promo", video.slug)}?affiliate_code=${affiliateCode}`)
                            }
                        >
                            <div className="relative w-full h-40 overflow-hidden rounded">
                                {hoveredVideo === video.id ? (
                                    <video
                                    src={video.preview_videos || video.video}
                                    autoPlay
                                    muted
                                    loop
                                    className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <img
                                    src={video.thumbnail}
                                    alt={video.name}
                                    className="w-full h-48 object-cover"
                                    />
                                )}
                            </div>

                            <div className="mt-3">
                                <div className="text-lg font-semibold text-gray-700 dark:text-white">
                                    {video.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-300">
                                    {video.category ?? __("No Category")}
                                </div>
                            </div>
                        </div>

                        ))
                    ) : (
                        <div className="text-gray-500 dark:text-gray-400 col-span-full text-center">
                            {__("No Preview Videos Found")}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {promo_videos?.links?.length > 1 && (
                <div className="mt-8 flex justify-center">
                    <nav className="inline-flex space-x-1">
                        {promo_videos.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() =>
                                    link.url &&
                                    Inertia.visit(link.url, {
                                        preserveScroll: true,
                                        preserveState: true,
                                        only: ["promo_videos"],
                                    })
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 rounded border text-sm ${
                                    link.active
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200"
                                } ${!link.url ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-100 dark:hover:bg-zinc-700"}`}
                            />
                        ))}
                    </nav>
                </div>
            )}

            </div>
        </>
    );
}
