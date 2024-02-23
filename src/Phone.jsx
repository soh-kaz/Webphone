import React, { useState } from "react";

//icons
import { FaPhone } from "react-icons/fa6";
import Dialpad from "./Dialpad";

const Phone = () => {


    const [wbp_show, setWebphoneShow] = useState(false)


    //Show/Hide Webphone Main Div
    const toggleWebphone = () => {
        setWebphoneShow(!wbp_show)
    }


    return (
        <>


            <dialog open id="wbp-dialog" className="rounded-lg min-w-[20%] max-w-[50%]">
                <div className="w-full bg-[lightgray] inline-flex px-4 py-1 rounded-t-lg">
                    <div className="w-1/2 text-left font-bold">
                        WARRANTY
                    </div>
                </div>
                <div className="w-full bg-white px-4 py-4 overflow-x-scroll text-left">
                
                    <p>NO WARRANTY</p>
                    <p>THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND</p>

                    <br/>

                    <span className="font-bold underline">Technology Used</span>
                    <ol className="list-decimal px-8 py-2">
                        <li>
                            <a href="https://github.com/versatica/JsSIP?tab=License-1-ov-file#readme" target="_blank">JsSIP, the JavaScript SIP library</a>
                        </li>
                        <li>ReactJS</li>
                        <li>Tailwindcss</li>
                    </ol>
                    

                </div>
            </dialog>


            
            {/* Floating Button */}
            <button 
            onClick={toggleWebphone}
            className="rounded-full w-20 h-20 bg-[green] text-white p-4
                shadow-xl
                hover:shadow-[#00800092]
                absolute
                bottom-8
                right-8
            ">
                <FaPhone className="icon-full" />
            </button>

            <Dialpad isShow={wbp_show} toggleWebphone={toggleWebphone} />

        </>
    )
}

export default Phone