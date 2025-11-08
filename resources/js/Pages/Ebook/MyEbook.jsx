import __ from "@/Functions/Translate";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { Head, Link } from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { AiOutlineEdit } from "react-icons/ai/index.js";
import { RiDeleteBin5Line } from "react-icons/ri/index.js";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Modal from "@/Components/Modal";
import { BsTagFill } from "react-icons/bs/index.js";
import AccountNavi from "../Channel/Partials/AccountNavi";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import { useState } from "react";

export default function MyEbook({ ebook }) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(0);

    const confirmDelete = (e, id) => {
        e.preventDefault();
        setShowDeleteConfirmation(true);
        setDeleteId(id);
    };

    const deleteEbook = () => {
        Inertia.visit(route("ebook.delete"), {
            method: "POST",
            data: { ebook: deleteId },
            preserveState: false,
        });
    };

    // active tab class
    const activeTabClass = "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
    const inactiveTabClass = "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";

    return (
        <AuthenticatedLayout>
            <Head title={__("My Ebooks")} />

            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <div className="px-5 py-10 text-center">
                    <h3 className="text-xl mb-3 text-zinc-700 dark:text-white">
                        {__("Are you sure you want to remove this ebook?")}
                    </h3>
                    <DangerButton onClick={deleteEbook}>
                        {__("Yes")}
                    </DangerButton>
                    <SecondaryButton className="ml-3" onClick={() => setShowDeleteConfirmation(false)}>
                        {__("No")}
                    </SecondaryButton>
                </div>
            </Modal>

            <div className="lg:flex lg:space-x-10">
                <AccountNavi active={"upload-ebook"} />
                <div className="ml-0 w-full">
                    <div className="mb-5">
                        <Link href={route("videos.list")} className={inactiveTabClass}>{__("Upload Videos")}</Link>
                        <Link href={route("audio.list")} className={inactiveTabClass}>{__("Upload Audio")}</Link>
                        <Link href={route("ebook.list")} className={activeTabClass}>{__("Upload Ebook")}</Link>
                        <Link href={route("textFile.list")} className={inactiveTabClass}>{__("Upload TextFile")}</Link>
                        <Link href={route("videos.ordered")} className={inactiveTabClass}>{__("Videos Ordered")}</Link>
                        <Link href={route("audio.ordered")} className={inactiveTabClass}>{__("Audio Ordered")}</Link>
                        <Link href={route("preview.list")} className={inactiveTabClass}>{__("Upload Preview")}</Link>
                        <Link href={route("gallery.list")} className={inactiveTabClass}>{__("Upload Gallery")}</Link>
                        <Link href={route("model.list")} className={inactiveTabClass}>{__("Upload Model")}</Link>
                    </div>

                    <div className="mt-5 p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg">
                        <header>
                            <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
                                <MdOutlinePictureAsPdf className="mr-2" />
                                {__("My Ebooks")}
                            </h2>
                            <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                                {__("Upload & manage ebooks for the channel")}
                            </p>
                            <PrimaryButton onClick={() => Inertia.visit(route("ebook.upload"))}>
                                {__("Upload Ebook")}
                            </PrimaryButton>
                        </header>

                        <hr className="my-5" />

                        {ebook.total === 0 && (
                            <div className="text-gray-600 dark:text-white">
                                {__("You didn't upload any ebook yet.")}
                            </div>
                        )}

                        {ebook.total !== 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-5 gap-y-10">
                                {ebook.data.map((v) => (
                                    <div
                                        key={`ebook-${v.id}`}
                                        className="w-full md:w-[340px] xl:w-[420px] mt-5 relative border dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden"
                                    >
                                        <div className="relative w-full aspect-video bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                                            {v.thumbnail ? (
                                                <img
                                                    src={`/${v.thumbnail}`}
                                                    alt={v.title_en}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <MdOutlinePictureAsPdf className="text-gray-400 dark:text-gray-500 text-6xl" />
                                            )}
                                            <Link
                                                href={v.ebook_file || '#'}
                                                target="_blank"
                                                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-semibold opacity-0 hover:opacity-100 transition-opacity"
                                            >
                                                {__("View Ebook")}
                                            </Link>
                                        </div>

                                        <div className="p-3">
                                            <div className="h-6 overflow-hidden text-gray-600 text-sm font-semibold dark:text-white mb-2">
                                                <a data-tooltip-content={v.title_en} data-tooltip-id={`tooltip-${v.id}`}>
                                                    {v.title_en}
                                                </a>
                                                <Tooltip anchorSelect="a" />
                                            </div>

                                            <div className="dark:text-white text-gray-600 flex items-center space-x-2 text-xs mb-2">
                                                <BsTagFill className="mr-1" />
                                                {v.categoryNames}
                                            </div>

                                            {/* Price */}
                                            <div className="flex mt-2 items-center space-x-2 text-sm justify-between">
                                                <span className="text-gray-600 dark:text-white">{__("Price")}</span>
                                                <span className="px-2 py-1 text-sm rounded-lg bg-sky-500 text-white">
                                                    {v.price > 0 ? __(":tokensPrice tokens", { tokensPrice: v.price }) : __("Free")}
                                                </span>
                                            </div>

                                            {/* Free for subs */}
                                            <div className="flex mt-2 items-center space-x-2 text-sm justify-between">
                                                <span className="text-gray-600 dark:text-white">{__("Free for subs")}</span>
                                                <span className="px-2 py-1 rounded-lg bg-teal-500 text-white">
                                                    {v.free_for_subs}
                                                </span>
                                            </div>

                                            {/* Views */}
                                            <div className="flex mt-2 items-center space-x-2 text-sm justify-between">
                                                <span className="text-gray-600 dark:text-white">{__("Views")}</span>
                                                <span className="px-2 py-1 rounded-lg bg-gray-500 text-white">
                                                    {v.views}
                                                </span>
                                            </div>

                                            {/* Earnings */}
                                            <div className="flex mt-2 items-center space-x-2 text-sm justify-between">
                                                <span className="text-gray-600 dark:text-white">{__("Earnings")}</span>
                                                <span className="px-2 py-1 rounded-lg bg-pink-500 text-white">
                                                    {v.sales_sum_price ? __(":salesTokens tokens", { salesTokens: v.sales_sum_price }) : "--"}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="border-t pt-3 mt-3 flex items-center">
                                                <Link href={route("ebook.edit", { ebook: v.id })} className="mr-2"> {/* ✅ Route updated */}
                                                    <AiOutlineEdit className="w-6 h-6 text-sky-600" />
                                                </Link>
                                                <button onClick={(e) => confirmDelete(e, v.id)}>
                                                    <RiDeleteBin5Line className="text-red-600 w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {ebook.last_page > 1 && (
                            <>
                                <hr className="my-5" />
                                <div className="flex text-gray-600 my-3 text-sm">
                                    {__("Page: :pageNumber of :lastPage", { pageNumber: ebook.current_page, lastPage: ebook.last_page })}
                                </div>
                                <SecondaryButton
                                    processing={ebook.prev_page_url ? false : true}
                                    className="mr-3"
                                    onClick={() => Inertia.visit(ebook.prev_page_url)}
                                >
                                    {__("Previous")}
                                </SecondaryButton>
                                <SecondaryButton
                                    processing={ebook.next_page_url ? false : true}
                                    onClick={() => Inertia.visit(ebook.next_page_url)}
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