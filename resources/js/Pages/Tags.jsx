import React, {useRef, useState} from "react";
import {Head, usePage} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import SecondaryButton from "@/Components/SecondaryButton";
import {FcEmptyFilter} from "react-icons/fc/index.js";
import {Inertia} from "@inertiajs/inertia";
import CategoryLoop from "@/Components/CategoryLoop";
import TagsLoop from "@/Components/TagsLoop";
import Spinner from "@/Components/Spinner";
import Front from "@/Layouts/Front";
import TextInput from "@/Components/TextInput";
import {IoMdFunnel} from "react-icons/io/index.js";
import {Pagination} from 'antd';

export default function Channels({channels, exploreImage, tags, userrequest}) {

    // console.log(channels,'Tags');

    const filters = useRef();

    const [search, setSearch] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState(userrequest['selectedTags']);


    const submit = (e) => {
        e.preventDefault();

        Inertia.visit(
            route("tag.browse", {
                search,
                selectedTags
            }),
            {
                // only: ["channels"],
                preserveState: true,
                onBefore: () => setLoading(true),
                onFinish: () => setLoading(false),
            }
        );

        hideFilters();
    };

    const onChangePaginate = (pageNumber) => {
        console.log('Page: ', pageNumber);
        // setCurrentPage(pageNumber);
        let fullPath = channels.path + '?page=' + pageNumber;
        Inertia.visit(fullPath)

    };

    const showFilters = (e) => {
        e.preventDefault();

        const shown =
            "fixed inset-0 z-[9999] pt-5 px-2 overflow-scroll h-screen bg-white dark:bg-black  block w-2/3 flex-shrink-0 mr-5";

        filters.current.className = shown;
    };

    const hideFilters = (e) => {
        e?.preventDefault();
        const hidden = "hidden lg:block w-56 lg:flex-shrink-0 lg:mr-5";
        console.log(`hiding filters ${hidden}`);
        filters.current.className = hidden;
    };

    const handleTags = (event) => {
        const {value, checked} = event.target;
        if (checked) {
            setSelectedTags((current) => [...current, value]);
        } else {
            setSelectedTags((current) =>
                current.filter((v) => v !== value)
            );
        }
    };

    return (
        <Front
            containerClass="w-full"
            extraHeader={true}
            extraHeaderTitle={__("Discover Tags")}
            extraHeaderImage={exploreImage}
            extraHeaderText={""}
            extraImageHeight={"h-14"}
        >
            <Head title={__("Discover Tags")}/>

            <div className="flex w-full -mt-16">
                <form onSubmit={submit}>
                    <div
                        ref={filters}
                        className="hidden lg:block w-56 lg:flex-shrink-0 lg:mr-5"
                    >
                        <h3 className="text-indigo-700 dark:text-white text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900 shadow rounded-t-lg">
                            {__("Search")}
                        </h3>
                        <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3">
                            <TextInput
                                className="w-full"
                                name="search"
                                value={search}
                                handleChange={(e) => setSearch(e.target.value)}
                                placeholder={__("Search Tags")}
                            />
                        </div>

                        <h3 className="mt-5 text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900  dark:text-white shadow rounded-t-lg">
                            {__("Tags")}
                        </h3>
                        <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3 overflow-y-auto h-48">
                            {tags.map((tag) => {
                                return (
                                    <label
                                        key={`tagFilter-${tag.id}`}
                                        className="flex items-center text-gray-600 dark:text-white cursor-pointer	"
                                    >
                                        <input
                                            type="checkbox"
                                            name="tags[]"
                                            className="mr-2"
                                            value={tag.id}
                                            onChange={handleTags}
                                            checked={selectedTags.includes(
                                                tag?.id?.toString()
                                            )}
                                        />
                                        {tag.name}
                                    </label>
                                );
                            })}
                        </div>


                        {isLoading ? (
                            <div className="my-3">
                                <Spinner/>
                            </div>
                        ) : (
                            <button
                                className="mt-5 bg-indigo-500 dark:bg-zinc-800 font-semibold text-white rounded-lg px-2 py-1.5 block w-full">
                                {__("Apply Filters")}
                            </button>
                        )}

                        <div className="lg:hidden text-center border-t dark:border-zinc-800 border-t-gray-300 py-5">
                            <SecondaryButton
                                className=""
                                onClick={(e) => hideFilters(e)}
                            >
                                {__("Close")}
                            </SecondaryButton>
                        </div>
                    </div>
                </form>

                <div className="flex-grow">
                    <button
                        onClick={(e) => showFilters(e)}
                        className="mb-7 px-3 -mt-1 py-1.5 bg-indigo-500 text-white rounded-lg lg:hidden flex items-center justify-end"
                    >
                        <IoMdFunnel className="mr-1"/>
                        {__("Show Filters")}
                    </button>

                    {channels.total === 0 && (
                        <div
                            className="text-xl bg-white dark:bg-zinc-900 rounded-lg shadow text-gray-600 dark:text-white font-light p-3 flex items-center">
                            <FcEmptyFilter className="w-12 h-12 mr-2"/>
                            {__("No Tags to show")}
                        </div>
                    )}

                    <TagsLoop channels={channels.data}/>

                    {channels.last_page > 1 && (
                        <>
                            <div className="flex text-gray-600 mt-10 mb-5 text-sm">
                                {__("Page: :pageNumber of :lastPage", {
                                    pageNumber: channels.current_page,
                                    lastPage: channels.last_page,
                                })}
                            </div>

                            <Pagination
                                total={channels.last_page * 10}
                                defaultCurrent={channels.current_page}
                                onChange={onChangePaginate}
                                // itemRender={itemRender}
                                showSizeChanger={false} // This hides the "Items per page" selector
                            />

                            {/*<SecondaryButton*/}
                            {/*    processing={*/}
                            {/*        channels.prev_page_url ? false : true*/}
                            {/*    }*/}
                            {/*    className="mr-3"*/}
                            {/*    onClick={(e) =>*/}
                            {/*        Inertia.visit(channels.prev_page_url)*/}
                            {/*    }*/}
                            {/*>*/}
                            {/*    {__("Previous")}*/}
                            {/*</SecondaryButton>*/}

                            {/*<SecondaryButton*/}
                            {/*    processing={*/}
                            {/*        channels.next_page_url ? false : true*/}
                            {/*    }*/}
                            {/*    onClick={(e) =>*/}
                            {/*        Inertia.visit(channels.next_page_url)*/}
                            {/*    }*/}
                            {/*>*/}
                            {/*    {__("Next")}*/}
                            {/*</SecondaryButton>*/}
                        </>
                    )}
                </div>
            </div>
        </Front>
    );
}
