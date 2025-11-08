import React, {useRef, useState} from "react";
import {Head, usePage} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import SecondaryButton from "@/Components/SecondaryButton";
import {FcEmptyFilter} from "react-icons/fc/index.js";
import {Inertia} from "@inertiajs/inertia";
import CategoryLoop from "@/Components/CategoryLoop";
import ModelLoop from "@/Components/ModelLoop";
import Spinner from "@/Components/Spinner";
import Front from "@/Layouts/Front";
import TextInput from "@/Components/TextInput";
import {IoMdFunnel} from "react-icons/io/index.js";
import {Pagination} from 'antd';
import {BsTagFill, BsFillTagsFill, BsShare, BsHeart, BsHeartFill} from "react-icons/bs/index.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Glossar({glossar, exploreImage, userrequest, tags, categories}) {
    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState(userrequest['selectedCategories'] || []);
    const [selectedTags, setSelectedTags] = useState(userrequest['selectedTags'] || []);
    const [isLoading, setLoading] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState(userrequest['sort_by_alphabet'] || '');
    const [currentPage, setCurrentPage] = useState(glossar.current_page || 1);

    const filters = useRef();

    // Alphabet letters for the filter
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const submit = (e) => {
        e.preventDefault();

        Inertia.visit(
            route("web.glossar.index", {
                search,
                selectedCategories,
                selectedTags,
                sort_by_alphabet: selectedLetter,
                page: 1 // Reset to first page when applying new filters
            }),
            {
                only: ["glossar"],
                preserveState: true,
                onBefore: () => setLoading(true),
                onFinish: () => setLoading(false),
            }
        );

        hideFilters();
    };

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter === selectedLetter ? '' : letter);
        setCurrentPage(1); // Reset to first page when changing letter filter

        Inertia.visit(
            route("web.glossar.index", {
                search,
                selectedCategories,
                selectedTags,
                sort_by_alphabet: letter === selectedLetter ? '' : letter,
                page: 1
            }),
            {
                only: ["glossar"],
                preserveState: true,
                onBefore: () => setLoading(true),
                onFinish: () => setLoading(false),
            }
        );
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        Inertia.visit(
            route("web.glossar.index", {
                search,
                selectedCategories,
                selectedTags,
                sort_by_alphabet: selectedLetter,
                page: page
            }),
            {
                only: ["glossar"],
                preserveState: true,
                onBefore: () => setLoading(true),
                onFinish: () => setLoading(false),
            }
        );
    };

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

    const hideFilters = (e) => {
        e?.preventDefault();
        const hidden = "hidden lg:block w-56 lg:flex-shrink-0 lg:mr-5";
        filters.current.className = hidden;
    };

    return (
        <Front
            containerClass="w-full"
            extraHeader={true}
            extraHeaderTitle={__("Glossar")}
            extraHeaderImage={exploreImage}
            extraHeaderText={""}
            extraImageHeight={"h-14"}
        >
            <Head title={__("Glossar")}/>

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
                                Inertia.visit(route("web.glossar.index"))
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
                    {/* Alphabet Filter */}
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow mb-4 p-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {alphabet.map((letter) => (
                                <button
                                    key={`letter-${letter}`}
                                    onClick={() => handleLetterClick(letter)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md font-medium 
                                    ${selectedLetter === letter
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600'
                                    }`}
                                >
                                    {letter}
                                </button>
                            ))}
                            <button
                                onClick={() => handleLetterClick('')}
                                className={`w-auto px-2 h-8 flex items-center justify-center rounded-md font-medium 
                                ${!selectedLetter
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-zinc-600'
                                }`}
                            >
                                {__('All')}
                            </button>
                        </div>
                    </div>

                    {glossar.data.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row items-start mb-4"
                        >
                            <div className="flex-shrink-0">
                                <a href={route("web.glossar.info", {slug: item?.slug})}>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        title={item.title}
                                        className="img-thumbnail wizmage-pattern-bg-img wizmage-cls wizmage-shade-4 w-full h-auto md:w-[200px] md:h-[112px]"
                                    />
                                </a>
                            </div>
                            <div className="ml-0 mt-4 md:ml-4 md:mt-0">
                                <h4 className="text-lg font-bold">
                                    <a
                                        className="font-semibold dark:text-indigo-100 hover:text-indigo-800 text-indigo-600 dark:hover:text-indigo-400"
                                        href={route("web.glossar.info", {slug: item?.slug})}
                                    >
                                        {item.title}
                                    </a>
                                </h4>
                                <div>
                                    <div className="text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm">
                                        <BsTagFill className="w-3"/>
                                        <span>{item?.categoryNames}</span>
                                    </div>
                                    <div className="text-gray-600 mr-2 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm">
                                        <BsFillTagsFill className="w-3"/>
                                        <span>{item?.tagNames}</span>
                                    </div>
                                    <h1 className="text-justify">
                                        <a
                                            className="text-gray-500 dark:text-gray-200"
                                            href={route("web.glossar.info", {slug: item.slug})}
                                        >
                                            {__('More Info...')}
                                        </a>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    ))}

                    {glossar.data.length === 0 && (
                        <div className="text-xl bg-white rounded-lg shadow text-gray-600 dark:bg-zinc-900 dark:text-white font-light p-3 flex items-center">
                            <FcEmptyFilter className="w-12 h-12 mr-2"/>
                            {__("No Glossar to show")}
                        </div>
                    )}

                    {glossar.total > glossar.per_page && (
                        <div className="mt-6 flex justify-center">
                            <Pagination
                                current={currentPage}
                                total={glossar.total}
                                pageSize={glossar.per_page}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                className="dark:text-white"
                                itemRender={(current, type, originalElement) => {
                                    if (type === 'prev') {
                                        return <a className="dark:text-white">Previous</a>;
                                    }
                                    if (type === 'next') {
                                        return <a className="dark:text-white">Next</a>;
                                    }
                                    return originalElement;
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Front>
    );
}