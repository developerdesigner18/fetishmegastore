import React, {useEffect, useRef, useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// const { getVideoDurationInSeconds } = require('get-video-duration');
import {Head, Link} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";
import {BsTagFill, BsFillTagsFill} from "react-icons/bs/index.js";
import {AiOutlineEye} from "react-icons/ai/index.js";
import {FcUnlock} from "react-icons/fc/index.js";
import PrimaryButton from "@/Components/PrimaryButton";
import {MdGeneratingTokens} from "react-icons/md/index.js";
import axios from "axios";
import {FaGrinStars} from "react-icons/fa/index.js";
import {Inertia} from "@inertiajs/inertia";
import QRCode from 'qrcode.react';

export default function CryptoWallet({wallte, tokenPack, inModal = false}) {
    // console.log('GG', wallte);
    // console.log('tokenPack', tokenPack);
    const [walletAddress, setWalletAddress] = useState("");
    const [walletAmount, setWalletAmount] = useState("");

    useEffect(() => {
        const fetchWalletAddress = async () => {
            try {
                const res = await axios.post(route('crypto.get.address'), { wallet: wallte, token: tokenPack });
                console.log('res', res.data);  // This should now log the response data
                setWalletAddress(res.data.address);  // Assuming you want to set the address only
                setWalletAmount(res.data.amount);
            } catch (error) {
                console.error('Error fetching wallet address:', error);
            }
        };

        fetchWalletAddress();
    }, []);


    return (
        <>
            <div className="mt-10 flex flex-col items-center justify-center space-y-5 bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
            <span className="block text-center text-gray-700 font-bold dark:text-white text-xl">
                {wallte.name}
            </span>
                <div className="flex items-center justify-center">
                    <img
                        src={wallte.img}
                        alt={wallte.name}
                        className="h-20 w-20 rounded-full border-4 border-gray-300 shadow-lg dark:border-gray-700"
                    />
                </div>
                <p className="text-center text-gray-600 dark:text-gray-300">
                    Please transfer the amount to the wallet address below:
                </p>
                <p className="text-center text-2xl text-blue-600 font-semibold dark:text-blue-400">
                    {walletAmount}
                </p>
                <h6 className="mt-4 px-4 py-2 text-center text-lg font-medium text-gray-700 bg-gray-100 rounded-md dark:text-gray-200 dark:bg-gray-700">
                    {walletAddress}
                </h6>
                {/* QR Code */}
                {walletAddress && (
                    <div className="mt-4 flex justify-center">
                        <QRCode value={walletAddress} size={128} bgColor="#ffffff" fgColor="#000000" />
                    </div>
                )}
                {/*<p className="text-center text-gray-600 dark:text-gray-300 mt-2">Scan the QR code to send payment</p>*/}
            </div>
        </>
    )
}
