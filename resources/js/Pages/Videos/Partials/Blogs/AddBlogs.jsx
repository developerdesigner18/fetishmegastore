import React from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import Textarea from "@/Components/Textarea";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/inertia-react";
import { Select } from "antd";
import { MdVideoLibrary } from "react-icons/md";
import AccountNavi from "@/Pages/Channel/Partials/AccountNavi";

export default function AddBlogs({ categories, tags }) {
  // Convert CSV or array string to number array for select default values
  const toNumberArray = (val) => {
    if (Array.isArray(val)) return val.map((v) => Number(v));
    if (typeof val === "string") return val.length ? val.split(",").map(Number) : [];
    return [];
  };

  const initSeo = {
    h2: "",
    keyword: "",
    meta_keyword: "",
    desc: "",
    og_title: "",
    og_desc: "",
    cust_url: "",
    de: { h2: "", keyword: "", meta_keyword: "", desc: "" },
  };

  const { data, setData, post, processing, errors } = useForm({
    title_en: "",
    title_de: "",
    description_en: "",
    description_de: "",
    category_id: [],
    tag_id: [],
    image: [], // files only
    seo: initSeo,
  });

  const handleSelectChange = (value, name) => {
    setData(name, value.map(Number));
  };

  const handleFileChange = (e) => {
    setData("image", Array.from(e.target.files));
  };

  const onHandleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("seo.")) {
      const path = name.replace(/^seo\./, "");
      if (path.includes(".")) {
        const [k1, k2] = path.split(".");
        setData("seo", { ...data.seo, [k1]: { ...(data.seo[k1] || {}), [k2]: value } });
      } else {
        setData("seo", { ...data.seo, [path]: value });
      }
    } else {
      setData(name, value);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    post(route("blogs.save"), { forceFormData: true });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Add Blog" />
      <div className="lg:flex lg:space-x-10">
        <AccountNavi active="upload-blogs" />
        <div className="p-4 sm:p-8 bg-white w-full dark:bg-zinc-900 shadow sm:rounded-lg">
          <header className="mb-5">
            <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
              <MdVideoLibrary className="mr-2" />
              Add Blog
            </h2>
          </header>

          <form onSubmit={submit} encType="multipart/form-data">
            {/* Title EN */}
            <InputLabel value="Title (EN)" />
            <TextInput name="title_en" value={data.title_en} handleChange={onHandleChange} className="mt-1 block w-full md:w-1/2" />
            <InputError message={errors.title_en} className="mt-2" />

            {/* Title DE */}
            <InputLabel value="Title (DE)" className="mt-4" />
            <TextInput name="title_de" value={data.title_de} handleChange={onHandleChange} className="mt-1 block w-full md:w-1/2" />
            <InputError message={errors.title_de} className="mt-2" />

            {/* Image */}
            <InputLabel value="Image" className="mt-4" />
            <TextInput type="file" name="image" multiple handleChange={handleFileChange} className="mt-1 block w-full md:w-1/2" />
            <InputError message={errors.image} className="mt-2" />

            {/* Category */}
            <InputLabel value="Category" className="mt-4" />
            <Select
              mode="multiple"
              allowClear
              style={{ width: "50%" }}
              placeholder="Select categories"
              value={data.category_id}
              onChange={(value) => handleSelectChange(value, "category_id")}
              options={categories}
            />
            <InputError message={errors.category_id} className="mt-2" />

            {/* Tags */}
            <InputLabel value="Tags" className="mt-4" />
            <Select
              mode="multiple"
              allowClear
              style={{ width: "50%" }}
              placeholder="Select tags"
              value={data.tag_id}
              onChange={(value) => handleSelectChange(value, "tag_id")}
              options={tags}
            />
            <InputError message={errors.tag_id} className="mt-2" />

            {/* Description EN */}
            <InputLabel value="Description (EN)" className="mt-4" />
            <Textarea name="description_en" value={data.description_en} handleChange={onHandleChange} className="mt-1 block w-full md:w-1/2" />

            {/* Description DE */}
            <InputLabel value="Description (DE)" className="mt-4" />
            <Textarea name="description_de" value={data.description_de} handleChange={onHandleChange} className="mt-1 block w-full md:w-1/2" />

            {/* SEO */}
            <hr className="my-5" />
            <label className="font-semibold">SEO</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
              {[
                ["seo.h2", "H2"],
                ["seo.keyword", "Keyword"],
                ["seo.meta_keyword", "Meta Keyword"],
                ["seo.desc", "Meta Description"],
                ["seo.og_title", "OG Title"],
                ["seo.og_desc", "OG Description"],
                ["seo.cust_url", "Custom URL"],
              ].map(([name, label]) => (
                <div key={name}>
                  <InputLabel value={label} />
                  <TextInput
                    name={name}
                    value={name.split(".").reduce((o, i) => (o ? o[i] : ""), data)}
                    handleChange={onHandleChange}
                    className="mt-1 block w-full"
                  />
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-6">
              <PrimaryButton processing={processing}>Save Blog</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
