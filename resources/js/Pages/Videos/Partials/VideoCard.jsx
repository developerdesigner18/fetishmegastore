import React, { useState, useCallback, useMemo, memo } from "react";
import { Link } from "@inertiajs/inertia-react";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import { BsTagFill, BsEyeFill } from "react-icons/bs/index.js";
import __ from "@/Functions/Translate";

function VideoCard({ video, priority = false, showViews = true }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = useCallback(() => {
        // Only load GIF on hover if it exists
        if (video.videoGIF) {
            setIsHovered(true);
        }
    }, [video.videoGIF]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const videoUrl = useMemo(() => {
        if (video.type === 'short-video') {
            return route("short.video.single.page", { id: video.slug || video.id });
        }
        return route("video.single.page", { id: video.slug || video.id });
    }, [video.type, video.slug, video.id]);

    const handleLinkClick = useCallback((e) => {
        e.preventDefault();
        window.location.href = videoUrl;
    }, [videoUrl]);

    const getResizedUrl = useCallback((url, width) => {
        if (!url) return "";
        // Check if it's a data URL or blob
        if (url.startsWith('data:') || url.startsWith('blob:')) return url;

        let path = url;
        if (url.startsWith('http')) {
            try {
                const urlObj = new URL(url);
                if (urlObj.hostname !== window.location.hostname) {
                    return url; // Return original if not local
                }
                path = urlObj.pathname;
            } catch (e) {
                return url;
            }
        }

        // Remove leading slash if present
        if (path.startsWith('/')) {
            path = path.substring(1);
        }

        return `/img-resize/${width}/${path}`;
    }, []);

    const channelUrl = useMemo(() =>
            video.streamer ? route("channel", { user: video.streamer.username }) : "#",
        [video.streamer]
    );

    return (
        <div className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900">
            <div className="relative">
                <a href={videoUrl}
                   onClick={handleLinkClick}
                   data-price={video.price}
                >
                    {isHovered && video.videoGIF ? (
                        <img src={video.videoGIF}
                             width="480"
                             height="253"
                             className="hovered-gif aspect-[19/10] object-cover rounded-tl-lg rounded-tr-lg mb-3"
                             alt={video.title}
                             loading={priority ? "eager" : "lazy"}
                             fetchPriority={priority ? "high" : "auto"}
                             onMouseLeave={handleMouseLeave}
                        />
                    ) : (
                        <img src={video.thumbnail}
                             srcSet={`${getResizedUrl(video.thumbnail, 480)} 480w, ${getResizedUrl(video.thumbnail, 720)} 720w`}
                             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                             width="480"
                             height="253"
                             className="aspect-[19/10] rounded-tl-lg rounded-tr-lg mb-3"
                             alt={video.title}
                             loading={priority ? "eager" : "lazy"}
                             fetchPriority={priority ? "high" : "auto"}
                             onMouseEnter={handleMouseEnter}
                        />
                    )}
                </a>

                <div className="absolute top-5 left-0 bg-indigo-800 text-white font-bold text-sm uppercase rounded-tr rounded-br px-2 py-1">
                    {video.price < 1 ? (
                        __("Free")
                    ) : (
                        <div className="flex items-center">
                            <MdGeneratingTokens className="h-4 w-4 mr-1" />
                            {video.price}
                        </div>
                    )}
                </div>
            </div>
            <div className="inline-flex items-center">
                <div className="w-10 flex-shrink-0 mr-2">
                    <Link href={channelUrl}>
                        {video.streamer && video.streamer.profile_picture ? (
                            <img src={video.streamer.profile_picture}
                                 width="40"
                                 height="40"
                                 className="w-10 h-10 rounded-full object-cover"
                                 alt={video.streamer.username || "Streamer profile"}
                                 onError={(e) => {
                                     e.target.onerror = null;
                                     e.target.src = "/profilePics/16-661d9f8e6bc63.JPG";
                                 }}
                            />
                        ) : (
                            <img src="/profilePics/16-661d9f8e6bc63.JPG"
                                 width="40"
                                 height="40"
                                 className="w-10 h-10 rounded-full object-cover"
                                 alt="Default avatar"
                            />
                        )}
                    </Link>
                </div>

                <div>
                    <div className="h-5 overflow-hidden">
                        <a className="font-semibold dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400"
                           href={videoUrl}
                           onClick={handleLinkClick}
                        >
                            {video.title}
                        </a>
                    </div>

                    <div className="mt-1.5 mb-1 flex items-center text-xs text-gray-500 dark:text-gray-200">
                        <div className="inline-flex items-center ml-2">
                            <BsTagFill className="mr-0.5" />
                            {video.categoryNames}
                        </div>
                        {showViews && (
                            <div className="inline-flex items-center ml-2">
                                <BsEyeFill className="mr-0.5" />
                                {video?.views}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Memoize component to prevent unnecessary re-renders
export default memo(VideoCard);
