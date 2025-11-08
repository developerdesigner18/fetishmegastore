import __ from "@/Functions/Translate";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import {Head, Link} from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Inertia} from "@inertiajs/inertia";
import {AiOutlineEdit} from "react-icons/ai/index.js";
import {RiDeleteBin5Line} from "react-icons/ri/index.js";
import {Tooltip} from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {useState} from "react";
import Modal from "@/Components/Modal";
import {BsTagFill , BsEyeFill} from "react-icons/bs/index.js";
import AccountNavi from "../Channel/Partials/AccountNavi";
import {MdOutlineVideoLibrary} from "react-icons/md/index.js";

export default function Upload({videos}) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(0);

    const confirmDelete = (e, id) => {
        e.preventDefault();

        setShowDeleteConfirmation(true);
        setDeleteId(id);
    };

    const deleteVideo = () => {
        Inertia.visit(route("gallery.delete"), {
            method: "POST",
            data: {video: deleteId},
            preserveState: false,
        });
    };

    // active tab class
    const activeTabClass =
        "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
    const inactiveTabClass =
        "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";

    return (
        <AuthenticatedLayout>
            <Head title={__("Gallery")}/>

            <Modal
                show={showDeleteConfirmation}
                onClose={(e) => setShowDeleteConfirmation(false)}
            >
                <div className="px-5 py-10 text-center">
                    <h3 className="text-xl mb-3 text-zinc-700 dark:text-white">
                        {__("Are you sure you want to remove this gallery?")}
                    </h3>
                    <DangerButton onClick={(e) => deleteVideo()}>
                        {__("Yes")}
                    </DangerButton>
                    <SecondaryButton
                        className="ml-3"
                        onClick={(e) => setShowDeleteConfirmation(false)}
                    >
                        {__("No")}
                    </SecondaryButton>
                </div>
            </Modal>

            <div className="lg:flex lg:space-x-10">
                <AccountNavi active={"preview-gallery"}/>
                <div className="ml-0">
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
                        href={route("ebook.list")}
                        className={inactiveTabClass}
                    >
                        {__("Upload Ebook")}
                    </Link>
                    <Link
                        href={route("videos.ordered")}
                        className={inactiveTabClass}
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
                        className={activeTabClass}
                    >
                        {__("Upload Gallery")}
                    </Link>
                    <Link
                        href={route("model.list")}
                        className={inactiveTabClass}
                    >
                        {__("Upload Model")}
                    </Link>

                    <div className="mt-5 p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg">
                        <header>
                            <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
                                <MdOutlineVideoLibrary className="mr-2"/>
                                {__("My Gallery")}
                            </h2>

                            <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                                {__("Upload & manage Gallery for the channel")}
                            </p>

                            <PrimaryButton
                                onClick={(e) =>
                                    Inertia.visit(route("gallery.upload"))
                                }
                            >
                                {__("Upload Gallery")}
                            </PrimaryButton>
                        </header>

                        <hr className="my-5"/>

                        {videos.total === 0 && (
                            <div className="text-gray-600 dark:text-white">
                                {__("You didn't upload any Gallery yet.")}
                            </div>
                        )}

                        {videos.total !== 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-5 gap-y-10">
                                {videos.data.map((v) => (
                                    <div
                                        key={`video-${v.id}`}
                                        className={
                                            "w-full md:w-[340px] xl:w-[420px] mt-5"
                                        }
                                    >
                                        <img className="w-full rounded-lg aspect-video" src={v.thumbnail}
                                             alt={v.thumbnail}/>

                                        <div
                                            className="my-3 h-6 overflow-hidden text-gray-600 text-sm font-semibold dark:text-white">
                                            <a
                                                data-tooltip-content={v.title}
                                                data-tooltip-id={`tooltip-${v.id}`}
                                            >
                                                {v.title}
                                            </a>

                                            <Tooltip anchorSelect="a"/>
                                        </div>

                                        <div
                                            className="dark:text-white text-gray-600 flex items-center space-x-2 text-xs">
                                            <BsTagFill className="mr-1"/>{" "}
                                            {v.categoryNames}
                                        </div>

                                        
                                        <div className="mt-1 md:mt-0 inline-flex items-center text-sm rounded px-2 py-1 cursor-pointer" >
                                            <BsEyeFill style={{ color: "red" }} className="w-4 h-4 mr-1" />
                                            <span>{ v?.views }</span>
                                        </div>

                                        <div className="border-t pt-3 mt-3  flex items-center">
                                            <Link
                                                href={route("gallery.edit", {
                                                    video: v.id,
                                                })}
                                            >
                                                <AiOutlineEdit className="w-6 h-6 mr-2 text-sky-600" />
                                            </Link>
                                            <button
                                                onClick={(e) =>
                                                    confirmDelete(e, v.id)
                                                }
                                            >
                                                <RiDeleteBin5Line className="text-red-600 w-5 h-5"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {videos.last_page > 1 && (
                            <>
                                <hr className="my-5"/>

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
