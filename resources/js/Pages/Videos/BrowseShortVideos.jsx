import React, {useState, useRef, useEffect} from "react";
import Front from "@/Layouts/Front";
import {Head,usePage} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import SecondaryButton from "@/Components/SecondaryButton";
import {FcEmptyFilter} from "react-icons/fc";
import {Inertia} from "@inertiajs/inertia";
import Spinner from "@/Components/Spinner";
import ShortVideosLoop from "./Partials/ShortVideosLoop";
import Modal from "@/Components/Modal";
import SingleVideo from "./SingleVideo";
import TextInput from "@/Components/TextInput";
import debounce from "lodash.debounce";
import {IoMdFunnel} from "react-icons/io";
import {Pagination} from 'antd';
import AdBar from "@/Components/AdBar";

export default function BrowseVideos({
                                         userrequest,
                                         videos,
                                         category,
                                         categories,
                                         exploreImage,
                                         tags,
                                         models,
                                         headTitle,
                                         randomvideos
                                         
                                     }) {
    const [sort, setSort] = useState(userrequest.sort || "Recently");
    const [search, setSearch] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [playVideo, setPlayVideo] = useState(false);
    const [modal, setModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [page, setPage] = useState(userrequest.page || 1);
      const { auth, watchVideos = [] } = usePage().props; // assuming watchVideos is passed via Inertia
         const userIsAuthenticated = !!auth?.user;
         const [showWatchedPopup, setShowWatchedPopup] = useState(false); 


     useEffect(() => {
             const hasShownPopup = localStorage.getItem("watchedPopupShown");
     
             if (watchVideos.length > 0 && !hasShownPopup) {
                 setShowWatchedPopup(true);
                 localStorage.setItem("watchedPopupShown", "true");
             }
         }, [watchVideos]);
     
     
         useEffect(() => {
             if (!userIsAuthenticated) {
                 localStorage.removeItem("watchedPopupShown");
             }
         }, [userIsAuthenticated]); 

    const updateTerm = debounce((e) => {

        if (e.target.value.length > 2) {
            setLoading(true);
            Inertia.reload({
                data: {
                    keyword: e.target.value,
                    sortBy: sort,
                },
                only: ["videos"],
                onFinish: () => setLoading(false),
            });
        } else {
            Inertia.reload({
                data: {
                    sortBy: sort,
                    keyword: "",
                },
                only: ["videos"],
                onFinish: () => setLoading(false),
            });
        }
    }, 500);

    const doRequest = () => {

        if (currentPage != page && sort) {
            setCurrentPage(page);

            Inertia.visit(
                route("short.videos.browse", {
                    search,
                    sort,
                    selectedCategories,
                    selectedTags,
                    selectedModels,
                    page
                }),
                {
                    only: ["videos"],
                    preserveState: true,
                    onBefore: () => setLoading(true),
                    onFinish: () => setLoading(false),
                }
            )
        }
    }
    // useEffect(() => {
    //     doRequest
    // }, [page])


    const onChangePaginate = (pageNumber) => {

        console.log('Page: ', pageNumber);
        setPage(pageNumber);
        doRequest();
        let fullPath = videos.path + '?page=' + pageNumber;
        Inertia.visit(fullPath)

    };

    useEffect(() => {
        doRequest();
    }, [page]);


    const sortItems = (e, sortBy) => {
        setSort(sortBy);
        setLoading(true);

        Inertia.reload({
            data: {
                sortBy,
            },
            only: ["videos"],
            onFinish: () => setLoading(false),
        });
    };

    const playModal = (e, video) => {
        e.preventDefault();
        setPlayVideo(video);
        setModal(true);
    };

    const filters = useRef();

    const [selectedCategories, setSelectedCategories] = useState(userrequest['selectedCategories']);
    const [selectedTags, setSelectedTags] = useState(userrequest['selectedTags']);
    const [selectedModels, setSelectedModels] = useState(userrequest['selectedModels']);

    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    };

    const submit = (e) => {
        e.preventDefault();
        setCurrentPage(1)
        setPage(1);
        Inertia.visit(
            route("short.videos.browse", {
                search,
                sort,
                selectedCategories,
                selectedTags,
                selectedModels,
            }),
            {
                only: ["videos", "randomvideos"],
                preserveState: true,
                onBefore: () => setLoading(true),
                onFinish: () => setLoading(false),
            }
        );

        hideFilters();
    };
    /* userrequest['selectedCategories'].forEach(value=>{
         setSelectedCategories((current) => [...current, value]);
     })*/

    const handleCategories = (event) => {
        const {value, checked} = event.target;
        if (checked) {
            setSelectedCategories((current) => [...current, value]);
        } else {
            setSelectedCategories((current) =>
                current.filter((v) => v !== value)
            );
        }
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

    const handleModels = (event) => {

        const {value, checked} = event.target;
        if (checked) {
            console.log('event', checked);
            setSelectedModels((current) => [...current, value]);
        } else {
            setSelectedModels((current) =>
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
    const itemRender = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a>Previous</a>;
        }
        if (type === 'next') {
            return <a>Next</a>;
        }
        return originalElement;
    };
    return (
        <Front
            containerClass="w-full"
            extraHeader={true}
            extraHeaderTitle={__("Browse Previews")}
            extraHeaderImage={exploreImage}
            extraHeaderText={""}
            extraImageHeight={"h-14"}
        >
            <Head
                title="Previews"
            />

            <Modal show={modal} onClose={(e) => setModal(false)}>
                {playVideo && <SingleVideo video={playVideo} inModal={true}/>}
            </Modal>

           <Modal show={showWatchedPopup} onClose={() => setShowWatchedPopup(false)}>
                 <div className="border dark:border-zinc-800 shadow-sm p-4 rounded-lg pb-2 bg-white dark:bg-zinc-900">
                   <h2 className="text-xl font-bold text-indigo-700 dark:text-white mb-4">
                     {__("Watched Your Videos")}
                   </h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                     {watchVideos.map((v) => (
                       <div
                         className="border dark:border-zinc-800 shadow-sm rounded-lg pb-2 bg-white dark:bg-zinc-900 w-full"
                         key={`vid-${v.id}`}
                       >
                         <div className="relative">
                           <a href={route("short.video.single.page", { id: v.slug })} data-price={v.price}>
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
                             <a href={v.streamer ? route("channel", { user: v.streamer.username }) : "#"}>
                               {v.streamer?.profile_picture ? (
                                 <img src={v.streamer.profile_picture} alt="Streamer" className="w-10 h-10 rounded-full" />
                               ) : (
                                 <div className="w-10 h-10 rounded-full bg-gray-300" />
                               )}
                             </a>
                           </div>
                           <div className="h-5 overflow-hidden">
                             <a
                               className="font-semibold dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400"
                               href={route("short.video.single.page", { id: v.slug })}
                             >
                               {v.title}
                             </a>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                   <div className="mt-4 text-center">
                     <SecondaryButton onClick={() => setShowWatchedPopup(false)}>
                       {__("Close")}
                     </SecondaryButton>
                   </div>
                 </div>
           </Modal>

            <div className="flex w-full -mt-16">
                <form onSubmit={submit}>
                    <div
                        ref={filters}
                        className="hidden lg:block w-56 lg:flex-shrink-0 lg:mr-5"
                    >
                        <h3 className="text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900 dark:text-white shadow rounded-t-lg">
                            {__("Search")}
                        </h3>
                        <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3">
                            <TextInput
                                className="w-full"
                                name="search"
                                value={search}
                                handleChange={(e) => setSearch(e.target.value)}
                                placeholder={__("Search Video")}
                            />
                        </div>

                        <h3 className="mt-5 text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900 dark:text-white shadow rounded-t-lg">
                            {__("Sort By")}
                        </h3>
                        <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3">
                            <label className="flex items-center text-gray-600 dark:text-white cursor-pointer	">
                                <input
                                    type={"radio"}
                                    name="sort"
                                    value="Most"
                                    checked={sort === "Most"}
                                    className="mr-2"
                                    onChange={(e) => setSort(e.target.value)}
                                />
                                {__("Most Viewed")}
                            </label>
                            <label className="flex items-center text-gray-600 dark:text-white cursor-pointer	">
                                <input
                                    type={"radio"}
                                    name="sort"
                                    value="Recently"
                                    checked={sort === "Recently"}
                                    className="mr-2"
                                    onChange={(e) => setSort(e.target.value)}
                                />
                                {__("Newest Uploaded")}
                            </label>
                            <label className="flex items-center text-gray-600 dark:text-white cursor-pointer	">
                                <input
                                    type={"radio"}
                                    name="sort"
                                    checked={sort === "Older"}
                                    value="Older"
                                    className="mr-2"
                                    onChange={(e) => setSort(e.target.value)}
                                />
                                {__("Older Videos")}
                            </label>
                            {/*<div className="flex items-center text-gray-600 dark:text-white">*/}
                            {/*    <input*/}
                            {/*        type={"radio"}*/}
                            {/*        name="sort"*/}
                            {/*        checked={sort === "Latest"}*/}
                            {/*        value="Latest"*/}
                            {/*        className="mr-2"*/}
                            {/*        onChange={(e) => setSort(e.target.value)}*/}
                            {/*    />*/}
                            {/*    {__("Latest")}*/}
                            {/*</div>*/}
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
                                            checked={selectedCategories.includes(
                                                cat.id.toString()
                                            )}

                                        />
                                        {cat.category}

                                    </label>
                                );
                            })}
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

                        <h3 className="mt-5 text-indigo-700 text-xl font-bold block p-3 bg-light-violet dark:bg-zinc-900  dark:text-white shadow rounded-t-lg">
                            {__("Models")}
                        </h3>
                        <div className="bg-white dark:bg-zinc-800 rounded-b-lg shadow p-3 overflow-y-auto h-48">
                            {models.map((model) => {
                                return (
                                    <label
                                        key={`modelFilter-${model.id}`}
                                        className="flex items-center text-gray-600 dark:text-white cursor-pointer	"
                                    >
                                        <input
                                            type="checkbox"
                                            name="models[]"
                                            className="mr-2"
                                            value={model.id}
                                            onChange={handleModels}
                                            checked={selectedModels.includes(
                                                model.id.toString()
                                            )}
                                        />
                                        {model.name}
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

                        <SecondaryButton
                            className="mt-2"
                            onClick={(e) =>
                                Inertia.visit(route("videos.browse"))
                            }
                        >
                            {__("Reset")}
                        </SecondaryButton>

                        <div className="lg:hidden text-center border-t border-t-gray-300 dark:border-gray-900 py-5">
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

                    {videos.total === 0 && (
                        <div
                            className="text-xl bg-white rounded-lg shadow text-gray-600 dark:bg-zinc-900 dark:text-white font-light p-3 flex items-center">
                            <FcEmptyFilter className="w-12 h-12 mr-2"/>
                            {__("No videos to show")}
                        </div>
                    )}

                    {videos.current_page == 1 && randomvideos.total > 0 && (
                        <div>
                            <h2 className="text-indigo-700 text-2xl font-bold dark:text-white">
                                {__("Random Previews")}
                            </h2>
                            <ShortVideosLoop videos={randomvideos.data}/>

                            <h2 className="text-indigo-700 text-2xl font-bold dark:text-white">
                                {__("Filtered Previews")}
                            </h2>
                        </div>

                    )}

                    <ShortVideosLoop videos={videos.data}/>

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

                    <div className="mt-3">
                        <AdBar/>
                    </div>

                </div>
            </div>
        </Front>
    );
}
