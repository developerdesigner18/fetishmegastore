import {usePage,Head, Link, useForm} from "@inertiajs/inertia-react";
import React from "react";



export default function AdBar() {

     const { adImage, adLink } = usePage().props;

    const hasImage = typeof adImage === 'string' && adImage.trim() !== '';
    const hasLink = typeof adLink === 'string' && adLink.trim() !== '';

    if (!hasImage) return null;
    return (
        <>

            <div className="flex justify-center items-center max-w-4xl h-full bg-gray-100">
            <a
                href={hasLink ? adLink : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
            >
                <img
                    src={adImage}
                    alt="Ad Banner"
                    className="w-full h-full object-cover"
                />
            </a>
        </div>


            {/* <div className="">
                <a href="https://adult-clips.eu/" target="_blank" className="block w-full h-full">
                    <img src="/ads/linkbanneradult-clips.gif" className="w-lg h-full object-cover"/>
                </a>
            </div> */}


            {/*<iframe style={{width: '100%', marginBottom: '5px'}}*/}
            {/*        src="//pt.wmptctl.com/avb/straight/hardcore/1_scene?targetCategory=girl&amp;landingTarget=listpage&amp;width=250&amp;height=auto&amp;psid=6camgirl&amp;tags=&amp;filters=&amp;banner=01&amp;pstool=501_101&amp;site=wl3&amp;cobrandId=244316&amp;psprogram=cbrnd&amp;campaign_id=&amp;subAffId={SUBAFFID}"*/}
            {/*        width="auto" height="auto"></iframe>*/}

            {/*<iframe style={{width: '100%', marginBottom: '5px',marginTop: '5px' , height: '480px'}}*/}
            {/*        src="https://ptwmcd.com/cifra?psid=6camgirl&psprogram=revs&pstool=212_1&site=fetishfix&cobrandid=&campaign_id=&category=fetish&row=2&column=3&background=A60000&fill=&border=&model=insidehover&modelColor=&modelFill=0&wide=1&padding=6px&width=0&height=0&imageWidth=0&imageHeight=0&stream=1&start=1&performerList=&subaffid={SUBAFFID}&legacyRedirect=1"*/}
            {/*        scrolling="no" align="middle" frameBorder="no" allowTransparency="true" marginHeight="0"*/}
            {/*        marginWidth="0"*/}
            {/*></iframe>*/}


            {/*<iframe*/}
            {/*    src="https://ptwmcd.com/cifra?psid=6camgirl&psprogram=revs&pstool=212_1&site=fetishfix&cobrandid=&campaign_id=&category=fetish&row=2&column=3&background=A60000&fill=&border=&model=insidehover&modelColor=&modelFill=0&wide=1&padding=6px&width=0&height=0&imageWidth=0&imageHeight=0&stream=1&start=1&performerList=&subaffid={SUBAFFID}&legacyRedirect=1"*/}
            {/*    scrolling="no" align="middle" frameBorder="no" allowTransparency="true" marginHeight="0"*/}
            {/*    marginWidth="0"*/}
            {/*></iframe>*/}

        </>
    );
}
