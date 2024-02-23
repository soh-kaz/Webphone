import JsSIP from "jssip"

const Lines = {
    first:{ 
        isActive:false, 
        // isMuted:false,
        // isOnHold:false,
        element:null, 
        icon:null
    },
    second:{ 
        isActive:false, 
        // isMuted:false,
        // isOnHold:false,
        element:null, 
        icon:null
    },
    third:{ 
        isActive:false, 
        // isMuted:false,
        // isOnHold:false,
        element:null, 
        icon:null
    },
    fourth:{ 
        isActive:false, 
        // isMuted:false,
        // isOnHold:false,
        element:null, 
        icon:null
    }
}


export default class PhoneLib {

    constructor(user, pass, url, port){

        if(user==null || pass==null || url==null || port==null ) return console.log("Missing Required Parameters")

        this.user = user
        this.pass = pass
        this.url = url
        this.port = port

        this.lines = Lines
        this.activeLine = this.lines.first

        this.dnd = false

        this.events = {}

        
        
    }


    //Connect
    connect(){

        try{

            //User Credentials
            let configuration = {
                uri: `sip:${this.user}@${this.url}`,
                authorizationUser: this.user,
                password: this.pass,
            };

            //Websocket Connection Interface
            const socket = new JsSIP.WebSocketInterface(`wss://${this.url}:${this.port}/ws`);

            //Sip User Agent
            this.userAgent = new JsSIP.UA({
                ...configuration,
                sockets: [socket],
            });

            
            this.userAgent.register()    //Register SIP
            this.userAgent.start()       //Start SIP
            

            //Connecting
            this.userAgent.on('connecting', () => {
                document.getElementById('wbp-phone-status').innerHTML = '🟡 Connecting ...'
                console.log('Connecting ...')
            })

            //Disconnected
            this.userAgent.on('disconnected', () => {
                document.getElementById('wbp-phone-status').innerHTML = '🔴 Disconnected'
                console.log('Disconnected')
            })

            //Connected
            this.userAgent.on('connected', () => {
                document.getElementById('wbp-phone-status').innerHTML = '🟢 Connected'
                console.log('Connected');
                // Make outgoing calls or perform actions upon successful connection
            })


            //RTCSession Class
            this.userAgent.on('newRTCSession', (con) => {

                const session = con.session;
                const direction = con.session._direction
                if (session.direction === 'incoming') {
                    this.incoming(con.session)
                }
                else if(session.direction === 'outgoing'){
                    this.outgoing(con.session)
                }
            })



        }
        catch(err){

        }

    }

    //On Incoming
    incoming(session){
        const line = this.getAvailLine()
        if(line){
            this.assign(line, session)
            this.emit('incoming', {line:line, ...this.ev(session)})
        }
        else {
            //Terminate Call with Busy Tone, because all lines are busy
            session.terminate({
                status_code: 486, // 486 Busy Here or use 603 Decline or another appropriate status code
            });
        }

    }

    //On Outgoing
    outgoing(session){
        const line = this.getAvailLine()
        if(line){
            this.assign(line, session)
            this.emit('outgoing', {line:line, ...this.ev(session)})
        }
        else {
        }
    }

    //Assign to Line
    assign(line, session){
        
        this.lines[line].element = document.querySelector("#"+line), 
        this.lines[line].icon = document.querySelector("#"+line+"-icon") 


        //On Ringing
        session.on('progress', ()=>{

            //If Do not Distrub flag is On
            //Reject all calls
            if(this.dnd == true){
                this.emit('dndRejected', {line:line, ...this.ev(session)})
                return (
                    session.terminate({
                        status_code: 486, // 486 Busy Here or use 603 Decline or another appropriate status code
                    })
                )
            }

            this.lines[line].session = session
            this.lines[line].isActive = true
            this.lines[line].icon.innerHTML = "🟢 "
            this.lines[line].element.classList.add("blink-text")
            this.updateUI()
        })


        //On Call hangup from Our end
        session.on('ended', ()=>{
            this.updateUI()
            this.lines[line].session = null
            this.lines[line].isActive = false
            this.lines[line].icon.innerHTML = ""
            this.lines[line].element.classList.remove("blink-text")
            this.timerStop()
            
        })
        //On Session destroy from Other end
        session.on('failed', ()=>{
            this.updateUI()
            this.lines[line].session = null
            this.lines[line].isActive = false
            this.lines[line].icon.innerHTML = ""
            this.lines[line].element.classList.remove("blink-text")
            this.timerStop()
            
        })
        //On Accepted
        session.on('accepted', ()=>{
            this.timerStatus()
            this.updateUI()
            this.lines[line].element.classList.remove("blink-text")

        })
        //On Confirmed
        session.on('confirmed', ()=>{
            this.updateUI()
            this.lines[line].element.classList.remove("blink-text")

        })

    }

