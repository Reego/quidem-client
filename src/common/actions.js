import {
    RECEIVE_WEB_SOCKET_CONNECTION,
    RECEIVE_STATE,
    RESET_STATE,
} from './actionTypes';

const receiveWebSocketConnect = (socket) => ({
    type: RECEIVE_WEB_SOCKET_CONNECTION,
    socket
});

const receiveState = (data) => ({
    type: RECEIVE_STATE,
    data
});

const resetState = () => ({type: RESET_STATE});

export {
    receiveWebSocketConnect,
    receiveState,
    resetState
};
