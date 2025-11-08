import React, { useEffect } from "react";
import { Link, Head, usePage } from "@inertiajs/inertia-react";
import Front from "@/Layouts/Front";
import __ from "@/Functions/Translate";
import { toast } from "react-toastify";

export default function Signup({ props,logoIcon,streamerIcon }) {
    const influencerIcon = "/images/streamer-icon.png";
    const userIcon = "/images/user-signup-icon.png";

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.message) {
            toast(flash.message);
        }
    }, [flash]);

    return (
        <Front>
            <div className="bg-white mx-auto dark:bg-zinc-900 rounded-lg shadow py-5 max-w-5xl text-center">
                <h2 className="text-3xl text-gray-600 dark:text-zinc-200 font-semibold text-center">
                    {__("Join Our Platform")}
                </h2>
                <p>
                    {__("Sign up now and enjoy:\n" +
                        "                        Exclusive videos: Access a vast library of high-quality content.\n" +
                        "                        Fresh updates: New videos added regularly to keep things exciting.\n" +
                        "                        Personalized experience: Tailored recommendations just for you.\n" +
                        "Join our community and indulge in the ultimate adult entertainment experience.")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-2">
                    {/*<div className="col text-center">*/}
                    {/*    <Link href={route("streamer.signup")}>*/}
                    {/*        <img*/}
                    {/*            src={streamerIcon}*/}
                    {/*            alt=""*/}
                    {/*            className="max-h-96 mx-auto"*/}
                    {/*        />*/}
                    {/*    </Link>*/}
                    {/*    <Link*/}
                    {/*        href={route("streamer.signup")}*/}
                    {/*        className="bg-pink-600  text-white font-bold py-2 px-4 rounded mb-4 hover:bg-pink-500 mt-5 inline-block"*/}
                    {/*    >*/}
                    {/*        {__("Regiater as channel streamer")}*/}
                    {/*    </Link>*/}
                    {/*</div>*/}
                    <div className="col text-center">
                        <Link href={route("register")}>
                            <img
                                // src={userIcon}
                                src={logoIcon}
                                alt=""
                                className="max-h-96 mx-auto"
                            />
                        </Link>
                        <Link
                            href={route("register")}
                            className="bg-indigo-700 inline-block mt-5 text-white font-bold py-2 px-4 rounded mb-4 hover:bg-indigo-600"
                        >
                            {__("Register as user")}
                        </Link>
                    </div>
                    {/* <div className="col text-center">
                        <Link href={route("streamer.signup")}>
                            <img
                                src="/images/AdobeStock_409185702.jpeg"
                                //src={logoIcon}
                                alt=""
                                className="max-h-96 mx-auto"
                            />
                        </Link>
                        <Link
                            href={route("streamer.signup")}
                            className="bg-indigo-700 inline-block mt-5 text-white font-bold py-2 px-4 rounded mb-4 hover:bg-indigo-600"
                        >
                            {__("Register as channel streamer")}
                        </Link>
                    </div> */}
                </div>
            </div>
        </Front>
    );
}
