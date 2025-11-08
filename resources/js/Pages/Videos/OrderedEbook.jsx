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
import EbookLoop from "./Partials/EbookLoop";
import AccountNavi from "../Channel/Partials/AccountNavi";

export default function OrderedEbook({ audio }) {
    console.log(audio, 'ebook');
    
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const { auth } = usePage().props;

    // active tab class
    const activeTabClass =
        "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
    const inactiveTabClass =
        "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";

    const searchAudio = (e) => {
        e.preventDefault();

        console.log(
            `Would visit: ${route("ebook.ordered")}?search_term=${searchTerm}`
        );
        Inertia.visit(`${route("ebook.ordered")}?search_term=${searchTerm}`, {
            method: "GET",
            preserveState: true,
            only: audio,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={__("Purchased ebook")} />

            <div className="lg:flex lg:space-x-10">
                <AccountNavi active={"ebook"} />

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
                                href={route("ebook.list")}
                                className={inactiveTabClass}
                            >
                                {__("Upload ebook")}
                            </Link>
                            <Link
                                href={route("videos.ordered")}
                                className={inactiveTabClass}
                            >
                                {__("Videos Ordered")}
                            </Link>
                            <Link
                                href={route("ebook.ordered")}
                                className={activeTabClass}
                            >
                                {__("ebook Ordered")}
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
                                {__("My Purchased ebook")}
                            </h2>

                            <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                                {__("Access to ebook you've purchased")}
                            </p>

                            <form onSubmit={searchAudio}>
                                <div className="flex items-center">
                                    <TextInput
                                        name="search_term"
                                        placeholder={__("Search ebook")}
                                        value={searchTerm}
                                        handleChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                    <PrimaryButton
                                        className="ml-2 py-3"
                                        onClick={(e) => searchAudio(e)}
                                    >
                                        {__("GO")}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </header>

                        <hr className="my-5" />

                        {audio.total === 0 && (
                            <div className="text-gray-600 dark:text-white">
                                {__("No ebook to show.")}
                            </div>
                        )}

                        {audio.total !== 0 && (
                            <div className="">
                                <EbookLoop audio={audio.data}/>
                            </div>
                        )}

                        {audio.last_page > 1 && (
                            <>
                                <hr className="my-5" />

                                <div className="flex text-gray-600 my-3 text-sm">
                                    {__("Page: :pageNumber of :lastPage", {
                                        pageNumber: audio.current_page,
                                        lastPage: audio.last_page,
                                    })}
                                </div>

                                <SecondaryButton
                                    processing={
                                        audio.prev_page_url ? false : true
                                    }
                                    className="mr-3"
                                    onClick={(e) =>
                                        Inertia.visit(audio.prev_page_url)
                                    }
                                >
                                    {__("Previous")}
                                </SecondaryButton>

                                <SecondaryButton
                                    processing={
                                        audio.next_page_url ? false : true
                                    }
                                    onClick={(e) =>
                                        Inertia.visit(audio.next_page_url)
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
