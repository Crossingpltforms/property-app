import io from 'socket.io-client'
import { SUBSCRIBE } from './socket-event'
import { PRODUCTION } from './http'
// const socketEndPointDEV = 'http://chat-alpha-wss.speedrent.com:11105' // Alpha
const socketEndPointDEV = 'https://chat-beta-socketio.speedrent.com' // Beta
const socketEndPointProd = 'https://chat-socketio.speedrent.com'
const socketEndPoint = PRODUCTION ? socketEndPointProd : socketEndPointDEV
// const socketEndPoint = 'http://localhost:8182'

// const IMAGE_UPLOAD_URL_DEV =
  // 'http://chat-alpha-wss.speedrent.com:11005/api/conversation/file/' //Alpha

const IMAGE_UPLOAD_URL_DEV =
  'https://chat-beta-wss.speedrent.com/api/conversation/file/' // Beta

const IMAGE_UPLOAD_URL_PROD =
  'https://chat.speedrent.com/api/conversation/file/'

export const IMAGE_UPLOAD_URL = PRODUCTION
  ? IMAGE_UPLOAD_URL_PROD
  : IMAGE_UPLOAD_URL_DEV

const VIDEO_UPLOAD_URL_DEV = 'https://chat-beta.speedrent.com/api/conversation/' // Beta

const VIDEO_UPLOAD_URL_PROD = 'https://chat.speedrent.com/api/conversation/'

export const VIDEO_UPLOAD_URL = PRODUCTION
  ? VIDEO_UPLOAD_URL_PROD
  : VIDEO_UPLOAD_URL_DEV

export const connectSocket = token => {
  const socket = io(`${socketEndPoint}/chat?token=${token}`, {
    reconnection: true,
    timeout: 60 * 1000,
    reconnectionDelay: 500,
    jsonp: false,
    reconnectionAttempts: Infinity,
    transports: ['websocket']
  })

  return socket
}

export const subscribe = (socket, channel) => {
  socket.emit(SUBSCRIBE, channel)
}
