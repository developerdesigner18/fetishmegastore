import __ from "@/Functions/Translate";
import { Link, Head, usePage } from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    MdGeneratingTokens,
    MdOutlineAccountBalanceWallet,
} from "react-icons/md/index.js";
import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import Spinner from "@/Components/Spinner";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentModal = ({ isOpen, closeModal, userName }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        try {
            const { data } = await axios.post('/payment/setup-intent');
            const clientSecret = data.clientSecret;

            const cardElement = elements.getElement(CardElement);
            const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { name: userName },
                },
            });

            if (error) {
                setErrorMessage(error.message);
                setProcessing(false);
            } else {
                await axios.post('/payment/save-payment-method', {
                    payment_method: setupIntent.payment_method,
                });
                closeModal(); // Close modal on success
                window.location.reload(true);
            }
        } catch (error) {
            setErrorMessage("An error occurred, please try again.");
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 md:p-8 relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">{__('Connect Your Card')}</h2>
                    <button
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={closeModal}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-4 bg-gray-50 border border-gray-300 rounded-md">
                        <CardElement className="p-3" />
                    </div>
                    {errorMessage && (
                        <div className="text-red-500 text-sm mt-2">
                            {errorMessage}
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            type="submit"
                            className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all ${processing ? 'opacity-75' : ''}`}
                            disabled={!stripe || processing}
                        >
                            {processing ? "Processing..." : "Save Card"}
                        </button>
                    </div>
                </form>

                <button
                    className="w-full mt-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md transition-all"
                    onClick={closeModal}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default function Subscribe({ channel, tier, publicKey, tokenPack, paypalImg, paymentMethod, isPaypal }) {
    const stripePromise = loadStripe(publicKey);

    const { auth } = usePage().props;

    const [plan, setPlan] = useState("Monthly");
    const [showPrice, setShowPrice] = useState(tier.price);
    const [processing, setProcessing] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false); // Modal state

    const updatePlan = (plan) => {
        setPlan(plan);

        switch (plan) {
            case "6 Months":
                setShowPrice(tier.SixMonthsPrice);
                break;
            case "Monthly":
                setShowPrice(tier.price);
                break;
            case "Yearly":
                setShowPrice(tier.YearlyPrice);
                break;
        }
    };

    const confirmSubscription = (e) => {
        e.preventDefault();

        Inertia.visit(
            route("confirm-subscription", {
                user: channel.id,
                tier: tier.id,
                plan: plan,
            }),
            {
                onBefore: (visit) => {
                    setProcessing(true);
                },
                onFinish: (visit) => {
                    setProcessing(false);
                },
            }
        );
    };

    const confirmPaypalSubscription = (e) => {
        e.preventDefault();

        Inertia.visit(
            route("paypal.purchaseSubscription", {
                user: channel.id,
                tier: tier.id,
                plan: plan,
            }),
            {
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
                title={__("Subscribe to :channel", {
                    channel: channel.username,
                })}
            />

            <div className="ml-0">
                <div className="p-4 sm:p-8 bg-gray-100 dark:bg-zinc-900 shadow sm:rounded-lg">
                    <header>
                        <div className="justify-center flex items-center space-x-2 flex-wrap">
                            <div>
                                <Link
                                    href={route("channel", {
                                        user: channel.username,
                                    })}
                                >
                                    <img
                                        src={channel.profile_picture}
                                        alt=""
                                        className="rounded-full h-14 border-zinc-200 dark:border-indigo-200 border"
                                    />
                                </Link>
                            </div>
                            <div>
                                <Link
                                    href={route("channel", {
                                        user: channel.username,
                                    })}
                                >
                                    <h2 className="text-center text-2xl font-medium text-gray-800 dark:text-gray-100">
                                        {__("Subscribe to @:channel", {
                                            channel: channel.username,
                                        })}
                                    </h2>
                                </Link>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center">
                                    {__("Select subscription length & payment method")}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:justify-around items-center mt-10 space-y-5 md:space-y-0">
                            <button
                                onClick={(e) => updatePlan("6 Months")}
                                className={`relative w-52 rounded-lg p-3 shadow ${plan === "6 Months" ? "bg-indigo-600 text-white" : "bg-white text-gray-800"}`}
                            >
                                <div className="absolute inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold text-white bg-pink-500 rounded-full -top-2 right-0">
                                    {__(":discount% OFF", { discount: tier.six_months_discount })}
                                </div>
                                {__("6 Months")}
                            </button>
                            <button
                                onClick={(e) => updatePlan("Monthly")}
                                className={`w-52 rounded-lg p-3 shadow ${plan === "Monthly" ? "bg-indigo-600 text-white" : "bg-white text-gray-800"}`}
                            >
                                {__("1 Month")}
                            </button>
                            <button
                                onClick={(e) => updatePlan("Yearly")}
                                className={`relative w-52 rounded-lg p-3 shadow ${plan === "Yearly" ? "bg-indigo-600 text-white" : "bg-white text-gray-800"}`}
                            >
                                <div className="absolute inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold text-white bg-pink-500 rounded-full -top-2 right-0">
                                    {__(":discount% OFF", { discount: tier.one_year_discount })}
                                </div>
                                {__("1 Year")}
                            </button>
                        </div>
                    </header>

                    <div className="border-t pt-5 text-xl text-center font-light mt-8 dark:text-white">
                        <p className="bg-white shadow text-gray-800 font-semibold inline-flex rounded-lg p-2">
                            <MdGeneratingTokens className="h-6 w-6" /> {__("Price: :price $", { price: showPrice })}
                        </p>
                        <br />

                        <div className="mt-5 border-t pt-5">
                            {auth.user.stripe_customer_id && auth.user.default_payment_method ? (
                                <>
                                    <button
                                        onClick={(e) => confirmSubscription(e)}
                                        className="py-2 px-3 mt-2 mb-3 inline-flex rounded-md items-center bg-pink-500 text-white font-semibold hover:bg-pink-600 disabled:bg-gray-300 disabled:text-gray-700"
                                        disabled={processing}
                                    >
                                        <MdGeneratingTokens className="h-6 w-6 mr-2" />
                                        <div>{__("Subscription By Card")}</div>
                                    </button>
                                    {processing && (
                                        <center>
                                            <Spinner />
                                        </center>
                                    )}
                                </>
                            ) : (
                                <div className="text-gray-700 dark:text-white text-base">
                                    {__("You need to connect your card first")}
                                    <br />
                                    <button
                                        className="py-1.5 px-3 mt-2 inline-flex border-2 rounded-md hover:border-gray-700 hover:text-gray-700 items-center border-indigo-600 text-indigo-600 dark:border-white dark:text-white dark:hover:border-indigo-200 dark:hover:text-indigo-200"
                                        onClick={() => setModalOpen(true)} // Open modal to connect card
                                    >
                                        <MdGeneratingTokens className="h-6 w-6 mr-2" />
                                        <div>{__("Subscription By Card")}</div>
                                    </button>
                                </div>
                            )}

                        </div>
                    

                        <div className="mt-5">
                            {isPaypal && (
                                <div className="mt-5">
                                    <button
                                        onClick={(e) => confirmPaypalSubscription(e)}
                                        className="py-2 px-3 mt-2 mb-3 inline-flex rounded-md items-center bg-pink-500 text-white font-semibold hover:bg-pink-600 disabled:bg-gray-300 disabled:text-gray-700"
                                        disabled={processing}
                                    >
                                        <MdGeneratingTokens className="h-6 w-6 mr-2" />
                                        <div>{__("Subscription By PayPal")}</div>
                                    </button>
                                    {processing && (
                                        <center>
                                            <Spinner />
                                        </center>
                                    )}
                                </div>
                            )}
                        </div>



                                {/* {<button className="py-1.5 px-3 mt-2 inline-flex border-2 rounded-md hover:border-gray-700 hover:text-gray-700 items-center border-indigo-600 text-indigo-600 dark:border-white dark:text-white dark:hover:border-indigo-200 dark:hover:text-indigo-200">
                                    <Link
                                        href={route("paypal.purchaseSubscription", {
                                            user: channel.id,
                                            tier: tier.id,
                                            plan: plan,
                                        })}
                                        passHref
                                    >
                                        <a className="inline-flex items-center">
                                            <img
                                                src={paypalImg}
                                                alt="PayPal"
                                                className="h-6 w-6 mr-2"
                                            />
                                            <div></div>
                                        </a>
                                    </Link>
                                </button>} */}
                            
                    </div>




                </div>
            </div>

            {/* Wrap with Elements here */}
            <Elements stripe={stripePromise}>
                <PaymentModal isOpen={isModalOpen} closeModal={() => setModalOpen(false)} userName={auth.user.username} />
            </Elements>
        </AuthenticatedLayout>
    );
}
