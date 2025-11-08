import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { VscArrowBoth } from "react-icons/vsc/index.js";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import { j as jsxs, a as jsx } from "../app.mjs";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/inertia-react";
import "@inertiajs/progress";
import "react/jsx-runtime";
function ScheduleTab({
  user
}) {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [scheduleInfo, setInfo] = useState("");
  useEffect(() => {
    getSchedule();
    getScheduleInfo();
  }, []);
  const getScheduleInfo = () => {
    axios.get(route("schedule.getInfo", {
      user: user.id
    })).then((resp) => {
      setInfo(resp.data);
      setLoading(false);
    }).catch((Err) => {
      var _a, _b;
      return toast.error((_b = (_a = Err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message);
    });
  };
  const getSchedule = () => {
    axios.get(route("schedule.get", {
      user: user.id
    })).then((resp) => {
      setSchedule(resp.data);
      setLoading(false);
    }).catch((Err) => {
      var _a, _b;
      return toast.error((_b = (_a = Err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message);
    });
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "mt-4",
    children: [loading && /* @__PURE__ */ jsx("div", {
      className: "my-3",
      children: /* @__PURE__ */ jsx(Spinner, {})
    }), scheduleInfo !== "" && /* @__PURE__ */ jsx("div", {
      className: "bg-white rounded-lg px-3 py-4 shadow mb-5 text-gray-600 font-semibold dark:bg-zinc-900 dark:text-white",
      children: scheduleInfo
    }), Object.keys(schedule).map((key, index) => {
      return /* @__PURE__ */ jsxs("div", {
        className: "flex  mb-5 md:items-center flex-col md:flex-row md:space-x-2 dark:text-gray-100 dark:bg-zinc-900 bg-white rounded-lg shadow p-3 text-gray-700 font-semibold",
        children: [/* @__PURE__ */ jsx("div", {
          className: "md:w-24 md:text-sm mb-2 md:mb-0 text-gray-600 bg-gray-200 rounded-lg py-1.5 mr-2 text-center",
          children: schedule[key].day_name
        }), /* @__PURE__ */ jsxs("div", {
          children: [`${schedule[key].from_hour || "--"}:${schedule[key].from_minute || "--"}`, schedule[key].from_hour && schedule[key].from_minute && schedule[key].from_type]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx(VscArrowBoth, {}), " "]
        }), /* @__PURE__ */ jsxs("div", {
          children: [`${schedule[key].to_hour || "--"}:${schedule[key].to_minute || "--"}`, schedule[key].from_hour && schedule[key].from_minute && schedule[key].to_type]
        })]
      }, `schedule-${index}`);
    })]
  });
}
export {
  ScheduleTab as default
};