    //Unused Available Line
    getAvailLine(){
        
        for(let [key, value] of Object.entries(this.lines)){
            
            if( this.lines[key].isActive == false) return key
        }

        return undefined
    }

    // Change Line 1-4
    changeLine(line){

        //Restore
        document.querySelector("#first").classList.remove("active-line")
        document.querySelector("#second").classList.remove("active-line")
        document.querySelector("#third").classList.remove("active-line")
        document.querySelector("#fourth").classList.remove("active-line")
        //Hold Current Line
        this.hold(this.activeLine?.session)

        //Change Active Line
        this.activeLine = this.lines[line]
        //UnHold Current Line
        this.unhold(this.activeLine?.session)

        //Change Background of Line
        document.querySelector("#"+line).classList.add("active-line")

        this.timerStatus()
        this.updateUI()
        this.emit('changeLine', {line:line, ...this.ev(this.activeLine?.session)})
        
    }

    //Update UI according to Active Line
    updateUI(){
        
        var player = document.querySelector('#ringing-audio')
        var callStatus = document.querySelector("#call-status")
        var btn_trigger = document.querySelector("#btn-trigger")
        var btn_answer = document.querySelector("#btn-answer")
        var btn_reject = document.querySelector("#btn-reject")
        var wbp_screen = document.querySelector("#wbp-screen")
        var phoneNumber = document.querySelector("#phone-number-box")
        
        if(this.activeLine?.session != null){

            // console.log(this.activeLine)

            //Call Status
            switch(this.activeLine?.session?.status){
                case 1: { 
                    callStatus.innerText = "Invite Sent"; 

                    break;
                }
                case 2: { 
                    callStatus.innerText = "Ringing...";

                    if(this.activeLine?.session?.direction == "outgoing"){
                        btn_trigger.style.display = "none";
                        btn_answer.style.display = "none";
                        btn_reject.style.display = "block";
                        wbp_screen.classList.remove("blink-text")
                        
                    }

                    break;
                }
                case 3: { 
                    callStatus.innerText = "Invite Received"; 

                    break;
                }
                case 4: { 
                    callStatus.innerText = "Waiting for Answer"; 

                    if(this.activeLine?.session?.direction == "incoming"){
                        btn_trigger.style.display = "none";
                        btn_answer.style.display = "block";
                        btn_reject.style.display = "block";
                        wbp_screen.classList.add("blink-text")
                        
                        player.play()
                        
                    }

                    break;
                }
                case 5: { 
                    callStatus.innerText = "Answered"; 

                    
                    break;
                }
                case 6: { 
                    callStatus.innerText = "Waiting for Ack"; 

                    if(this.activeLine?.session?.direction == "incoming"){
                        btn_trigger.style.display = "none";
                        btn_answer.style.display = "none";
                        btn_reject.style.display = "block";
                        wbp_screen.classList.remove("blink-text")
                        
                        player.pause()
                    }

                    break;
                }
                case 7: { 
                    callStatus.innerText = "Canceled"; 

                    if(this.activeLine?.session?.direction == "incoming"){
                        btn_trigger.style.display = "block";
                        btn_answer.style.display = "none";
                        btn_reject.style.display = "none";
                        wbp_screen.classList.remove("blink-text")
                        
                        player.pause()
                    }

                    break;
                }
                case 8: { 
                    callStatus.innerText = "Terminated"; 

                    if(this.activeLine?.session?.direction == "incoming"){
                        btn_trigger.style.display = "block";
                        btn_answer.style.display = "none";
                        btn_reject.style.display = "none";
                        wbp_screen.classList.remove("blink-text")
                        
                        player.pause()
                    }
                    else if(this.activeLine?.session?.direction == "outgoing"){
                        btn_trigger.style.display = "block";
                        btn_answer.style.display = "none";
                        btn_reject.style.display = "none";
                        wbp_screen.classList.remove("blink-text")
                        
                        player.pause()
                    }

                    break;
                }
                case 9: { 
                    callStatus.innerText = "Call Established"; 

                    if(this.activeLine?.session?.direction == "incoming"){
                        btn_trigger.style.display = "none";
                        btn_answer.style.display = "none";
                        btn_reject.style.display = "block";
                        wbp_screen.classList.remove("blink-text")
                        
                        player.pause()
                    }
                    else if(this.activeLine?.session?.direction == "outgoing"){
                        btn_trigger.style.display = "none";
                        btn_answer.style.display = "none";
                        btn_reject.style.display = "block";
                        wbp_screen.classList.remove("blink-text")
                        
                        player.pause()
                    }

                    

                    break;
                }
                default: callStatus.innerText = "Ready to Call"; break;
            }

            //Show Caller Number to Screen
            this.activeLine?.session?.direction == "incoming" ? 
                phoneNumber.value = this.activeLine?.session?.remote_identity?.display_name :
                phoneNumber.value = this.activeLine?.session?.local_identity?.display_name
            

            

        }
        else{
            callStatus.innerText = "Ready to Call";
            player.pause()

            btn_trigger.style.display = "block";
            btn_answer.style.display = "none";
            btn_reject.style.display = "none";
            wbp_screen.classList.remove("blink-text")
            phoneNumber.value = ""
        }
    }

