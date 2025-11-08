import { useState, useEffect } from "react";
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
import ModelLoop from "@/Components/ModelLoop";
export default function ChannleModels({ streamUser ,userIsSubscribed }) {
    const [videos, setVideos] = useState({});
    const [loading, setLoading] = useState(true);
    const [playVideo, setPlayVideo] = useState(false);
    const [hovered, setHovered] = useState({});
    const [modal, setModal] = useState(false);

    const handleMouseEnter = (id) => {
        setHovered((prev) => ({ ...prev, [id]: true }));
    };

    const handleMouseLeave = (id) => {
        setHovered((prev) => ({ ...prev, [id]: false }));
    };
    const playModal = (e, video) => {
        e.preventDefault();
        setPlayVideo(video);
        setModal(true);
    };

    useEffect(() => {
        getVideos(1);
    }, []);

    const getVideos = (page) => {
        axios
            .get(
                `${route("channel.models", {
                    user: streamUser.id,
                })}?page=${page}`
            )
            .then((resp) => {
                setVideos(resp.data);
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
                {playVideo && <SingleVideo video={playVideo} inModal={true} />}
            </Modal>

            {videos && videos.data && (
                <ModelLoop channels={videos.data}/>
            )}

            {videos.total > 9 && (
                <>
                    <SecondaryButton
                        className="mr-2"
                        processing={videos.prev_page_url ? false : true}
                        onClick={(e) => getVideos(videos.current_page - 1)}
                    >
                        {__("Prev")}
                    </SecondaryButton>

                    <SecondaryButton
                        processing={videos.next_page_url ? false : true}
                        onClick={(e) => getVideos(videos.current_page + 1)}
                    >
                        {__("Next")}
                    </SecondaryButton>
                </>
            )}
            {videos.total === 0 && (
                <div className="dark:text-white dark:bg-zinc-900 rounded-lg px-3 py-5 text-gray-600 bg-white shadow">
                    {__("No videos uploaded by :streamer", {
                        streamer: streamUser.username,
                    })}
                </div>
            )}
        </div>
    );
}
