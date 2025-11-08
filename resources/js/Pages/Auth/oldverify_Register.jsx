import React, { useEffect, useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage } from "@inertiajs/inertia-react";
import Front from "@/Layouts/Front";
import __ from "@/Functions/Translate";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";

export default function Register() {
    const routeName = route().current();
    const [verificationModalOpen, setVerificationModalOpen] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false); // New state for email verification

    // Initialize form data
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        category: "",
        is_streamer: routeName == "streamer.signup" ? "yes" : "no",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        is_mail_verified:isEmailVerified
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
        // Reset isEmailVerified if email changes
        if (event.target.name === "email") {
            setIsEmailVerified(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (!isEmailVerified) {
            toast("Please verify your email before registering.");
            return;
        }
        post(route("register"));
    };

    const { categories, flash } = usePage().props;

    useEffect(() => {
        if (flash?.message) {
            toast(flash.message);
        }

        if (Object.keys(errors).length !== 0) {
            Object.keys(errors).forEach((key) => {
                toast(errors[key]);
            });
        }
    }, [flash, errors]);

    const verifyEmail = () => {
        setIsVerifyingEmail(true);
        axios
            .post(route('send-email-verification'), { email: data.email })
            .then((response) => {
                toast("Verification email sent.");
                setVerificationModalOpen(true);
                setIsVerifyingEmail(false);
            })
            .catch((error) => {
                toast("Failed to send verification email.");
                setIsVerifyingEmail(false);
            });
    };

    const handleVerificationSubmit = () => {
        axios
            .post(route('verify-email-code'), { email: data.email, code: verificationCode })
            .then((response) => {
                if (response.data.status) {
                    toast("Email verified successfully!");
                    setIsEmailVerified(true); // Update the new state
                    setVerificationModalOpen(false); // Close modal
                } else {
                    toast("Invalid verification code.");
                }
            })
            .catch((error) => {
                toast("Error verifying the code.");
            });
    };

    return (
        <Front>
            <Head title={__("Register")} />

            <div className="flex items-center flex-col md:flex-row md:space-x-10 bg-white rounded-lg px-5 pb-6 dark:bg-zinc-900 shadow max-w-5xl mx-auto">
                <div className="flex-grow pt-10 w-full">
                    <form onSubmit={submit}>
                        <input type="hidden" name="is_streamer" value={data.is_streamer} />

                        <div className="mb-4">
                            <InputLabel forInput="username" value={__("Username")} />

                            <TextInput
                                name="username"
                                value={data.username}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                handleChange={onHandleChange}
                                isFocused={true}
                                required
                            />

                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        {/* Email Field and Verify Button */}
                        <div className="mt-4">
                            <InputLabel forInput="email" value={__("Email")} />
                            <div className="grid grid-cols-[1fr_auto] items-center">


                                <TextInput
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="email"
                                    handleChange={onHandleChange}
                                    required
                                />

                                {isEmailVerified ? (
                                    <FaCheck style={{"color": "green"}} />
                                ):(
                                    <PrimaryButton
                                        className="ml-2"
                                        onClick={verifyEmail}
                                        processing={isVerifyingEmail}
                                        disabled={isEmailVerified || isVerifyingEmail} // Disable button if email is verified or verifying
                                    >
                                        {isEmailVerified ? __("Verified") : __("Verify Email")}
                                    </PrimaryButton>
                                )}


                            </div>

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel forInput="password" value={__("Password")} />

                            <TextInput
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                handleChange={onHandleChange}
                                required
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel forInput="password_confirmation" value={__("Confirm Password")} />

                            <TextInput
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                handleChange={onHandleChange}
                                required
                            />

                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton className="ml-4" processing={processing}>
                                {__("Register")}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal for email verification */}
            {verificationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-[#f9f9f4] p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold text-center">
                            {__("Enter Verification Code")}
                        </h2>
                        <TextInput
                            type="text"
                            name="verification_code"
                            value={verificationCode}
                            className="mt-4 block w-full"
                            handleChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                        <PrimaryButton
                            className="mt-4 w-full"
                            onClick={handleVerificationSubmit}
                        >
                            {__("Verify")}
                        </PrimaryButton>
                    </div>
                </div>
            )}
        </Front>
    );
}
