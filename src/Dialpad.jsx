import React, { useEffect } from "react";

import avatar from "./assets/avatar.jpg"

import { MdBackspace, MdDoDisturbOn, MdPhonePaused, MdPhoneForwarded } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { BsFillMicMuteFill } from "react-icons/bs";
import { GrClose } from "react-icons/gr";


import audioRing from "./assets/audio/telephone.mp3"


import PhoneLib from "./PhoneLib";

const phone = new PhoneLib("USERNAME", "PASSWORD", "DIALLING-SERVER-URL", "SERVER_PORT")


const Dialpad = ({isShow, toggleWebphone}) => {


    useEffect(()=>{

        phone.connect()
        // console.log(phone)

        /*
        incoming
        outgoing
        dndRejected
        changeLine
        hold
        unhold
        muted
        unmuted
        transfer
        */

        phone.on('incoming', (e)=>{
            console.log("incoming call is ringing", e)
            toggleWebphone()
        })

    }, [])



    
    const toggleTransfer = () => {
        const transferDiv = document.querySelector("#transfer-input-div")
        transferDiv.classList.toggle("hidden")
    }

    //Change Line
    const changeLine = (line) => phone.changeLine(line)
    //Accept Incoming Call
    const acceptCall = () => phone.acceptCall()
    //Terminate Call
    const terminateCall = () => phone.terminateCall()
    //Trigger New Call
    const trigger = () => phone.trigger()
    //Hold Active Line
    const hold = () => {
        phone.hold()
        document.querySelector("#btn-hold").classList.toggle("hidden")
        document.querySelector("#btn-unhold").classList.toggle("hidden")
    }
    //UnHold Active Line
    const unhold = () => {
        phone.unhold()
        document.querySelector("#btn-hold").classList.toggle("hidden")
        document.querySelector("#btn-unhold").classList.toggle("hidden")
    }
    //Mute Active Line
    const mute = () => {
        phone.mute()
        document.querySelector("#btn-mute").classList.toggle("hidden")
        document.querySelector("#btn-unmute").classList.toggle("hidden")
    }
    //UnMute Active Line
    const unmute = () => {
        phone.unmute()
        document.querySelector("#btn-mute").classList.toggle("hidden")
        document.querySelector("#btn-unmute").classList.toggle("hidden")
    }

    //Transfer Call
    const transferCall = () => {
        const number = document.querySelector("#transfer-number-box").value
        if(number){
            phone.transfer(number)
        }
    }

    //Do not Distrub
    const doNotDistrub = () => {
        document.querySelector("#btn-dnd").classList.toggle("hidden")
        document.querySelector("#btn-dnd-off").classList.toggle("hidden")
        
        phone.toggleDND()
        
    }

    //Dial Button
    const dial = (num) => {
        
        const numberBox = document.querySelector("#phone-number-box")
        numberBox.value += num

        // phone.dial(num)
    }

    



    return (
        <div id="wbp-phone" className={ isShow == false ? 'hidden' : '' }>


        
            
            <audio id="ringing-audio" autoPlay={false} src={audioRing}></audio>
            {/* <audio id="outgoing-ringing-audio" src={outgoingRing} loop /> */}

            <div className="w-[24rem]  bg-[black]
                absolute
                bottom-3
                right-3
                z-50
                grid
            ">

                {/* Phone Status */}
                <div className="w-full bg-[lightgray] px-3 py-1 inline-flex">
                    <div className="w-1/2 text-left">
                        <span id="wbp-phone-status">🟡 Connecting ...</span>
                    </div>
                    <div className="w-1/2 text-right">
                        <button onClick={toggleWebphone}>
                            <GrClose />
                        </button>
                    </div>
                </div>

                {/* Available Lines */}
                <div className="bg-white w-full grid place-items-start
                    px-3
                    py-2
                ">
                    <span>Available Lines</span>
                    <div className="w-full grid-cols-4 gap-2">
                        <div id="first" onClick={()=>changeLine("first")} className="bg-[#12202F] px-2 py-[2px] text-white inline-flex justify-center active-line cursor-pointer">
                            <div id="first-icon"></div>
                            <span>Line 1</span>
                        </div>
                        <div id="second" onClick={()=>changeLine("second")} className="bg-[#12202F] text-center px-2 py-[2px] text-white inline-flex justify-center cursor-pointer">
                            <div id="second-icon"></div>
                            <span>Line 2</span>
                        </div>
                        <div id="third" onClick={()=>changeLine("third")} className="bg-[#12202F] text-center px-2 py-[2px] text-white inline-flex justify-center cursor-pointer">
                            <div id="third-icon"></div>
                            <span>Line 3</span>
                        </div>
                        <div id="fourth" onClick={()=>changeLine("fourth")} className="bg-[#12202F] text-center px-2 py-[2px] text-white inline-flex justify-center cursor-pointer">
                            <div id="fourth-icon"></div>
                            <span>Line 4</span>
                        </div>
                    </div>
                </div>


                {/* Special Buttons */}
                <div className="bg-[#E0FFFF] w-full 
                    px-3 py-2
                    grid-cols-4
                ">
                    <div className="grid w-full cursor-pointer hover:bg-[#9fdfe2] justify-items-center">
                        <div onClick={mute} id="btn-mute" className="grid w-full justify-items-center py-2 delay-150 transition-transform">
                            <BsFillMicMuteFill className="icon-sm"/>
                            <span className="">Mute</span>
                        </div>
                        <div onClick={unmute} id="btn-unmute" className="hidden grid w-full justify-items-center py-2 text-white bg-[#293341] delay-150 transition-transform">
                            <BsFillMicMuteFill className="icon-sm"/>
                            <span className="">Un-Mute</span>
                        </div>
                    </div>
                    <div className="grid w-full cursor-pointer hover:bg-[#9fdfe2] justify-items-center">
                        <div onClick={hold} id="btn-hold" className="grid w-full justify-items-center py-2 delay-150 transition-transform">
                            <MdPhonePaused className="icon-sm"/>
                            <span className="">Hold</span>
                        </div>
                        <div onClick={unhold} id="btn-unhold" className="hidden grid w-full justify-items-center py-2 text-white bg-[#293341] delay-150 transition-transform">
                            <MdPhonePaused className="icon-sm"/>
                            <span className="">Unhold</span>
                        </div>

                    </div>
                    <div className="grid w-full cursor-pointer hover:bg-[#9fdfe2] justify-items-center">
                        <div onClick={toggleTransfer} id="btn-hold" className="grid w-full justify-items-center py-2 delay-150 transition-transform">
                            <MdPhoneForwarded className="icon-sm"/>
                            <span className="">Transfer</span>
                        </div>
                    </div>
                    
                    <div className="grid w-full cursor-pointer hover:bg-[#9fdfe2] justify-items-center"  title="Do not Distrub">
                        <div onClick={doNotDistrub} id="btn-dnd" className="grid w-full justify-items-center py-2 delay-150 transition-transform">
                            <MdDoDisturbOn className="icon-sm"/>
                            <span className="">DND</span>
                        </div>
                        <div onClick={doNotDistrub} id="btn-dnd-off" className="hidden grid w-full justify-items-center py-2 text-white bg-[#293341] delay-150 transition-transform">
                            <MdDoDisturbOn className="icon-sm"/>
                            <span className="">DND</span>
                        </div>

                    </div>

                </div>

                {/* Call Transfer Number */}
                <div id="transfer-input-div" className="bg-[whitesmoke] w-full h-16 px-3 py-2 inline-flex gap-2 hidden">
                    <input className="rounded-sm py-2 px-2 text-2xl w-full bg-[whitesmoke] border-solid border-[#12202F] border-[1px]" placeholder="1 2531 2536" id="transfer-number-box"/>
                    <span className="font-bold grid justify-center">
                        <button className="px-2 py-2 border-solid border-[#12202F] border-[1px] rounded-sm 
                            hover:bg-[#12202F] 
                            hover:text-white
                            transition-colors
                            delay-150
                        "
                            onClick={transferCall}
                        >
                            Transfer
                        </button>
                    </span>
                </div>

                {/* Dial Pad */}
                <div className="bg-[#12202F] w-full 
                    px-3 py-2
                    grid
                ">

                    {/* Screen */}
                    <div id="wbp-screen" className="w-full bg-[#293341] h-min-14 rounded-md 
                        px-3 py-2
                        inline-flex
                    ">
                        <div className="w-14 h-14 rounded-full">
                            <img src={avatar} className="rounded-full" />
                        </div>
                        <div className="w-fit px-4 grid text-left">
                            <span className="font-bold text-white" id="call-status">Ready to Call</span>
                            <span className="text-white" id="call-duration">00:00:00</span>
                        </div>
                    </div>

                    {/* Number Textbox */}
                    <div className="w-full inline-flex
                        px-3 py-2
                    ">

                        <div className="w-full text-left">
                            <input className="py-2 px-2 text-2xl text-white w-full bg-transparent" placeholder="1 2531 2536" id="phone-number-box"/>
                        </div>
                        <div className="ps-2">
                            <MdBackspace className="icon-full text-white" />
                        </div>

                    </div>

                    {/* Dialling Box */}
                    <div className="w-full grid-cols-3 gap-2
                        px-3
                        py-2
                    ">

                        <div className="grid py-2 rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial(1)}>
                            <span className="font-bold text-white text-2xl">1</span>
                            <span className="text-white"></span>
                        </div>

                        <div className="grid py-2 rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial(2)}>
                            <span className="font-bold text-white text-2xl">2</span>
                            <span className="text-white">ABC</span>
                        </div>

                        <div className="grid py-2 rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial(3)}>
                            <span className="font-bold text-white text-2xl">3</span>
                            <span className="text-white">DEF</span>
                        </div>

                        <div className="grid py-2 rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial(4)}>
                            <span className="font-bold text-white text-2xl">4</span>
                            <span className="text-white">GHI</span>
                        </div>

                        <div className="grid py-2 rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial(5)}>
                            <span className="font-bold text-white text-2xl">5</span>
                            <span className="text-white">JKL</span>
                        </div>

                        <div className="grid py-2 rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial(6)}>
                            <span className="font-bold text-white text-2xl">6</span>
                            <span className="text-white">MNO</span>
                        </div>

                        <div className="grid py-2 rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial(7)}>
                            <span className="font-bold text-white text-2xl">7</span>
                            <span className="text-white">PQRS</span>
                        </div>

                        <div className="grid py-2 rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial(8)}>
                            <span className="font-bold text-white text-2xl">8</span>
                            <span className="text-white">TUV</span>
                        </div>

                        <div className="grid py-2 rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial(9)}>
                            <span className="font-bold text-white text-2xl">9</span>
                            <span className="text-white">WXYZ</span>
                        </div>


                        <div className="grid py-2 min-h-[72px] rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial('*')}>
                            <span className="font-bold text-white text-2xl">*</span>
                            <span className="text-white"> </span>
                        </div>

                        <div className="grid py-2 min-h-[72px] rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial(0)}>
                            <span className="font-bold text-white text-2xl">0</span>
                            <span className="text-white"></span>
                        </div>

                        <div className="grid py-2 min-h-[72px] rounded-md cursor-pointer hover:bg-[#293341]" onClick={()=>dial('#')}>
                            <span className="font-bold text-white text-2xl">#</span>
                            <span className="text-white"></span>
                        </div>

                    </div>

                    {/* Dialling Button */}
                    <div className="w-full gap-2 px-8 pt-2 pb-8">
                        <div className=" w-full place-items-center inline-flex justify-center gap-6">
                            <div id="btn-trigger" onClick={trigger} className="w-16 py-4 bg-[green] text-white h-16 rounded-full cursor-pointer hover:opacity-80">
                                <FaPhone className="icon-full" />
                            </div>
                            <div id="btn-answer" onClick={acceptCall} className="hidden w-16 py-4 bg-[green] text-white h-16 rounded-full cursor-pointer hover:opacity-80">
                                <FaPhone className="icon-full" />
                            </div>
                            <div id="btn-reject" onClick={terminateCall} className="hidden w-16 py-4 bg-[red] text-white h-16 rounded-full cursor-pointer hover:opacity-80">
                                <FaPhone className="icon-full" />
                            </div>
                        </div>
                    </div>



                </div>

            </div>

        </div>
    )
}

export default Dialpad