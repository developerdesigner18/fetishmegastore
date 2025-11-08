import { useEffect, Fragment } from "react";
import ReactDOM from "react-dom";
import { Transition } from "@headlessui/react";
import { a as jsx, j as jsxs } from "../app.mjs";
function Modal({
  children,
  show = false,
  maxWidth = "2xl",
  closeable = true,
  onClose = () => {
  }
}) {
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : null;
  }, [show]);
  const close = () => {
    if (closeable) {
      onClose();
    }
  };
  const closeOnEscape = (e) => {
    if (e.key === "Escape" && props.show) {
      close();
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = null;
    };
  }, []);
  const maxWidthClass = {
    xs: "max-w-xs",
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl"
  }[maxWidth];
  const modalRoot = document.getElementById("modal-root");
  return ReactDOM.createPortal(/* @__PURE__ */ jsx(Transition, {
    show,
    leave: "duration-200",
    children: /* @__PURE__ */ jsxs("div", {
      className: "fixed inset-0 overflow-y-auto overflow-scroll h-full flex items-center justify-center px-4 py-6 sm:px-0 z-50",
      children: [/* @__PURE__ */ jsx(Transition.Child, {
        as: Fragment,
        enter: "ease-out duration-300",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leave: "ease-in duration-200",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
        children: /* @__PURE__ */ jsx("div", {
          className: "fixed inset-0 transform transition-all",
          onClick: close,
          children: /* @__PURE__ */ jsx("div", {
            className: "absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"
          })
        })
      }), /* @__PURE__ */ jsx(Transition.Child, {
        as: Fragment,
        enter: "ease-out duration-300",
        enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
        enterTo: "opacity-100 translate-y-0 sm:scale-100",
        leave: "ease-in duration-200",
        leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
        leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
        children: /* @__PURE__ */ jsx("div", {
          className: `bg-white dark:bg-gray-800 rounded-lg overflow-x-hidden overflow-y-scroll shadow-xl transform transition-all w-full max-h-96 md:max-h-full mx-auto ${maxWidthClass}`,
          children
        })
      })]
    })
  }), modalRoot);
}
export {
  Modal as M
};
