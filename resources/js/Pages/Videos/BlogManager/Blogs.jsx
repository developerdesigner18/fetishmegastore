import __ from "@/Functions/Translate";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { Head, Link } from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { AiOutlineEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useState } from "react";
import Modal from "@/Components/Modal";
import { BsTagFill } from "react-icons/bs";
import AccountNavi from "../../Channel/Partials/AccountNavi";
import { MdOutlineVideoLibrary } from "react-icons/md";

export default function Upload({ blogs }) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(0);

    const confirmDelete = (e, id) => {
        e.preventDefault();
        setShowDeleteConfirmation(true);
        setDeleteId(id);
    };

    const deleteBlogs = () => {
        Inertia.visit(route("blogs.delete"), {
            method: "POST",
            data: { blog: deleteId }, // must match Laravel's expected key
            preserveState: false,
        });
    };

    const activeTabClass =
        "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
    const inactiveTabClass =
        "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";

    // Safe JSON parsing helper
    const safeJSON = (str, fallback = {}) => {
        try {
            return typeof str === "string" ? JSON.parse(str) : str;
        } catch {
            return fallback;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={__("Blogs")} />

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
            >
                <div className="px-5 py-10 text-center">
                    <h3 className="text-xl mb-3 text-zinc-700 dark:text-white">
                        {__("Are you sure you want to remove this blog?")}
                    </h3>
                    <DangerButton onClick={deleteBlogs}>
                        {__("Yes")}
                    </DangerButton>
                    <SecondaryButton className="ml-3" onClick={() => setShowDeleteConfirmation(false)}>
                        {__("No")}
                    </SecondaryButton>
                </div>
            </Modal>

            <div className="lg:flex lg:space-x-10">
                <AccountNavi active={"preview-blogs"} />
                <div className="ml-0">
                    {/* Navigation */}
                    <Link href={route("gallery.list")} className={inactiveTabClass}>
                        {__("Upload Videos")}
                    </Link>
                    <Link href={route("audio.list")} className={inactiveTabClass}>
                        {__("Upload Audio")}
                    </Link>
                    <Link href={route("videos.ordered")} className={inactiveTabClass}>
                        {__("Videos Ordered")}
                    </Link>
                    <Link href={route("preview.list")} className={inactiveTabClass}>
                        {__("Upload Preview")}
                    </Link>
                    <Link href={route("gallery.list")} className={inactiveTabClass}>
                        {__("Upload Gallery")}
                    </Link>
                    <Link href={route("model.list")} className={inactiveTabClass}>
                        {__("Upload Model")}
                    </Link>
                    <Link href={route("blogs.list")} className={activeTabClass}>
                        {__("Add Blogs")}
                    </Link>

                    {/* Blog List */}
                    <div className="mt-5 p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg">
                        <header>
                            <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
                                <MdOutlineVideoLibrary className="mr-2" />
                                {__("My Blogs")}
                            </h2>

                            <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                                {__("Add & manage Blogs for the channel")}
                            </p>

                            <PrimaryButton onClick={() => Inertia.visit(route("blogs.upload"))}>
                                {__("Add Blogs")}
                            </PrimaryButton>
                        </header>

                        <hr className="my-5" />

                        {blogs.total === 0 && (
                            <div className="text-gray-600 dark:text-white">
                                {__("You didn't add any Blogs yet.")}
                            </div>
                        )}

                        {blogs.total !== 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-5 gap-y-10">
                                {blogs.data.map((v) => {
                                    const titleObj = safeJSON(v.title, { en: "" });
                                    const displayTitle = titleObj?.en || v.title || "";
                                    const imagePath = v.image ? v.image.split(",")[0] : "";
                                    const tagDisplay = Array.isArray(v.tag_id)
                                        ? v.tag_id.join(", ")
                                        : v.tag_id || __("No Tag");

                                    return (
                                        <div key={`blog-${v.id}`} className="w-full md:w-[340px] xl:w-[420px] mt-5">
                                            <img
                                                className="w-full rounded-lg aspect-video"
                                                src={imagePath}
                                                alt={displayTitle}
                                            />

                                            <div className="my-3 h-6 overflow-hidden text-gray-600 text-sm font-semibold dark:text-white">
                                                <a data-tooltip-content={displayTitle} data-tooltip-id={`tooltip-${v.id}`}>
                                                    {displayTitle}
                                                </a>
                                                <Tooltip id={`tooltip-${v.id}`} />
                                            </div>

                                            <div className="dark:text-white text-gray-600 text-xs flex flex-col gap-1 mt-2">
                                                <div className="flex items-center gap-2">
                                                    <BsTagFill className="text-indigo-600" />
                                                    <span className="font-medium">{__("Tag")}:</span> {v.tagNames || __("No Tag")}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BsTagFill className="text-green-600" />
                                                    <span className="font-medium">{__("Category")}:</span> {v.categoryNames || __("No Category")}
                                                </div>
                                            </div>

                                            <div className="border-t pt-3 mt-3 flex items-center">
                                                <Link href={route("blogs.edit", v.id)}>
                                                    <AiOutlineEdit className="w-6 h-6 mr-2 text-sky-600" />
                                                </Link>
                                                <button onClick={(e) => confirmDelete(e, v.id)}>
                                                    <RiDeleteBin5Line className="text-red-600 w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        {blogs.last_page > 1 && (
                            <>
                                <hr className="my-5" />
                                <div className="flex text-gray-600 my-3 text-sm">
                                    {__("Page: :pageNumber of :lastPage", {
                                        pageNumber: blogs.current_page,
                                        lastPage: blogs.last_page,
                                    })}
                                </div>
                                <SecondaryButton
                                    disabled={!blogs.prev_page_url}
                                    className="mr-3"
                                    onClick={() => blogs.prev_page_url && Inertia.visit(blogs.prev_page_url)}
                                >
                                    {__("Previous")}
                                </SecondaryButton>
                                <SecondaryButton
                                    disabled={!blogs.next_page_url}
                                    onClick={() => blogs.next_page_url && Inertia.visit(blogs.next_page_url)}
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
