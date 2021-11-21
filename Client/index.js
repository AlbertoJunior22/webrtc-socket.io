import PeerManager from "./PeerManager.js"

const remote = document.querySelector('#remote')
const local = document.querySelector('#local')

window.onload = () => {

    //const socket = io('http://localhost:3000')

    window.startMirroring = async function() {
        const stream = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true})
        local.srcObject = stream
        
        const remoteStream = new MediaStream()
        remote.srcObject = remoteStream

        const sender = new PeerManager()
        stream.getTracks().forEach(t => {
            sender._peer.addTrack(t, stream)
        })
        
        const receiver = new PeerManager(remoteStream)

        sender.makeCall()
    }
}