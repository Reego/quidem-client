import {
    receiveWebSocketConnect,
    receiveState,
    resetState
} from './actions';

const WEBSOCKET_PATH = 'ws/quidem/';

const createWebSocketConnection = (session_id, dispatch) => {
    const socket = new WebSocket(WEBSOCKET_PATH + session_id + '/');

    socket.onopen = () => {
        dispatch(receiveWebSocketConnect(this));
    };
    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        dispatch(receiveState(data));
    };
    socket.onclose = () => {
        dispatch(resetState());
    };
};

export default createWebSocketConnection;
