import { forwardRef, useRef, useEffect } from "react";
import { a as jsx } from "../app.mjs";
const Textarea = forwardRef(function Textarea2({
  name,
  value,
  className,
  autoComplete,
  required,
  isFocused,
  handleChange
}, ref) {
  const input = ref ? ref : useRef();
  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, []);
  return /* @__PURE__ */ jsx("div", {
    className: "flex flex-col items-start",
    children: /* @__PURE__ */ jsx("textarea", {
      rows: "5",
      name,
      className: `border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ` + className,
      ref: input,
      autoComplete,
      required,
      onChange: (e) => handleChange(e),
      value
    })
  });
});
export {
  Textarea as T
};
