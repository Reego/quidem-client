import {
    RECEIVE_WEB_SOCKET_CONNECTION,
    RECEIVE_STATE,
    RESET_STATE,
} from './actionTypes';

const socket = (state=null, action) => (action.type === RECEIVE_WEB_SOCKET_CONNECTION) ? action.socket : state;

const receiveState = (state={}, action) => {
    if(action.type === RECEIVE_STATE) {

    }
    return state;
};

const resetState = (state={}}, action) => (action.type === RESET_STATE) ? {} : state;

return {
    socket,
    resetState
};
