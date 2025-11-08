import React, { useRef, useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import SecondaryButton from "@/Components/SecondaryButton";
import { FcEmptyFilter } from "react-icons/fc/index.js";
import { Inertia } from "@inertiajs/inertia";
import CategoryLoop from "@/Components/CategoryLoop";
import Spinner from "@/Components/Spinner";
import Front from "@/Layouts/Front";
import TextInput from "@/Components/TextInput";
import { IoMdFunnel } from "react-icons/io/index.js";
import { Pagination } from 'antd';
import SkeletonCard from '@/Components/SkeletonCategoryCard';

export default function Channels({ channels, exploreImage, categories, userrequest }) {

    console.log(channels, 'Categories');
    console.log(userrequest, 'userrequest');
    const isInitialMount = useRef(true);
    const isLoadMoreUpdate = useRef(false);
    const [channelsData, setChannelsData] = useState(channels.data);
    const [nextPageUrl, setNextPageUrl] = useState(channels.next_page_url);
    const [loadingMore, setLoadingMore] = useState(false); // YAHI VARIABLE MISSING THA

    const filters = useRef();

    const [search, setSearch] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(userrequest['selectedCategories']);

    useEffect(() => {
        // Agar yeh "load more" se aaya update hai, to kuch mat karo
        if (isLoadMoreUpdate.current) {
            isLoadMoreUpdate.current = false; // Flag ko reset kar do
            return;
        }

        // Agar yeh pehla load hai, to kuch mat karo
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Sirf jab filters ya browser navigation se update ho, tabhi data ko replace karo
        setChannelsData(channels.data);
        setNextPageUrl(channels.next_page_url);

    }, [channels]);

    const loadMoreChannels = () => {
        if (!nextPageUrl || loadingMore) return;

        setLoadingMore(true);
        // "Load More" shuru hone se pehle flag set karo
        isLoadMoreUpdate.current = true;

        Inertia.get(nextPageUrl, {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['channels'],
            onSuccess: (page) => {
                const newChannels = page.props.channels.data;
                const newNextPageUrl = page.props.channels.next_page_url;

                // Yahan data hamesha append hoga
                setChannelsData(current => [...current, ...newChannels]);
                setNextPageUrl(newNextPageUrl);
                setLoadingMore(false);
            },
            onError: () => {
                setLoadingMore(false);
                isLoadMoreUpdate.current = false; // Error par bhi flag reset karo
            }
        });
    };

    const submit = (e) => {
        e.preventDefault();

        Inertia.visit(
            route("categories.browse", {
                search,
                selectedCategories
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

    const handleCategories = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedCategories((current) => [...current, value]);
        } else {
            setSelectedCategories((current) =>
                current.filter((v) => v !== value)
            );
        }
    };

    return (
        <Front
            containerClass="w-full"
            extraHeader={true}
            extraHeaderTitle={__("Discover Categories")}
            extraHeaderImage={exploreImage}
            extraHeaderText={""}
            extraImageHeight={"h-14"}
        >
            <Head title={__("Discover Categories")} />

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
                                placeholder={__("Search Category")}
                            />
                        </div>

                        <h3 className="mt-5 text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900  dark:text-white shadow rounded-t-lg">
                            {__("Category")}
                        </h3>
                        <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3 overflow-y-auto h-48">
                            {categories.map((cat) => {
                                return (
                                    <label
                                        key={`catFilter-${cat.id}`}
                                        className="flex items-center text-gray-600 dark:text-white cursor-pointer	"
                                    >
                                        <input
                                            type="checkbox"
                                            name="categories[]"
                                            className="mr-2"
                                            value={cat.id}
                                            onChange={handleCategories}
                                            checked={selectedCategories.includes(cat.id.toString())}

                                        />
                                        {cat.category}

                                    </label>
                                );
                            })}
                        </div>


                        {isLoading ? (
                            <div className="my-3">
                                <Spinner />
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
                        <IoMdFunnel className="mr-1" />
                        {__("Show Filters")}
                    </button>

                    {channels.total === 0 && (
                        <div
                            className="text-xl bg-white dark:bg-zinc-900 rounded-lg shadow text-gray-600 dark:text-white font-light p-3 flex items-center">
                            <FcEmptyFilter className="w-12 h-12 mr-2" />
                            {__("No Category to show")}
                        </div>
                    )}

                    <CategoryLoop channels={channelsData} />

                    {loadingMore && (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    )}

                    <div className="text-center mt-10 mb-5">
                        {nextPageUrl && !loadingMore && (
                            <SecondaryButton onClick={loadMoreChannels}>
                                {__("Load More Categories")}
                            </SecondaryButton>
                        )}
                        {!nextPageUrl && channelsData.length > 0 && (
                            <p className="text-gray-500 mt-4">{__("You've reached the end!")}</p>
                        )}
                    </div>
                </div>
            </div>
        </Front>
    );
}
