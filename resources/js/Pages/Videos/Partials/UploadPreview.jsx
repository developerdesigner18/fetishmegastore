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
import { Select, Switch} from 'antd';
import Swal from "sweetalert2";
import Checkbox from "@/Components/Checkbox";
export default function UploadPreview({ video, ogValue, categories, fileNames, tags, models, systemVideo, isEdit, supportedLocales}) {
    console.log('preview deatils',video);
    const { data, setData, post, processing, errors, progress } = useForm({
        title_en_val: ogValue?.title?.en || "",
        title_lang: ogValue?.title_lang || "",
        title_de: ogValue?.title?.[ogValue?.title_lang] || "",

        description_en_val: ogValue?.description?.en || "",
        description_lang: ogValue?.description_lang || "",
        description_de: ogValue?.description?.[ogValue?.description_lang] || "",

        tag: video.tag,
        category_id: video.category_id,
        model_id: video.model_id,
        video_id: video.video_id,
        price: video.price,
        is_from_ftp: false,
        thumbnail: "",
        video_file: "",
        is_terms:"",
        is_agreement:"",
        is_rules:"",
        seo: {
            h2: video.seoDeatils?.h2,
            keyword: video.seoDeatils?.keyword,
            meta_keyword: video.seoDeatils?.meta_keyword,
            desc: video.seoDeatils?.desc
        }
    });

    // console.log('categories',categories);

    const [videoFile, setVideoFile] = useState("");
    const [chunks, setChunks] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [videoId, setVideoId] = useState(2);
    const [uploaded, setUploaded] = useState(0);
    const [checked, setChecked]= useState(false)
    const [selectedCategory, setSelectedCategory]= useState([])


    const handleChange = () => {
        setChecked(!checked);

        data.is_from_ftp = checked === true ? false : true;
        // console.log('checked',data.is_from_ftp);
    };

    useEffect(()=>{
        if(video){
            if(video?.is_from_ftp ==1){

                setChecked(true)
                data.is_from_ftp = true;
                // console.log('trueeeeee')
            }
            else if(video?.is_from_ftp == 0){
                setChecked(false)
                data.is_from_ftp = false;
                // console.log('falseeeeeeeeee')
            }
        }

        setSelectedCategory(video.category_id)

    },[])

    const onTitleLangChange = (e) => {
        const lang = e.target.value;
        const titleTranslations = video.title || {};
        setData(data => ({
            ...data,
            title_lang: lang,
            title_de: titleTranslations[lang] || ""
        }));
    };

    const onDescriptionLangChange = (e) => {
        const lang = e.target.value;
        const descTranslations = video.description || {};
        setData(data => ({
            ...data,
            description_lang: lang,
            description_de: descTranslations[lang] || ""
        }));
    };

    // console.log(video,'video!!!!')
    const handleVideoChange = (value) => {
        console.log(`selected ${value}`);
        setVideoFile(value)
        data.video_file = 'short-videos/'+value;
        data.is_from_ftp = checked
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

    const handleVideoLinkChange = (value) => {
        console.log(`selected video ${value}`);
        data.video_id = value;
    };

    const onHandleChangeTitle = (event) => {
        console.log('onHandleChangeTitle',event);
    };

    useEffect(() => {
        if (Object.keys(errors).length) {
            Object.keys(errors).map((key) => {
                toast.error(errors.key);
            });
        }
    }, [errors]);

    useEffect(() => {
        if (chunks.length > 0) {
            uploadChunks();
        }
    }, [chunks]);

    const onHandleChange = (event) => {
        const { name, type, checked, value } = event.target;
        if (name.startsWith("seo.")) {
            setData("seo", { ...data.seo, [name.split(".")[1]]: type === "checkbox" ? checked : value });
        } else {
            setData(name, type === "checkbox" ? checked : value);
        }
    };

    // const onHandleChange = (event) => {
    //     // console.log('eventttttttttt',event)
    //     setData(
    //         event.target.name,
    //         event.target.type === "checkbox"
    //             ? event.target.checked
    //             : event.target.value
    //     );
    //
    //
    // };

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
        postData.append("from", "short-videos");
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
                            text: "Do you want to save this preview?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Yes, save it!",
                            cancelButtonText: "No, cancel",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // If confirmed, proceed with the API call
                                post(route("preview.save"));

                                Swal.fire(
                                    "Saved!",
                                    "Your preview has been saved.",
                                    "success"
                                );
                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                Swal.fire(
                                    "Cancelled",
                                    "Your preview has not been saved",
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

        if (!data.is_terms) {
            toast.error(__('Please agree to terms and conditions'));
            return;
        }

        if (!data.is_agreement) {
            toast.error(__('Please agree to the agreement'));
            return;
        }

        if (!data.is_rules) {
            toast.error(__('Please agree to the rules'));
            return;
        }

        console.log(videoFile,'videoFile')
        if (videoFile) {
            if(checked){
                setSpinner(true);

                if(video.id === null){

                    Swal.fire({
                        title: "Are you sure?",
                        text: "Do you want to save this preview?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, save it!",
                        cancelButtonText: "No, cancel",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // If confirmed, proceed with the API call
                            post(route("preview.save"));

                            Swal.fire(
                                "Saved!",
                                "Your preview has been saved.",
                                "success"
                            );
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            Swal.fire(
                                "Cancelled",
                                "Your preview has not been saved",
                                "error"
                            );
                        }
                    });

                }else{
                    console.log('ggwp');
                    post(route("preview.update", { video: video.id }));
                }

                setSpinner(false);
                // axios
                //     .post(route("videos.save"), data, {
                //         onUploadProgress: (event) => {
                //             setUploaded(uploaded + event.loaded);
                //         },
                //     })
                //     .then(function (response) {
                //
                //             // if (video.id === null) {
                //             //     post(route("videos.save"));
                //             // } else {
                //             //     updateVideo();
                //             // }
                //
                //
                //
                //     })
                //     .catch(function (error) {
                //         setUploaded(0);
                //         toast.error(error.response?.data?.message);
                //     })
                //     .then(function () {
                //         setSpinner(false);
                //     });
            }else{
                createChunks();
            }
        } else if (videoFile === "" && video.id !== null) {
            if(checked){
                console.log('gg');
                post(route("preview.update", { video: video.id }));

            }else{
                updateVideo();
            }
        }
    };

    const updateVideo = () => {
        post(route("preview.update", { video: video.id }));
    };

    // console.log('video.category_id',typeof video.category_id , video.category_id)

    // console.log('video.selectedModel',video.selectedModel);

    console.log(data, "data");
    console.log(video, "video");

    const formattedSystemVideoOptions = systemVideo.map(video => {
        const englishLabel = video?.label?.en;
        const germanLabel = video?.label?.ogValue?.title_lang;

        return {
            value: video?.value,
            label: englishLabel || germanLabel || 'Untitled Video'
        };
    });

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
                                ? __("Upload Preview")
                                : __("Edit Preview")}
                        </h2>

                        <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                            {__("Upload a new Preview")}
                        </p>

                        <PrimaryButton
                            onClick={(e) => Inertia.visit(route("preview.list"))}
                        >
                            {__("<< Back to Previews")}
                        </PrimaryButton>
                    </header>

                    <hr className="my-5" />
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="mb-5">
                            <InputLabel for="title" value={__("Title")} />

                            <TextInput
                                name="title_en_val"
                                value={data.title_en_val}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />

                            <InputError
                                message={errors.title_en_val}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">
                            <InputLabel htmlFor="title_lang" value={__("Select Title Language")} />
                            <select
                                name="title_lang"
                                value={data.title_lang}
                                onChange={onTitleLangChange}
                                className="mt-1 block w-full md:w-1/2 ..."
                            >
                                <option value="">{__("--Select--")}</option>
                                {supportedLocales && supportedLocales.map((locale) => (
                                    <option key={`title-locale-${locale.lang_value}`} value={locale.lang_value}>
                                        {locale.lang_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {data.title_lang && (
                            <div className="mb-5">
                                <InputLabel
                                    htmlFor="title_de"
                                    value={`${supportedLocales?.find((l) => l.lang_value === data.title_lang)?.lang_name || 'Translated'} Title`}
                                />
                                <TextInput
                                    name="title_de"
                                    value={data.title_de}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full md:w-1/2"
                                />
                            </div>
                        )}

                        <div className="mb-5">
                            <InputLabel for="category" value={__("Category")} />

                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                style={{ width: '50%' }}
                                placeholder="Please this  select"
                                defaultValue={video.selectedCategory}
                                onChange={handleCategoryChange}
                                options={categories}
                                optionFilterProp="label"
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

                            {/*<select*/}
                            {/*    name="model_id"*/}
                            {/*    value={data?.model_id}*/}
                            {/*    onChange={onHandleChange}*/}
                            {/*    className={`mt-1 block w-full md:w-1/2 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm `}*/}
                            {/*>*/}
                            {/*    <option value="">{__("--Select--")}</option>*/}
                            {/*    {models.map((c) => (*/}
                            {/*        <option*/}
                            {/*            key={`category-${c.id}`}*/}
                            {/*            value={c.id}*/}
                            {/*        >*/}
                            {/*            {c.name}*/}
                            {/*        </option>*/}
                            {/*    ))}*/}
                            {/*</select>*/}

                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                style={{ width: '50%' }}
                                placeholder="Please select"
                                defaultValue={video.model_id === null ? [] : video.selectedModel}
                                onChange={handleModelChange}
                                options={models}
                                optionFilterProp="label"
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
                                defaultValue={video.tags === null ? [] : video.selectedTags}
                                onChange={handleTagChange}
                                options={tags}
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />

                            <InputError
                                message={errors.tag}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">

                            <InputLabel for="model" value={__("Full Video Link")} />

                            <Select
                                allowClear
                                showSearch
                                style={{ width: '50%' }}
                                placeholder="Please select"
                                defaultValue={video.video_id === null ? [] : video.fullVideoLink}
                                onChange={handleVideoLinkChange}
                                options={formattedSystemVideoOptions}
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />

                            <InputError
                                message={errors.video_id}
                                className="mt-2"
                            />
                        </div>

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
                                    {__("tokens")} {__('0 = Free')}
                                </div>
                            </div>

                            <InputError
                                message={errors.price}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">
                            <InputLabel
                                for="thumbnail"
                                value={__(
                                    "Thumbnail - helps to attract sales (will be resized to 640x320px)"
                                )}
                            />
                            {isEdit && (
                                <>
                                    <span className="text-red-900"> {__('Upload only if you want to make a change')}</span>
                                </>
                            )}

                            <TextInput
                                className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                type="file"
                                name="thumbnail"
                                handleChange={(e) =>
                                    setData("thumbnail", e.target.files[0])
                                }
                                required={video.id === null}
                            />

                            <InputError
                                message={errors.thumbnail}
                                className="mt-2"
                            />
                        </div>

                        {/*<div>*/}
                        {/*    <label>*/}
                        {/*        <Switch onChange={handleChange} checked={data.is_from_ftp} />*/}
                        {/*        Select video from ftp?*/}
                        {/*    </label>*/}
                        {/*</div>*/}

                        {!checked && <div className="mb-5">
                            <InputLabel for="video" value={__("Video")} />

                            {isEdit && (
                                <>
                                    <span className="text-red-900"> {__('Upload only if you want to make a change')}</span>
                                </>
                            )}

                            <TextInput
                                className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                type="file"
                                name="video"
                                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/qt,video/mov"
                                handleChange={(e) =>
                                    setVideoFile(e.target.files[0])
                                }
                                required={video.id === null}
                            />

                            <InputError
                                message={errors.video_file}
                                className="mt-2"
                            />
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
                            <InputLabel for="description_en_val" value={__("Description")} />

                            <Textarea
                                name="description_en_val"
                                value={data.description_en_val}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />

                            <InputError
                                message={errors.description_en_val}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">
                            <InputLabel htmlFor="description_lang" value={__("Select Description Language")} />
                            <select
                                name="description_lang"
                                value={data.description_lang}
                                onChange={onDescriptionLangChange}
                                className="mt-1 block w-full md:w-1/2"
                            >
                                <option value="">{__("--Select--")}</option>
                                {supportedLocales && supportedLocales.map((locale) => (
                                    <option key={`desc-locale-${locale.lang_value}`} value={locale.lang_value}>
                                        {locale.lang_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {data.description_lang && (
                             <div className="mb-5">
                                <InputLabel
                                    htmlFor="description_de"
                                    value={`${supportedLocales?.find((l) => l.lang_value === data.description_lang)?.lang_name} ${__("Description")}`}
                                />
                                <Textarea
                                    name="description_de"
                                    value={data.description_de}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full md:w-1/2"
                                />
                            </div>
                        )}

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
                        </div>

                        {/* Terms Checkbox */}
                        <div className="mt-4">
                            <Checkbox
                                name="is_terms"
                                checked={data.is_terms}
                                handleChange={onHandleChange}
                            />
                            <span className="mx-2">
                                {__(' Agree to ')}
                                <a href="policy/Terms.pdf" className="underline" target="_blank">
                                    {__('Terms and Conditions')}
                                </a>
                            </span>
                            <InputError message={errors.is_terms} className="mt-2" />
                        </div>

                        {/* Agreement Checkbox */}
                        <div className="mt-4">
                            <Checkbox
                                name="is_agreement" // Corrected the spelling
                                checked={data.is_agreement}
                                handleChange={onHandleChange}
                            />
                            <span className="mx-2">
                                {__(' Agree to ')}
                                <a href="policy/Streamer-Agreement.pdf" className="underline" target="_blank">
                                    {__('Agreement')}
                                </a>
                            </span>
                            <InputError message={errors.is_agreement} className="mt-2" />
                        </div>

                        {/* Rules Checkbox */}
                        <div className="mt-4">
                            <Checkbox
                                name="is_rules"
                                checked={data.is_rules}
                                handleChange={onHandleChange}
                            />
                            <span className="mx-2">
                                {__(' Agree to ')}
                                <a href="policy/Content-Rules.pdf" className="underline" target="_blank">
                                    {__('Rules')}
                                </a>
                            </span>
                            <InputError message={errors.is_rules} className="mt-2" />
                        </div>


                        <div className="flex justify-between items-center mt-2">
                            <PrimaryButton processing={processing || spinner}>
                                {video.id === null
                                    ? __("Save Preview")
                                    : __("Update Preview")}
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
