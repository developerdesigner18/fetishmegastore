import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import Textarea from "@/Components/Textarea";
import PrimaryButton from "@/Components/PrimaryButton";
import __ from "@/Functions/Translate";
import { toast } from "react-toastify";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, useForm, Head, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/Components/Spinner";
import { MdVideoLibrary } from "react-icons/md/index.js";
import AccountNavi from "@/Pages/Channel/Partials/AccountNavi";
import { Select, Switch } from 'antd';
import Swal from "sweetalert2";

export default function UploadVideo({ video, ogValue, categories, fileNames, tags, models, supportedLocales }) {
    console.log('UploadVideo video', video)
    const { data, setData, post, processing, errors, progress } = useForm({
        title_en: ogValue?.title?.en || "",
        title_lang: ogValue?.title_lang || "",
        title_de: ogValue?.title?.[ogValue?.title_lang] || "",
        description_en: ogValue?.description?.en || "",
        description_lang: ogValue?.description_lang || "",
        description_de: ogValue?.description?.[ogValue?.description_lang] || "",

        tag: video.tag,

        category_id: video.category_id,
        model_id: video.model_id,
        price: video.price,
        free_for_subs: video.free_for_subs,
        is_from_ftp: false,
        thumbnail: "",
        video_file: "",
        seo: {
            h2: video.seoDeatils?.h2,
            keyword: video.seoDeatils?.keyword,
            meta_keyword: video.seoDeatils?.meta_keyword,
            desc: video.seoDeatils?.desc,
            og_title: video.seoDeatils?.og_title,
            og_desc: video.seoDeatils?.og_desc,
            meta_robot: video.seoDeatils?.meta_robot,
            cust_url: video.seoDeatils?.cust_url,
            og_image_url: video.seoDeatils?.og_image_url,
            json_id: video.seoDeatils?.json_id
        }
    });

    // console.log('categories',categories);
    const [videoFile, setVideoFile] = useState("");
    const [chunks, setChunks] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [videoId, setVideoId] = useState(2);
    const [uploaded, setUploaded] = useState(0);
    const [checked, setChecked] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState([])

    const handleChange = () => {
        setChecked(!checked);

        data.is_from_ftp = checked === true ? false : true;
        // console.log('checked',data.is_from_ftp);
    };

    useEffect(() => {
        if (video) {
            if (video?.is_from_ftp == 1) {

                setChecked(true)
                data.is_from_ftp = true;
                // console.log('trueeeeee')
            }
            else if (video?.is_from_ftp == 0) {
                setChecked(false)
                data.is_from_ftp = false;
                // console.log('falseeeeeeeeee')
            }
        }

        setSelectedCategory(video.category_id)

    }, [])

    // console.log(video,'video!!!!')
    const handleVideoChange = (value) => {
        console.log(`selected ${value}`);
        setVideoFile(value)
        data.video_file = 'videos/' + value;
        data.is_from_ftp = checked
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setData("video_file", file);
        }
    };

    const handleTagChange = (value) => {
        console.log(`selected tag ${value}`);
        data.tag = value;
    };

    const handleCategoryChange = (value) => {
        console.log(`selected category ${value}`);
        data.category_id = value;
    };

    const handleModelChange = (value) => {
        console.log(`selected model ${value}`);
        data.model_id = value;
    };

    // Reset secondary title/description when language changes

    useEffect(() => {
        if (chunks.length > 0) {
            uploadChunks();
        }
    }, [chunks]);

    const onHandleChange = (event) => {
        const { name, value } = event.target;
        setData(name, value);

        // If language selection changes, update the *_de field to reflect the selected language's value from JSON
        if (name === "title_lang") {
            const parsedTitle = video.title ? JSON.parse(video.title) : {};
            setData("title_de", parsedTitle[value] || "");
        }
        if (name === "description_lang") {
            const parsedDesc = video.description ? JSON.parse(video.description) : {};
            setData("description_de", parsedDesc[value] || "");
        }
    };

    const onTitleLangChange = (e) => setData({ ...data, title_lang: e.target.value, title_de: "" });
    const onDescriptionLangChange = (e) => setData({ ...data, description_lang: e.target.value, description_de: "" });

    useEffect(() => {
        if (Object.keys(errors).length) {
            Object.keys(errors).forEach((key) => toast.error(errors[key]));
        }
    }, [errors]);

    const createChunks = () => {
        setChunks([]);

        // 8 mb chunks
        let size = 1024 * 1024 * 8;
        let chunksCount = Math.ceil(videoFile.size / size);

        for (let i = 0; i < chunksCount; i++) {
            setChunks((chunks) => [
                ...chunks,
                videoFile.slice(
                    i * size,
                    Math.min(i * size + size, videoFile.size),
                    videoFile.type
                ),
            ]);
        }
    };

    const uploadChunks = () => {
        setSpinner(true);

        // compute the form data
        const postData = new FormData();

        // append media_type request
        postData.append("media_type", "video");
        postData.append("is_last", chunks.length === 1);
        postData.append("video", videoId);
        postData.set("file", chunks[0], `${videoFile.name}.part`);

        // send the request

        axios
            .post(route("video.uploadChunks"), postData, {
                onUploadProgress: (event) => {
                    setUploaded(uploaded + event.loaded);
                },
            })
            .then(function (response) {
                if (chunks.length <= 1) {
                    // setVideoFile(null);
                    setChunks([]);
                    setUploaded(0);

                    // set video
                    data.video_file = response.data.result;

                    console.log(response.data.result);

                    console.log(`Chunks.length <= 1, posting data`);
                    console.log(data);

                    if (video.id === null) {
                        Swal.fire({
                            title: "Are you sure?",
                            text: "Do you want to save this video?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Yes, save it!",
                            cancelButtonText: "No, cancel",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // If confirmed, proceed with the API call
                                post(route("videos.save"));
                                Swal.fire(
                                    "Saved!",
                                    "Your video has been saved.",
                                    "success"
                                );
                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                Swal.fire(
                                    "Cancelled",
                                    "Your video has not been saved",
                                    "error"
                                );
                            }
                        });

                    } else {
                        updateVideo();
                    }
                }

                // remove this chunk
                let chunksArray = [...chunks];
                chunksArray.splice(0, 1);

                // update state
                setChunks(chunksArray);
            })
            .catch(function (error) {
                setUploaded(0);
                toast.error(error.response?.data?.message);
            })
            .then(function () {
                setSpinner(false);
            });
    };

    const submit = (e) => {
        e.preventDefault();

        if (videoFile) {
            if (checked) {
                setSpinner(true);

                if (video.id === null) {
                    Swal.fire({
                        title: "Are you sure?",
                        text: "Do you want to save this video?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, save it!",
                        cancelButtonText: "No, cancel",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            post(route("videos.save"), {
                                onFinish: () => setSpinner(false),
                            });

                            Swal.fire("Saved!", "Your video has been saved.", "success");
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            setSpinner(false);
                            Swal.fire("Cancelled", "Your video has not been saved", "error");
                        }
                    });
                } else {
                    Inertia.post(
                        route("videos.update", { video: video.id }),
                        {
                            ...data,
                            _method: "PUT", // Laravel को बताएंगे कि ये update है
                        },
                        {
                            onFinish: () => setSpinner(false),
                        }
                    );
                }
            } else {
                createChunks();
            }
        } else if (videoFile === "" && video.id !== null) {
            // Editing existing video without uploading new file
            Inertia.post(
                route("videos.update", { video: video.id }),
                {
                    ...data,
                    _method: "PUT",
                },
                {
                    onFinish: () => setSpinner(false),
                }
            );
        }
    };

    const updateVideo = () => {
        Inertia.post(
            route("videos.update", { video: video.id }),
            {
                ...data,
                _method: "PUT",
            },
            {
                onFinish: () => setSpinner(false),
            }
        );
    };

    const uniqueTags = tags.filter((value, index, self) =>
        index === self.findIndex((t) => t.value === value.value) // or t.label if you prefer
    );
    console.log('data', data);

    return (
        <AuthenticatedLayout>
            <Head title={__("Upload Video")} />
            <div className="lg:flex lg:space-x-10">
                <AccountNavi active="upload-videos" />
                <div className="p-4 sm:p-8 bg-white w-full dark:bg-zinc-900 shadow sm:rounded-lg">
                    <header className="mb-5">
                        <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
                            <MdVideoLibrary className="mr-2" />
                            {video.id === null
                                ? __("Upload Video")
                                : __("Edit Video")}
                        </h2>

                        <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                            {__("Upload a new video")}
                        </p>

                        <PrimaryButton
                            onClick={(e) => Inertia.visit(route("videos.list"))}
                        >
                            {__("<< Back to Videos")}
                        </PrimaryButton>
                    </header>

                    <hr className="my-5" />
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="mb-5">
                            <InputLabel for="title" value={__("Title")} />

                            <TextInput
                                name="title_en"
                                value={data.title_en}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />

                            <InputError
                                message={errors.title_en}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">
                            <InputLabel for="title_lang" value={__("Select Title Language")} />
                            <select
                                name="title_lang"
                                value={data.title_lang}
                                onChange={onTitleLangChange}
                                className="mt-1 block w-full md:w-1/2 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">{__("--Select--")}</option>
                                {supportedLocales.map((locale) => (
                                    <option key={locale.lang_value} value={locale.lang_value}>
                                        {locale.lang_name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.title_lang} className="mt-2" />
                        </div>

                        <div className="mb-5">
                            <InputLabel
                                for="title_de"
                                value={`${supportedLocales.find((l) => l.lang_value === data.title_lang)?.lang_name} Title`}
                            />
                            <TextInput
                                name="title_de"
                                value={data.title_de}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />
                            <InputError message={errors.title_de} className="mt-2" />
                        </div>

                        <div className="mb-5">
                            <InputLabel for="category" value={__("Category")} />

                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                style={{ width: '50%' }}
                                placeholder="Please select"
                                defaultValue={video.category_id === "" ? [] : video.selectedCategory}
                                onChange={handleCategoryChange}
                                options={categories}
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />

                            <InputError
                                message={errors.category_id}
                                className="mt-2"
                            />

                        </div>

                        <div className="mb-5">
                            <InputLabel for="model" value={__("Model")} />

                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                style={{ width: '50%' }}
                                placeholder="Please select"
                                defaultValue={video.model_id === null ? [] : video.selectedModel}
                                onChange={handleModelChange}
                                options={models}
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />

                            <InputError
                                message={errors.model_id}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">
                            <InputLabel for="tag" value={__("Tags")} />

                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                style={{ width: '50%' }}
                                placeholder="Please select"
                                // defaultValue={Array.isArray(video.tags) ? video.tags.map(tag => tag.value) : []} // Safe check
                                defaultValue={video.tags === null ? [] : video.selectedTags} // Safe check
                                onChange={handleTagChange}
                                options={uniqueTags} // Use unique tags
                                filterOption={(input, option) =>
                                    option?.label?.toLowerCase().includes(input.toLowerCase())
                                }
                            />

                            <InputError
                                message={errors.tag}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex w-full md:w-1/2 flex-col md:flex-row md:items-center md:space-x-10 md:justify-between">
                            <div className="mb-5">
                                <InputLabel for="price" value={__("Price")} />

                                <div className="flex items-center">
                                    <TextInput
                                        type="number"
                                        name="price"
                                        value={data.price}
                                        handleChange={onHandleChange}
                                        required
                                        className="mt-1  w-32"
                                    />
                                    <div className="ml-1 dark:text-white text-gray-700">
                                        {__("tokens")}
                                    </div>
                                </div>

                                <InputError
                                    message={errors.price}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mb-5">
                                <InputLabel
                                    for="free_for_subs"
                                    value={__("Free for subscribers?")}
                                />

                                <select
                                    name="free_for_subs"
                                    value={data.free_for_subs}
                                    onChange={onHandleChange}
                                    required
                                    className={`mt-1 block w-32 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm `}
                                >
                                    <option value="yes">{__("Yes")}</option>
                                    <option value="no">{__("No")}</option>
                                </select>

                                <InputError
                                    message={errors.free_for_subs}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <InputLabel
                                for="thumbnail"
                                value={__(
                                    "Thumbnail - helps to attract sales (will be resized to 640x320px)"
                                )}
                            />

                            <TextInput
                                className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                type="file"
                                name="thumbnail"
                                handleChange={(e) =>
                                    setData("thumbnail", e.target.files[0])
                                }

                            />

                            <InputError
                                message={errors.thumbnail}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label>
                                <Switch onChange={handleChange} checked={data.is_from_ftp} />
                                Select video from ftp?
                            </label>
                        </div>

                        {!checked &&
                            <div className="mb-5">
                                <InputLabel for="video" value={__("Video")} />

                                <InputLabel for="video" value="Video File" />
                                <TextInput
                                    type="file"
                                    name="video"
                                    accept="video/*"
                                    handleChange={(e) =>
                                        setVideoFile(e.target.files[0])
                                    }
                                />
                                <InputError message={errors.video_file} />
                            </div>}

                        {checked && <div className="mt-2">
                            <Select
                                mode="single"
                                allowClear
                                showSearch
                                style={{ width: '50%' }}
                                placeholder="Please select"
                                defaultValue={video.video}
                                onChange={handleVideoChange}
                                options={fileNames}
                            />
                        </div>}


                        <div className="mb-5">
                            <InputLabel for="description_en" value={__("Description")} />

                            <Textarea
                                name="description_en"
                                value={data.description_en}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />

                            <InputError
                                message={errors.description_en}
                                className="mt-2"
                            />
                        </div>
                        <div className="mb-5">
                            <InputLabel for="description_lang" value={__("Select Description Language")} />
                            <select
                                name="description_lang"
                                value={data.description_lang}
                                onChange={onDescriptionLangChange}
                                className="mt-1 block w-full md:w-1/2 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">{__("--Select--")}</option>
                                {supportedLocales.map((locale) => (
                                    <option key={locale.lang_value} value={locale.lang_value}>
                                        {locale.lang_name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.description_lang} className="mt-2" />
                        </div>


                        <div className="mb-5">
                            <InputLabel
                                for="description_de"
                                value={`${supportedLocales.find((l) => l.lang_value === data.description_lang)?.lang_name} ${__("Description")}`}
                            />
                            <Textarea
                                name="description_de"
                                value={data.description_de}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />
                            <InputError message={errors.description_de} className="mt-2" />
                        </div>

                        <hr className="mt-3" />

                        <label>SEO</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel for="seo_h2" value="H2" />
                                <TextInput
                                    name="seo.h2"
                                    value={data.seo.h2}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_keyword" value="Keyword" />
                                <TextInput
                                    name="seo.keyword"
                                    value={data.seo.keyword}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_meta_keyword" value="Meta Keyword" />
                                <TextInput
                                    name="seo.meta_keyword"
                                    value={data.seo.meta_keyword}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_desc" value="Meta Description" />
                                <TextInput
                                    name="seo.desc"
                                    value={data.seo.desc}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_og_title" value="OG Title" />
                                <TextInput
                                    name="seo.og_title"
                                    value={data.seo.og_title}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_og_desc" value="OG Description" />
                                <TextInput
                                    name="seo.og_desc"
                                    value={data.seo.og_desc}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_meta_robot" value="Meta Robot" />
                                <TextInput
                                    name="seo.meta_robot"
                                    value={data.seo.meta_robot}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_cust_url" value="Custom URL" />
                                <TextInput
                                    name="seo.cust_url"
                                    value={data.seo.cust_url}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_og_image_url" value="OG Image URL" />
                                <TextInput
                                    name="seo.og_image_url"
                                    value={data.seo.og_image_url}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_json_id" value="JSON ID" />
                                <TextInput
                                    name="seo.json_id"
                                    value={data.seo.json_id}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                        </div>


                        <div className="flex justify-between items-center mt-2">
                            <PrimaryButton processing={processing || spinner}>
                                {video.id === null
                                    ? __("Save Video")
                                    : __("Update Video")}
                            </PrimaryButton>
                        </div>

                        {spinner && (
                            <div className="my-3">
                                <Spinner />
                            </div>
                        )}

                        {progress && (
                            <progress
                                className="mt-5"
                                value={progress.percentage}
                                max="100"
                            >
                                {progress.percentage}%
                            </progress>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
