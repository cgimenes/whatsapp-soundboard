class Connection {
    constructor(authInfo) {
        this.authInfo = this.loadAuthInfo(authInfo)
        this.state = 'close'
    }

    loadAuthInfo(authInfo) {
        const secretBundle = typeof authInfo.WASecretBundle === 'string' ? JSON.parse(authInfo.WASecretBundle) : authInfo.WASecretBundle
        this.authInfo = {
            clientID: authInfo.WABrowserId.replace(/\"/g, ''),
            serverToken: authInfo.WAToken2.replace(/\"/g, ''),
            clientToken: authInfo.WAToken1.replace(/\"/g, ''),
            encKey: secretBundle.encKey,
            macKey: secretBundle.macKey,
        }
        this.conn = null
        this.lastSeen = null
        this.msgCount = 0
        this.referenceDate = new Date()
        this.version = [2, 2049, 10]
        // this.browserDescription = [r.os || "Unknown", r.name || "Unknown", r.version || "Unknown"]
    }

    connect() {
        this.conn = new WebSocket('wss://web.whatsapp.com/ws')

        this.conn.addEventListener('message', event => {
            console.log('Message from server ', event.data)
        })
        this.conn.addEventListener('open', event => {
            this.startKeepAliveRequest()
            // this.authenticate()
        })
        this.conn.addEventListener('close', event => {
            console.log('Bye!')
        })
        this.conn.addEventListener('error', event => {
            console.log('Error ', event)
        })
    }

    // authenticate() {
    //     var _a, _b, _c, _d, _e, _f
    //     const canLogin = this.canLogin()
    //     this.referenceDate = new Date() // refresh reference date
    //     let isNewUser = false
    //     this.startDebouncedTimeout()
    //     const initQuery = (async () => {
    //         var _a
    //         const { ref, ttl } = await this.query({
    //             json: ['admin', 'init', this.version, this.browserDescription, this.authInfo.clientID, true],
    //             expect200: true,
    //             waitForOpen: false,
    //             longTag: true,
    //             requiresPhoneConnection: false,
    //             startDebouncedTimeout: true
    //         })
    //         if (!canLogin) {
    //             this.stopDebouncedTimeout() // stop the debounced timeout for QR gen
    //             this.generateKeysForAuth(ref, ttl)
    //         }
    //     })()
    //     let loginTag
    //     if (canLogin) {
    //         // if we have the info to restore a closed session
    //         const json = [
    //             'admin',
    //             'login',
    //             (_b = this.authInfo) === null || _b === void 0 ? void 0 : _b.clientToken,
    //             (_c = this.authInfo) === null || _c === void 0 ? void 0 : _c.serverToken,
    //             (_d = this.authInfo) === null || _d === void 0 ? void 0 : _d.clientID,
    //         ]
    //         loginTag = this.generateMessageTag(true)
    //         if (reconnect)
    //             json.push(...['reconnect', reconnect.replace('@s.whatsapp.net', '@c.us')])
    //         else
    //             json.push('takeover')
    //         // send login every 10s
    //         const sendLoginReq = () => {
    //             var _a
    //             if (!this.conn || ((_a = this.conn) === null || _a === void 0 ? void 0 : _a.readyState) !== this.conn.OPEN) {
    //                 this.logger.warn('Received login timeout req when WS not open, ignoring...')
    //                 return
    //             }
    //             if (this.state === 'open') {
    //                 this.logger.warn('Received login timeout req when state=open, ignoring...')
    //                 return
    //             }
    //             this.logger.debug('sending login request')
    //             this.sendJSON(json, loginTag)
    //             this.initTimeout = setTimeout(sendLoginReq, 10000)
    //         }
    //         sendLoginReq()
    //     }
    //     await initQuery
    //     // wait for response with tag "s1"
    //     let response = await Promise.race([
    //         this.waitForMessage('s1', false, undefined),
    //         loginTag && this.waitForMessage(loginTag, false, undefined)
    //     ]
    //         .filter(Boolean))
    //     this.startDebouncedTimeout()
    //     this.initTimeout && clearTimeout(this.initTimeout)
    //     this.initTimeout = null
    //     if (response.status && response.status !== 200) {
    //         throw new Constants_1.BaileysError(`Unexpected error in login`, { response, status: response.status })
    //     }
    //     // if its a challenge request (we get it when logging in)
    //     if ((_e = response[1]) === null || _e === void 0 ? void 0 : _e.challenge) {
    //         await this.respondToChallenge(response[1].challenge)
    //         response = await this.waitForMessage('s2', true)
    //     }
    //     const newUser = await this.validateNewConnection(response[1]) // validate the connection
    //     if (newUser.jid !== ((_f = this.user) === null || _f === void 0 ? void 0 : _f.jid)) {
    //         isNewUser = true
    //         // clear out old data
    //         this.chats.clear()
    //         this.contacts = {}
    //     }
    //     this.user = newUser
    //     this.logger.info('validated connection successfully')
    //     this.emit('connection-validated', this.user)
    //     if (this.loadProfilePicturesForChatsAutomatically) {
    //         const response = await this.query({
    //             json: ['query', 'ProfilePicThumb', this.user.jid],
    //             waitForOpen: false,
    //             expect200: false,
    //             requiresPhoneConnection: false,
    //             startDebouncedTimeout: true
    //         })
    //         this.user.imgUrl = (response === null || response === void 0 ? void 0 : response.eurl) || ''
    //     }
    //     this.sendPostConnectQueries()
    //     this.logger.debug('sent init queries')
    //     return { isNewUser }
    // }

    startKeepAliveRequest() {
        let interval = 20 * 1000
        this.keepAliveReq && clearInterval(this.keepAliveReq)
        this.keepAliveReq = setInterval(() => {
            if (!this.lastSeen) {
                this.lastSeen = new Date()
            }
            const diff = new Date().getTime() - this.lastSeen.getTime()
            if (diff > interval + 5000) {
                console.log('unexpectedDisconnect')
                // this.unexpectedDisconnect(Constants_1.DisconnectReason.lost)
            } else if (this.conn) {
                this.send('?,,')
            }
        }, interval)
    }

    send(msg) {
        this.msgCount += 1
        this.conn.send(msg)
    }

    sendAudio() {
// const broadcastId = '[timestamp of creation]@broadcast'
// const buffer = fs.readFileSync("Media/audio.mp3")
// const options: MessageOptions = { mimetype: Mimetype.mp4Audio }
// conn.sendMessage(personId, buffer, MessageType.audio, options)
    }

    getId() {
        if (document.querySelector('#main') === null) {
            return null
        }

        let msg = document.querySelector('.focusable-list-item[data-id]')
        let attr = msg.getAttribute('data-id')
        let parsed = attr.split('_')

        return parsed[1]
    }
}

let conn = new Connection({
    WABrowserId: window.localStorage.getItem('WABrowserId'),
    WASecretBundle: window.localStorage.getItem('WASecretBundle'),
    WAToken1: window.localStorage.getItem('WAToken1'),
    WAToken2: window.localStorage.getItem('WAToken2')
})
conn.connect()

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.function === "get-id") {
        let id = conn.getId()
        sendResponse(id)
    } else if (request.function === "send") {
        conn.sendAudio()
    }
    return true
})