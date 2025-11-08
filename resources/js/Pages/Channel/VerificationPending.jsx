import React, {useEffect} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, useForm, usePage, Link} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import {HiIdentification} from "react-icons/hi/index.js";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import {toast} from 'react-toastify';

export default function StreamerVerification({terms, agreement, rules, user}) {
    const {auth} = usePage().props;


    const {flash} = usePage().props;

    useEffect(() => {
        if (flash?.message) {
            toast(flash.message);
        }

        // if (Object.keys(errors).length !== 0) {
        //     Object.keys(errors).forEach((key) => {
        //         toast(errors[key]);
        //     });
        // }
    }, [flash]);


    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={__("Pending Verification")}/>

            <div className="ml-0">
                <div className="p-4 sm:p-8 bg-gray-100 dark:bg-zinc-900 dark:text-white shadow sm:rounded-lg">
                    <div className="flex items-center mb-4">
                        <div>
                            <HiIdentification className="h-12 w-12 mr-2"/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                {__("Pending Verification")}
                            </h2>
                        </div>
                    </div>
                    <p className="dark:text-white text-lg mb-4">
                        {__("We have received your identity verification request and will analyze it as soon as possible.")}
                    </p>
                    <p className="dark:text-white text-lg mb-4">
                        {__("While we review your account, here are a few things you can do to get started:")}
                    </p>
                    <ul className="list-disc pl-5 text-gray-900 dark:text-gray-100 mb-4">
                        <li>{__("Add a profile picture.")}</li>
                        <li>{__("Fill out your bio.")}</li>
                        <li>{__("Customize your preferences.")}</li>
                        <li>{__("Upload a minimum of two videos.")}</li>
                    </ul>
                    <p className="dark:text-white text-lg mb-4">
                        {__("Please note: Your videos won’t appear on the site until your account is approved.")}
                    </p>
                    <div className="mt-4">
                        <Link
                            href={route("channel.settings")}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            {__("Go to Profile Setup")}
                        </Link>
                    </div>

                    <div className="mt-4">
                        <Link
                            href={route("videos.list")}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            {__("Go to Video Manager")}
                        </Link>
                    </div>

                    <div className="mt-4">
                        <Link
                            href={route("preview.list")}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        >
                            {__("Go to Preview Manager")}
                        </Link>
                    </div>

                    <div className="mt-4">
                        <Link
                            href={route("gallery.list")}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                        >
                            {__("Go to Gallery Manager")}
                        </Link>
                    </div>
                    <p className="dark:text-white text-lg mt-4">
                        {__("Thank you for your patience!")}
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>

    );
}
