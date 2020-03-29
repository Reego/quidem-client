import {
    receiveWebSocketConnect,
    receiveState,
    resetState
} from './actions';

const WEBSOCKET_PATH = 'ws://127.0.0.1:8000/ws/quidem/';
const CLIENT_KEY_RANGE = 100000;

const createWebSocketConnection = (session_id, onInitialMessage, dispatch, nickname='Author') => {
    const clientKey = Math.floor(Math.random() * CLIENT_KEY_RANGE);
    const socket = new WebSocket(WEBSOCKET_PATH + session_id + '&' + clientKey + '&' + nickname +  '/');

    const send = socket.send.bind(socket);

    socket.send = obj => {
        send(JSON.stringify(obj));
    };

    socket['session_id'] = session_id;

    let isInitialMessage = true;

    socket.onopen = () => {
        dispatch(receiveWebSocketConnect(socket));
        socket.send({'action': 'WOW'});
    };
    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if(isInitialMessage && data.type === 'join' && data.key === clientKey) {
            isInitialMessage = false;
            onInitialMessage();
        }

        dispatch(receiveState(data));
    };
    socket.onclose = () => {
        // alert('onclose');
        dispatch(resetState());
    };
};

export default createWebSocketConnection;
