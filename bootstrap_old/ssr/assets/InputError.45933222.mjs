import { a as jsx } from "../app.mjs";
function InputError({
  message,
  className = ""
}) {
  return message ? /* @__PURE__ */ jsx("p", {
    className: "text-sm text-red-600 dark:text-red-400 " + className,
    children: message
  }) : null;
}
export {
  InputError as I
};
