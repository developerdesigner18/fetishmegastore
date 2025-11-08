import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/inertia-react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { BsTagFill, BsDownload, BsLink45Deg } from "react-icons/bs";

export default function PromoSingleVideo({ video, url }) {
    const videoUrl = video.preview_videos; // unified backend key

    const videoSrc = {
        type: "video",
        sources: [
            {
                src: videoUrl,
                type: "video/mp4",
                size: 720,
            },
        ],
    };

    const [copied, setCopied] = useState(false);

    const fallbackCopy = (text) => {
        const input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    };

    const handleCopy = () => {
        if (!url) return;

        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(url)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(() => {
                    fallbackCopy(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                });
        } else {
            fallbackCopy(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={video.name} />
            <div className="max-w-4xl mx-auto mt-10 px-4">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3">
                    {video.name}
                </h1>

                <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm mb-5 space-x-4">
                    <div className="flex items-center">
                        <BsTagFill className="mr-1" />
                        <span>{video.category || ""}</span>
                    </div>

                    <a
                        href={videoUrl}
                        download = {videoUrl}
                        className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <BsDownload className="mr-1" />
                        <span className="hidden sm:inline">Download</span>
                    </a>

                    <button
                        onClick={handleCopy}
                        className="flex items-center text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title="Copy Video URL"
                    >
                        <BsLink45Deg className="mr-1" />
                        {copied ? "Copied!" : <span className="hidden sm:inline">Copy URL</span>}
                    </button>
                </div>

                <div className="w-full rounded-lg overflow-hidden shadow-lg">
                    <Plyr
                        source={videoSrc}
                        options={{
                            controls: ["play", "progress", "current-time", "fullscreen", "mute", "volume"],
                        }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
