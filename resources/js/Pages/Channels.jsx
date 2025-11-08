import React, { useRef, useState } from "react";
import { Head, usePage } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import SecondaryButton from "@/Components/SecondaryButton";
import { FcEmptyFilter } from "react-icons/fc/index.js";
import { Inertia } from "@inertiajs/inertia";
import ChannelsLoop from "@/Components/ChannelsLoop";
import Spinner from "@/Components/Spinner";
import Front from "@/Layouts/Front";
import TextInput from "@/Components/TextInput";
import { IoMdFunnel } from "react-icons/io/index.js";
import { Pagination } from 'antd';
import SkeletonCard from '@/Components/SkeletonCard';

export default function Channels({ channels, exploreImage }) {
    const { categories } = usePage().props;

    const filters = useRef();

    const [channelsData, setChannelsData] = useState(channels.data);
    // 2. Agla page number store karne ke liye
    const [nextPageUrl, setNextPageUrl] = useState(channels.next_page_url);
    // 3. Naya data load hote time spinner dikhane ke liye
    const [loadingMore, setLoadingMore] = useState(false);

    const loadMoreChannels = () => {
        // Agar agla page nahi hai ya already loading chal rahi hai, to kuch mat karo
        if (!nextPageUrl || loadingMore) {
            return;
        }

        setLoadingMore(true);

        // Inertia se agle page ka data fetch karo
        Inertia.get(nextPageUrl, {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['channels'], // Bahut Important: Sirf 'channels' prop hi fetch karo
            onSuccess: (page) => {
                const newChannels = page.props.channels.data;
                const newNextPageUrl = page.props.channels.next_page_url;

                // Naye channels ko purane channels ke saath jod do
                setChannelsData(currentChannels => [...currentChannels, ...newChannels]);

                // Agle page ka URL update karo
                setNextPageUrl(newNextPageUrl);

                setLoadingMore(false);
            },
            onError: () => {
                setLoadingMore(false);
            }
        });
    };

    const [sort, setSort] = useState("Popularity");
    const [search, setSearch] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const submit = (e) => {
        e.preventDefault();

        Inertia.visit(
            route("channels.browse", {
                search,
                sort,
                selectedCategories,
            }),
            {
                only: ["channels"],
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

    return (
        <Front
            containerClass="w-full"
            extraHeader={true}
            extraHeaderTitle={__("Discover Channels")}
            extraHeaderImage={exploreImage}
            extraHeaderText={""}
            extraImageHeight={"h-14"}
        >
            <Head title={__("Discover Channels")} />

            <div className="flex w-full -mt-16">

                <div className="flex-grow">
                    <button
                        onClick={(e) => showFilters(e)}
                        className="mb-7 px-3 -mt-1 py-1.5 bg-indigo-500 text-white rounded-lg lg:hidden flex items-center justify-end"
                    >
                        <IoMdFunnel className="mr-1" />
                        {__("Show Filters")}
                    </button>

                    {/* {channels.total === 0 && (
                        <div className="text-xl bg-white dark:bg-zinc-900 rounded-lg shadow text-gray-600 dark:text-white font-light p-3 flex items-center">
                            <FcEmptyFilter className="w-12 h-12 mr-2" />
                            {__("No channels to show")}
                        </div>
                    )} */}
                    {channelsData.length === 0 && !loadingMore && (
                        <div className="text-xl bg-white dark:bg-zinc-900 rounded-lg shadow text-gray-600 dark:text-white font-light p-3 flex items-center">
                            <FcEmptyFilter className="w-12 h-12 mr-2" />
                            {__("No channels to show")}
                        </div>
                    )}

                    <ChannelsLoop channels={channelsData} />

                    {/* JAB 'LOAD MORE' PAR CLICK HO, TO KUCH SKELETONS DIKHAO */}
                    {loadingMore && (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    )}

                    {/* ... Load More button ka logic ... */}
                    <div className="text-center mt-10 mb-5">
                        {nextPageUrl && !loadingMore && (
                            <SecondaryButton onClick={loadMoreChannels}>
                                {__("Load More Channels")}
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