    //Accept Selected Line
    acceptCall(){
        try{

            

            if(this.activeLine?.session != null){


                //Answer the Call
                this.activeLine?.session?.answer({
                    mediaConstraints: {
                    audio: true,
                    video: false
                    },
                    pcConfig: {
                    //   iceServers: [
                        // { urls: 'stun:stun.l.google.com:19302' },
                        // Add more ICE servers if needed
                    //   ]
                    }

                })

                // Attach 'addstream' event listener to the RTCPeerConnection
                this.activeLine?.session.connection.addEventListener('addstream', function(e) {
                    console.log("Stream", e.stream);
                
                    try {
                        // Create a new audio element
                        const remoteAudio = new Audio();
                
                        // Assign the stream to the audio element's source object
                        if ('srcObject' in remoteAudio) {
                            remoteAudio.srcObject = e.stream;
                        } else {
                            // Fallback for older browsers
                            remoteAudio.src = window.URL.createObjectURL(e.stream);
                            
                        }
                
                        // Unmute the audio (if necessary)
                        remoteAudio.muted = false;
                
                        // Play the audio
                        remoteAudio.play()
                            .then(() => {
                                // console.log('Audio playback started successfully');
                            })
                            .catch((error) => {
                                console.error('Error playing audio:', error);
                            });
                    } catch (error) {
                        console.error('Error setting up remote audio:', error);
                    }
                });

                

                

            }


        }
        catch(err){
            console.log("Error", err)
        }
    }
    //Terminate Call
    terminateCall(){

        try{

            if(this.activeLine?.session != null){
            
                if(this.activeLine?.session.isEstablished() == true){
                    this.activeLine?.session.terminate()
                }
                else{
                    this.activeLine?.session.terminate({
                        status_code: 486, // 486 Busy Here or use 603 Decline or another appropriate status code
                    });
                }
            }
            
        }
        catch(err){}
    }

