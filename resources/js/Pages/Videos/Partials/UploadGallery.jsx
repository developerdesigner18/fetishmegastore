import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import Textarea from "@/Components/Textarea";
import PrimaryButton from "@/Components/PrimaryButton";
import __ from "@/Functions/Translate";
import {toast} from "react-toastify";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {usePage, useForm, Head, Link} from "@inertiajs/inertia-react";
import {Inertia} from "@inertiajs/inertia";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/Components/Spinner";
import {MdVideoLibrary} from "react-icons/md/index.js";
import AccountNavi from "@/Pages/Channel/Partials/AccountNavi";
import {Select, Switch, Popconfirm} from 'antd';
import Swal from "sweetalert2";
import { XCircle } from "lucide-react";
import Checkbox from "@/Components/Checkbox";

export default function UploadVideo({video, ogValue, categories, tags, models, systemVideo, isEdit, supportedLocales}) {
    console.log('gallery', video);
    const {data, setData, post, processing, errors, progress} = useForm({
        title_en: ogValue?.title?.en || "",
        title_lang: ogValue?.title_lang || "",
        title_de: ogValue?.title?.[ogValue?.title_lang] || "",

        description_en: ogValue?.description?.en || "",
        description_lang: ogValue?.description_lang || "",
        description_de: ogValue?.description?.[ogValue?.description_lang] || "",

        tag: video?.tag,
        category_id: video?.category_id,
        model_id: video?.model_id,
        video_id: video?.video_id,
        price: video?.price,
        thumbnail: "",
        images: [],  // Update images to be an array
        temp_gallery: video?.galleryUrl,
        is_terms: "",
        is_agreement: "",
        is_rules: "",
        seo: {
            h2: video?.seoDeatils?.h2,
            keyword: video?.seoDeatils?.keyword,
            meta_keyword: video?.seoDeatils?.meta_keyword,
            desc: video?.seoDeatils?.desc
        }
    });

    const [tempGallery, setTempGallery] = useState(video?.galleryUrl || []);

    const removeImage = (index, e) => {
        e.preventDefault(); // Prevent form submission
        e.stopPropagation(); // Stop event bubbling (optional)

        const updatedGallery = tempGallery.filter((_, i) => i !== index);
        setTempGallery(updatedGallery);
        setData("temp_gallery", updatedGallery); // Ensure form data is updated
    };
    // useEffect(() => {
    //    data.temp_gallery = video.galleryUrl
    // }, []);

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

    const handleTagChange = (value) => {
        console.log('selected tag ${value}');
        data.tag = value;
    };

    const handleVideoLinkChange = (value) => {
        console.log(`selected video ${value}`);
        data.video_id = value;
    };

    const handleCategoryChange = (value) => {
        console.log('selected category ${value}');
        data.category_id = value;
    };

    const handleModelChange = (value) => {
        console.log('selected model ${value}');
        data.model_id = value;
    };

    const onHandleChangeTitle = (event) => {
        console.log('onHandleChangeTitle', event);
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
    const onHandleChange = (event) => {
        const {name, type, checked, value} = event.target;
        if (name.startsWith("seo.")) {
            setData("seo", {...data.seo, [name.split(".")[1]]: type === "checkbox" ? checked : value});
        } else {
            setData(name, type === "checkbox" ? checked : value);
        }
    };

    useEffect(() => {
        if (Object.keys(errors).length) {
            Object.keys(errors).map((key) => {
                toast.error(errors.key);
            });
        }
    }, [errors]);

    const onImagesChange = (event) => {
        // Convert the FileList to an array and set it in the data
        setData("images", Array.from(event.target.files));
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

        if (video.id === null) {
            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to save this gallery?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, save it!",
                cancelButtonText: "No, cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    // If confirmed, proceed with the API call
                    post(route("gallery.save"), {
                        forceFormData: true, // Ensures files are sent correctly
                    });

                    Swal.fire(
                        "Saved!",
                        "Your gallery has been saved.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire(
                        "Cancelled",
                        "Your gallery has not been saved",
                        "error"
                    );
                }
            });
        } else {
            updateVideo();
        }

    };
    const updateVideo = () => {
        post(route("gallery.update", {video: video.id}));
    };

    console.log(data,"data");
    console.log(video,"video");

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
            <Head title={__("Upload Video")}/>
            <div className="lg:flex lg:space-x-10">
                <AccountNavi active="upload-videos"/>
                <div className="p-4 sm:p-8 bg-white w-full dark:bg-zinc-900 shadow sm:rounded-lg">
                    <header className="mb-5">
                        <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
                            <MdVideoLibrary className="mr-2"/>
                            {__("Upload Gallery")}
                        </h2>
                        <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                            {__("Upload a new Gallery")}
                        </p>
                        <PrimaryButton onClick={(e) => Inertia.visit(route("gallery.list"))}>
                            {__("<< Back to Gallery")}
                        </PrimaryButton>
                    </header>
                    <hr className="my-5"/>

                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="mb-5">
                            <InputLabel for="title" value={__("Title")}/>

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
                            <InputLabel htmlFor="title_lang" value={__("Select Additional Language for Title")} />
                            <select className="mt-1 block w-full md:w-1/2" name="title_lang" value={data.title_lang} onChange={onTitleLangChange}>
                                <option value="">--Select--</option>
                                {supportedLocales && supportedLocales.map((locale) => (
                                    <option key={`title-locale-${locale.lang_value}`} value={locale.lang_value}>
                                        {locale.lang_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Dynamic Title Input */}
                        {data.title_lang && (
                            <div className="mb-5">
                                <InputLabel htmlFor="title_de" value={`Title (${supportedLocales?.find(l => l.lang_value === data.title_lang)?.lang_name})`} />
                                <TextInput className="mt-1 block w-full md:w-1/2" name="title_de" value={data.title_de} handleChange={onHandleChange} />
                            </div>
                        )}

                        <div className="mb-5">
                            <InputLabel for="category" value={__("Category")}/>

                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                style={{width: '50%'}}
                                placeholder="Please select"
                                defaultValue={video.category_id == "" ? [] : video.selectedCategory}
                                onChange={handleCategoryChange}
                                options={categories}
                            />

                            <InputError
                                message={errors.category_id}
                                className="mt-2"
                            />

                        </div>

                        <div className="mb-5">
                            <InputLabel for="model" value={__("Model")}/>


                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                style={{width: '50%'}}
                                placeholder="Please select"
                                defaultValue={video.model_id === null ? [] : video.selectedModel}
                                onChange={handleModelChange}
                                options={models}
                            />

                            <InputError
                                message={errors.model_id}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">
                            <InputLabel for="tag" value={__("Tags")}/>

                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                style={{width: '50%'}}
                                placeholder="Please select"
                                defaultValue={video.tags === null ? [] : video.selectedTags}
                                onChange={handleTagChange}
                                options={tags}
                            />

                            <InputError
                                message={errors.tag}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">

                            <InputLabel for="model" value={__("Full Video Link")}/>

                            <Select
                                allowClear
                                showSearch
                                style={{width: '50%'}}
                                placeholder="Please select"
                                defaultValue={video.video_id === null ? [] : video.fullVideoLink}
                                onChange={handleVideoLinkChange}
                                options={formattedSystemVideoOptions}
                            />

                            <InputError
                                message={errors.video_id}
                                className="mt-2"
                            />
                        </div>
                        <div className="mb-5">
                            <InputLabel for="price" value={__("Price")}/>

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
                                    <span
                                        className="text-red-900"> {__('Upload only if you want to make a change')}</span>
                                </>
                            )}

                            <TextInput
                                className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                type="file"
                                name="thumbnail"
                                handleChange={(e) =>
                                    setData("thumbnail", e.target.files[0])
                                }
                                // required={video.id === null}
                            />

                            <InputError
                                message={errors.thumbnail}
                                className="mt-2"
                            />
                        </div>

                        {/* New Multiple Images Input */}
                        <div className="mb-5">
                            <InputLabel for="images" value={__("Images (Select multiple)")}/>
                            {isEdit && (
                                <>
                                    <span className="text-red-900"> {__('This will add new images')}</span>
                                </>
                            )}
                            <input
                                type="file"
                                name="images"
                                multiple
                                onChange={onImagesChange}
                                className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                            />
                            <InputError message={errors.images} className="mt-2"/>
                        </div>

                        <div className="mb-5">
                            <InputLabel htmlFor="description_en" value={__("Description (English)")} />
                            <Textarea className="mt-1 block w-full md:w-1/2" name="description_en" value={data.description_en} handleChange={onHandleChange} />
                            <InputError message={errors.description_en} />
                        </div>
                        
                        {/* Language Selector for Description */}
                        <div className="mb-5">
                            <InputLabel htmlFor="description_lang" value={__("Select Additional Language for Description")} />
                            <select className="mt-1 block w-full md:w-1/2" name="description_lang" value={data.description_lang} onChange={onDescriptionLangChange}>
                                <option value="">--Select--</option>
                                {supportedLocales && supportedLocales.map((locale) => (
                                    <option key={`desc-locale-${locale.lang_value}`} value={locale.lang_value}>
                                        {locale.lang_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Dynamic Description Input */}
                        {data.description_lang && (
                            <div className="mb-5">
                                <InputLabel htmlFor="description_de" value={`Description (${supportedLocales?.find(l => l.lang_value === data.description_lang)?.lang_name})`} />
                                <Textarea className="mt-1 block w-full md:w-1/2" name="description_de" value={data.description_de} handleChange={onHandleChange} />
                            </div>
                        )}

                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-4">Current Gallery</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {tempGallery.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={img.link}
                                            alt={`Gallery ${index}`}
                                            className="w-full h-32 object-cover rounded-lg shadow-md"
                                        />
                                        <button
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100"
                                            onClick={(e) => removeImage(index, e)} // Pass event explicitly
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <hr className="mt-3"/>

                        <label>SEO</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel for="seo_h2" value="H2"/>
                                <TextInput
                                    name="seo.h2"
                                    value={data.seo.h2}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_keyword" value="Keyword"/>
                                <TextInput
                                    name="seo.keyword"
                                    value={data.seo.keyword}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_meta_keyword" value="Meta Keyword"/>
                                <TextInput
                                    name="seo.meta_keyword"
                                    value={data.seo.meta_keyword}
                                    handleChange={onHandleChange}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel for="seo_desc" value="Meta Description"/>
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
                            <InputError message={errors.is_terms} className="mt-2"/>
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
                            <InputError message={errors.is_agreement} className="mt-2"/>
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
                            <InputError message={errors.is_rules} className="mt-2"/>
                        </div>


                        <PrimaryButton processing={processing}>
                            {__("Save Gallery")}
                        </PrimaryButton>

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

