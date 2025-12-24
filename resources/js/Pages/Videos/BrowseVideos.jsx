import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Front from "@/Layouts/Front";
import { Head, usePage } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import SecondaryButton from "@/Components/SecondaryButton";
import { FcEmptyFilter } from "react-icons/fc";
import { Inertia } from "@inertiajs/inertia";
import Spinner from "@/Components/Spinner";
import VideosLoop from "./Partials/VideosLoopNew";
import Modal from "@/Components/Modal";
import SingleVideo from "./SingleVideoDetails";
import TextInput from "@/Components/TextInput";
import AdBar from "@/Components/AdBar";
import { IoMdFunnel } from "react-icons/io";
import { Pagination } from "antd";

export default function BrowseVideos({
                                         userLoginID,
                                         userrequest = {},
                                         randomvideos = { data: [], total: 0 },
                                         recommendedVideo = { data: [], total: 0 },
                                         featuredChannels = [],
                                         videos: initialVideos,
                                         category,
                                         categories,
                                         exploreImage,
                                         tags,
                                         models,
                                         blocks,
                                         headTitle,
                                         faqs,
                                     }) {
    // State for all data
    const [videos, setVideos] = useState(initialVideos || { data: [], total: 0, current_page: 1 });
    const [sort, setSort] = useState(userrequest.sort || "Recently");
    const [search, setSearch] = useState(userrequest.search || "");
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(userrequest.page || 1); // Yeh page number ke liye hai
    const [selectedCategories, setSelectedCategories] = useState(userrequest.selectedCategories || []);
    const [selectedTags, setSelectedTags] = useState(userrequest.selectedTags || []);
    const [selectedModels, setSelectedModels] = useState(userrequest.selectedModels || []);

    const isFirstPage = videos.current_page == 1;
    // Other states
    const [playVideo, setPlayVideo] = useState(false);
    const [modal, setModal] = useState(false);
    const { auth, watchVideos = [] } = usePage().props;
    const [showWatchedPopup, setShowWatchedPopup] = useState(false);
    const filters = useRef();
    const searchDebounceTimer = useRef(null);

    // Memoize expensive filter calculations
    const hasFilter = useMemo(() =>
            search !== "" || selectedCategories.length > 0 || selectedTags.length > 0 || selectedModels.length > 0,
        [search, selectedCategories.length, selectedTags.length, selectedModels.length]
    );

    useEffect(() => {
        const hasShownPopup = localStorage.getItem("watchedPopupShown");
        if (watchVideos.length > 0 && !hasShownPopup) {
            setShowWatchedPopup(true);
            localStorage.setItem("watchedPopupShown", "true");
        }
    }, [watchVideos]);

    // Memoize API call function
    const callFilterAPI = useCallback((pageNumber, filterOptions) => {
        setLoading(true);
        Inertia.get(route('videos.browse'), { ...filterOptions, page: pageNumber }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onSuccess: (page) => {
                setVideos(page.props.videos);
            },
            onFinish: () => setLoading(false),
        });
    }, []);

    // Form submit handler
    const submit = useCallback((e) => {
        e.preventDefault();
        setPage(1);
        const filterOptions = { sort, search, selectedCategories, selectedTags, selectedModels };
        callFilterAPI(1, filterOptions);
        hideFilters();
    }, [sort, search, selectedCategories, selectedTags, selectedModels, callFilterAPI]);

    // Pagination handler
    const onChangePaginate = useCallback((pageNumber) => {
        setPage(pageNumber);
        const filterOptions = { sort, search, selectedCategories, selectedTags, selectedModels };
        callFilterAPI(pageNumber, filterOptions);
    }, [sort, search, selectedCategories, selectedTags, selectedModels, callFilterAPI]);

    // Sort change handler
    const handleSortChange = useCallback((e) => {
        const newSort = e.target.value;
        setSort(newSort);
        setPage(1);
        const filterOptions = { sort: newSort, search, selectedCategories, selectedTags, selectedModels };
        callFilterAPI(1, filterOptions);
    }, [search, selectedCategories, selectedTags, selectedModels, callFilterAPI]);

    // Helper functions - memoized
    const playModal = useCallback((e, video) => {
        e.preventDefault();
        setPlayVideo(video);
        setModal(true);
    }, []);

    const handleCategories = useCallback((event) => {
        const { value, checked } = event.target;
        setSelectedCategories(current =>
            checked ? [...current, value] : current.filter(v => v !== value)
        );
    }, []);

    const handleTags = useCallback((event) => {
        const { value, checked } = event.target;
        setSelectedTags(current =>
            checked ? [...current, value] : current.filter(v => v !== value)
        );
    }, []);

    const handleModels = useCallback((event) => {
        const { value, checked } = event.target;
        setSelectedModels(current =>
            checked ? [...current, value] : current.filter(v => v !== value)
        );
    }, []);

    const showFilters = useCallback((e) => {
        e.preventDefault();
        filters.current.className = "fixed inset-0 z-[9999] pt-5 px-2 overflow-scroll h-screen bg-white dark:bg-black block w-2/3 flex-shrink-0 mr-5";
    }, []);

    const hideFilters = useCallback((e) => {
        e?.preventDefault();
        filters.current.className = "hidden lg:block w-56 lg:flex-shrink-0 lg:mr-5";
    }, []);

    const resetFilters = useCallback((e) => {
        e.preventDefault();
        Inertia.visit(route("videos.browse"));
    }, []);

    const handleClose = useCallback(async () => {
        try {
            await axios.post(route("cache.clear"));
        } catch (error) {
            // Silently handle error in production
        }
        setShowWatchedPopup(false);
    }, []);

    return (
        <Front
            containerClass="w-full"
            extraHeader={true}
            extraHeaderTitle={__("Browse Videos")}
            extraHeaderImage={exploreImage}
            extraHeaderText={""}
            extraImageHeight={"h-14"}
        >
            <Head
                title={`${category !== null
                    ? __(":categoryName Videos", {
                        categoryName: category.category,
                    })
                    : headTitle
                }`}
            />
            <Modal show={modal} onClose={(e) => setModal(false)}>
                {playVideo && <SingleVideo video={playVideo} inModal={true} />}
            </Modal>
            <Modal show={showWatchedPopup} onClose={() => setShowWatchedPopup(false)}>
                <div className="border dark:border-zinc-800 shadow-sm p-4 rounded-lg pb-2 bg-white dark:bg-zinc-900">
                    <h2 className="text-xl font-bold text-indigo-700 dark:text-white mb-4">
                        {__("Watched Your Videos")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-5">
                        {watchVideos.map((v) => (
                            <div
                                className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900 w-full"
                                key={`vid-${v.id}`}
                            >
                                <div className="relative">
                                    <a
                                        href={route("video.single.page", { id: v.slug })}
                                        data-price={v.price}
                                    >
                                        <img src={v.thumbnail} alt={v.title} className="mb-3" />
                                    </a>
                                    <div className="absolute top-5 left-0 bg-indigo-800 text-white font-bold text-sm uppercase rounded-tr rounded-br px-2 py-1">
                                        {v.price < 1 ? (
                                            __("Free")
                                        ) : (
                                            <div className="flex items-center">{v.price}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="inline-flex items-center px-3">
                                    <div className="w-10 flex-shrink-0 mr-2">
                                        <a
                                            href={
                                                v.streamer
                                                    ? route("channel", { user: v.streamer.username })
                                                    : "#"
                                            }
                                        >
                                            {v.streamer?.profile_picture ? (
                                                <img
                                                    src={v.streamer.profile_picture}
                                                    alt="Streamer"
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-300" />
                                            )}
                                        </a>
                                    </div>
                                    <div className="h-5 overflow-hidden">
                                        <a
                                            className="font-semibold dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400"
                                            href={route("video.single.page", { id: v.slug })}
                                        >
                                            {v.title}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <SecondaryButton onClick={handleClose}>
                            {__("Close")}
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
            <div className="flex w-full -mt-16">
                <form onSubmit={submit} role="search" aria-label="Video filters">
                    <div
                        ref={filters}
                        className="hidden lg:block w-56 lg:flex-shrink-0 lg:mr-5"
                    >
                        {/* Search Input */}
                        <h3 className="text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900 dark:text-white shadow rounded-t-lg">
                            {__("Search")}
                        </h3>
                        <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3">
                            <label htmlFor="video-search" className="sr-only">{__("Search Video")}</label>
                            <TextInput
                                id="video-search"
                                className="w-full"
                                name="search"
                                value={search}
                                handleChange={(e) => setSearch(e.target.value)}
                                placeholder={__("Search Video")}
                                aria-label={__("Search Video")}
                            />
                        </div>

                        {/* Sort By Radios */}
                        <h3 className="mt-5 text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900 dark:text-white shadow rounded-t-lg" id="sort-by-heading">
                            {__("Sort By")}
                        </h3>
                        <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3" role="radiogroup" aria-labelledby="sort-by-heading">
                            {['Most', 'Recently', 'Older', 'Highest', 'Lowest', 'Only Free'].map(option => (
                                <label key={option} className="flex items-center text-gray-600 dark:text-white cursor-pointer">
                                    <input
                                        type={"radio"}
                                        name="sort"
                                        value={option}
                                        checked={sort === option}
                                        className="mr-2"
                                        onChange={handleSortChange} // onChange event handler
                                    />
                                    {__(option === 'Most' ? 'Most Viewed' :
                                        option === 'Recently' ? 'Newest Uploaded' :
                                            option === 'Older' ? 'Older Videos' :
                                                option === 'Highest' ? 'Highest Price' :
                                                    option === 'Lowest' ? 'Lowest Price' : 'Only Free')}
                                </label>
                            ))}
                        </div>
                        <h3 className="mt-5 text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900  dark:text-white shadow rounded-t-lg" id="category-heading">
                            {__("Category")}
                        </h3>
                        <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3 overflow-y-auto h-48" role="group" aria-labelledby="category-heading">
                            {categories.map((cat) => (
                                <label key={`catFilter-${cat.id}`} className="flex items-center text-gray-600 dark:text-white cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="categories[]"
                                        className="mr-2"
                                        value={cat.id}
                                        onChange={handleCategories}
                                        checked={selectedCategories.includes(String(cat.id))}
                                    />
                                    {cat.category}
                                </label>
                            ))}
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
                                            value={tag.name}
                                            onChange={handleTags}
                                            checked={selectedTags.includes(tag?.name?.toString())}
                                        />
                                        {tag.name}
                                    </label>
                                );
                            })}
                        </div>
                        <h3 className="mt-5 text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900  dark:text-white shadow rounded-t-lg">
                            {__("Models")}
                        </h3>
                        <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3 overflow-y-auto h-48">
                            {models.map((model) => {
                                return (
                                    <label
                                        key={`modelFilter-${model.id}`}
                                        className="flex items-center text-gray-600 dark:text-white cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            name="models[]"
                                            className="mr-2"
                                            value={model.id}
                                            onChange={handleModels}
                                            checked={selectedModels.includes(model.id.toString())}
                                        />
                                        {model.name}
                                    </label>
                                );
                            })}
                        </div>
                        {isLoading ? (
                            <div className="my-3"><Spinner /></div>
                        ) : (
                            <button type="submit" className="mt-5 bg-indigo-500 dark:bg-zinc-800 font-semibold text-white rounded-lg px-2 py-1.5 block w-full" aria-label={__("Apply Filters")}>
                                {__("Apply Filters")}
                            </button>
                        )}
                        <SecondaryButton
                            className="mt-2"
                            onClick={resetFilters} // Reset function ko call karein
                        >
                            {__("Reset")}
                        </SecondaryButton>
                        <div className="lg:hidden text-center border-t border-t-gray-300 dark:border-gray-900 py-5">
                            <SecondaryButton className="" onClick={(e) => hideFilters(e)}>
                                {__("Close")}
                            </SecondaryButton>
                        </div>
                    </div>
                </form>
                <div className="flex-grow" role="region" aria-label="Video results">
                    <button
                        onClick={(e) => showFilters(e)}
                        className="mb-7 px-3 -mt-1 py-1.5 bg-indigo-500 text-white rounded-lg lg:hidden flex items-center justify-end"
                        aria-label={__("Show Filters")}
                        aria-expanded="false"
                    >
                        <IoMdFunnel className="mr-1" />
                        {__("Show Filters")}
                    </button>
                    {videos.total === 0 && (
                        <div className="text-xl bg-white rounded-lg shadow text-gray-600 dark:bg-zinc-900 dark:text-white font-light p-3 flex items-center">
                            <FcEmptyFilter className="w-12 h-12 mr-2" />
                            {__("No videos to show")}
                        </div>
                    )}
                    {isFirstPage && !hasFilter && randomvideos?.data?.length > 0 && (
                        <div>
                            <h2 className="text-indigo-700 text-2xl font-bold dark:text-white">
                                {__("Random Videos")}
                            </h2>

                            {/* Only first 4 rows */}
                            <VideosLoop
                                videos={randomvideos.data.slice(0, 12)} // 👈 Only first 12 videos
                                blocks={blocks}
                                userLoginID={userLoginID}
                            />


                            <h2 className="text-indigo-700 text-2xl font-bold dark:text-white mt-5">
                                {__("Filtered Videos")}
                            </h2>
                        </div>
                    )}
                    <VideosLoop
                        videos={videos.data}
                        blocks={blocks}
                        userLoginID={userLoginID}
                    />
                    {recommendedVideo?.data?.length > 0 && (
                        <>
                            <h2 className="text-indigo-700 text-2xl font-bold dark:text-white">
                                {__("Recommended Videos")}
                            </h2>
                            <VideosLoop videos={recommendedVideo.data} blocks={blocks} />
                        </>
                    )}
                    {featuredChannels?.length > 0 && (
                        <>
                            <h2 className="text-indigo-700 text-2xl font-bold dark:text-white">
                                {__("Featured Channels Videos")}
                            </h2>
                            {featuredChannels.map((user) => (
                                <div key={user.id} className="my-5">
                                    {user.videos && user.videos.length > 0 ? (
                                        <VideosLoop
                                            videos={user.videos}
                                            blocks={blocks}
                                            userLoginID={userLoginID}
                                        />
                                    ) : (
                                        <div className="text-gray-600 dark:text-white mt-3">
                                            {__("No featured videos found")}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                    {videos.last_page > 1 && (
                        <>
                            <div className="flex text-gray-600 mt-10 mb-5 text-sm">
                                {__("Page: :pageNumber of :lastPage", {
                                    pageNumber: videos.current_page,
                                    lastPage: videos.last_page,
                                })}
                            </div>
                            <Pagination
                                total={videos.last_page * 10}
                                current={page}
                                onChange={onChangePaginate}
                                showSizeChanger={false}
                            />
                        </>
                    )}
                    <br></br>
                    <div className="mt-3">
                        <AdBar />
                    </div>
                    {faqs && Array.isArray(faqs) && faqs.length > 0 && (
                        <div className="mt-10">
                            <h2 className="text-indigo-700 text-2xl font-bold dark:text-white mb-4">
                                {__("Frequently Asked Questions")}
                            </h2>
                            <div className="space-y-4">
                                {faqs.slice(0, 5).map((faq) => (
                                    <div
                                        key={faq.id}
                                        className="bg-white dark:bg-zinc-800 shadow rounded-lg"
                                    >
                                        <details className="group p-4">
                                            <summary className="font-semibold cursor-pointer text-lg text-indigo-700 dark:text-indigo-300">
                                                {faq.question}
                                            </summary>
                                            <p className="mt-2 text-gray-700 dark:text-gray-200 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </details>
                                    </div>
                                ))}
                            </div>
                            {faqs.length > 5 && (
                                <div className="text-center mt-6">
                                    <a
                                        href={route("web.faq.index")}
                                        className="px-5 py-3 bg-indigo-800 border border-transparent rounded font-black text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        {__("View More FAQs")}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Front>
    );
}
