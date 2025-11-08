import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/inertia-react"; // <<--- YEH LINE THEEK KI GAYI HAI
import __ from "@/Functions/Translate";
import { toast } from "react-toastify";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import Textarea from "@/Components/Textarea";
import PrimaryButton from "@/Components/PrimaryButton";
import { Select, Switch } from 'antd';
import Swal from "sweetalert2";
import Checkbox from "@/Components/Checkbox";
import AccountNavi from "@/Pages/Channel/Partials/AccountNavi";
import { MdVideoLibrary } from "react-icons/md";

export default function UploadEbook({ ebook, ogValue, categories, models, tags, fileNames, supportedLocales,
    selectedCategoryIds, selectedModelIds, selectedTagNames }) {

    const { data, setData, post, processing, errors, progress } = useForm({
        title_en: ogValue?.title?.en || "",
        title_lang: ogValue?.title_lang || "",
        title_lang_val: ogValue?.title?.[ogValue?.title_lang] || "",

        description_en: ogValue?.description?.en || "",
        description_lang: ogValue?.description_lang || "",
        description_lang_val: ogValue?.description?.[ogValue?.description_lang] || "",

        tag: (ebook.tags && typeof ebook.tags === 'string' && ebook.tags) ? ebook.tags.split(',') : (selectedTagNames || []),
        category_id: (ebook.category_id && typeof ebook.category_id === 'string' && ebook.category_id) ? ebook.category_id.split(',').map(Number) : (selectedCategoryIds || []),
        model_id: (ebook.model_id && typeof ebook.model_id === 'string' && ebook.model_id) ? ebook.model_id.split(',').map(Number) : (selectedModelIds || []),
        
        price: ebook.price || "",
        free_for_subs: ebook.free_for_subs || "no",
        is_from_ftp: ebook.is_from_ftp === 1,

        thumbnail: "",
        ebook_file_input: null,
        ebook_file: ebook.ebook_file || "",

        is_terms: typeof ebook.is_terms === 'boolean' ? ebook.is_terms : false,
        is_agreement: typeof ebook.is_agreement === 'boolean' ? ebook.is_agreement : false,
        is_rules: typeof ebook.is_rules === 'boolean' ? ebook.is_rules : false,
        
        seo: {
            h2: ebook.seoDetails?.h2 || null,
            keyword: ebook.seoDetails?.keyword || null,
            meta_keyword: ebook.seoDetails?.meta_keyword || null,
            desc: ebook.seoDetails?.desc || null,
            og_title: ebook.seoDetails?.og_title || null,
            og_desc: ebook.seoDetails?.og_desc || null,
            meta_robot: ebook.seoDetails?.meta_robot || null,
            cust_url: ebook.seoDetails?.cust_url || null,
            og_image_url: ebook.seoDetails?.og_image_url || null,
            json_id: ebook.seoDetails?.json_id || null
        }
    });

    const [ebookFileObject, setEbookFileObject] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [uploaded, setUploaded] = useState(0);
    const [checked, setChecked] = useState(data.is_from_ftp);
    const [thumbnailPreview, setThumbnailPreview] = useState(ebook.thumbnail ? `/${ebook.thumbnail}` : null);

    const [selectedCategoriesAntd, setSelectedCategoriesAntd] = useState(
        (ebook.category_id && typeof ebook.category_id === 'string') ? ebook.category_id.split(',').map(Number) : (selectedCategoryIds || [])
    );

    const [selectedModelsAntd, setSelectedModelsAntd] = useState(
        (ebook.model_id && typeof ebook.model_id === 'string') ? ebook.model_id.split(',').map(Number) : (selectedModelIds || [])
    );

    const [selectedTagsAntd, setSelectedTagsAntd] = useState(
        (ebook.tags && typeof ebook.tags === 'string' && ebook.tags !== '') ? ebook.tags.split(',') : (selectedTagNames || [])
    );

    const handleChange = () => {
        setChecked(prev => {
            const newChecked = !prev;
            setData('is_from_ftp', newChecked);
            return newChecked;
        });
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setData("thumbnail", file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setThumbnailPreview(null);
        }
    };

    const handleEbookFileChange = (e) => {
        const file = e.target.files[0];
        setEbookFileObject(file);
        setData('ebook_file_input', file);
    };

    const handleFtpEbookChange = (value) => {
        setEbookFileObject(null);
        setData('ebook_file', value);
    };

    const handleTagChange = (value) => { setSelectedTagsAntd(value); };
    const handleCategoryChange = (value) => { setSelectedCategoriesAntd(value); };
    const handleModelChange = (value) => { setSelectedModelsAntd(value); };

    const onHandleChange = (event) => {
        const { name, type, checked, value } = event.target;
        if (name.startsWith("seo.")) {
            const seoField = name.split(".")[1];
            setData("seo", { ...data.seo, [seoField]: type === "checkbox" ? checked : value });
        } else {
            setData(name, type === "checkbox" ? checked : value);
        }
    };

    const onTitleLangChange = (e) => {
        const lang = e.target.value;
        const titleTranslations = ebook.title || {};
        setData(data => ({
            ...data,
            title_lang: lang,
            title_lang_val: titleTranslations[lang] || ""
        }));
    };

    const onDescriptionLangChange = (e) => {
        const lang = e.target.value;
        const descTranslations = ebook.description || {};
        setData(data => ({
            ...data,
            description_lang: lang,
            description_lang_val: descTranslations[lang] || ""
        }));
    };

    useEffect(() => {
        if (ebook) {
            setData(data => ({
                ...data,
                title_en: ogValue?.title?.en || "",
                title_lang: ogValue?.title_lang || "",
                title_lang_val: ogValue?.title?.[ogValue?.title_lang] || "",
                description_en: ogValue?.description?.en || "",
                description_lang: ogValue?.description_lang || "",
                description_lang_val: ogValue?.description?.[ogValue?.description_lang] || "",
                price: ebook.price || "",
                free_for_subs: ebook.free_for_subs || "no",
                ebook_file: ebook.ebook_file || "",
                is_terms: typeof ebook.is_terms === 'boolean' ? ebook.is_terms : false,
                is_agreement: typeof ebook.is_agreement === 'boolean' ? ebook.is_agreement : false,
                is_rules: typeof ebook.is_rules === 'boolean' ? ebook.is_rules : false,
                seo: ebook.seoDetails || {},
            }));
            setChecked(ebook.is_from_ftp === 1);
            
            setSelectedCategoriesAntd((ebook.category_id && typeof ebook.category_id === 'string') ? ebook.category_id.split(',').map(Number) : []);
            setSelectedModelsAntd((ebook.model_id && typeof ebook.model_id === 'string') ? ebook.model_id.split(',').map(Number) : []);
            setSelectedTagsAntd((ebook.tags && typeof ebook.tags === 'string') ? ebook.tags.split(',') : []);
            
            setThumbnailPreview(ebook.thumbnail ? `/${ebook.thumbnail}` : null);
            setEbookFileObject(null);
        }
    }, [ebook, ogValue]);

    useEffect(() => { setData('category_id', selectedCategoriesAntd); }, [selectedCategoriesAntd]);
    useEffect(() => { setData('model_id', selectedModelsAntd); }, [selectedModelsAntd]);
    useEffect(() => { setData('tag', selectedTagsAntd); }, [selectedTagsAntd]);

    useEffect(() => {
        if (Object.keys(errors).length) {
            Object.keys(errors).forEach((key) => {
                toast.error(errors[key]);
            });
        }
    }, [errors]);

    useEffect(() => {
        if (chunks.length > 0 && ebookFileObject) {
            uploadChunks();
        }
    }, [chunks, ebookFileObject]);

    const createChunks = () => {
        if (!ebookFileObject) {
            toast.error(__('Please select an ebook file to upload.'));
            return;
        }
        setChunks([]);
        let size = 1024 * 1024 * 8;
        let chunksCount = Math.ceil(ebookFileObject.size / size);

        for (let i = 0; i < chunksCount; i++) {
            setChunks((chunks) => [
                ...chunks,
                ebookFileObject.slice(i * size, Math.min(i * size + size, ebookFileObject.size), ebookFileObject.type),
            ]);
        }
    };

    const uploadChunks = () => {
        setSpinner(true);
        const postData = new FormData();
        postData.append("media_type", "ebook");
        postData.append("is_last", chunks.length === 1);
        postData.append("ebook", ebook.id || 0);
        postData.set("file", chunks[0], `${ebookFileObject.name}.part`);

        axios
            .post(route("ebook.uploadChunks"), postData, {
                onUploadProgress: (event) => {
                    setUploaded(uploaded + event.loaded);
                },
            })
            .then(function (response) {
                if (chunks.length <= 1) {
                    setChunks([]);
                    setUploaded(0);
                    setData('ebook_file', response.data.result); 
                    
                    if (ebook.id === null) {
                        saveEbook();
                    } else {
                        updateEbook();
                    }
                }

                let chunksArray = [...chunks];
                chunksArray.splice(0, 1);
                setChunks(chunksArray);
            })
            .catch(function (error) {
                setUploaded(0);
                toast.error(error.response?.data?.message || __('An error occurred during chunk upload.'));
            })
            .then(function () {
                setSpinner(false);
            });
    };

    const saveEbook = () => {
        Swal.fire({
            title: __("Are you sure?"), text: __("Do you want to save this ebook?"), icon: "warning",
            showCancelButton: true, confirmButtonText: __("Yes, save it!"), cancelButtonText: __("No, cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                post(route("ebook.saveEbook"), { forceFormData: true });
                Swal.fire(__("Saved!"), __("Your ebook has been saved."), "success");
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(__("Cancelled"), __("Your ebook has not been saved"), "error");
            }
        });
    };

    const updateEbook = () => {
        post(route("ebook.update", { ebook: ebook.id }), { forceFormData: true });
    };

    const submit = (e) => {
        e.preventDefault();
        // Checkboxes validation
        if (!data.is_terms) { toast.error(__('Please agree to terms and conditions')); return; }
        if (!data.is_agreement) { toast.error(__('Please agree to the agreement')); return; }
        if (!data.is_rules) { toast.error(__('Please agree to the rules')); return; }

        const isEditing = ebook.id !== null;
        const hasNewThumbnail = data.thumbnail instanceof File; 
        const hasNewEbookFile = ebookFileObject instanceof File; 
        const hasExistingEbookFile = data.ebook_file && typeof data.ebook_file === 'string'; 

        // Initial validation for required files
        if (!isEditing) { // CREATE mode
            if (!hasNewThumbnail) { toast.error(__('Thumbnail is required.')); return; }
            if (!checked && !hasNewEbookFile) { toast.error(__('Ebook file is required for local upload.')); return; }
            if (checked && !hasExistingEbookFile) { toast.error(__('Please select an ebook file from FTP.')); return; }
        } else { // EDIT mode
            if (!hasNewThumbnail && !ebook.thumbnail) { toast.error(__('Thumbnail is required.')); return; }
            if (!checked && !hasNewEbookFile && !hasExistingEbookFile) { toast.error(__('Ebook file is required for local upload.')); return; }
            if (checked && !hasExistingEbookFile && !hasNewEbookFile) { toast.error(__('Please select an ebook file from FTP.')); return; }
        }
        
        setSpinner(true);

        if (hasNewEbookFile && !checked) { // Local file upload via chunking
            createChunks();
        } else { // FTP selection OR no new local file, just metadata/thumbnail update
            if (ebook.id === null) {
                saveEbook();
            } else {
                updateEbook();
            }
            setSpinner(false);
        }
    };

    console.log(data, "data");

    return (
        <AuthenticatedLayout>
            <Head title={__("Upload ebook")} />
            <div className="lg:flex lg:space-x-10">
                <AccountNavi active="upload-ebook" />
                <div className="p-4 sm:p-8 bg-white w-full dark:bg-zinc-900 shadow sm:rounded-lg">
                    <header className="mb-5">
                        <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
                            <MdVideoLibrary className="mr-2" />
                            {ebook.id === null ? __("Upload ebook") : __("Edit ebook")}
                        </h2>
                        <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                            {__("Upload a new ebook")}
                        </p>
                        <Link
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            href={route("ebook.list")}
                        >
                            {__("<< Back to ebook")}
                        </Link>
                    </header>

                    <hr className="my-5" />
                    <form onSubmit={submit} encType="multipart/form-data">
                        {/* Title Inputs */}
                        <div className="mb-5">
                            <InputLabel for="title_en" value={__("Title")} />
                            <TextInput
                                name="title_en"
                                value={data.title_en}
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
                                placeholder={__("Please select")}
                                value={selectedCategoriesAntd}
                                onChange={handleCategoryChange}
                                options={categories}
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
                                placeholder={__("Please select")}
                                value={selectedModelsAntd}
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
                                placeholder={__("Please select")}
                                value={selectedTagsAntd}
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
                        <div className="mb-5">
                            <InputLabel for="thumbnail" value={__("Thumbnail")} />
                            <TextInput
                                className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                type="file"
                                name="thumbnail"
                                handleChange={handleThumbnailChange}
                                required={ebook.id === null}
                            />
                            <InputError message={errors.thumbnail} className="mt-2" />
                            {thumbnailPreview && (
                                <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                            )}
                        </div>

                        {/* FTP Switch */}
                        <div className="mb-5">
                            <label className="flex items-center space-x-2">
                                <Switch onChange={handleChange} checked={checked} />
                                <span>Select ebook from FTP?</span>
                            </label>
                        </div>

                        {/* ebook File */}
                        {!checked && (
                            <div className="mb-5">
                                <InputLabel for="ebook_file_input" value={__("Ebook File")} />
                                <TextInput
                                    className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                    type="file"
                                    name="ebook_file_input"
                                    accept=".pdf"
                                    handleChange={handleEbookFileChange}
                                    required={ebook.id === null}
                                />
                                <InputError message={errors.ebook_file_input} className="mt-2" />
                                {ebookFileObject && ebookFileObject.name && <p className="text-sm text-gray-500 mt-1">{ebookFileObject.name}</p>}
                                {ebook.ebook_file && typeof ebook.ebook_file === 'string' && !ebookFileObject && (
                                    <p className="text-sm text-gray-500 mt-1">Current file: {ebook.ebook_file.split('/').pop()}</p>
                                )}
                            </div>
                        )}

                        {checked && (
                            <div className="mt-2">
                                <Select
                                    style={{ width: "50%" }}
                                    placeholder={__("Please select")}
                                    value={data.ebook_file}
                                    onChange={handleFtpEbookChange}
                                    options={fileNames}
                                    required={ebook.id === null}
                                />
                                <InputError message={errors.ebook_file} className="mt-2" />
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-5">
                            <InputLabel for="description_en" value={__("Description (English)")} />
                            <Textarea
                                name="description_en"
                                value={data.description_en || ''}
                                handleChange={(e) => setData("description_en", e.target.value)}
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
                                value={`${supportedLocales.find((l) => l.lang_value === data.description_lang)?.lang_name || 'Translated'} Description`}
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
                                {ebook.id === null ? __("Upload") : __("Save Changes")}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}