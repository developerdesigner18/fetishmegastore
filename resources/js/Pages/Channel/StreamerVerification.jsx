import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, useForm } from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import { HiIdentification } from "react-icons/hi/index.js";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Checkbox from "@/Components/Checkbox";

export default function StreamerVerification( terms, agreement, rules) {
    const { auth } = usePage().props;

    const { data, setData, errors, processing, post, progress } = useForm({
        address: null,
        taxinfo: null,
        phonenumber: null,
        otheremail: null,
        document: "",
        is_terms: false,
        is_agreement: false,
        is_rules: false,
    });

    useEffect(() => {
        console.log(errors);
    }, [errors]);

    const onHandleChange = (event) => {
        setData(
            event.target.name,
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("streamer.submitVerification"));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={__("Verify Identity To Start Streaming")} />

            <div className="ml-0">
                <div className="p-4 sm:p-8 bg-gray-100 dark:bg-zinc-900 dark:text-white shadow sm:rounded-lg">
                    <div className="flex items-center">
                        <div>
                            <HiIdentification className="h-12 w-12 mr-2" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {__("Verify Identity to Start Streaming")}
                            </h2>
                            <p className="dark:text-white text-sm">
                                {__(
                                    "In order to start streaming, you need to send your gov. issued ID/passport to verify the account name matches to the document."
                                )}
                            </p>
                            <p className="dark:text-white text-sm">
                                {__("Please upload image which contains both side of the proof.")}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="text-sm text-red-500">
                            {__("Attention: You may have accidentally created a 'Streamer' account. Please be aware that a 'Streamer' account is meant for vendors, sellers, studios, or models. If you are just a regular user, please go back and create a 'User' account. If you register a 'Streamer' account and do not provide a valid ID within 24 hours, your account will be removed.")}
                        </div>
                    </div>

                    <div className="mt-5">
                        <form onSubmit={submit}>
                            <div className="mt-4">
                            <InputLabel value={__("Document (PNG or JPG)")} />

                            <input
                                className="p-1 block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                id="document"
                                type="file"
                                required
                                accept="image/jpg,image/png,image/jpeg"
                                onChange={(e) =>
                                    setData("document", e.target.files[0])
                                }
                            />

                            <InputError
                                className="mt-2"
                                message={errors.document}
                            />
                            </div>

                            {/*<div className="mb-4 mt-4">*/}
                            {/*    <InputLabel forInput="address" value={__("Address (optional)")} />*/}
                            {/*    <TextInput*/}
                            {/*        name="address"*/}
                            {/*        value={data.address}*/}
                            {/*        className="mt-1 block w-full"*/}
                            {/*        autoComplete="address"*/}
                            {/*        handleChange={onHandleChange}*/}
                            {/*        isFocused={true}*/}
                            {/*    />*/}
                            {/*    <InputError message={errors.address} className="mt-2" />*/}
                            {/*</div>*/}


                            {/*<div className="mt-4">*/}
                            {/*    <InputLabel forInput="taxinfo" value={__("Tax Info (optional)")} />*/}
                            {/*    <TextInput*/}
                            {/*        name="taxinfo"*/}
                            {/*        value={data.taxinfo}*/}
                            {/*        className="mt-1 block w-full"*/}
                            {/*        autoComplete="taxinfo"*/}
                            {/*        handleChange={onHandleChange}*/}
                            {/*    />*/}
                            {/*    <InputError message={errors.taxinfo} className="mt-2" />*/}
                            {/*</div>*/}


                            {/*<div className="mt-4">*/}
                            {/*    <InputLabel forInput="phonenumber" value={__("Phone Number (optional)")} />*/}
                            {/*    <TextInput*/}
                            {/*        name="phonenumber"*/}
                            {/*        value={data.phonenumber}*/}
                            {/*        className="mt-1 block w-full"*/}
                            {/*        autoComplete="phonenumber"*/}
                            {/*        handleChange={onHandleChange}*/}
                            {/*    />*/}
                            {/*    <InputError message={errors.phonenumber} className="mt-2" />*/}
                            {/*</div>*/}


                            {/*<div className="mt-4">*/}
                            {/*    <InputLabel forInput="otheremail" value={__("Secondary Email (optional)")} />*/}
                            {/*    <TextInput*/}
                            {/*        name="otheremail"*/}
                            {/*        value={data.otheremail}*/}
                            {/*        className="mt-1 block w-full"*/}
                            {/*        autoComplete="phonenumber"*/}
                            {/*        handleChange={onHandleChange}*/}
                            {/*    />*/}
                            {/*    <InputError message={errors.otheremail} className="mt-2" />*/}
                            {/*</div>*/}


                            {/* Terms Checkbox */}
                            <div className="mt-4">
                                <Checkbox
                                    name="is_terms"
                                    checked={data.is_terms}
                                    handleChange={onHandleChange}
                                />
                                <span className="mx-2">
                                {__(' Agree to ')}
                                    <a href={terms} className="underline" target="_blank">
                                    {__('Terms and Conditions')}
                                </a>
                            </span>
                                <InputError message={errors.is_terms} className="mt-2" />
                            </div>

                            {/* Agreement Checkbox */}
                            <div className="mt-4">
                                <Checkbox
                                    name="is_agreement" // Corrected the spelling
                                    checked={data.is_agreement}
                                    handleChange={onHandleChange}
                                />
                                <span className="mx-2">
                                {__(' Agree to ')}
                                    <a href={agreement} className="underline" target="_blank">
                                    {__('Agreement')}
                                </a>
                            </span>
                                <InputError message={errors.is_agreement} className="mt-2" />
                            </div>

                            {/* Rules Checkbox */}
                            <div className="mt-4">
                                <Checkbox
                                    name="is_rules"
                                    checked={data.is_rules}
                                    handleChange={onHandleChange}
                                />
                                <span className="mx-2">
                                {__(' Agree to ')}
                                    <a href={rules} className="underline" target="_blank">
                                    {__('Rules')}
                                </a>
                            </span>
                                <InputError message={errors.is_rules} className="mt-2" />
                            </div>

                            <PrimaryButton
                                className="mt-5"
                                processing={processing}
                            >
                                {__("Submit Request")}
                            </PrimaryButton>
                        </form>

                        {progress && (
                            <progress value={progress.percentage} max="100">
                                {progress.percentage}%
                            </progress>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
