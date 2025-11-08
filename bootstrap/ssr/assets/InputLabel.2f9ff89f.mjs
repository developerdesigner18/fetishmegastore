import "react";
import { a as jsx } from "../app.mjs";
function InputLabel({
  forInput,
  value,
  className,
  children
}) {
  return /* @__PURE__ */ jsx("label", {
    htmlFor: forInput,
    className: `block font-medium text-sm text-gray-700 dark:text-gray-300 ` + className,
    children: value ? value : children
  });
}
export {
  InputLabel as I
};
