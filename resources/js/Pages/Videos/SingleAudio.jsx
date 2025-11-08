import React, { useEffect, useRef , useState}  from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// const { getVideoDurationInSeconds } = require('get-video-duration');
import { Head, Link } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import { BsTagFill, BsFillTagsFill } from "react-icons/bs/index.js";
import { AiOutlineEye } from "react-icons/ai/index.js";
import { FcUnlock } from "react-icons/fc/index.js";
import PrimaryButton from "@/Components/PrimaryButton";
import { MdGeneratingTokens } from "react-icons/md/index.js";
import axios from "axios";
import { FaGrinStars } from "react-icons/fa/index.js";
import { Inertia } from "@inertiajs/inertia";

const AudioComponent = ({ audio, inModal }) => {

    // const videoRef = useRef(null);
    const [duration, setDuration] = useState()

    // useEffect(() => {
    //     getVideoDurationInSeconds(
    //         "https://fetishmegastore.com/videos/DETECTIVECONAN.mp4"
    //     ).then((duration) => {
    //         setDuration(video.duration)
    //         console.log('duration',duration)
    //     })
    // }, []);

    // useEffect(() => {
    //     const video = videoRef.current;
    //     if (video) {
    //         video.addEventListener('loadedmetadata', () => {
    //             console.log(`The duration of the video is ${video.duration} seconds.`);
    //             setDuration(video.duration)
    //         });
    //
    //         // Trigger a load event for the video element whenever there's a new URL
    //         video.load();
    //     }
    // }, [video.videoUrl]);

    
    const increaseViews = () => {
        axios.post(route("video.increaseViews", { audio: audio.id }));
    };
    return (
        <div className={`justify-center w-full ${inModal ? "p-3" : "p-0"}`}>
            <div className="flex items-start">
                <div className="mr-5 flex flex-col items-center flex-shrink-0">
                    <Link
                        href={route("channel", {
                            user: audio.streamer.username,
                        })}
                    >
                        <img
                            src={audio.streamer.profile_picture}
                            className="w-14 h-14 rounded-full"
                        />
                    </Link>
                </div>
                <div>
                    <h3 className="text-lg md:text-2xl font-light text-gray-600 dark:text-white">
                        {audio.title}
                    </h3>

                    <div className="flex items-center flex-wrap md:space-x-2 mt-1">
                        <Link
                            href={route("channel", {
                                user: audio.streamer.username,
                            })}
                            className="text-sm text-gray-600 mr-2  dark:text-white"
                        >
                            @{audio.streamer.username}
                        </Link>

                        {audio.selectedCategory?.map((category,index) => (
                            <Link
                                href={route("audio.browse", {
                                    videocategory: category.value,
                                    slug: `-${category.label}`,
                                })}
                                className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                            >
                                <BsTagFill className="w-3" />
                                <span>{category.label}</span>
                            </Link>
                        ))}

                        
                            <BsFillTagsFill className="w-3" />
                            <span>
                                {audio?.tags?.map((tag,index) => (
                               <Link
                               href={route("tag.videos", {
                                id: tag.id
                               ,
                            })}
                               className="text-gray-600 mr-2  inline-flex items-center space-x-1 dark:text-zinc-100 text-sm"
                           > <span>{tag} {index !== audio.tags.length - 1 && ', '}</span> 
                           </Link>
                                ))}
                            </span>
                       

                        {/*<span className="text-gray-600 inline-flex items-center space-x-1 dark:text-zinc-100 text-sm mr-2   ">*/}
                        {/*    <AiOutlineEye className="w-5 h-5 mr-1" />*/}
                        {/*    {video.views === 1*/}
                        {/*        ? __("1 view")*/}
                        {/*        : __(":viewsCount views", {*/}
                        {/*              viewsCount: video.views,*/}
                        {/*          })}*/}
                        {/*</span>*/}

                        {audio.free_for_subs === "yes" && audio.price !== 0 && (
                            <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                <FaGrinStars className="w-4 h-4 mr-1" />
                                {__("Free For Subscribers")}
                            </div>
                        )}

                        {audio.isCurrentSubscriber || audio.canBePlayed &&(
                            <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                                <a href={audio.audioUrl} download>{__("Download")}</a>
                            </div>
                        )}

                        <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                            <span> {__("Duration ")} : {audio.duration.minute}</span>
                        </div>

                        <div className="mt-1 md:mt-0 inline-flex items-center text-sm bg-gray-100 rounded px-2 py-1 text-gray-500 dark:text-gray-600">
                            <span> {__("Resolution ")} : {audio.duration.resolution}</span>
                        </div>

                    </div>
                </div>
            </div>

            <div className="mt-5">
                {audio.canBePlayed ? (
                    <audio
                        className="w-full aspect-video"
                        controls
                        disablePictureInPicture
                        controlsList="nodownload"
                        onPlay={(e) => increaseViews()}
                    >
                        <source src={`${audio.audioUrl}#t`} type="audio/mp3" />
                    </audio>
                ) : (
                    <div className="flex flex-col items-center  md:flex-row space-y-5 md:space-y-0 md:space-x-5">
                        <div className="relative">
                            <img
                                src={audio.thumbnail}
                                alt=""
                                className="rounded-lg w-full"
                            />

                            <div className="absolute top-0 left-0 text-center bg-gray-700 w-full h-full bg-opacity-25 rounded-lg ">
                                <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center">
                                    <div className="w-full">
                                        <div className="bg-white inline-flex bg-opacity-25 rounded-full p-2">
                                            <FcUnlock className="w-12 h-12" />
                                        </div>
                                    </div>

                                    <div>
                                        <PrimaryButton
                                            className="h-12 mt-5 inline-flex"
                                            onClick={(e) =>
                                                Inertia.visit(
                                                    route("audio.unlock", {
                                                        audio: audio.id,
                                                    })
                                                )
                                            }
                                        >
                                            <MdGeneratingTokens className="mr-2 w-6 h-6 md:w-8 md:h-8" />
                                            {__("Unlock with :tokens tokens", {
                                                tokens: audio.price,
                                            })}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-5">
                {audio.description ? audio.description : ''}
            </div>

        </div>
    );
};

export default function SingleAudio({ audio, inModal = false }) {
    if (inModal) {
        return <AudioComponent audio={audio} inModal={true} />;
    } else {
        return (
            <AuthenticatedLayout>
                <Head title={audio.title} />
                <AudioComponent audio={audio} inModal={false} />
            </AuthenticatedLayout>
        );
    }
}
