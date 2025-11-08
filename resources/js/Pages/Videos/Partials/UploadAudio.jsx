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
import Checkbox from "@/Components/Checkbox";


export default function UploadAudio({ audio, ogValue, categories, models, tags, fileNames, supportedLocales,
    selectedCategoryIds, selectedModelIds, selectedTagNames }) {

    // --- useForm state ---
    const { data, setData, post, processing, errors, progress } = useForm({
        title_en: ogValue?.title?.en || "",
        title_lang: ogValue?.title_lang || "",
        title_lang_val: ogValue?.title?.[ogValue?.title_lang] || "",

        description_en: ogValue?.description?.en || "",
        description_lang: ogValue?.description_lang || "",
        description_lang_val: ogValue?.description?.[ogValue?.description_lang] || "",

        tag: tags || [],
        category_id: audio.category_id || [],
        model_id: audio.model_id || [],
        price: audio.price || "",
        free_for_subs: audio.free_for_subs || false,
        is_from_ftp: audio.is_from_ftp || false,

        audio_file_input: null, // Nayi local file ke liye
        audio_file: audio?.audio_file || "", // Purana/FTP file path

        thumbnail: null, // Nayi file ke liye, shuru mein hamesha null

        is_terms: typeof audio.is_terms === 'boolean' ? audio.is_terms : false,
        is_agreement: typeof audio.is_agreement === 'boolean' ? audio.is_agreement : false,
        is_rules: typeof audio.is_rules === 'boolean' ? audio.is_rules : false,
        seo: {
            h2: audio.seoDeatils?.h2 || "",
            keyword: audio.seoDeatils?.keyword || "",
            meta_keyword: audio.seoDeatils?.meta_keyword || "",
            desc: audio.seoDeatils?.desc || "",
            og_title: audio.seoDeatils?.og_title || "",
            og_desc: audio.seoDeatils?.og_desc || "",
            meta_robot: audio.seoDeatils?.meta_robot || "",
            cust_url: audio.seoDeatils?.cust_url || "",
            og_image_url: audio.seoDeatils?.og_image_url || "",
            json_id: audio.seoDeatils?.json_id || ""
        }
    });

    const [audioFileObject, setAudioFileObject] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(audio.thumbnail ? `/${audio.thumbnail}` : null);

    // --- Local States ---
    const [audioFile, setAudioFile] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [uploaded, setUploaded] = useState(0);
    const [checked, setChecked] = useState(audio.is_from_ftp === 1);
    const [selectedCategories, setSelectedCategories] = useState(selectedCategoryIds || []);
    const [selectedModels, setSelectedModels] = useState(selectedModelIds || []);
    const [selectedTags, setSelectedTags] = useState(selectedTagNames || []);

    // --- Handle FTP Switch ---
    const handleChange = () => {
        setChecked(!checked);
        setData('is_from_ftp', !checked);
    };

    const handleFtpChange = (checked) => { setData('is_from_ftp', checked); };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setData("thumbnail", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setThumbnailPreview(reader.result); };
            reader.readAsDataURL(file);
        } else {
            setThumbnailPreview(audio.thumbnail ? `/${audio.thumbnail}` : null);
        }
    };

    // --- Initialize form on edit ---
    useEffect(() => {
        if (audio) {
            setData({
                title_en: ogValue?.title?.en || "",
                title_lang: ogValue?.title_lang || "",
                title_lang_val: ogValue?.title?.[ogValue?.title_lang] || "",
                description_en: ogValue?.description?.en || "",
                description_lang: ogValue?.description_lang || "",
                description_lang_val: ogValue?.description?.[ogValue?.description_lang] || "",
                tag: audio.tags && typeof audio.tags === 'string' ? audio.tags.split(',') : [],
                category_id: audio.category_id || [],
                model_id: audio.model_id || [],
                price: audio.price || "",
                free_for_subs: audio.free_for_subs || false,
                thumbnail: "",
                audio_file: audio.audio_file || "",
                is_terms: typeof audio.is_terms === 'boolean' ? audio.is_terms : false,
                is_agreement: typeof audio.is_agreement === 'boolean' ? audio.is_agreement : false,
                is_rules: typeof audio.is_rules === 'boolean' ? audio.is_rules : false,
                seo: audio.seo || {}
            });
            setChecked(audio.is_from_ftp === 1);
            setSelectedCategories(audio.category_id || []);
            setSelectedModels(audio.model_id || []);
            setSelectedTags(audio.tags && typeof audio.tags === 'string' ? audio.tags.split(',') : []);
        }
    }, [audio]);

    const handleAudioFileChange = (e) => {
        const file = e.target.files[0];
        setAudioFileObject(file);
        setData('audio_file_input', file);
    };

    const handleFtpAudioChange = (value) => {
        setAudioFileObject(null);
        setData('audio_file', 'audio/' + value);
    };

    // --- Handle Title Language Change ---
    const onTitleLangChange = (e) => {
        const lang = e.target.value;
        const titleTranslations = audio.title || {};
        setData(data => ({
            ...data,
            title_lang: lang,
            title_lang_val: titleTranslations[lang] || ""
        }));
    };

    // --- Handle Description Language Change ---
    const onDescriptionLangChange = (e) => {
        const lang = e.target.value;
        const descTranslations = audio.description || {};
        setData(data => ({
            ...data,
            description_lang: lang,
            description_lang_val: descTranslations[lang] || ""
        }));
    };

    // --- Handle Audio File from FTP ---
    const handleAudioChange = (value) => {
        setAudioFile(value);
        setData('audio_file', 'audio/' + value);
        setData('is_from_ftp', checked);
    };

    // --- Handle Tags, Categories, Models ---
    const handleTagChange = (value) => {
        setSelectedTags(value);
        setData('tag', value);
    };
    const handleCategoryChange = (value) => {
        setSelectedCategories(value);
        setData('category_id', value);
    };
    const handleModelChange = (value) => {
        setSelectedModels(value);
        setData('model_id', value);
    };

    // --- Handle normal input changes ---
    const onHandleChange = (event) => {
        const { name, type, checked, value } = event.target;
        if (name.startsWith("seo.")) {
            setData("seo", { ...data.seo, [name.split(".")[1]]: type === "checkbox" ? checked : value });
        } else {
            setData(name, type === "checkbox" ? checked : value);
        }
    };

    // --- Show errors using toast ---
    useEffect(() => {
        if (Object.keys(errors).length) {
            Object.keys(errors).forEach((key) => {
                toast.error(errors[key]);
            });
        }
    }, [errors]);

    // --- Chunk Upload ---
    useEffect(() => {
        if (chunks.length > 0) {
            uploadChunks();
        }
    }, [chunks]);

    // const createChunks = () => {
    //     setChunks([]);
    //     let size = 1024 * 1024 * 8; // 8MB
    //     let chunksCount = Math.ceil(audioFile.size / size);
    //     for (let i = 0; i < chunksCount; i++) {
    //         setChunks(chunks => [
    //             ...chunks,
    //             audioFile.slice(i * size, Math.min(i * size + size, audioFile.size), audioFile.type)
    //         ]);
    //     }
    // };

    // const uploadChunks = () => {
    //     setSpinner(true);
    //     const postData = new FormData();
    //     postData.append("media_type", "audio");
    //     postData.append("is_last", chunks.length === 1);
    //     postData.append("audio", audio.id || 0);
    //     postData.set("file", chunks[0], `${audioFile.name}.part`);

    //     axios.post(route("audio.uploadChunks"), postData, {
    //         onUploadProgress: (event) => setUploaded(uploaded + event.loaded)
    //     })
    //         .then((response) => {
    //             if (chunks.length <= 1) {
    //                 setChunks([]);
    //                 setUploaded(0);
    //                 setData('audio_file', response.data.result);

    //                 if (audio.id === null) saveAudio();
    //                 else updateAudio();
    //             }
    //             let chunksArray = [...chunks];
    //             chunksArray.splice(0, 1);
    //             setChunks(chunksArray);
    //         })
    //         .catch((error) => {
    //             setUploaded(0);
    //             toast.error(error.response?.data?.message || 'Upload failed');
    //         })
    //         .finally(() => setSpinner(false));
    // };

    const createChunks = () => {
        if (!audioFileObject) return; // Agar file nahi hai to kuch na karein
        setChunks([]);
        let size = 1024 * 1024 * 8;
        let chunksCount = Math.ceil(audioFileObject.size / size); // Sahi state ka use karein
        for (let i = 0; i < chunksCount; i++) {
            setChunks((prev) => [...prev, audioFileObject.slice(i * size, Math.min(i * size + size, audioFileObject.size))]);
        }
    };

    const uploadChunks = () => {
        if (!audioFileObject) return; // Double check
        setSpinner(true);
        const postData = new FormData();
        postData.append("media_type", "audio");
        postData.append("is_last", chunks.length === 1);
        postData.append("audio", audio.id || 0);
        postData.set("file", chunks[0], `${audioFileObject.name}.part`); // Sahi state ka use karein

        axios.post(route("audio.uploadChunks"), postData, {
            onUploadProgress: (event) => setUploaded((prev) => prev + event.loaded),
        }).then(function (response) {
            if (chunks.length <= 1) {
                setChunks([]);
                setUploaded(0);
                setData('audio_file', response.data.result);
                if (!audio.id) {
                    saveAudio();
                } else {
                    updateAudio();
                }
            }
            setChunks((prev) => prev.slice(1));
        }).catch(function (error) {
            setUploaded(0);
            toast.error(error.response?.data?.message || "Chunk upload failed.");
        }).finally(() => {
            if (chunks.length === 1) setSpinner(false);
        });
    };

    // --- Save / Update Audio ---
    const saveAudio = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to save this audio?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, save it!",
            cancelButtonText: "No, cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                post(route("audio.saveAudio"));
                Swal.fire("Saved!", "Your audio has been saved.", "success");
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "Your audio has not been saved", "error");
            }
        });
    };

    const updateAudio = () => {
        post(route("audio.update", { audio: audio.id }));
    };

    // --- Form Submit ---
    // const submit = (e) => {
    //     e.preventDefault();

    //     if (!data.is_terms) { toast.error(__('Please agree to terms and conditions')); return; }
    //     if (!data.is_agreement) { toast.error(__('Please agree to the agreement')); return; }
    //     if (!data.is_rules) { toast.error(__('Please agree to the rules')); return; }

    //     if (audio.id === null && !audioFile) {
    //         toast.error(__('Please select an audio file'));
    //         return;
    //     }

    //     if (audioFile) {
    //         if (checked) {
    //             setSpinner(true);
    //             if (audio.id === null) saveAudio();
    //             else updateAudio();
    //             setSpinner(false);
    //         } else createChunks();
    //     } else if (!audioFile && audio.id !== null) {
    //         if (checked) post(route("audio.update", { audio: audio.id }));
    //         else updateAudio();
    //     }
    // };

    const submit = (e) => {
        e.preventDefault();

        if (!data.is_terms || !data.is_agreement || !data.is_rules) {
            toast.error(__('Please agree to all terms, agreements, and rules.'));
            return;
        }

        const isEditing = !!audio.id;
        const hasNewLocalAudioFile = audioFileObject instanceof File;

        // Validation sirf ADD mode mein
        if (!isEditing) {
            if (!data.thumbnail) { toast.error(__('Thumbnail is required.')); return; }
            if (!data.is_from_ftp && !hasNewLocalAudioFile) { toast.error(__('Audio file is required for local upload.')); return; }
            if (data.is_from_ftp && !data.audio_file) { toast.error(__('Please select an audio file from FTP.')); return; }
        }

        setSpinner(true);

        if (hasNewLocalAudioFile && !data.is_from_ftp) {
            createChunks(); // Nayi local file hai, to upload shuru karo
        } else {
            // Agar FTP se hai, ya edit mode mein koi nayi file nahi hai, to seedhe save/update karo
            if (isEditing) {
                updateAudio();
            } else {
                saveAudio();
            }
            setSpinner(false);
        }
    };

    console.log(data, "data");

    return (
        <AuthenticatedLayout>
            <Head title={__("Upload audio")} />
            <div className="lg:flex lg:space-x-10">
                <AccountNavi active="upload-audio" />
                <div className="p-4 sm:p-8 bg-white w-full dark:bg-zinc-900 shadow sm:rounded-lg">
                    <header className="mb-5">
                        <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
                            <MdVideoLibrary className="mr-2" />
                            {audio.id === null ? __("Upload audio") : __("Edit audio")}
                        </h2>
                        <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                            {__("Upload a new audio")}
                        </p>
                        <PrimaryButton onClick={(e) => Inertia.visit(route("audio.list"))}>
                            {__("<< Back to audio")}
                        </PrimaryButton>
                    </header>

                    <hr className="my-5" />
                    <form onSubmit={submit} encType="multipart/form-data">
                        {/* Title Inputs */}
                        <div className="mb-5">
                            <InputLabel for="title_en" value={__("Title")} />
                            <TextInput
                                name="title_en"
                                value={data.title_en || audio.title_en || audio.title || ""}
                                handleChange={(e) => setData("title_en", e.target.value)}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />
                            <InputError message={errors.title_en} className="mt-2" />
                        </div>

                        {/* Title Language Dropdown */}
                        <div className="mb-5">
                            <InputLabel htmlFor="title_lang" value={__("Select Title Language")} />
                            <select
                                name="title_lang"
                                value={data.title_lang}
                                onChange={onTitleLangChange}
                                className="mt-1 block w-full md:w-1/2 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">{__("--Select--")}</option>
                                {supportedLocales && supportedLocales.map((locale) => (
                                    <option key={`title-locale-${locale.lang_value}`} value={locale.lang_value}>
                                        {locale.lang_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-5">
                            <InputLabel
                                htmlFor="title_lang_val"
                                value={`${supportedLocales.find((l) => l.lang_value === data.title_lang)?.lang_name || 'Translated'} Title`}
                            />
                            <TextInput
                                name="title_lang_val"
                                value={data.title_lang_val}
                                handleChange={onHandleChange}
                                className="mt-1 block w-full md:w-1/2"
                            />
                            <InputError message={errors.title_lang_val} className="mt-2" />
                        </div>

                        {/* Category Select */}
                        <div className="mb-5">
                            <InputLabel for="category" value={__("Category")} />
                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                style={{ width: '50%' }}
                                placeholder="Please select"
                                value={selectedCategories} // `defaultValue` ki jagah `value` ka istemal karein
                                onChange={handleCategoryChange}
                                options={categories} // Dropdown ke options
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
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
                                value={selectedModels} // `defaultValue` ki jagah `value`
                                onChange={handleModelChange}
                                options={models}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
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
                                value={selectedTags} // `defaultValue` ki jagah `value`
                                onChange={handleTagChange}
                                options={tags}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />

                            <InputError
                                message={errors.tag}
                                className="mt-2"
                            />
                        </div>

                        {/* Price */}
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
                                        className="mt-1 w-32"
                                    />
                                    <div className="ml-1 dark:text-white text-gray-700">{__("tokens")}</div>
                                </div>
                                <InputError message={errors.price} className="mt-2" />
                            </div>

                            <div className="mb-5">
                                <InputLabel for="free_for_subs" value={__("Free for subscribers?")} />
                                <select
                                    name="free_for_subs"
                                    value={data.free_for_subs}
                                    onChange={onHandleChange}
                                    required
                                    className="mt-1 block w-32 border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                >
                                    <option value="yes">{__("Yes")}</option>
                                    <option value="no">{__("No")}</option>
                                </select>
                                <InputError message={errors.free_for_subs} className="mt-2" />
                            </div>
                        </div>

                        {/* Thumbnail */}
                        {/* <div className="mb-5">
                            <InputLabel for="thumbnail" value={__("Thumbnail")} />
                            <TextInput
                                className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                type="file"
                                name="thumbnail"
                                handleChange={(e) => setData("thumbnail", e.target.files[0])}
                                required={audio.id === null}
                            />
                            <InputError message={errors.thumbnail} className="mt-2" />
                        </div> */}
                        {/* <div className="mb-5">
                            <InputLabel htmlFor="thumbnail" value={__("Thumbnail")} />
                            <TextInput
                                className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                type="file"
                                name="thumbnail"
                                handleChange={handleThumbnailChange} // Yahan `handleChange` use karna galat hai, file ke liye alag handler chahiye
                                required={!audio.id}
                            />
                            <InputError message={errors.thumbnail} className="mt-2" />
                            {thumbnailPreview && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">Preview:</p>
                                    <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-20 w-auto rounded-md border p-1" />
                                </div>
                            )}
                        </div> */}
                         <div className="mb-5">
                            <InputLabel for="thumbnail" value={__("Thumbnail")} />
                            <TextInput
                                className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                type="file"
                                name="thumbnail"
                                handleChange={(e) => setData("thumbnail", e.target.files[0])}
                                required={audio.id === null}
                            />
                            <InputError message={errors.thumbnail} className="mt-2" />
                        </div>

                        {/* FTP Switch */}
                        <div className="mb-5">
                            <label>
                                <Switch onChange={handleChange} checked={data.is_from_ftp} />
                                Select audio from FTP?
                            </label>
                        </div>

                        {/* Audio File */}
                        {/* {!checked && (
                            <div className="mb-5">
                                <InputLabel for="audio" value={__("Audio")} />
                                <TextInput
                                    className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                    type="file"
                                    name="audio_file"
                                    accept="audio/mp3,audio/mpeg,audio/ogg"
                                    handleChange={(e) => setAudioFile(e.target.files[0])}
                                    required={audio.id === null}
                                />
                                <InputError message={errors.audio_file} className="mt-2" />
                            </div>
                        )}

                        {checked && (
                            <div className="mt-2">
                                <Select
                                    style={{ width: "50%" }}
                                    placeholder="Please select"
                                    value={audio.audio_file}
                                    onChange={handleAudioChange}
                                    options={fileNames}
                                />
                            </div>
                        )} */}
                        {data.is_from_ftp ? (
                            <div className="mt-2">
                                <InputLabel value={__("Select FTP Audio File")} />
                                <Select
                                    style={{ width: "50%" }}
                                    placeholder={__("Please select")}
                                    value={data.audio_file ? data.audio_file.replace('audio/', '') : undefined}
                                    onChange={handleFtpAudioChange}
                                    options={fileNames}
                                    required={!audio.id}
                                />
                                <InputError message={errors.audio_file} className="mt-2" />
                            </div>
                        ) : (
                            <div className="mb-5">
                                <InputLabel htmlFor="audio_file" value={__("Upload Audio File")} />
                                {audio.audio_file && !audioFileObject && (
                                    <p className="text-sm text-gray-500 mt-1">Current file: {audio.audio_file.split('/').pop()}</p>
                                )}
                                {/* <TextInput
                                    className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                    type="file"
                                    name="audio_file"
                                    accept="audio/mp3,audio/mpeg,audio/ogg"
                                    handleChange={handleAudioFileChange} // Yahan bhi `handleChange` galat tha
                                    required={!audio.id && !data.is_from_ftp}
                                /> */}
                                <TextInput
                                    className="p-1 block w-full md:w-1/2 ..."
                                    type="file"
                                    name="audio_file_input"
                                    accept="audio/mp3,audio/mpeg,audio/ogg"
                                    handleChange={handleAudioFileChange} // Sahi handler use karein
                                    required={!audio.id && !data.is_from_ftp}
                                />
                                <InputError message={errors.audio_file} className="mt-2" />
                                {audioFileObject && <p className="text-sm text-gray-500 mt-1">New file selected: {audioFileObject.name}</p>}
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-5">
                            <InputLabel for="description_en" value={__("Description (English)")} />
                            <Textarea
                                name="description_en"
                                value={data.description_en || ''}  // Using data from useForm state
                                handleChange={(e) => setData("description_en", e.target.value)}  // Update useForm state
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />
                            <InputError message={errors.description_en} className="mt-2" />
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
                                {supportedLocales.map((locale) => (
                                    <option key={locale.lang_value} value={locale.lang_value}>
                                        {locale.lang_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-5">
                            <InputLabel
                                htmlFor="description_lang_val"
                                value={`${supportedLocales.find((l) => l.lang_value === data.description_lang)?.lang_name} ${__("Description")}`}
                            />
                            <Textarea
                                name="description_lang_val"
                                value={data.description_lang_val}
                                handleChange={onHandleChange}
                                className="mt-1 block w-full md:w-1/2"
                            />
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
                                name="is_agreement"
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

                        <div className="mt-5">
                            <PrimaryButton type="submit" processing={processing} disabled={processing}>
                                {audio.id === null ? __("Upload") : __("Save Changes")}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}



