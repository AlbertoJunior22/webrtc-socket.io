import Constants from "./Constants.js"
import SData from "./SData.js"
import Socket from "./Socket.js"

const PeerManager = class {

    constants = new Constants()
    
    _peer
    _socket
    _main
    _remoteStream

    constructor(remoteStream) {
        this._peer = new RTCPeerConnection()
        this._socket = new Socket(this.treatMessage)
        this._remoteStream = remoteStream
        this.addPeerEvents()
    }

    addPeerEvents() {
        this._peer.onicecandidate = (candidate) => {
            if (candidate.candidate) {
                const data = new SData(this.constants.CANDIDATE, candidate.candidate)
                this._socket.send(data)
            }
        }

        this._peer.onconnectionstatechange = (evt) => {
            console.log(`Connection: ${evt.connectionState}`)
        }

        this._peer.ontrack = (evt) => {
            this._remoteStream.addTrack(evt.track, this._remoteStream);
        }
    }

    treatMessage = async (msg) => {
        console.log(`Message: ${JSON.stringify(msg)}`)
        switch(msg._event) {
            case this.constants.OFFER:
                this.setRemoteDescription(msg._message)
                break
            case this.constants.ANSWER:
                this.setRemoteDescription(msg._message)
                break
            case this.constants.CANDIDATE:
                this.setRemoteCandidate(msg._message)
                break
        }
    }

    async setRemoteCandidate(candidate) {
        await this._peer.addIceCandidate(candidate)
    }

    async makeCall() {
        this._main = true
        const localDescription = await this._peer.createOffer()
        await this._peer.setLocalDescription(localDescription)
        const msg = new SData(this.constants.OFFER, localDescription)
        this._socket.send(msg)
    }

    async setRemoteDescription(description) {
        //new RTCPeerConnection().setRemoteDescription
        await this._peer.setRemoteDescription(description)
        if (!this._main) {
            const localDescription = await this._peer.createAnswer()
            await this._peer.setLocalDescription(localDescription)
            const msg = new SData(this.constants.ANSWER, localDescription)
            this._socket.send(msg)
        }
    }
}

export default PeerManager