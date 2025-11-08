import React from "react";
import { Head } from "@inertiajs/inertia-react";
import Front from "@/Layouts/Front";
import __ from "@/Functions/Translate";
import { useState } from "react";
import axios from "axios";
import PrimaryButton from "@/Components/PrimaryButton";
import { toast } from "react-toastify";
import { FaHandSparkles } from "react-icons/fa/index.js";
import { Inertia } from "@inertiajs/inertia";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function BlogSlider({data}) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };
    return (
        <div className="slider-container">
            <Slider {...settings}>
                    {data.map((data, index)=>(
                        <div key={index} className='rounded-xl shadow-lg'>
                            <img src={data.image} className='max-h-[200px] ' alt={data.img}/>
                            <div className='p-[10px]'>
                                <h2 className="font-bold text-[25px]">{data.title}</h2>
                                <p>{data.descr}</p>
                            </div>

                        </div>
                    ))}
            </Slider>
        </div>
    );
}

export default BlogSlider;