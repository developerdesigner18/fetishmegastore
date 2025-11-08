import __ from "@/Functions/Translate";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "@inertiajs/inertia-react"; 

export default function PromoGallery({ promo_gallery, affiliate_code }) {
    //console.log("affiliate_code :", affiliate_code);
    const [search, setSearch] = useState("");

    const gallery = promo_gallery || { data: [], links: [] };

    const handleDownload = async (url, id) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            const extension = url.split(".").pop().split("?")[0];
            link.href = downloadUrl;
            link.download = `promo_${id}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Download failed:", error);
            Swal.fire("Error", "Failed to download gallery", "error");
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        Inertia.visit(route("affiliate.dashboard"), {
            method: "get",
            data: { search: value },
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="p-6 bg-white dark:bg-zinc-900 shadow-md rounded-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
                    {__("Promo Gallery")}
                </h2>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder={__("Search gallery...")}
                    className="mt-4 md:mt-0 px-4 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-800 dark:border-zinc-600 dark:text-white w-full md:w-1/3"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.data.length > 0 ? (
                    gallery.data.map((galleryItem) => (
                        <div key={galleryItem.id} className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg shadow-sm hover:shadow-md transition">
                            <Link
                                href={`${route("gallerySinglePage.promo", galleryItem.slug)}?affiliate_code=${affiliate_code}`}
                            >
                                <img
                                    src={galleryItem.thumbnail}
                                    alt={galleryItem.title}
                                    className="w-full h-40 object-cover rounded-md cursor-pointer transition duration-300 hover:scale-105"
                                />
                            </Link>
                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-base font-semibold text-gray-700 dark:text-white">
                                    {galleryItem.title}
                                </div>
                                <button
                                    onClick={() => handleDownload(galleryItem.images, galleryItem.id)}
                                    title="Download gallery"
                                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">
                        {__("No Promo gallery Found")}
                    </div>
                )}
            </div>

            {gallery.links && gallery.links.length > 3 && (
                <div className="mt-10 flex justify-center flex-wrap gap-2">
                    {gallery.links.map((link, i) => (
                       <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => link.url && Inertia.visit(link.url)}
                            className={`px-3 py-1 rounded border text-sm ${
                                link.active
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200"
                            } ${!link.url ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-100 dark:hover:bg-zinc-700"}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}


                     
                </div>
            )}
        </div>
    );
}

