import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import Textarea from "@/Components/Textarea";
import PrimaryButton from "@/Components/PrimaryButton";
import __ from "@/Functions/Translate";
import { toast } from "react-toastify";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, useForm, Head, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/Components/Spinner";
import { MdGeneratingTokens, MdOutlineAccountBalanceWallet } from "react-icons/md/index.js";

export default function Unlock({ ebook }) {
    const { props } = usePage();
    const auth = props.auth;

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!auth || !auth.user) {
            Inertia.visit(route('login'));
        }
    }, [auth]);

    if (!auth || !auth.user) {
        return <Spinner />;
    }

    const confirmPurchase = (e) => {
        e.preventDefault();

        console.log("Ebook to purchase:", ebook);

        Inertia.visit(
            route("ebook.purchase", {
                ebook: ebook.id,
            }),
            {
                method: "POST",
                onBefore: (visit) => {
                    setProcessing(true);
                },
                onFinish: (visit) => {
                    setProcessing(false);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head
                title={__("Unlock ebook: :ebookTitle", {
                    ebookTitle: ebook.title_en,
                })}
            />

            <div className="ml-0">
                <div className="p-4 sm:p-8 bg-gray-100 dark:bg-zinc-900 shadow sm:rounded-lg">
                    <header>
                        <div className="justify-center flex items-center space-x-2 flex-wrap">
                            <div>
                                <Link
                                    href={route("channel", {
                                        user: ebook.streamer.username,
                                    })}
                                >
                                    <img
                                        src={ebook.streamer.profile_picture}
                                        alt={ebook.streamer.username}
                                        className="rounded-full h-14 border-zinc-200 dark:border-indigo-200 border"
                                    />
                                </Link>
                            </div>
                            <div>
                                <Link
                                    href={route("channel", {
                                        user: ebook.streamer.username,
                                    })}
                                >
                                    <h2 className="text-center text-2xl font-medium text-gray-800 dark:text-gray-100">
                                        {__("Unlock :ebookTitle", {
                                            ebookTitle: ebook.title_en,
                                        })}
                                    </h2>
                                </Link>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center">
                                    {__("Confirm your purchase")}
                                </p>
                            </div>
                        </div>
                    </header>

                    <div className="border-t pt-5 text-xl text-center font-light mt-8 dark:text-white">
                        <p className="bg-white shadow text-gray-800 font-semibold inline-flex rounded-lg p-2">
                            <MdGeneratingTokens className="h-6 w-6" />{" "}
                            {__("Price: :price tokens", { price: ebook.price })}
                        </p>
                        <br />
                        <p className="mt-3 bg-white shadow text-gray-800 text-sm font-semibold inline-flex rounded-lg p-2">
                            {" "}
                            <MdOutlineAccountBalanceWallet className="w-4 h-4" />{" "}
                            {__("Your Balance: :userBalance tokens", {
                                userBalance: auth.user.tokens,
                            })}
                        </p>

                        <div className="mt-5 border-t pt-5">
                            {ebook.price <= auth.user.tokens ? (
                                <>
                                    <button
                                        onClick={(e) => confirmPurchase(e)}
                                        className="py-2 px-3 mt-2 mb-3 inline-flex rounded-md items-center bg-pink-500 text-white font-semibold hover:bg-pink-600 disabled:bg-gray-300 disabled:text-gray-700"
                                        disabled={processing}
                                    >
                                        <MdGeneratingTokens className="h-6 w-6 mr-2" />
                                        <div>{__("Purchase ebook")}</div>
                                    </button>
                                    <br />
                                    {processing && (
                                        <center>
                                            <Spinner />
                                        </center>
                                    )}
                                </>
                            ) : (
                                <div className="text-gray-700 dark:text-white text-base">
                                    {__(
                                        "You need to charge your token balance to be able to unlock this ebook"
                                    )}
                                    <br />
                                    <Link
                                        href={route("token.packages")}
                                        className="py-1.5 px-3 mt-2 inline-flex border-2 rounded-md hover:border-gray-700 hover:text-gray-700 items-center border-indigo-600 text-indigo-600 dark:border-white dark:hover:border-indigo-200 dark:hover:text-indigo-200"
                                    >
                                        <MdGeneratingTokens className="h-6 w-6 mr-2" />
                                        <div>{__("Token Packages")}</div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}