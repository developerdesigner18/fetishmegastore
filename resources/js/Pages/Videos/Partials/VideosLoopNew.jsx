import __ from "@/Functions/Translate";
import { Head } from "@inertiajs/inertia-react";
import "react-tooltip/dist/react-tooltip.css";
import Modal from "@/Components/Modal";
import SingleVideo from "../SingleVideoDetails";
import { useState, useMemo, memo } from "react";
import Loader from '@/Components/Loader';
import VideoCard from "./VideoCard";

function VideosLoop({ recommendedVideo, videos, blocks = null, userLoginID }) {

    const [playVideo, setPlayVideo] = useState(false);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Determine LCP image for preloading - memoized to prevent recalculation
    const lcpImage = useMemo(() => {
        if (recommendedVideo && recommendedVideo.length > 0) {
            return recommendedVideo[0].thumbnail;
        }
        if (videos && videos.length > 0) {
            return videos[0].thumbnail;
        }
        return null;
    }, [recommendedVideo, videos]);

    const playModal = (e, video) => {
        e.preventDefault();
        setPlayVideo(video);
        setModal(true);
    };

    // Helper to generate resized URL (duplicated from VideoCard to ensure consistency)
    const getResizedUrl = (url, width) => {
        if (!url) return "";
        if (url.startsWith('data:') || url.startsWith('blob:')) return url;
        let path = url;
        if (url.startsWith('http')) {
            try {
                const urlObj = new URL(url);
                if (urlObj.hostname !== window.location.hostname) return url;
                path = urlObj.pathname;
            } catch (e) { return url; }
        }
        if (path.startsWith('/')) path = path.substring(1);
        return `/img-resize/${width}/${path}`;
    };

    return (
        <>
            {lcpImage && (
                <Head>
                    <link
                        rel="preload"
                        as="image"
                        href={lcpImage}
                        imageSrcSet={`${getResizedUrl(lcpImage, 480)} 480w, ${getResizedUrl(lcpImage, 720)} 720w`}
                        imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        fetchPriority="high"
                    />
                </Head>
            )}
            {loading && <Loader />}
            <Modal show={modal} onClose={(e) => setModal(false)}>
                {playVideo && <SingleVideo video={playVideo} inModal={true} />}
            </Modal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {recommendedVideo && recommendedVideo.length > 0 && (
                    <div className="recommended-video-section mb-8">
                        <h2 className="font-bold text-lg mt-2">Recommended Videos</h2>
                        {recommendedVideo.map((v, index) => (
                            <VideoCard
                                key={`vid-${v.id}`}
                                video={v}
                                priority={index < 2}
                                showViews={false}
                            />
                        ))}
                    </div>
                )}

                {videos?.map((v, index) => (
                    <VideoCard
                        key={`vid-${v.id}`}
                        video={v}
                        priority={index < 4}
                        showViews={true}
                    />
                ))}
            </div>
        </>
    );
}

// Memoize component to prevent unnecessary re-renders
export default memo(VideosLoop);
