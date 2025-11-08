import React, { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm, usePage } from "@inertiajs/inertia-react";
import Front from "@/Layouts/Front";
import __ from "@/Functions/Translate";
import { toast } from "react-toastify";

export default function Register() {
    const routeName = route().current();
    const queryParams = new URLSearchParams(window.location.search);
    const isAffiliate = queryParams.get("is_affiliate") === "1";

    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        category: "",
        is_streamer: routeName == "streamer.signup" ? "yes" : "no",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        is_affiliate: isAffiliate ? 1 : 0, // from URL
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

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

        post(route("register"));
    };

    const influencerIcon = "/images/streamer-icon.png";
    const userIcon = "/images/user-signup-icon.png";

    const { categories, flash } = usePage().props;

    useEffect(() => {
        if (flash?.message) {
            toast(flash.message);
        }

        if (Object.keys(errors).length !== 0) {
            Object.keys(errors).map((key, index) => {
                toast(errors[key]);
            });
        }
    }, [flash, errors]);

    return (
        <Front>
            <Head title={__("Register")} />
    
            <div className="flex items-center flex-col md:flex-row md:space-x-10 bg-white rounded-lg px-5 pb-6 dark:bg-zinc-500 shadow max-w-5xl mx-auto">
                {/* Left Side Image Section */}
                <div className="w-full md:w-1/3 text-center">
                    <img
                        src="/images/AdobeStock_409185702.jpeg" // Replace with your image path
                        alt="Register Illustration"
                        className="h-auto rounded-lg mx-auto"
                        style={{ maxWidth: '90%' }}
                    />
                </div>
    
                {/* Right Side Form Section */}
                <div className="flex-grow pt-10 w-full md:w-2/3">
                {routeName === "streamer.signup" ? (
                            <h2 className="text-lg font-bold text-center text-gray-700 dark:text-gray-300 mb-5">
                                Register as seller (Vendor, Studio). So register only if you want to sell your content
                            </h2>
                        ) : (
                            <h2 className="text-lg font-bold text-center text-gray-700 dark:text-gray-300 mb-5">
                                Register as Customer
                            </h2>
                        )}
                    <form onSubmit={submit}>
                        <input
                            type="hidden"
                            name="is_streamer"
                            value={data.is_streamer}
                        />
                        <input type="hidden" name="is_affiliate" value={data.is_affiliate} />
    
                        <div className="mb-4">
                            <InputLabel
                                forInput="username"
                                value={__("Username")}
                            />
    
                            <TextInput
                                name="username"
                                value={data.username}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                handleChange={onHandleChange}
                                isFocused={true}
                                required
                            />
    
                            <InputError
                                message={errors.username}
                                className="mt-2"
                            />
                        </div>
    
                        <div className="mt-4">
                            <InputLabel forInput="email" value={__("Email")} />
    
                            <TextInput
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                handleChange={onHandleChange}
                                required
                            />
    
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>
    
                        <div className="mt-4">
                            <InputLabel
                                forInput="password"
                                value={__("Password")}
                            />
    
                            <TextInput
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                handleChange={onHandleChange}
                                required
                            />
    
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>
    
                        <div className="mt-4">
                            <InputLabel
                                forInput="password_confirmation"
                                value={__("Confirm Password")}
                            />
    
                            <TextInput
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                handleChange={onHandleChange}
                                required
                            />
    
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>
    
                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton
                                className="ml-4"
                                processing={processing}
                            >
                                {__("Register")}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </Front>
    );
    
}