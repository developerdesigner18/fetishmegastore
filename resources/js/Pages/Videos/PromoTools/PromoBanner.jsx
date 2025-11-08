import __ from "@/Functions/Translate";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function PromoBanner({ promo_banners }) {
    const [search, setSearch] = useState("");

    // Fallback if undefined
    const banners = promo_banners || { data: [], links: [] };

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
            Swal.fire("Error", "Failed to download banner", "error");
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
                    {__("Promo Banners")}
                </h2>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder={__("Search banners...")}
                    className="mt-4 md:mt-0 px-4 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-zinc-800 dark:border-zinc-600 dark:text-white w-full md:w-1/3"
                />
            </div>

            {/* Banner Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {banners.data.length > 0 ? (
                    banners.data.map((banner) => (
                        <div
                            key={banner.id}
                            className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <img
                                src={banner.thumbnail}
                                alt={banner.name}
                                className="w-full object-none rounded-md"
                            />
                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-base font-semibold text-gray-700 dark:text-white">
                                    {banner.name}
                                </div>
                                <button
                                    onClick={() => handleDownload(banner.banner_image, banner.id)}
                                    title="Download Banner"
                                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">
                        {__("No Promo Banners Found")}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {banners.links && banners.links.length > 3 && (
                <div className="mt-10 flex justify-center flex-wrap gap-2">
                    {banners.links.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() => link.url && Inertia.visit(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1 rounded border text-sm ${
                                link.active
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200"
                            } ${!link.url ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-100 dark:hover:bg-zinc-700"}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
