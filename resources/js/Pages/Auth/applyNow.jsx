import React, { useEffect } from "react";
import { Link, Head, usePage } from "@inertiajs/inertia-react";
import Front from "@/Layouts/Front";
import __ from "@/Functions/Translate";
import { toast } from "react-toastify";

export default function Signup({ props,logoIcon,pillowImage,streamerIcon }) {
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
                    {__("Start Earning Today!")}
                </h2>
                {/*<p className="text-center mb-8 text-xl text-gray-600 dark:text-zinc-200 mt-1">*/}
                {/*    {__(*/}
                {/*        "We are welcoming both streamers and users to our platform to get connected to each other."*/}
                {/*    )}*/}
                {/*</p>*/}

                <p className="dark:text-zinc-200">
                    {__("Fetishmegastore is a premium video marketplace and the best location for content resellers to host and sell their digital goods such as video clips, pictures, audio recording, messages and documents. \n" +
                        "No matter if you are a solo model performer or a studio. Fetishmegastore is here for all kind of authorized content producers. Open a channel as streamer and monetize your content still today!")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-6">
                    <div className="col text-center">
                        <Link href={route("register")}>
                            <img
                                src={pillowImage}
                                alt=""
                                className="max-h-96 mx-auto"
                            />
                        </Link>
                        <Link
                            href={route("streamer.signup")}
                            className="bg-indigo-700 inline-block mt-5 text-white font-bold py-2 px-6 rounded hover:bg-indigo-600 dark:text-zinc-200"
                        >
                            {__("Apply Now!")}
                        </Link>
                    </div>

                    <div className="col text-left">
                        <h2 className="text-xl font-semibold mb-4 dark:text-zinc-200">{__("Features")}</h2>
                        <ul className="list-disc pl-5 space-y-3 dark:text-zinc-200">
                            <li className="dark:text-zinc-200">{__("View detailed transaction history and generate real financial reports!")}</li>
                            <li className="dark:text-zinc-200">{__("Sell unlimited digital content: videos, photos, MP3s, PDFs, etc. - In your Artist Account!")}</li>
                            <li className="dark:text-zinc-200">{__("Pay-to-view messaging. Charge fans to open messages through our site - set your own prices!")}</li>
                            <li className="dark:text-zinc-200">{__("View detailed transaction history and generate real financial reports!")}</li>
                            <li className="dark:text-zinc-200">{__("Built-in promotional tools to help you build traffic & sales!")}</li>
                            <li className="dark:text-zinc-200">{__("24/7 customer and technical support via email")}</li>
                            <li className="dark:text-zinc-200">{__("Remote your wish lists from any site!")}</li>
                            <li className="dark:text-zinc-200">{__("Fast & Easy FTP system!")}</li>
                            <li className="dark:text-zinc-200">{__("Tutorials on how the site works!")}</li>
                            <li className="dark:text-zinc-200">{__("Payout whenever you want!")}</li>
                        </ul>
                    </div>
                </div>

            </div>
        </Front>
    );
}
