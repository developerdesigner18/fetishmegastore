import { useState, useEffect, useRef } from "react";
import __ from "@/Functions/Translate";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "@/Components/Spinner";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import { Link } from "@inertiajs/inertia-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { AiOutlineEye } from "react-icons/ai";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import SingleVideo from "@/Pages/Videos/SingleVideo";

export default function EbookTab({ streamUser, userIsSubscribed }) {
    const [audio, setAudio] = useState({});
    const [loading, setLoading] = useState(true);
    const [playAudio, setPlayAudio] = useState(false);
    const [hovered, setHovered] = useState({});
    const [modal, setModal] = useState(false);

    const handleMouseEnter = (id) => {
        setHovered((prev) => ({ ...prev, [id]: true }));
    };

    const handleMouseLeave = (id) => {
        setHovered((prev) => ({ ...prev, [id]: false }));
    };

    const playModal = (e, audio) => {
        e.preventDefault();
        setPlayAudio(audio);
        setModal(true);
    };

    useEffect(() => {
        getAudio(1);
    }, []);

    const getAudio = (page) => {
        axios
            .get(
                `${route("channel.ebook", {
                    user: streamUser.id,
                })}?page=${page}`
            )
            .then((resp) => {
                setAudio(resp.data);
                setLoading(false);
            })
            .catch((Err) => toast.error(Err.response?.data?.message));
    };

    return (
        <div className="mt-5">
            {loading && (
                <div className="my-3">
                    <Spinner />
                </div>
            )}

            <Modal show={modal} onClose={(e) => setModal(false)}>
                {playAudio && <SingleVideo audio={playAudio} inModal={true} />}
            </Modal>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {audio.data &&
                    audio.data.map((v) => (
                        <div
                            className="mb-4 pb-2 w-full bg-white dark:bg-zinc-900 shadow rounded-lg"
                            key={`audio-${v.id}`}
                        >
                            <div className="relative">
                                <a
                                    href={route("audio.single.page", {
                                        id: v.slug,
                                    })}
                                    onClick={(e) => handleLinkClick(e, route("audio.single.page", { id: v.slug }))}
                                >
                                    {hovered[v.id] && v.videoGIF ? (
                                        <img
                                            src={v.videoGIF}
                                            className="hovered-gif thumbnail-image rounded-tl-lg rounded-tr-lg mb-3"
                                            alt="Any Fetish Porn and Extreme XXX Porn Site – FetishMegaStore"
                                            onMouseLeave={() => handleMouseLeave(v.id)}
                                        />
                                    ) : (
                                        <img
                                            src={`http://${window.location.hostname.includes('localhost') ? 'localhost.fetishmegastore' : 'fetishmegastore.com'}/${v.thumbnail}`}
                                            className="thumbnail-image rounded-tl-lg rounded-tr-lg mb-3"
                                            alt="Watch Free Fetish and BDSM Porn Audio – FetishMegaStore"
                                            onMouseEnter={() => handleMouseEnter(v.id)}
                                        />
                                    )}
                                </a>

                                <div className="absolute top-5 left-0 bg-indigo-800 text-white font-bold text-sm uppercase rounded-tr rounded-br px-2 py-1">
                                    {v.price < 1 ? (
                                        __("Free")
                                    ) : (
                                        <div className="flex items-center">
                                            <MdGeneratingTokens className="h-4 w-4 mr-1" />
                                            {v.price}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="inline-flex items-start px-2">
                                <div className="w-10 flex-shrink-0 mr-2">
                                    <Link
                                        href={route("channel", {
                                            user: v.streamer.username,
                                        })}
                                    >
                                        <img
                                            src={v.streamer.profile_picture}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </Link>
                                </div>
                                <div>
                                    <div className="h-5 overflow-hidden">
                                        <Link
                                            href={route("video.single.page", {
                                                id: v.slug,
                                            })}
                                        >
                                            {v.title_en}
                                        </Link>
                                    </div>
                                    <div className="mt-1.5 flex items-center text-xs text-gray-500 dark:text-gray-200">
                                        <div>
                                            <Link
                                                href={route("channel", {
                                                    user: v.streamer.username,
                                                })}
                                            >
                                                @{v.streamer.username}
                                            </Link>

                                            <Tooltip anchorSelect="a" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {audio.total > 9 && (
                <>
                    <SecondaryButton
                        className="mr-2"
                        processing={audio.prev_page_url ? false : true}
                        onClick={(e) => getAudio(audio.current_page - 1)}
                    >
                        {__("Prev")}
                    </SecondaryButton>

                    <SecondaryButton
                        processing={audio.next_page_url ? false : true}
                        onClick={(e) => getAudio(audio.current_page + 1)}
                    >
                        {__("Next")}
                    </SecondaryButton>
                </>
            )}

            {audio.total === 0 && (
                <div className="dark:text-white dark:bg-zinc-900 rounded-lg px-3 py-5 text-gray-600 bg-white shadow">
                    {__("No Ebbok uploaded by :streamer", {
                        streamer: streamUser.username,
                    })}
                </div>
            )}
        </div>
    );
}
