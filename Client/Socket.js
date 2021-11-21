const Socket = class {

    _socket
    _callback

    constructor(callback) {
        this._socket = io('http://localhost:3000')
        this._callback = callback
        this.startEvents()
    }

    startEvents() {
        this._socket.on('message', async (msg) => {
            this._callback(msg)
        })
    }

    send(msg) {
        this._socket.emit('message', msg)
    }
}

export default Socket