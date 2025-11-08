import __ from "@/Functions/Translate";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { Head, Link, useForm, usePage } from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { AiOutlineEye } from "react-icons/ai/index.js";
import "react-tooltip/dist/react-tooltip.css";
import { useState } from "react";
import Modal from "@/Components/Modal";
import { BsTagFill } from "react-icons/bs/index.js";
import TextInput from "@/Components/TextInput";
import VideosLoop from "./Partials/VideosLoop";
import AccountNavi from "../Channel/Partials/AccountNavi";
import ShortVideosLoop from "./Partials/ShortVideosLoop";
import GalleryLoop from "./Partials/GalleryLoop";


export default function OrderedPreviews({ videos }) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const { auth } = usePage().props;

    // active tab class
    const activeTabClass =
        "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
    const inactiveTabClass =
        "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";

    const searchVideos = (e) => {
        e.preventDefault();

        console.log(
            `Would visit: ${route("preview.ordered")}?search_term=${searchTerm}`
        );
        Inertia.visit(`${route("preview.ordered")}?search_term=${searchTerm}`, {
            method: "GET",
            preserveState: true,
            only: videos,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={__("Purchased Videos")} />

            <div className="lg:flex lg:space-x-10">
                <AccountNavi active={"videos"} />

                <div className="ml-0 w-full">
                    {auth.user.is_streamer == "yes" && (
                        <div className="mb-5">
                            <Link
                                href={route("videos.list")}
                                className={inactiveTabClass}
                            >
                                {__("Upload Videos")}
                            </Link>
                            <Link
                                href={route("audio.list")}
                                className={inactiveTabClass}
                            >
                                {__("Upload Audio")}
                            </Link>
                            <Link
                                href={route("videos.ordered")}
                                className={activeTabClass}
                            >
                                {__("Videos Ordered")}
                            </Link>
                            <Link
                                href={route("preview.list")}
                                className={inactiveTabClass}
                            >
                                {__("Upload Preview")}
                            </Link>
                            <Link
                                href={route("gallery.list")}
                                className={inactiveTabClass}
                            >
                                {__("Upload Gallery")}
                            </Link>
                            <Link
                                href={route("model.list")}
                                className={inactiveTabClass}
                            >
                                {__("Upload Model")}
                            </Link>
                        </div>
                    )}

                    <div className="p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg">
                        <header>
                            <h2 className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-100">
                                {__("My Purchased Previews")}
                            </h2>

                            <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                                {__("Access to previews you've purchased")}
                            </p>

                            <form onSubmit={searchVideos}>
                                <div className="flex items-center">
                                    <TextInput
                                        name="search_term"
                                        placeholder={__("Search Video")}
                                        value={searchTerm}
                                        handleChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                    <PrimaryButton
                                        className="ml-2 py-3"
                                        onClick={(e) => searchVideos(e)}
                                    >
                                        {__("GO")}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </header>

                        <hr className="my-5" />

                        {videos.total === 0 && (
                            <div className="text-gray-600 dark:text-white">
                                {__("No videos to show.")}
                            </div>
                        )}

                        {videos.total !== 0 && (
                            <div className="">
                                <GalleryLoop videos={videos.data}/>
                            </div>
                        )}

                        {videos.last_page > 1 && (
                            <>
                                <hr className="my-5" />

                                <div className="flex text-gray-600 my-3 text-sm">
                                    {__("Page: :pageNumber of :lastPage", {
                                        pageNumber: videos.current_page,
                                        lastPage: videos.last_page,
                                    })}
                                </div>

                                <SecondaryButton
                                    processing={
                                        videos.prev_page_url ? false : true
                                    }
                                    className="mr-3"
                                    onClick={(e) =>
                                        Inertia.visit(videos.prev_page_url)
                                    }
                                >
                                    {__("Previous")}
                                </SecondaryButton>

                                <SecondaryButton
                                    processing={
                                        videos.next_page_url ? false : true
                                    }
                                    onClick={(e) =>
                                        Inertia.visit(videos.next_page_url)
                                    }
                                >
                                    {__("Next")}
                                </SecondaryButton>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
