import TopNavi from "@/Components/TopNavi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CookieConsent from "react-cookie-consent";
import __ from "@/Functions/Translate";
import HomepageHeader from "@/Components/HomepageHeader";
import { usePage, Link } from "@inertiajs/inertia-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaPinterest,
} from "react-icons/fa";
import { FaXTwitter, FaReddit } from "react-icons/fa6";

export default function Front({
  children,
  containerClass = "",
  headerShow = false,
  extraHeader = false,
  extraHeaderTitle = "",
  extraHeaderText = "",
  extraHeaderImage = "",
  extraImageHeight = "",
}) {
  const { seo_title, pages } = usePage().props;

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer theme="dark" />
      <TopNavi />

      {headerShow && <HomepageHeader />}

      {extraHeader && (
        <div className="w-full mt-[60px] dark:bg-black bg-light-violet border-2 dark:border-zinc-900 pl-3 lg:pl-5">
          <div className="bg-light-violet dark:bg-black  pt-2">
            <div className="flex max-w-7xl mx-auto items-center flex-wrap">
              <div>
                <img
                  src={extraHeaderImage}
                  alt=""
                  className={extraImageHeight}
                  width="42px"
                  height="56px"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-indigo-700 text-2xl font-bold dark:text-white">
                  {extraHeaderTitle}
                </h3>

                <div className="hidden lg:flex lg:items-center lg:space-x-3">
                  {extraHeaderText}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex-grow min-h-full px-3 w-full">
        {/*<div className="max-w-10xl mx-auto flex-grow min-h-full px-3 w-full">*/}
        <div className={"mt-[100px]"}>{children}</div>
      </div>

      <CookieConsent>
        {__("This website uses cookies to enhance the user experience.")}
      </CookieConsent>

      <div className="mt-10 w-full border-t dark:border-zinc-800 dark:bg-zinc-900 py-3 bg-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-x-12">
          
          {/* Left side - Copyright and Description */}
          <div className="w-full lg:w-1/2">
            <div>
              <Link
                className="font-semibold text-sm dark:text-zinc-300"
                href={route("home")}
              >
                &copy; {seo_title}
              </Link>
            </div>
            <div className="mt-5 text-indigo-600 dark:text-indigo-400">
              <p className="text-sm">
                {__(
                  "At Fetish Mega Store, we are committed to curating an expansive collection of fetish and BDSM content to cater to diverse tastes and preferences. Our platform features a wide array of high-quality videos and photo albums, available for streaming or download, ensuring you can enjoy your favorite content hassle-free. As a leading provider in the adult entertainment industry, we continuously update our offerings to enhance your experience. Join our vibrant community and explore a variety of features designed to keep your passion for erotica thriving. Your feedback is invaluable to us; feel free to reach out with any questions, comments and suggestions."
                )}
              </p>
            </div>
          </div>

          {/* Right side - Links + Social Icons */}
          <div className="w-full lg:w-1/2 mt-5 lg:mt-0">
            <div className="flex justify-between items-start">
              
              {/* Links in 2 columns */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-8 flex-1">
                {[
                  ...pages.map((p, i) => ({
                    label: __(p.page_title),
                    href: route("page", { page: p.page_slug }),
                    type: "link",
                    id: `page-${p.id}-${i}`,
                  })),
                  { label: __("Glossar"), href: route("web.glossar.index"), type: "link", id: "extra1" },
                  { label: __("Sitemap"), href: "/sitemap.xml", type: "a", id: "extra2" },
                  { label: __("Faqs"), href: route("web.faq.index"), type: "link", id: "extra3" },
                  { label: __("Register as Streamer"), href: route("streamer.signup"), type: "link", id: "extra4" },
                  { label: __("Affiliate Program"), href: route("web.affiliate.affiliateProgram"), type: "link", id: "extra5" },
                ].map((item) =>
                  item.type === "a" ? (
                    <a
                      key={item.id}
                      href={item.href}
                      className="text-sm text-gray-600 dark:text-zinc-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="text-sm text-gray-600 dark:text-zinc-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>

              {/* Social icons aligned right */}
              <div className="ml-8 flex items-center space-x-4">
                <a
                  className="text-gray-600 dark:text-zinc-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                  href="#"
                >
                  <FaFacebookF />
                </a>
                <a
                  className="text-gray-600 dark:text-zinc-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                  href="https://x.com/Fetishmega"
                  target="_blank"
                >
                  <FaXTwitter />
                </a>
                <a
                  className="text-gray-600 dark:text-zinc-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                  href="https://www.instagram.com/fetishmegastore2025"
                  target="_blank"
                >
                  <FaInstagram />
                </a>
                <a
                  className="text-gray-600 dark:text-zinc-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                  href="https://t.me/fetishmega"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTelegram />
                </a>
                <a
                  className="text-gray-600 dark:text-zinc-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                  href="https://www.redgifs.com/users/fetishmegastore/"
                  target="_blank"
                >
                  <FaReddit />
                </a>
                <a
                  className="text-gray-600 dark:text-zinc-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                  href="https://uk.pinterest.com/fetishmegastore751"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaPinterest />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
