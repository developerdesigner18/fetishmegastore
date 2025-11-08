import React, {useEffect,useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, Link, usePage, useForm} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import {MdGeneratingTokens} from "react-icons/md/index.js";
import {Inertia} from "@inertiajs/inertia";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import CryptoWallet from "@/Components/CryptoWallet";
import QRCode from 'qrcode.react';
export default function SelectGateway({auth, tokenPack, wallets}) {
    const [showCryptoModel, setShowCryptoModel] = useState(false);
    const [modal, setModal] = useState(false);
    // console.log('wallets', wallets);
    const {currency_symbol, currency_code} = usePage().props;

    const playCrypto = (e, walletDetails) => {
        console.log(e, walletDetails);
        e.preventDefault();
        setShowCryptoModel(walletDetails);
        setModal(true);

    };

    return (
        <>
        <Modal show={modal} onClose={(e) => setModal(false)}>
            {showCryptoModel && <CryptoWallet wallte={showCryptoModel} tokenPack={tokenPack} inModal={true}/>}
        </Modal>
        <AuthenticatedLayout auth={auth}>
        <Head title={__("Select Crypto - Purchase Tokens")}/>

        <div className="p-4 sm:p-8 bg-white max-w-3xl mx-auto dark:bg-zinc-900 shadow sm:rounded-lg">
            <h3 className="text-3xl font-semibold dark:text-white text-center">
                {__("Select Crypto Coin")}
            </h3>


            <div className="mt-10 flex flex-wrap items-center justify-center space-y-5 space-x-5">
                {Object.values(wallets)?.map((walletDetails, index) => (
                    <div className="mt-10" key={index}>
                            <span className="block text-center text-gray-700 font-bold dark:text-white text-lg">
                                {walletDetails.name}
                            </span>
                        <div className="flex items-center justify-center">
                            <button onClick={(e) => playCrypto(e, walletDetails)}>
                                <img
                                    src={walletDetails.img}
                                    alt={walletDetails.name}
                                    className="h-20 mx-auto"
                                />
                            </button>
                        </div>
                    </div>

                ))}
            </div>


        </div>
    </AuthenticatedLayout>
        </>
);
}
