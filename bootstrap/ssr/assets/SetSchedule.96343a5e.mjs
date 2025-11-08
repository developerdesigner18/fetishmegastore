import { _ as __ } from "./Translate.346b89d9.mjs";
import { useState, useEffect } from "react";
import axios from "axios";
import { S as Spinner } from "./Spinner.a2c890cd.mjs";
import { usePage } from "@inertiajs/inertia-react";
import { P as PrimaryButton } from "./PrimaryButton.9fb48a50.mjs";
import { j as jsxs, F as Fragment, a as jsx } from "../app.mjs";
import { I as InputLabel } from "./InputLabel.2f9ff89f.mjs";
import { T as TextInput } from "./TextInput.7d39776a.mjs";
import { N as NumberInput } from "./NumberInput.e1cdf2ea.mjs";
import { toast } from "react-toastify";
import { Inertia } from "@inertiajs/inertia";
import "lodash";
import "laravel-echo";
import "pusher-js";
import "react-dom/client";
import "@inertiajs/progress";
import "react/jsx-runtime";
function SetSchedule() {
  const {
    auth
  } = usePage().props;
  const user = auth.user;
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState({});
  const [scheduleInfo, setInfo] = useState("");
  useEffect(() => {
    getSchedule();
    getScheduleInfo();
  }, []);
  const getSchedule = () => {
    axios.get(route("schedule.get", {
      user: user.id
    })).then((resp) => {
      console.log(resp.data);
      setSchedule(resp.data);
      setLoading(false);
    }).catch((Err) => {
      var _a, _b;
      return toast.error((_b = (_a = Err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message);
    });
  };
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
  const submit = (e) => {
    e.preventDefault();
    Inertia.visit(route("schedule.save"), {
      method: "POST",
      data: {
        schedule,
        scheduleInfo
      },
      preserveScroll: true,
      onBefore: () => setLoading(true),
      onFinish: () => setLoading(false),
      onError: (Error) => {
        var _a, _b;
        return toast.error((_b = (_a = Error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message);
      }
    });
  };
  const updateSchedule = (dayName, key, value) => {
    console.log(`Would update Day: ${dayName}, Key: ${key}, Value: ${value}`);
    setSchedule({
      ...schedule,
      [dayName]: {
        ...schedule[dayName],
        [key]: value
      }
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs("header", {
      className: "mt-10 border-t pt-10",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-lg font-medium text-gray-900 dark:text-gray-100",
        children: __("Streaming Schedule")
      }), /* @__PURE__ */ jsx("p", {
        className: "mt-1 text-sm text-gray-600 dark:text-gray-400",
        children: __("Set your streaming schedule for users to get an idea on your live times")
      })]
    }), loading && /* @__PURE__ */ jsx("div", {
      className: "my-5",
      children: /* @__PURE__ */ jsx(Spinner, {})
    }), /* @__PURE__ */ jsxs("form", {
      onSubmit: submit,
      children: [/* @__PURE__ */ jsx("div", {
        className: "mt-4",
        children: /* @__PURE__ */ jsx(TextInput, {
          value: scheduleInfo,
          className: "w-full",
          placeholder: __("Enter schedule info like All times in PST, etc."),
          handleChange: (e) => setInfo(e.target.value)
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-4",
        children: Object.keys(schedule).map((key, index) => {
          return /* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex mb-5 md:items-center flex-col md:flex-row md:space-x-2",
              children: [/* @__PURE__ */ jsx("div", {
                className: "md:w-24 md:text-sm mb-2 md:mb-0 text-gray-600 bg-gray-200 rounded-lg py-3 text-center",
                children: schedule[key].day_name
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center space-x-2",
                children: [/* @__PURE__ */ jsx(NumberInput, {
                  type: "number",
                  max: 12,
                  min: 0,
                  name: `${schedule[key].day_name}_from_hour`,
                  value: schedule[key].from_hour || "",
                  className: "w-full md:w-20",
                  handleChange: (e) => updateSchedule(key, "from_hour", e.target.value)
                }), /* @__PURE__ */ jsx("span", {
                  className: "py-2 px-3 text-gray-600 bg-gray-200 rounded-lg",
                  children: ":"
                }), /* @__PURE__ */ jsx(NumberInput, {
                  type: "number",
                  max: 59,
                  min: 0,
                  name: `${schedule[key].day_name}_from_minute`,
                  value: schedule[key].from_minute || "",
                  className: "w-full md:w-20",
                  handleChange: (e) => updateSchedule(key, "from_minute", e.target.value)
                }), /* @__PURE__ */ jsxs("select", {
                  name: `${schedule[key].day_name}_from_type`,
                  value: schedule[key].from_type,
                  onChange: (e) => updateSchedule(key, "from_type", e.target.value),
                  required: true,
                  className: ` border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm `,
                  children: [/* @__PURE__ */ jsx("option", {
                    value: "AM",
                    children: __("AM")
                  }), /* @__PURE__ */ jsx("option", {
                    value: "PM",
                    children: __("PM")
                  })]
                })]
              }), /* @__PURE__ */ jsx(InputLabel, {
                className: "my-3 md:my-0",
                children: __("To")
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex items-center space-x-2",
                children: [/* @__PURE__ */ jsx(NumberInput, {
                  className: "w-full md:w-20",
                  type: "number",
                  max: 12,
                  min: 0,
                  value: schedule[key].to_hour || "",
                  name: `${schedule[key].day_name}_to_hour`,
                  handleChange: (e) => updateSchedule(key, "to_hour", e.target.value)
                }), /* @__PURE__ */ jsx("span", {
                  className: "py-2 px-3 text-gray-600 bg-gray-200 rounded-lg",
                  children: ":"
                }), /* @__PURE__ */ jsx(NumberInput, {
                  className: "w-full md:w-20",
                  type: "number",
                  max: 59,
                  min: 0,
                  value: schedule[key].to_minute || "",
                  name: `${schedule[key].day_name}_to_minute`,
                  handleChange: (e) => updateSchedule(key, "to_minute", e.target.value)
                }), /* @__PURE__ */ jsxs("select", {
                  name: `${schedule[key].day_name}_to_type`,
                  value: schedule[key].to_type,
                  onChange: (e) => updateSchedule(key, "to_type", e.target.value),
                  required: true,
                  className: `w-20 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm `,
                  children: [/* @__PURE__ */ jsx("option", {
                    value: "AM",
                    children: __("AM")
                  }), /* @__PURE__ */ jsx("option", {
                    value: "PM",
                    children: __("PM")
                  })]
                })]
              })]
            })
          }, `schedule-${index}`);
        })
      }), /* @__PURE__ */ jsx(PrimaryButton, {
        processing: loading,
        className: "mt-5",
        children: __("Save")
      })]
    })]
  });
}
export {
  SetSchedule as default
};
