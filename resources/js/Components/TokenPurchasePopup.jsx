import {useState, useEffect} from "react";
import {motion} from "framer-motion";
import {IoMdClose} from "react-icons/io";
import {usePage, Head, Link, useForm} from "@inertiajs/inertia-react";
import __ from "@/Functions/Translate";

const TokenPopup = () => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 15000); // Show after 15 seconds
        return () => clearTimeout(timer);
    }, []);

    return (
        showPopup && (
            <motion.div
                initial={{y: 100, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: 100, opacity: 0}}
                transition={{duration: 0.5}}
                className="fixed bottom-5 right-5 bg-white dark:bg-gray-800 shadow-lg p-4 rounded-lg w-64 flex items-center justify-between border border-gray-300 dark:border-gray-700"
            >
                <div>
                    <p className="text-gray-800 dark:text-white font-medium">Out of tokens?</p>
                    <Link
                        href={route("token.packages")}
                        className="text-blue-500 font-semibold"
                    >
                        <span>{__("Click here to purchase")}</span>
                    </Link>
                </div>
                {/*<button onClick={() => setShowPopup(false)}*/}
                {/*        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">*/}
                {/*    <IoMdClose size={20}/>*/}
                {/*</button>*/}
            </motion.div>
        )
    );
};

export default TokenPopup;
