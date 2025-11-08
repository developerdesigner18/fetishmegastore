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
import { Select, Switch, Popconfirm} from 'antd';
import Swal from "sweetalert2";
import { useDropzone } from 'react-dropzone';
import Checkbox from "@/Components/Checkbox";

export default function UploadModel() {

    const [selectedImages, setSelectedImages] = useState([]);

    const { data, setData, post, processing, errors, progress } = useForm({
        name: '',
        age: '',
        size: '',
        shoe_size: '',
        country: '',
        weight:'',
        thumbnail: "",
        images: [],  // Update images to be an array
        is_terms:"",
        is_agreement:"",
        is_rules:"",
        seo: {
            h2: "",
            keyword: "",
            meta_keyword: "",
            desc: "",
            og_title: "",
            og_desc: "",
            meta_robot: "",
            cust_url: "",
            og_image_url: "",
            json_id: "",
        }
    });


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
    // };

    useEffect(() => {
        if (Object.keys(errors).length) {
            Object.keys(errors).map((key) => {
                toast.error(errors.key);
            });
        }
    }, [errors]);

    const onImagesChange = (event) => {
        const files = Array.from(event.target.files);

        // Set data for form submission
        setData("images", files);

        // Display selected images
        setSelectedImages(files.map((file) => URL.createObjectURL(file)));
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

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to save this model?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, save it!",
            cancelButtonText: "No, cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                // If confirmed, proceed with the API call
                post(route("model.save"), {
                    forceFormData: true, // Ensures files are sent correctly
                });

                Swal.fire(
                    "Saved!",
                    "Your model has been saved.",
                    "success"
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    "Cancelled",
                    "Your model has not been saved",
                    "error"
                );
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={__("Upload Model")} />
            <div className="lg:flex lg:space-x-10">
                <AccountNavi active="upload-videos" />
                <div className="p-4 sm:p-8 bg-white w-full dark:bg-zinc-900 shadow sm:rounded-lg">
                    <header className="mb-5">
                        <h2 className="text-lg inline-flex items-center md:text-xl font-medium text-gray-600 dark:text-gray-100">
                            <MdVideoLibrary className="mr-2" />
                            {__("Upload Model")}
                        </h2>
                        <p className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
                            {__("Upload a new Model")}
                        </p>
                        <PrimaryButton onClick={(e) => Inertia.visit(route("model.list"))}>
                            {__("<< Back to Model")}
                        </PrimaryButton>
                    </header>
                    <hr className="my-5" />

                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="mb-5">
                            <InputLabel for="name" value={__("Name")} />

                            <TextInput
                                name="name"
                                value={data.name}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />

                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">
                            <InputLabel for="age" value={__("Age")} />

                            <TextInput
                                name="age"
                                value={data.age}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />

                            <InputError
                                message={errors.age}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">
                            <InputLabel for="size" value={__("Size")} />

                            <TextInput
                                name="size"
                                value={data.size}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />

                            <InputError
                                message={errors.size}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">
                            <InputLabel for="shoe_size" value={__("Shoe Size")} />

                            <TextInput
                                name="shoe_size"
                                value={data.shoe_size}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />

                            <InputError
                                message={errors.shoe_size}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-5">
                            <InputLabel for="country" value={__("Country")} />

                            <TextInput
                                name="country"
                                value={data.country}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />

                            <InputError
                                message={errors.country}
                                className="mt-2"
                            />
                        </div>
                        <div className="mb-5">
                            <InputLabel for="weight" value={__("Weight")} />

                            <TextInput
                                name="weight"
                                value={data.weight}
                                handleChange={onHandleChange}
                                required
                                className="mt-1 block w-full md:w-1/2"
                            />

                            <InputError
                                message={errors.weight}
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


                        {/*<div className="mb-5">*/}
                        {/*    <InputLabel for="images" value={__("Images (Select multiple)")} />*/}
                        {/*    <input*/}
                        {/*        type="file"*/}
                        {/*        name="images"*/}
                        {/*        multiple*/}
                        {/*        onChange={onImagesChange}*/}
                        {/*        className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"*/}
                        {/*    />*/}
                        {/*    <InputError message={errors.images} className="mt-2" />*/}
                        {/*</div>*/}

                        <div className="mb-5">
                            <InputLabel for="images" value="Images (Select multiple)" />
                            <input
                                type="file"
                                name="images"
                                multiple
                                onChange={onImagesChange}
                                className="p-1 block w-full md:w-1/2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 focus:outline-none dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-zinc-900"
                            />
                            <InputError message={errors.images} className="mt-2" />

                            {/* Displaying selected images */}
                            <div className="flex space-x-2 mt-4">
                                {selectedImages.map((src, index) => (
                                    <img key={index} src={src} alt={`Selected ${index}`} className="h-20 w-20 object-cover rounded" />
                                ))}
                            </div>
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

                        <PrimaryButton processing={processing}>
                            {__("Save Model")}
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

