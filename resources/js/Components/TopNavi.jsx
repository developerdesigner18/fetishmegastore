import { AiOutlineMenuUnfold, AiFillTags } from "react-icons/ai";
import { RiLoginBoxLine } from "react-icons/ri/index.js";
import { BiUserPlus, BiSearchAlt } from "react-icons/bi/index.js";
import {
    MdDarkMode,
    MdGeneratingTokens,
    MdOutlineVideoLibrary,
    MdOutlineCategory,
    MdOutlineGirl,
} from "react-icons/md/index.js";
import { MdOutlineVideoCameraFront } from "react-icons/md";
import { BsFillSunFill, BsSlashSquare } from "react-icons/bs/index.js";
import { TbBrandStorytel } from "react-icons/tb";
import { BiUserCircle } from "react-icons/bi/index.js";
import { Link } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import { usePage } from "@inertiajs/inertia-react";
import { Select, Space } from 'antd';
import { useState, useEffect } from "react";
import Dropdown from "@/Components/Dropdown";
import Modal from "@/Components/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from "lodash.debounce";
import axios from "axios";
import TextInput from "./TextInput";
import { FaChromecast, FaBlog } from "react-icons/fa/index.js";
import { RxCaretDown } from "react-icons/rx/index.js";

export default function TopNavi({ children }) {
    const { logo, logo_day, auth, pages, current_locale } = usePage().props;

    //const [selectedLang, setSelectedLang] = useState(current_locale || "en");
    const [isDarkMode, setIsDarkMode] = useState("no");
    const [showSearch, setShowSearch] = useState(false);

    const [results, setResults] = useState([]);

    const { flash } = usePage().props;

    let selectedLang = 'English';
    switch (current_locale) {
        case 'de': selectedLang = 'German'; break;
        case 'it': selectedLang = 'Italian'; break;
        case 'fr': selectedLang = 'French'; break;
        case 'es': selectedLang = 'Spanish'; break;
        case 'ru': selectedLang = 'Russian'; break;
        case 'zh': selectedLang = 'Chinese'; break;
        case 'jp': selectedLang = 'Japanese'; break;
        case 'pt': selectedLang = 'Portuguese'; break;
        case 'pl': selectedLang = 'Polish'; break;
        case 'tr': selectedLang = 'Turkish'; break;
        default: selectedLang = 'English';
    }

    // switch (current_locale) {
    //     case 'en':
    //         selectedLang = 'English';
    //         break;
    //     case 'de':
    //         selectedLang = 'German';
    //         break;
    //     case 'it':
    //         selectedLang = 'Italian';
    //         break;
    //     case 'fr':
    //         selectedLang = 'French';
    //         break;
    //     case 'es':
    //         selectedLang = 'Spanish';
    //         break;
    //     case 'ru':
    //         selectedLang = 'Russian';
    //         break;
    //     case 'zh':
    //         selectedLang = 'Chinese';
    //         break;
    //     case 'jp':
    //         selectedLang = 'Japanese';
    //         break;
    //     case 'pt':
    //         selectedLang = 'Portugese';
    //         break;
    //     case 'pl':
    //         selectedLang = 'Polish';
    //         break;
    //     case 'tr':
    //         selectedLang = 'Turkish';
    //         break;
    // }

    const handleChangeLang = (value) => {
        axios.post(route('change.lang', { lang: value }))
            .then((resp) => {
                window.location.href = resp.data.redirect; // redirect to localized URL
            })
            .catch((Error) => {
                toast.error(Error.response?.data?.message);
            });
    };

    useEffect(() => {
        if (flash?.message) {
            toast(flash.message);
        }
    }, [flash]);

    useEffect(() => {
        if (localStorage.getItem("is-dark-mode")) {
            setIsDarkMode(localStorage.getItem("is-dark-mode"));
        }

        if (isDarkMode == "yes") {
            document.body.classList.add("dark");
            document.body.classList.add("bg-black");
            document.body.classList.remove("bg-slate-50");
        } else {
            document.body.classList.remove("dark");
            document.body.classList.remove("bg-black");
            document.body.classList.add("bg-slate-50");
        }
    }, [isDarkMode]);

    const switchDarkMode = () => {
        if (isDarkMode == "no") {
            document.body.classList.add("dark");
            localStorage.setItem("is-dark-mode", "yes");
            setIsDarkMode("yes");
        } else {
            document.body.classList.remove("dark");
            document.body.classList.remove("bg-black");
            localStorage.setItem("is-dark-mode", "no");
            setIsDarkMode("no");
        }
    };

    const updateTerm = debounce((e) => {
        if (e.target.value.length > 2) {
            axios
                .get(route("channel.search"), {
                    params: { term: e.target.value },
                })
                .then((resp) => setResults(resp.data))
                .catch((Error) => toast(Error.response?.data?.message));
        } else {
            setResults([]);
        }
    }, 500);

    return (
        <nav className="fixed inset-x-0 z-10 bg-violet-800 border-b-2 border-violet-800 dark:bg-zinc-900 dark:border-b-2 dark:border-zinc-800" role="navigation" aria-label="Main navigation">
            <Modal show={showSearch}
                   closeable={true}
                   onClose={(e) => setShowSearch(false)}
            >
                <div className="p-3">
                    <label htmlFor="channel-search" className="sr-only">{__("Search Channels")}</label>
                    <TextInput
                        id="channel-search"
                        className={"w-full mb-5"}
                        handleChange={(e) => updateTerm(e)}
                        type="text"
                        placeholder={__("Search Channels")}
                        isFocused={true}
                        aria-label={__("Search Channels")}
                    />
                    {results.length === 0 && (
                        <div className="dark:text-white" role="status" aria-live="polite">
                            {__("No results")}
                        </div>
                    )}

                    {results.map((sr) => {
                        return (
                            <div
                                key={`sr-${sr.id}`}
                                className="flex items-center mt-2 space-x-2"
                            >
                                <div>
                                    <Link
                                        href={route("channel", {
                                            user: sr.username,
                                        })}
                                    >
                                        <img
                                            src={sr.profile_picture}
                                            alt={`${sr.name} profile picture`}
                                            width="56"
                                            height="56"
                                            className="rounded-full h-14 border-zinc-200 dark:border-indigo-200 border"
                                        />
                                    </Link>
                                </div>
                                <div className="grow">
                                    <Link
                                        className="block text-gray-600 dark:text-gray-300 font-semibold mt-1 ml-1"
                                        href={route("channel", {
                                            user: sr.username,
                                        })}
                                    >
                                        {sr.name}
                                    </Link>
                                    <Link
                                        className="block text-sky-500 hover:text-sky-600 font-semibold mt-1 ml-1"
                                        href={route("channel", {
                                            user: sr.username,
                                        })}
                                    >
                                        @{sr.username}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Modal>

            <div className="max-w-7xl mx-auto">
                <div className="hidden lg:flex items-center justify-between py-2">
                    <div className="flex-shrink-0">
                        <Link href={route("home")} aria-label="Home">
                            <img src={logo} alt="Fetish Mega Store Logo" width="100%" height="32" className="h-8" style={{ imageRendering: 'crisp-edges', objectFit: 'contain' }} />
                        </Link>
                    </div>

                    <div className="flex flex-col flex-grow mx-4">
                        <div className="flex justify-center space-x-6">
                            <Link
                                href={route("home")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                {__("Home")}
                            </Link>
                            <Link
                                href={route("categories.browse")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Categories")}</span>
                            </Link>
                            <Link
                                href={route("videos.browse")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Videos")}</span>
                            </Link>

                            <Link
                                href={route("short.videos.browse")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Previews")}</span>
                            </Link>
                            <Link
                                href={route("products.index")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Products")}</span>
                            </Link>
                            <a
                                href='https://adultdata.net/our-sites/'
                                target="_blank"
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Our Sites")}</span>
                            </a>
                            {/* <Link
                                href={route("ebook.browse")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("E-Books")}</span>
                            </Link>
                            <Link
                                href={route("audio.browse")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Audios")}</span>
                            </Link>
                            <Link
                                href={route("short.videos.browse")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Previews")}</span>
                            </Link> */}
                        </div>

                        {/* Second Navigation Row */}
                        <div className="flex justify-center space-x-6 mt-1">
                            <Link
                                href={route("channels.browse")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Channels")}</span>
                            </Link>
                            <Link
                                href={route("model.browse")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Models")}</span>
                            </Link>
                            <Link
                                href={route("gallery.browse")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Gallery")}</span>
                            </Link>
                            <Link
                                href={route("tag.browse")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Tags")}</span>
                            </Link>
                            <Link
                                href={route("web.blogs.index")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Blogs")}</span>
                            </Link>
                            <Link
                                href={route("web.story.index")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Stories")}</span>
                            </Link>
                            <a
                                href={`https://ctrdwm.com/?siteId=fetishfix&categoryName=&pageName=home&performerName=&prm[psid]=6camgirl&prm[pstool]=205_1&prm[psprogram]=revs&prm[campaign_id]=&subAffId={SUBAFFID}`}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <span>{__("Fetish Cams")}</span>
                            </a>
                            <Link
                                href={route("token.packages")}
                                className="inline-flex items-center text-white text-md hover:text-indigo-200 font-semibold"
                            >
                                <MdGeneratingTokens className="h-6 w-6 mr-1" />
                                <span>{__("Token Packs")}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Section - User Controls */}
                    <div className="flex items-center space-x-4 flex-shrink-0">
                        <Select defaultValue={selectedLang}
                                style={{ width: 120 }}
                                className="hidden md:inline-flex items-center text-white font-semibold"
                                onChange={handleChangeLang}
                                options={[
                                    { value: 'en', label: 'English' },
                                    { value: 'de', label: 'German' },
                                    { value: 'it', label: 'Italian' },
                                    { value: 'fr', label: 'French' },
                                    { value: 'es', label: 'Spanish' },
                                    { value: 'ru', label: 'Russian' },
                                    { value: 'zh', label: 'Chinese' },
                                    { value: 'jp', label: 'Japanese' },
                                    { value: 'pt', label: 'Portuguese' },
                                    { value: 'pl', label: 'Polish' },
                                    { value: 'tr', label: 'Turkish' },
                                ]}
                        />

                        {isDarkMode == "no" ? (
                            <button
                                onClick={switchDarkMode}
                                aria-label={__("Switch to dark mode")}
                                className="w-6 h-6 text-white hover:text-indigo-200 cursor-pointer"
                            >
                                <MdDarkMode className="w-6 h-6" />
                            </button>
                        ) : (
                            <button
                                onClick={switchDarkMode}
                                aria-label={__("Switch to light mode")}
                                className="w-6 h-6 text-white cursor-pointer hover:text-orange-400"
                            >
                                <BsFillSunFill className="w-6 h-6" />
                            </button>
                        )}

                        {!auth.user ? (
                            <>
                                <Link
                                    className="text-white hover:text-indigo-200 border border-white hover:border-indigo-200 p-1 rounded-lg px-4 font-semibold"
                                    href={route("login")}
                                >
                                    {__("Login")}
                                </Link>
                                <Link
                                    href={route("signup")}
                                    className="bg-violet-600 p-1.5 rounded-lg border-violet-600 font-semibold px-4 text-zinc-200 hover:bg-violet-500"
                                >
                                    {__("Signup")}
                                </Link>
                                <Link
                                    href={route("apply.now")}
                                    className="hidden lg:block text-white text-sm w-24 text-center whitespace-normal"
                                >
                                    {__("Open a channel")}
                                </Link>
                            </>
                        ) : (
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <div className="relative inline-flex">
                                        <BiUserCircle
                                            className="mr-1 w-6 h-6 text-white cursor-pointer hover:text-indigo-400" />
                                        <div
                                            className="absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -left-1">
                                            {auth.unreadNotifications}
                                        </div>
                                        <div
                                            className="inline-flex items-center cursor-pointer text-white font-semibold hover:text-indigo-400 pt-0.5">
                                            {__(auth.user.firstName)}
                                            <RxCaretDown />
                                        </div>
                                    </div>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link
                                        href={`${auth.user.is_streamer === "yes"
                                            ? route("payout.withdraw")
                                            : route("profile.myTokens")
                                        }`}
                                    >
                                        <span
                                            className="flex items-center bg-green-100 text-green-700 text-xs font-bold justify-center py-1 rounded-lg">
                                            <MdGeneratingTokens className="h-5 w-5" />
                                            {auth.user.tokens}
                                        </span>
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("notifications.inbox")}
                                    >
                                        {__("Notifications")}
                                        <span
                                            className="bg-red-100 text-red-500 text-xs font-medium px-1.5 py-0.5 rounded-full dark:bg-red-500 dark:text-red-100">
                                            {__(
                                                ":unreadNotificationsCount new",
                                                {
                                                    unreadNotificationsCount:
                                                    auth.unreadNotifications,
                                                }
                                            )}
                                        </span>
                                    </Dropdown.Link>
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("channel", {
                                                user: auth.user.username,
                                            })}
                                        >
                                            {__("My Channel")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("channel.settings")}
                                        >
                                            {__("Channel Settings")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("payout.withdraw")}
                                        >
                                            {__("Withdraw")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("membership.set-tiers")}
                                        >
                                            {__("Membership Tiers")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("videos.list")}
                                        >
                                            {__("Upload Videos")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("audio.list")}
                                        >
                                            {__("Upload Audio")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("preview.list", {
                                                user: auth.user.username,
                                            })}
                                        >
                                            {__("Upload Previews")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("gallery.list", {
                                                user: auth.user.username,
                                            })}
                                        >
                                            {__("Upload Gallery")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("model.list", {
                                                user: auth.user.username,
                                            })}
                                        >
                                            {__("Upload Model")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("channel.bannedUsers", {
                                                user: auth.user.username,
                                            })}
                                        >
                                            {__("Banned Users")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("channel.followers", {
                                                user: auth.user.username,
                                            })}
                                        >
                                            {__("My Followers")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("mySubscribers")}
                                        >
                                            {__("My Subscribers")}
                                        </Dropdown.Link>
                                    )}
                                    <Dropdown.Link
                                        href={route("videos.ordered")}
                                    >
                                        {__("My Videos")}
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("audio.ordered")}
                                    >
                                        {__("My Audios")}
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("watchedVideos.list")}
                                    >
                                        {__("Watched Video")}
                                    </Dropdown.Link>

                                    {/* <Dropdown.Link href={route("audio.ordered")} >
                                        {__("My Audio")}
                                    </Dropdown.Link> */}
                                    <Dropdown.Link
                                        href={route("profile.followings")}
                                    >
                                        {__("My Followings")}
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route("ebook.ordered")}>
                                        {__("My Ebooks")}
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("mySubscriptions")}
                                    >
                                        {__("My Subscriptions")}
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("myFavorites")}
                                    >
                                        {__("My Favorites")}
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        {__("My Account")}
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route("page.userAccount")}>
                                        {__("User Guide")}
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        {__("Logout")}
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        )}
                    </div>
                </div>

                {/* Mobile Layout - No Changes */}
                <div className="lg:hidden flex justify-between items-center py-4 px-4">
                    <div className="flex items-center">
                        <Link href={route("home")} aria-label="Home">
                            <img src={logo} alt="Fetish Mega Store Logo" width="100%" height="32" className="h-8 mr-1 mt-1" style={{ imageRendering: 'crisp-edges', objectFit: 'contain' }} />
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Select value={selectedLang}
                                style={{ width: 100 }}
                                className="inline-flex items-center text-white text-md"
                                onChange={handleChangeLang}
                                options={[
                                    { value: "en", label: "English" },
                                    { value: "de", label: "German" },
                                    { value: "it", label: "Italian" },
                                    { value: "fr", label: "French" },
                                    { value: "es", label: "Spanish" },
                                    { value: "ru", label: "Russian" },
                                    { value: "zh", label: "Chinese" },
                                    { value: "jp", label: "Japanese" },
                                    { value: "pt", label: "Portuguese" },
                                    { value: "pl", label: "Polish" },
                                    { value: "tr", label: "Turkish" },
                                ]}
                        />

                        {!auth.user ? (
                            <>
                                <Link href={route("login")} className="text-white">
                                    {__("Login")}
                                </Link>
                                <Link href={route("signup")} className="text-white">
                                    {__("Signup")}
                                </Link>
                            </>
                        ) : (
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <div className="relative inline-flex mt-1">
                                        <BiUserCircle
                                            className="mr-1 w-6 h-6 text-white cursor-pointer hover:text-indigo-400" />
                                        <div
                                            className="absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -left-1">
                                            {auth.unreadNotifications}
                                        </div>
                                    </div>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link
                                        href={`${auth.user.is_streamer === "yes"
                                            ? route("payout.withdraw")
                                            : route("profile.myTokens")
                                        }`}
                                    >
                                        <span
                                            className="flex items-center bg-green-100 text-green-700 text-xs font-bold justify-center py-1 rounded-lg">
                                            <MdGeneratingTokens className="h-5 w-5" />
                                            {auth.user.tokens}
                                        </span>
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("notifications.inbox")}
                                    >
                                        {__("Notifications")}
                                        <span
                                            className="bg-red-100 text-red-500 text-xs font-medium px-1.5 py-0.5 rounded-full dark:bg-red-500 dark:text-red-100">
                                            {__(
                                                ":unreadNotificationsCount new",
                                                {
                                                    unreadNotificationsCount:
                                                    auth.unreadNotifications,
                                                }
                                            )}
                                        </span>
                                    </Dropdown.Link>
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("channel", {
                                                user: auth.user.username,
                                            })}
                                        >
                                            {__("My Channel")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("channel.settings")}
                                        >
                                            {__("Channel Settings")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("payout.withdraw")}
                                        >
                                            {__("Withdraw")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("membership.set-tiers")}
                                        >
                                            {__("Membership Tiers")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("videos.list")}
                                        >
                                            {__("Upload Videos")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("channel.followers", {
                                                user: auth.user.username,
                                            })}
                                        >
                                            {__("My Followers")}
                                        </Dropdown.Link>
                                    )}
                                    {auth.user.is_streamer === "yes" && (
                                        <Dropdown.Link
                                            href={route("mySubscribers")}
                                        >
                                            {__("My Subscribers")}
                                        </Dropdown.Link>
                                    )}
                                    <Dropdown.Link
                                        href={route("videos.ordered")}
                                    >
                                        {__("My Videos")}
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("audio.ordered")}
                                    >
                                        {__("My Audios")}
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("profile.followings")}
                                    >
                                        {__("My Followings")}
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("watchedVideos.list")}
                                    >
                                        {__("Watched Video")}
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("mySubscriptions")}
                                    >
                                        {__("My Subscriptions")}
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("myFavorites")}
                                    >
                                        {__("My Favorites")}
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        {__("My Account")}
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        {__("Logout")}
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        )}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <AiOutlineMenuUnfold
                                    className="ml-2 w-6 h-6 text-white cursor-pointer hover:text-indigo-200"
                                />
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Content>
                                    {/* Add a fixed height and enable vertical scrolling */}
                                    <div className="max-h-64 overflow-y-auto">
                                        <div className="flex pl-4 pt-2 text-gray-500 dark:text-white font-bold">
                                            {__("Menu")}
                                        </div>
                                        <Dropdown.Link href={route("home")}>
                                            {__("Home")}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("categories.browse")}>
                                            {__("Categories")}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("videos.browse")}>
                                            {__("Videos")}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("short.videos.browse")}>
                                            {__("Previews Videos")}
                                        </Dropdown.Link>
                                        <a href="https://adultdata.net/our-sites/" target="_blank" className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out">
                                            {__("Our Sites")}
                                        </a>
                                        <Dropdown.Link href={route("channels.browse")}>
                                            {__("Channels")}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("model.browse")}>
                                            {__("Models")}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("gallery.browse")}>
                                            {__("Gallery")}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("tag.browse")}>
                                            {__("Tags")}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("web.blogs.index")}>
                                            {__("Blogs")}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("web.story.index")}>
                                            {__("Stories")}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("token.packages")}>
                                            <div className="flex items-center justify-between">
                                                <div>{__("Token Packs")}</div>
                                                <div>
                                                    <MdGeneratingTokens className="h-6 w-6" />
                                                </div>
                                            </div>
                                        </Dropdown.Link>
                                        <a
                                            href={`https://ctrdwm.com/?siteId=fetishfix&categoryName=&pageName=home&performerName=&prm[psid]=6camgirl&prm[pstool]=205_1&prm[psprogram]=revs&prm[campaign_id]=&subAffId={SUBAFFID}`}
                                            className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out"
                                        >
                                            {__('Fetish Cams')}
                                        </a>
                                        {!auth?.user ? (
                                            <Dropdown.Link href={route("apply.now")}>
                                                {__("Open a channel")}
                                            </Dropdown.Link>
                                        ) : null}
                                        <div className="flex pl-4 pt-2 text-gray-500 dark:text-white font-bold">
                                            {__("General")}
                                        </div>
                                        <Dropdown.Link href={route("contact.form")}>
                                            {__("Get In Touch")}
                                        </Dropdown.Link>
                                        {pages.map((p) => (
                                            <Dropdown.Link
                                                key={`page-${p.id}`}
                                                href={route("page", { page: p.page_slug })}
                                            >
                                                {p.page_title}
                                            </Dropdown.Link>
                                        ))}
                                    </div>
                                </Dropdown.Content>
                            </Dropdown.Content>
                        </Dropdown>

                        {isDarkMode == "no" ? (
                            <MdDarkMode
                                className="w-6 h-6 text-white hover:text-indigo-200 cursor-pointer"
                                onClick={switchDarkMode}
                            />
                        ) : (
                            <BsFillSunFill
                                className="w-6 h-6 text-white cursor-pointer hover:text-orange-400 hover:rounded"
                                onClick={switchDarkMode}
                            />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
