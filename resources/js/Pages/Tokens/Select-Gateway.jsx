import React, {useEffect} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, Link, usePage, useForm} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import {MdGeneratingTokens} from "react-icons/md/index.js";
import {Inertia} from "@inertiajs/inertia";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function SelectGateway({
                                          auth,
                                          tokenPack,
                                          paypalEnabled,
                                          stripeEnabled,
                                          bankEnabled,
                                          ccbillEnabled,
                                          paypalImg,
                                          ccbillImg,
                                          stripeImg,
                                          bankImg,
                                          bitImg,
                                      }) {
    const {data, setData, post, processing, errors, reset} = useForm({
        voucher_type: "",
        code: "",
        selected_token: tokenPack.id
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

        post(route("submit.voucher"));
    };

    const {currency_symbol, currency_code} = usePage().props;
    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={__("Select Gateway - Purchase Tokens")}/>

            <div className="p-4 sm:p-8 bg-white max-w-3xl mx-auto dark:bg-zinc-900 shadow sm:rounded-lg">
                <h3 className="text-3xl font-semibold dark:text-white text-center">
                    {__("Select Payment Gateway")}
                </h3>

                <h3 className="mt-5 text-2xl font-semibold dark:text-white text-center">
                    {__(
                        "You are purchasing :tokensAmount tokens for :moneyAmount",
                        {
                            tokensAmount: tokenPack.tokensFormatted,
                            moneyAmount: `${currency_symbol}${tokenPack.price}`,
                        }
                    )}
                </h3>


                <div className="mt-10 flex items-center justify-center flex-col space-y-5">
                    
                    <div className="flex space-x-5">
                        
                        <div>
                            <span className="text-center text-gray-700 font-bold dark:text-white text-lg">
                                {__("Pay via Crypto")}
                            </span>
                            <Link
                                href={route("crypto.purchaseTokens", {
                                    tokenPack: tokenPack.id,
                                })}
                            >
                                <img
                                    src={bitImg}
                                    alt="crypto"
                                    className="h-24 mx-auto"
                                />
                            </Link>
                        </div>
                        
                        <div>
                        <span className="block text-center text-gray-700 font-bold dark:text-white text-lg">
                            {__("Pay via PayPal")}
                        </span>
                            {paypalEnabled == "Yes" && (
                                <Link
                                    href={route("paypal.purchaseTokens", {
                                        tokenPack: tokenPack.id,
                                    })}
                                >
                                    <img
                                        src={paypalImg}
                                        alt="paypal"
                                        className="h-24 mx-auto"
                                    />
                                </Link>
                            )}
                        </div>
                        {stripeEnabled == "Yes" && (
                            <div>
                            <span className="block text-center mb-3 text-gray-700 font-bold dark:text-white text-lg">
                                {__("Credit Card (Stripe)")}
                            </span>
                                <Link
                                    href={route("stripe.purchaseTokens", {
                                        tokenPack: tokenPack.id,
                                    })}
                                >
                                    <img
                                        src={stripeImg}
                                        alt="stripe"
                                        className="h-14 mx-auto"
                                    />
                                </Link>
                            </div>
                        )}
                        {ccbillEnabled == "Yes" && (
                            <div className="pt-5">
                            <span className="block text-center text-gray-700 font-bold dark:text-white text-lg">
                                {__("CCBill (Credit Card)")}
                            </span>
                                <a
                                    href={route("ccbill.purchaseTokens", {
                                        tokenPack: tokenPack.id,
                                    })}
                                >
                                    <img
                                        src={ccbillImg}
                                        alt="stripe"
                                        className="h-14 mx-auto"
                                    />
                                </a>
                            </div>
                        )}
                        {bankEnabled == "Yes" && (
                            <div className="mt-10">
                            <span className="block text-center text-gray-700 font-bold dark:text-white text-lg">
                                {__("Pay via Bank Transfer")}
                            </span>
                                <Link
                                    href={route("bank.purchaseTokens", {
                                        tokenPack: tokenPack.id,
                                    })}
                                >
                                    <img
                                        src={bankImg}
                                        alt="stripe"
                                        className="h-14 mx-auto"
                                    />
                                </Link>
                            </div>
                        )}

                    </div>

                    <div className="flex space-x-5">
                        {/*<div className="hidden lg:block  mt-10">*/}
                        {/*    <span*/}
                        {/*        className="text-center text-gray-700 font-bold dark:text-white text-lg">*/}
                        {/*        {__("Pay via Crypto")}*/}
                        {/*    </span>*/}
                        {/*    <Link*/}
                        {/*        href={route("crypto.purchaseTokens", {*/}
                        {/*            tokenPack: tokenPack.id,*/}
                        {/*        })}*/}
                        {/*    >*/}
                        {/*        <img*/}
                        {/*            src={bitImg}*/}
                        {/*            alt="crypto"*/}
                        {/*            className="h-14 mx-auto"*/}
                        {/*        />*/}
                        {/*    </Link>*/}
                        {/*</div>*/}
                        <div>
                            <form onSubmit={submit}>
                                <span className="block text-center text-gray-700 font-bold dark:text-white text-lg">
                                    {__("Voucher Code?")}
                                </span>
                                <div className="mt-4">
                                    <InputLabel
                                        forInput="voucher_type"
                                        value={__("Voucher Type")}
                                    />
                                    <select
                                        name="voucher_type"
                                        onChange={(e) => onHandleChange(e)}
                                        required
                                        className={`mt-1 block w-full border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm `}
                                    >
                                        <option value={""}>
                                            {__("- Select -")}
                                        </option>
                                        <option value={"AMAZON"}>
                                            {__('AMAZONE VOUCHER')}
                                        </option>
                                        {/*<option value={"PAYSAFE"}>*/}
                                        {/*    {__("PAYSAFE")}*/}
                                        {/*</option>*/}
                                    </select>

                                    <InputError
                                        message={errors.category}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="mt-4">
                                    <InputLabel
                                        forInput="code"
                                        value={__("Code")}
                                    />

                                    <TextInput
                                        name="code"
                                        value={data.code}
                                        className="mt-1 block w-full"
                                        autoComplete="code"
                                        handleChange={onHandleChange}
                                        isFocused={true}
                                        required
                                    />

                                    <InputError
                                        message={errors.username}
                                        className="mt-2"
                                    />
                                </div>


                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton
                                        className="ml-4"
                                        processing={processing}
                                    >
                                        {__("Submit")}
                                    </PrimaryButton>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>


            </div>
        </AuthenticatedLayout>
    );
}
