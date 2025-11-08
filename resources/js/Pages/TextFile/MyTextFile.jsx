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
import { MdOutlineVideoLibrary } from "react-icons/md/index.js";
import { useState, useRef, useEffect } from "react"; // Import useEffect for side-effects


export default function Upload({ textFile }) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const textFileRef = useRef(null);

    const confirmDelete = (e, id) => {
        e.preventDefault();
        setShowDeleteConfirmation(true);
        setDeleteId(id);
    };

    const deleteTextFile = () => {
        Inertia.visit(route("textFile.deleteTextFile"), {
            method: "POST",
            data: { textFile: deleteId },
            preserveState: false,
        });
    };

    // Function to play the textFile after user clicks
    const previewTextFile = () => {
        const textFileElement = textFileRef.current;
        if (textFileElement) {
            // Example: You could trigger any additional logic here if necessary
            console.log("Document opened:", textFileElement);
        }
    };

    // active tab class
    const activeTabClass =
        "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
    const inactiveTabClass =
        "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";

    return (
        <AuthenticatedLayout>
            <Head title={__("Text File")} />

            <Modal show={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
                <div className="px-5 py-10 text-center">
                    <h3 className="text-xl mb-3 text-zinc-700 dark:text-white">
                        {__("Are you sure you want to remove this TextFile?")}
                    </h3>
                    <DangerButton onClick={deleteTextFile}>
                        {__("Yes")}
                    </DangerButton>
                    <SecondaryButton className="ml-3" onClick={() => setShowDeleteConfirmation(false)}>
                        {__("No")}
                    </SecondaryButton>
                </div>
            </Modal>

            <div className="lg:flex lg:space-x-10">
                <AccountNavi active={"upload-textFile"} />
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
                        href={route("textFile.list")}
                        className={activeTabClass}
                    >
                        {__("Upload TextFile")}
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

                    <div className="mt-5 p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg">
                        <header>
                            <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
                                <MdOutlineVideoLibrary className="mr-2" />
                                {__("My TextFile")}
                            </h2>

                            <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                                {__("Upload & manage textFile for the channel")}
                            </p>

                           
                            <PrimaryButton
                            onClick={(e) =>
                                Inertia.visit(route("textFile.upload"))
                            }
                        >
                            {__("Upload TextFile")}
                        </PrimaryButton>
                        </header>

                        <hr className="my-5" />

                        {textFile.total === 0 && (
                            <div className="text-gray-600 dark:text-white">
                                {__("You didn't upload any text file yet.")}
                            </div>
                        )}

                        {textFile.total !== 0 && (
                       <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-5 gap-y-10">
                       {textFile.data.map((v) => (
                         <div 
                           key={`textFile-${v.id}`} 
                           className="w-full md:w-[340px] xl:w-[420px] mt-5 relative"
                           style={{
                             backgroundImage: `url(/thumbnails/${v.thumbnail})`,
                             backgroundSize: 'cover',
                             backgroundPosition: 'center'
                           }}
                         >
                             <div className="relative w-full">
                           <embed
                                    ref={textFileRef}
                                    src={v.textFile_file} // Link to the document (e.g., a PDF)
                                    type="application/pdf"
                                    className="w-full h-full rounded-lg"
                                    onClick={previewTextFile} // Trigger preview logic (or any custom action)
                                />
                                

                                {/* Thumbnail overlay for preview action */}
                                <img
                                    src={v.thumbnail} // Thumbnail image of the document
                                    alt="textFile Thumbnail"
                                    className="textFile-thumbnail w-full rounded-lg cursor-pointer absolute top-0 left-0 w-full h-full object-cover opacity-30"
                                    onClick={previewTextFile} // You can trigger the preview action here if needed
                                />
                            </div>


                                

                                        <div className="my-3 h-6 overflow-hidden text-gray-600 text-sm font-semibold dark:text-white">
                                            <a
                                                data-tooltip-content={v.title_en}  
                                                data-tooltip-id={`tooltip-${v.id}`}
                                            >
                                                {v.title_en} 
                                            </a>

                                            <Tooltip anchorSelect="a" />
                                        </div>

                                        <div className="dark:text-white text-gray-600 flex items-center space-x-2 text-xs">
                                            <BsTagFill className="mr-1" />{" "}
                                            {v.categoryNames}
                                        </div>

                                        <div className="mt-3 flex items-center space-x-2 text-sm justify-between">
                                            <span className="text-gray-600 dark:text-white">
                                                {__("Price")}{" "}
                                            </span>
                                            <span className="px-2 py-1 text-sm rounded-lg bg-sky-500 text-white">
                                                {v.price > 0
                                                    ? __(
                                                          ":tokensPrice tokens",
                                                          {
                                                              tokensPrice:
                                                                  v.price,
                                                          }
                                                      )
                                                    : __("Free")}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center space-x-2 text-sm justify-between">
                                            <span className="text-gray-600 dark:text-white">
                                                {__("Free for subs")}{" "}
                                            </span>
                                            <span className="px-2 py-1 rounded-lg bg-teal-500 text-white">
                                                {v.free_for_subs}
                                            </span>
                                        </div>

                                         <div className="flex mt-2 items-center space-x-2 text-sm justify-between">
                                            <span className="text-gray-600 dark:text-white">
                                                {__("Views")}{" "}
                                            </span>
                                            <span className="px-2 py-1 rounded-lg bg-gray-500 text-white">
                                                {v.views}
                                            </span>
                                        </div>

                                        <div className="flex mt-2 items-center space-x-2 text-sm justify-between">
                                            <span className="text-gray-600 dark:text-white">
                                                {__("Earnings")}{" "}
                                            </span>
                                            <span className="px-2 py-1 rounded-lg bg-pink-500 text-white">
                                                {v.sales_sum_price
                                                    ? __(
                                                          ":salesTokens tokens",
                                                          {
                                                              salesTokens:
                                                                  v.sales_sum_price,
                                                          }
                                                      )
                                                    : "--"}
                                            </span>
                                        </div> 

                                        <div className="border-t pt-3 mt-3  flex items-center">
                                            <Link
                                                href={route("textFile.edit", {
                                                    textFile: v.id,
                                                })}
                                            >
                                                <AiOutlineEdit className="w-6 h-6 mr-2 text-sky-600" />
                                            </Link>
                                            <button
                                                onClick={(e) =>
                                                    confirmDelete(e, v.id)
                                                }
                                            >
                                                <RiDeleteBin5Line className="text-red-600 w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {textFile.last_page > 1 && (
                            <>
                                <hr className="my-5" />

                                <div className="flex text-gray-600 my-3 text-sm">
                                    {__("Page: :pageNumber of :lastPage", {
                                        pageNumber: textFile.current_page,
                                        lastPage: textFile.last_page,
                                    })}
                                </div>

                                <SecondaryButton
                                    processing={
                                        textFile.prev_page_url ? false : true
                                    }
                                    className="mr-3"
                                    onClick={(e) =>
                                        Inertia.visit(textFile.prev_page_url)
                                    }
                                >
                                    {__("Previous")}
                                </SecondaryButton>

                                <SecondaryButton
                                    processing={
                                        textFile.next_page_url ? false : true
                                    }
                                    onClick={(e) =>
                                        Inertia.visit(textFile.next_page_url)
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
