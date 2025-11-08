import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/inertia-react";
import { BsDownload, BsTagFill, BsClipboard } from "react-icons/bs";
import Swal from "sweetalert2";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function PromoSingleGallery({ gallery }) {
    const images = Array.isArray(gallery.images) ? gallery.images : [gallery.images];
    const [thumbsSwiper, setThumbsSwiper] = React.useState(null);

    const handleDownloadZip = async () => {
        const zip = new JSZip();
        const folder = zip.folder("promo_gallery");

        try {
            await Promise.all(
                images.map(async (imgUrl, index) => {
                    const response = await fetch(imgUrl);
                    const blob = await response.blob();
                    const ext = imgUrl.split(".").pop().split("?")[0];
                    folder.file(`image_${index + 1}.${ext}`, blob);
                })
            );
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${gallery.slug}.zip`);
        } catch (error) {
            console.error("Download error:", error);
            Swal.fire("Error", "Failed to download images", "error");
        }
    };

    const handleCopyLink = () => {
    const url = window.location.href;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(url)
            .then(() => {
                Swal.fire("Copied!", "Gallery URL copied to clipboard", "success");
            })
            .catch((err) => {
                console.error("Clipboard error:", err);
                fallbackCopy(url);
            });
    } else {
        fallbackCopy(url);
    }
};

// Fallback method using document.execCommand (for older browsers)
const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed"; // prevent scrolling
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        const successful = document.execCommand("copy");
        if (successful) {
            Swal.fire("Copied!", "Gallery URL copied (fallback)", "success");
        } else {
            throw new Error("execCommand failed");
        }
    } catch (err) {
        console.error("Fallback copy failed", err);
        Swal.fire("Error", "Failed to copy URL", "error");
    }

    document.body.removeChild(textarea);
};


    return (
        <AuthenticatedLayout>
            <Head title={gallery.name} />
            <div className="max-w-4xl mx-auto mt-10 px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                        {gallery.name}
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleDownloadZip}
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Download Gallery"
                        >
                            <BsDownload />
                            <span className="hidden sm:inline">Download All</span>
                        </button>

                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                            title="Copy Gallery URL"
                        >
                            <BsClipboard />
                            <span className="hidden sm:inline">Copy URL</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center text-gray-500 dark:text-gray-300 text-sm mb-4">
                    <BsTagFill className="mr-2" />
                    <span>{gallery.category}</span>
                </div>

                {images.length > 1 ? (
                    <>
                        <Swiper
                            modules={[Navigation, Thumbs]}
                            spaceBetween={10}
                            navigation
                            thumbs={{ swiper: thumbsSwiper }}
                            className="rounded-lg overflow-hidden shadow-lg mb-4"
                        >
                            {images.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <img
                                        src={img}
                                        alt={`Slide ${i + 1}`}
                                        className="w-full h-auto rounded-lg"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress
                            className="rounded-md"
                        >
                            {images.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${i + 1}`}
                                        className="cursor-pointer rounded-md border-2"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </>
                ) : (
                    <img
                        src={images[0]}
                        alt="Gallery Image"
                        className="w-full object-contain rounded-lg shadow"
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
