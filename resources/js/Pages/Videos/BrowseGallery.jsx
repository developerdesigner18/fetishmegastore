import React, {useState, useRef, useEffect} from "react";
import Front from "@/Layouts/Front";
import {Head} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import SecondaryButton from "@/Components/SecondaryButton";
import {FcEmptyFilter} from "react-icons/fc";
import {Inertia} from "@inertiajs/inertia";
import Spinner from "@/Components/Spinner";
import GalleryLoop from "./Partials/GalleryLoop";
import Modal from "@/Components/Modal";
import SingleVideo from "./SingleVideo";
import TextInput from "@/Components/TextInput";
import debounce from "lodash.debounce";
import {IoMdFunnel} from "react-icons/io";
import {Pagination} from 'antd';
import AdBar from "@/Components/AdBar";

export default function BrowseGallery({
                                          userrequest,
                                          videos,
                                          category,
                                          categories,
                                          exploreImage,
                                          tags,
                                          models,
                                          headTitle,
                                          randomvideos,
                                      }) {
    const [sort, setSort] = useState(userrequest.sort || "Recently");
    const [search, setSearch] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [playVideo, setPlayVideo] = useState(false);
    const [modal, setModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [page, setPage] = useState(userrequest.page || 1);

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
                route("gallery.browse", {
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
    useEffect(() => {
        doRequest
    }, [page])

    const onChangePaginate = (pageNumber) => {

        console.log('Page: ', pageNumber);
        setPage(pageNumber);

        let fullPath = videos.path + '?page=' + pageNumber;
        console.log('Path: ', fullPath);
        Inertia.visit(fullPath)


    };

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
            route("gallery.browse", {
                search,
                sort,
                selectedCategories,
                selectedTags,
                selectedModels,
            }),
            {
                only: ["videos","randomvideos"],
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
            extraHeaderTitle={__("Browse Gallery")}
            extraHeaderImage={exploreImage}
            extraHeaderText={""}
            extraImageHeight={"h-14"}
        >
            <Head
                title="Gallery"
            />

            <Modal show={modal} onClose={(e) => setModal(false)}>
                {playVideo && <SingleVideo video={playVideo} inModal={true}/>}
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
                            <label className="flex items-center text-gray-600 dark:text-white cursor-pointer	">
                                <input
                                    type={"radio"}
                                    name="sort"
                                    checked={sort === "Highest"}
                                    value="Highest"
                                    className="mr-2"
                                    onChange={(e) => setSort(e.target.value)}
                                />
                                {__("Highest Price")}
                            </label>
                            <label className="flex items-center text-gray-600 dark:text-white cursor-pointer	">
                                <input
                                    type={"radio"}
                                    name="sort"
                                    checked={sort === "Lowest"}
                                    value="Lowest"
                                    className="mr-2"
                                    onChange={(e) => setSort(e.target.value)}
                                />
                                {__("Lowest Price")}
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
                                            value={tag.name}
                                            onChange={handleTags}
                                            checked={selectedTags.includes(
                                                tag?.name?.toString()
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
                            {__("No Gallery to show")}
                        </div>
                    )}


                    {videos.current_page == 1 && randomvideos.total > 0 && (
                        <div>
                            <h2 className="text-indigo-700 text-2xl font-bold dark:text-white">
                                {__("Random Galleries")}
                            </h2>
                            <GalleryLoop videos={randomvideos.data}/>

                            <h2 className="text-indigo-700 text-2xl font-bold dark:text-white">
                                {__("Filtered Galleries")}
                            </h2>
                        </div>

                    )}

                    <GalleryLoop videos={videos.data}/>

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
                                defaultCurrent={videos.current_page}
                                onChange={onChangePaginate}
                                // itemRender={itemRender}
                                showSizeChanger={false} // This hides the "Items per page" selector
                            />

                        </>
                    )}
                </div>


            </div>
            <div className="mt-3">
                <AdBar/>
            </div>
        </Front>
    );
}
