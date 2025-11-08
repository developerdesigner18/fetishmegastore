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


export default function UploadTextFile({ textFile, categories, models, tags, fileNames }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        title_en: textFile.title_en || "",
        title_de: textFile.title_de || "",
        tag: textFile.tag || "",
        description_en: textFile.description_en || "",
        description_de: textFile.description_de || "",
        category_id: textFile.category_id || "",
        model_id: textFile.model_id || "",
        price: textFile.price || "",
        free_for_subs: textFile.free_for_subs || false,
        is_from_ftp: textFile.is_from_ftp || false,
        thumbnail: "",
        text_file: "",
        is_terms: typeof textFile.is_terms === 'boolean' ? textFile.is_terms : false,  
        is_agreement: typeof textFile.is_agreement === 'boolean' ? textFile.is_agreement : false,  
        is_rules: typeof textFile.is_rules === 'boolean' ? textFile.is_rules : false,  
    });

    const [textFileFile, setTextFileFile] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [uploaded, setUploaded] = useState(0);
    const [checked, setChecked] = useState(textFile.is_from_ftp === 1);
    const [selectedCategory, setSelectedCategory] = useState(textFile.category_id || "");
    const [selectedModel, setSelectedModel] = useState(textFile.model_id || "");

    const handleChange = () => {
        setChecked(!checked);
        data.is_from_ftp = checked === true ? false : true;
    };

    useEffect(() => {
        if (textFile) {
            setData('description_en', textFile.description_en || '');
            setData('description_de', textFile.description_de || '');
            setSelectedCategory(textFile.category_id);
            setSelectedModel(textFile.model_id);
        }
    }, [textFile]);

    const handleTextFileChange = (value) => {
        console.log(`selected ${value}`);
        setTextFileFile(value);
        data.text_file = 'textFile/' + value;
        data.is_from_ftp = checked;
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

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === "checkbox" ? event.target.checked : event.target.value);
    };

    useEffect(() => {
        if (Object.keys(errors).length) {
            Object.keys(errors).forEach((key) => {
                toast.error(errors[key]);
            });
        }
    }, [errors]);

    useEffect(() => {
        if (chunks.length > 0) {
            uploadChunks();
        }
    }, [chunks]);

    const createChunks = () => {
        setChunks([]);
        let size = 1024 * 1024 * 8;
        let chunksCount = Math.ceil(textFileFile.size / size);

        for (let i = 0; i < chunksCount; i++) {
            setChunks((chunks) => [
                ...chunks,
                textFileFile.slice(i * size, Math.min(i * size + size, textFileFile.size), textFileFile.type),
            ]);
        }
    };

    const uploadChunks = () => {
        setSpinner(true);
        const postData = new FormData();
        postData.append("media_type", "textFile");
        postData.append("is_last", chunks.length === 1);
        postData.append("textFile", textFile.id || 0);
        postData.set("file", chunks[0], `${textFileFile.name}.part`);

        axios
            .post(route("textFile.uploadChunks"), postData, {
                onUploadProgress: (event) => {
                    setUploaded(uploaded + event.loaded);
                },
            })
            .then(function (response) {
                if (chunks.length <= 1) {
                    setChunks([]);
                    setUploaded(0);
                    data.text_file = response.data.result;

                    if (textFile.id === null) {
                        saveTextFile();
                    } else {
                        updateTextFile();
                    }
                }

                let chunksArray = [...chunks];
                chunksArray.splice(0, 1);
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

    const saveTextFile = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to save this textFile?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, save it!",
            cancelButtonText: "No, cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                post(route("textFile.saveTextFile"));
                Swal.fire("Saved!", "Your textFile has been saved.", "success");
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "Your textFile has not been saved", "error");
            }
        });
    };

    const updateTextFile = () => {
        post(route("textFile.update", { textFile: textFile.id }));
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
        if (textFileFile) {
            if (checked) {
                setSpinner(true);
                if (textFile.id === null) {
                    saveTextFile();
                } else {
                    updateTextFile();
                }
                setSpinner(false);
            } else {
                createChunks();
            }
        } else if (textFileFile === "" && textFile.id !== null) {
            if (checked) {
                post(route("textFile.update", { textFile: textFile.id }));
            } else {
                updateTextFile();
            }
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={__("Upload TextFile")} />
            <div className="lg:flex lg:space-x-10">
                <AccountNavi active="upload-textFile" />
                <div className="p-4 sm:p-8 bg-white w-full dark:bg-zinc-900 shadow sm:rounded-lg">
                    <header className="mb-5">
                        <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
                            <MdVideoLibrary className="mr-2" />
                            {textFile.id === null ? __("Upload TextFile") : __("Edit TextFile")}
                        </h2>
                        <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                            {__("Upload a new TextFile")}
                        </p>
                        <PrimaryButton onClick={(e) => Inertia.visit(route("textFile.list"))}>
                            {__("<< Back to TextFile")}
                        </PrimaryButton>
                    </header>

                    <hr className="my-5" />
                    <form onSubmit={submit} encType="multipart/form-data">
                        {/* Title Inputs */}
                        <div className="mb-5">
                            <InputLabel for="title_en" value={__("Title")} />
                            <TextInput
                                name="title_en"
                                value={data.title_en || textFile.title_en || textFile.title || ""}
                                handleChange={(e) => setData("title_en", e.target.value)}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />
                            <InputError message={errors.title_en} className="mt-2" />
                        </div>

                        <div className="mb-5">
                            <InputLabel for="title_de" value={__("German Title")} />
                            <TextInput
                                name="title_de"
                                value={data.title_de || textFile.title_de || ""}
                                handleChange={(e) => setData("title_de", e.target.value)}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />
                            <InputError message={errors.title_de} className="mt-2" />
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
                                defaultValue={data.category_id == "" ? [] : textFile.selectedCategory}
                                onChange={handleCategoryChange}
                                options={categories}
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
                                defaultValue={data.model_id === null ? [] : textFile.selectedModel}
                                onChange={handleModelChange}
                                options={models}
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
                                defaultValue={data.tag === null ? [] : textFile.tags}
                                onChange={handleTagChange}
                                options={tags}
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
                                handleChange={(e) => setData("thumbnail", e.target.files[0])}
                                required={textFile.id === null}
                            />
                            <InputError message={errors.thumbnail} className="mt-2" />
                        </div>

                        {/* FTP Switch */}
                        <div className="mb-5">
                            <label>
                                <Switch onChange={handleChange} checked={data.is_from_ftp} />
                                Select textFile from FTP?
                            </label>
                        </div>

                        {/* textFile File */}
                        {!checked && (
                            <div className="mb-5">
                                <InputLabel for="textFile" value={__("Text File")} />
                                <TextInput
                                    className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                                    type="file"
                                    name="textFile_file"
                                    accept="pdf,doc,docx,txt"
                                    handleChange={(e) => setTextFileFile(e.target.files[0])}
                                    required={textFile.id === null}
                                />
                                <InputError message={errors.textFile_file} className="mt-2" />
                            </div>
                        )}

                        {checked && (
                            <div className="mt-2">
                                <Select
                                    style={{ width: "50%" }}
                                    placeholder="Please select"
                                    value={textFile.textFile_file }
                                    onChange={handleTextFileChange}
                                    options={fileNames}
                                />
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
                            <InputLabel for="description_de" value={__("Description (German)")} />
                            <Textarea
                                name="description_de"
                                value={data.description_de || ''}  // Using data from useForm state
                                handleChange={(e) => setData("description_de", e.target.value)}  // Update useForm state
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />
                            <InputError message={errors.description_de} className="mt-2" />
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


                        {/* Submit Button */}
                        <div className="mt-5">
                        <PrimaryButton type="submit" processing={processing} disabled={processing}>
        {textFile.id === null ? __("Upload") : __("Save Changes")}
    </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}



