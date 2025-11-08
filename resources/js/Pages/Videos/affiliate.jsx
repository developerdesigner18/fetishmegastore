import __ from "@/Functions/Translate";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Head, Link, useForm, usePage } from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";
import TextInput from "@/Components/TextInput";
import AccountNavi from "../Channel/Partials/AccountNavi";

export default function VideosOrdered({ userLoginID }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const { auth, flash } = usePage().props;

    const activeTabClass =
        "text-xl font-bold mr-2 md:mr-4 text-indigo-800 dark:text-indigo-500 border-b-2 border-indigo-800";
    const inactiveTabClass =
        "text-xl font-bold mr-2 md:mr-4 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-500";

    const submitAffiliateCode = (e) => {
        e.preventDefault();
        const code = e.target.affiliate_code.value;

        setLoading(true);

        Inertia.post(
            route("affiliate.submit"),
            { affiliate_code: code },
            {
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={__("Purchased Videos")} />

            <div className="lg:flex lg:space-x-10">
                <AccountNavi active={"videos"} />

                <div className="ml-0 w-full">
                    {auth.user.is_streamer === "yes" && (
                        <div className="mb-5">
                            <Link href={route("videos.list")} className={inactiveTabClass}>
                                {__("Upload Videos")}
                            </Link>
                            <Link href={route("audio.list")} className={inactiveTabClass}>
                                {__("Upload Audio")}
                            </Link>
                            <Link href={route("videos.ordered")} className={activeTabClass}>
                                {__("Videos Ordered")}
                            </Link>
                            <Link href={route("audio.ordered")} className={inactiveTabClass}>
                                {__("Audio Ordered")}
                            </Link>
                            <Link href={route("preview.list")} className={inactiveTabClass}>
                                {__("Upload Preview")}
                            </Link>
                            <Link href={route("gallery.list")} className={inactiveTabClass}>
                                {__("Upload Gallery")}
                            </Link>
                            <Link href={route("model.list")} className={inactiveTabClass}>
                                {__("Upload Model")}
                            </Link>
                            <Link href={route("watchedVideos.list")} className={inactiveTabClass}>
                                {__("My Watched Video")}
                            </Link>
                            <Link href={route("affiliate")} className={activeTabClass}>
                                {__("Affiliate")}
                            </Link>
                        </div>
                    )}

                    <div className="p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg">
                        {/* Flash Messages */}
                        {flash.success && (
                            <div className="mb-4 px-4 py-2 rounded text-green-800 bg-green-100 border border-green-300">
                                {flash.success}
                            </div>
                        )}
                        {flash.error && (
                            <div className="mb-4 px-4 py-2 rounded text-red-800 bg-red-100 border border-red-300">
                                {flash.error}
                            </div>
                        )}

                        {/* Affiliate Code Form */}
                        <form onSubmit={submitAffiliateCode} className="mb-6">
                            <div className="flex items-center space-x-3">
                                <TextInput
                                    name="affiliate_code"
                                    placeholder={__("Enter Affiliate Code")}
                                    required
                                />
                                <PrimaryButton type="submit" disabled={loading}>
                                    {loading ? __("Applying...") : __("Apply Code")}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
