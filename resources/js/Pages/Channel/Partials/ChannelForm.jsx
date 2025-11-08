import React, { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/inertia-react";
import { Transition } from "@headlessui/react";
import __ from "@/Functions/Translate";
import Textarea from "@/Components/Textarea";
import { FaCog } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ChannelForm({ mustVerifyEmail, status, className }) {
    const user = usePage().props.auth.user;
    const { categories } = usePage().props;

    const [previewProfile, setPreviewProfile] = useState(user.profile_picture);
    const [previewCover, setPreviewCover] = useState(user.cover_picture);

    const {
        data,
        setData,
        errors,
        processing,
        recentlySuccessful,
        post,
        progress,
    } = useForm({
        username: user.username,
        about: user.about,
        // category: user.firstCategory.id,
        headline: user.headline,
        fb_link: user.meta?.fb_link,
        wb_link: user.meta?.wb_link,
        x_link: user.meta?.x_link,
        insta_link: user.meta?.insta_link,
        // paxum_email: user.meta?.paxum_email,
        telegram: user.meta?.telegram,
        skype: user.meta?.skype,
        address: user.address,
        taxinfo: user.taxinfo,
        phonenumber: user.phonenumber,
        otheremail: user.otheremail,
    });

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


        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to save setting?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, save it!",
            cancelButtonText: "No, cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                // If confirmed, proceed with the API call
                post(route("channel.update-settings"), {
                    preserveState: false,
                });

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    "Cancelled",
                    "Your setting has not been saved",
                    "error"
                );
            }
        });


    };

    const changeCover = (file) => {
        setData("coverPicture", file);
        setPreviewCover((window.URL ? URL : webkitURL).createObjectURL(file));
    };

    const changeProfilePicture = (file) => {
        setData("profilePicture", file);
        setPreviewProfile((window.URL ? URL : webkitURL).createObjectURL(file));
    };

    return (
        <section className={className}>
            <header>
                <div className="flex items-center">
                    <FaCog className="text-gray-600 dark:text-gray-100 mr-2" />
                    <h2 className="text-xl font-medium text-gray-600 dark:text-gray-100">
                        {__("Channel Settings")}
                    </h2>
                </div>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {__("Update your channel infos")}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel for="username" value={__("Username")} />

                    <TextInput
                        id="username"
                        className="mt-1 block w-full"
                        value={data.username}
                        handleChange={(e) =>
                            setData("username", e.target.value)
                        }
                        required
                        autofocus
                    />

                    <InputError className="mt-2" message={errors.username} />
                </div>

                {/*<div>*/}
                {/*    <InputLabel for="category" value={__("Category")} />*/}

                {/*    <select*/}
                {/*        name="category"*/}
                {/*        onChange={(e) => setData("category", e.target.value)}*/}
                {/*        className={`mt-1 block w-full border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm `}*/}
                {/*        defaultValue={data.category}*/}
                {/*    >*/}
                {/*        <option value={""}>{__("- Select -")}</option>*/}
                {/*        {categories.map((c, cIndex) => {*/}
                {/*            return (*/}
                {/*                <option value={c.id} key={c.id}>*/}
                {/*                    {c.category}*/}
                {/*                </option>*/}
                {/*            );*/}
                {/*        })}*/}
                {/*    </select>*/}

                {/*    <InputError className="mt-2" message={errors.category} />*/}
                {/*</div>*/}

                {/*<div>*/}
                {/*    <InputLabel for="paxum_email" value={__("Paxum Email")} />*/}

                {/*    <TextInput*/}
                {/*        id="paxum_email"*/}
                {/*        className="mt-1 block w-full"*/}
                {/*        value={data.paxum_email}*/}
                {/*        handleChange={(e) =>*/}
                {/*            setData("paxum_email", e.target.value)*/}
                {/*        }*/}
                {/*        autofocus*/}
                {/*    />*/}

                {/*    <InputError className="mt-2" message={errors.paxum_email} />*/}
                {/*</div>*/}

                <div>
                    <InputLabel
                        for="profilePicture"
                        value={__("Profile Picture - 80x80 recommended")}
                    />

                    <TextInput
                        className="p-1 block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                        id="profilePicture"
                        type="file"
                        handleChange={(e) =>
                            changeProfilePicture(e.target.files[0])
                        }
                    />

                    <InputError
                        className="mt-2"
                        message={errors.profilePicture}
                    />
                    <img
                        src={previewProfile}
                        alt="profile picture"
                        className="h-20 rounded-full mt-2 border-white border-2 dark:border-indigo-200"
                    />
                </div>

                <div>
                    <InputLabel
                        for="coverPicture"
                        value={__("Cover Picture - 960x280 recommended")}
                    />

                    <TextInput
                        className="p-1 block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                        id="coverPicture"
                        type="file"
                        handleChange={(e) => changeCover(e.target.files[0])}
                    />

                    <InputError
                        className="mt-2"
                        message={errors.coverPicture}
                    />

                    <div className="mt-3">
                        <img
                            src={previewCover}
                            alt="cover picture"
                            className="rounded-md border-2 border-white dark:border-indigo-200 h-40"
                        />
                    </div>
                </div>

                <div>
                    <InputLabel for="headline" value={__("Profile Headline")} />

                    <TextInput
                        id="headline"
                        className="mt-1 block w-full"
                        value={data.headline}
                        handleChange={(e) =>
                            setData("headline", e.target.value)
                        }
                        required
                        autofocus
                    />

                    <InputError className="mt-2" message={errors.headline} />
                </div>

                <div>
                    <InputLabel for="wb_link" value={__("Website Link")} />

                    <TextInput
                        id="wb_link"
                        className="mt-1 block w-full"
                        value={data.wb_link}
                        handleChange={(e) =>
                            setData("wb_link", e.target.value)
                        }
                        autofocus
                    />

                    <InputError className="mt-2" message={errors.wb_link} />
                </div>

                <div>
                    <InputLabel for="fb_link" value={__("Facebook Link")} />

                    <TextInput
                        id="fb_link"
                        className="mt-1 block w-full"
                        value={data.fb_link}
                        handleChange={(e) =>
                            setData("fb_link", e.target.value)
                        }
                        autofocus
                    />

                    <InputError className="mt-2" message={errors.fb_link} />
                </div>
                <div>
                    <InputLabel for="x_link" value={__("X Link")} />

                    <TextInput
                        id="x_link"
                        className="mt-1 block w-full"
                        value={data.x_link}
                        handleChange={(e) =>
                            setData("x_link", e.target.value)
                        }
                        autofocus
                    />

                    <InputError className="mt-2" message={errors.x_link} />
                </div>
                <div>
                    <InputLabel for="insta_link" value={__("Instagram Link")} />

                    <TextInput
                        id="insta_link"
                        className="mt-1 block w-full"
                        value={data.insta_link}
                        handleChange={(e) =>
                            setData("insta_link", e.target.value)
                        }
                        autofocus
                    />

                    <InputError className="mt-2" message={errors.insta_link} />
                </div>

                <div>
                <InputLabel for="telegram" value={__("Telegram")} />

                    <TextInput
                        id="telegram"
                        className="mt-1 block w-full"
                        value={data.telegram}
                        handleChange={(e) =>
                            setData("telegram", e.target.value)
                        }
                        autofocus
                    />

                    <InputError className="mt-2" message={errors.telegram} />
                </div>

                <div>
                <InputLabel for="skype" value={__("Skype")} />

                    <TextInput
                        id="skype"
                        className="mt-1 block w-full"
                        value={data.skype}
                        handleChange={(e) =>
                            setData("skype", e.target.value)
                        }
                        autofocus
                    />

                    <InputError className="mt-2" message={errors.skype} />
                </div>

                <div className="mb-4 mt-4">
                    <InputLabel forInput="address" value={__("Address (optional)")} />
                    <TextInput
                        name="address"
                        value={data.address}
                        className="mt-1 block w-full"
                        autoComplete="address"
                        handleChange={onHandleChange}
                        isFocused={true}
                    />
                    <InputError message={errors.address} className="mt-2" />
                </div>


                <div className="mt-4">
                    <InputLabel forInput="taxinfo" value={__("Tax Info (optional)")} />
                    <TextInput
                        name="taxinfo"
                        value={data.taxinfo}
                        className="mt-1 block w-full"
                        autoComplete="taxinfo"
                        handleChange={onHandleChange}
                    />
                    <InputError message={errors.taxinfo} className="mt-2" />
                </div>


                <div className="mt-4">
                    <InputLabel forInput="phonenumber" value={__("Phone Number (optional)")} />
                    <TextInput
                        name="phonenumber"
                        value={data.phonenumber}
                        className="mt-1 block w-full"
                        autoComplete="phonenumber"
                        handleChange={onHandleChange}
                    />
                    <InputError message={errors.phonenumber} className="mt-2" />
                </div>


                <div className="mt-4">
                    <InputLabel forInput="otheremail" value={__("Secondary Email (optional)")} />
                    <TextInput
                        name="otheremail"
                        value={data.otheremail}
                        className="mt-1 block w-full"
                        autoComplete="phonenumber"
                        handleChange={onHandleChange}
                    />
                    <InputError message={errors.otheremail} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        for="about"
                        value={__("Channel About - html <img /> tag allowed")}
                    />
                    <Textarea
                        id="about"
                        className="mt-1 block w-full"
                        value={data.about ? data.about : ""}
                        handleChange={(e) => setData("about", e.target.value)}
                    />
                    <div className="bg-zinc-300 dark:bg-zinc-800 dark:text-gray-200 rounded p-2 text-xs mt-2">
                        <strong className="font-bold">
                            Allowed HTML Tags:{" "}
                        </strong>
                        img, h3, h4, h5, h6, blockquote, p, a,
                        ul,ol,nl,li,b,i,strong,em,
                        strike,code,hr,br,div,table,thead,
                        caption,tbody,tr,th,td,pre'
                    </div>

                    <InputError className="mt-2" message={errors.about} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton processing={processing}>
                        {__("Save")}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {__("Saved")}.
                        </p>
                    </Transition>
                </div>

                {progress && (
                    <progress value={progress.percentage} max="100">
                        {progress.percentage}%
                    </progress>
                )}
            </form>
        </section>
    );
}