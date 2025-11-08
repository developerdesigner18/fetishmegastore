import "react";
import { a as jsx } from "../app.mjs";
function DangerButton({
  type = "submit",
  className = "",
  processing,
  children,
  onClick
}) {
  return /* @__PURE__ */ jsx("button", {
    type,
    onClick,
    className: `inline-flex items-center px-4 py-2 bg-pink-600 dark:bg-gray-200 dark:text-zinc-900 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-pink-500 active:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ${processing && "opacity-25"} ` + className,
    disabled: processing,
    children
  });
}
export {
  DangerButton as D
};
