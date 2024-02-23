# Overview
A full featured Webphone using JsSIP.

- 4 Lines for Call
- Easy to use and powerful API of JsSIP library
- SIP over WebSocket
- Lightweight!
- Feature like Mute, Hold, Transfer and DND (Do not Call)
- Attractive UI

## Technology Used
- [JsSIP, the JavaScript SIP library](https://github.com/versatica/JsSIP)
- React + Vite
- [React Icons](https://www.npmjs.com/package/react-icons)
- Tailwindcss


## Usage

```javascript

const phone = new PhoneLib(SIP_USER, SIP_PASS, URL_WEBRTC, PORT_NO_WEBRTC)

//Connect to the SIP Server
phone.connect()


```

## Events
```javascript

//On Incoming Call
phone.on('incoming', (data)=>{
  console.log(data)
})

//On Outgoing Call
phone.on('outgoing', (data)=>{
  console.log(data)
})

//On Line Change
phone.on('changeLine', (data)=>{
  console.log(data)
})

//On Call Transfered
phone.on('transfer', (data)=>{
  console.log(data)
})

//On Calls Rejected while DND is enable
phone.on('dndRejected', (data)=>{
  console.log(data)
})

//On Line Hold
phone.on('hold', (data)=>{
  console.log(data)
})

//On Line UnHold
phone.on('unhold', (data)=>{
  console.log(data)
})

//On Line Muted
phone.on('mute', (data)=>{
  console.log(data)
})

//On Line UnMuted
phone.on('unmute', (data)=>{
  console.log(data)
})

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.
Please make sure to update tests as appropriate.