    //Timer
    timerStatus(){

        const callDuration = document.getElementById('call-duration')

        if(this.activeLine?.session != null){

            //Timer
            const startTime = this.activeLine?.session?._start_time?.getTime()




            // Start the timer
            this.timer = setInterval(() => {
                const currentTime = new Date().getTime();
                const duration = Math.floor((currentTime - startTime) / 1000); // Calculate call duration in seconds
                // console.log('Call duration:', duration, 'seconds');

                // Convert duration to hours, minutes, and seconds
                const hours = Math.floor(duration / 3600);
                const minutes = Math.floor((duration % 3600) / 60);
                const seconds = duration % 60;

                // Format duration as HH:MM:SS
                const formattedDuration = 
                (hours < 10 ? '0' : '') + hours + ':' +
                (minutes < 10 ? '0' : '') + minutes + ':' +
                (seconds < 10 ? '0' : '') + seconds;


                callDuration.innerHTML = formattedDuration
                // callDuration.innerHTML = startTime
                // You can display or use the 'duration' variable as needed
            }, 1000); // Update every second

            // console.log("Starting", this.timer)

        }
        else{
            //Stop
            this.timerStop()
        }
        
    }
    //Stop Timer
    timerStop(){
        // console.log("Closing", this.timer)
        clearInterval(this.timer)
        document.getElementById('call-duration').innerHTML = "00:00:00"
        
    }

    //Trigger New Call
    trigger(){

        var phoneNumber = document.querySelector("#phone-number-box").value
        const options = {
            mediaConstraints: {
                audio: true,
                video: false
            },
        }
        this.userAgent.call(`sip:${phoneNumber}@${this.url}`, options);
        
       
    }

    //Hold Call
    hold(session = this.activeLine?.session){
        if(session){
            session.hold({
                success: () => {
                    console.log('Call is on hold');
                    // Perform actions after successfully putting the call on hold
                    // For example, update UI to indicate call is on hold
                    this.emit('hold', {...this.ev(session)})
                },
                failure: (err) => {
                    console.error('Failed to put call on hold:', err);
                    // Handle failure to put the call on hold
                }
            })
        }
        
    }
    //UnHold Call
    unhold(session = this.activeLine?.session){
        if(session){
            session?.unhold({
                success: () => {
                    console.log('Call is unhold');
                    // Perform actions after successfully putting the call on hold
                    // For example, update UI to indicate call is on hold
                    this.emit('unhold', {...this.ev(session)})
                    
                },
                failure: (err) => {
                    console.error('Failed to resume call from hold:', err);
                    // Handle failure to put the call on hold
                }
            })
        }
    }

    //Mute Session
    mute(session = this.activeLine?.session){

        if(session){
            session.mute({
                'audio': true,   // Local audio is muted
            })
            this.emit('muted', {...this.ev(session)})
        }
    }

    //UnMute Session
    unmute(session = this.activeLine?.session){

        if(session){
            session.unmute({
                'audio': true,   // Local audio is unmuted
            })
            this.emit('unmuted', {...this.ev(session)})
        }
    }

    //Transfer Call
    transfer(number){
        if(number == null || typeof Number.parseInt(number) != "number"){
            return alert('Enter Valid Contact Number')
        }


        if(this.activeLine?.session){

            const target = `sip:${number}@${this.url}`;
            const referOptions = {
            extraHeaders: ['Refer-To: ' + target],
            eventHandlers: {
                requestSucceeded: function() {
                
                    console.log('Transfer succeeded', this.activeLine?.session);
                    
                    this.emit('transfer', {...this.ev(this.activeLine?.session)})

                    //Call Transfer Status on Dialer Screen
                    // document.querySelector('#wbp-show-caller-name').innerHTML = "Call Transfer Succeeded"
                
                },
                requestFailed: function() {
                    console.error('Transfer failed');
                }
            }
            };
        
            this.activeLine?.session?.refer(target, referOptions);
            //After successfull transfer, terminate session
            this.activeLine?.session?.terminate()


        }
        else{
            return alert('Active Call not found to be transfered')
        }

        



    }

    //Do not Distrub
    toggleDND(){
        this.dnd = !this.dnd

    }

    //Dial Button DTMF
    dial(num){
        // if(this.activeLine?.session){
        //     this.activeLine?.session.dtmf(num)
        //     console.log(num)
        // }
    }

    //Custom Events
    on(event, callback){

        if(callback && typeof callback == "function"){
            this.events[event] = callback
        }
    }

    //Fire Event
    emit(event, params = {}){
        const e = this.events[event]
        if(e && typeof e == "function"){
            e(params)
        }
    }
    //Event Params
    ev(session){
        return {
            number:session?.remote_identity?.display_name,
            direction:session?.direction,
            timestamp:new Date().getTime()
        }
    }


}