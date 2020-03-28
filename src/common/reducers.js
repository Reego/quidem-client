import {
    RECEIVE_WEB_SOCKET_CONNECTION,
    RECEIVE_STATE,
    RESET_STATE,
} from './actionTypes';

const socket = (state={}, action) => {
    if(action.type === RECEIVE_WEB_SOCKET_CONNECTION) {
        const newState = {...state};
        newState.socket = action.socket
        return newState;
    }
    return state;
};

const receiveState = (state={}, action) => {
    if(action.type === RECEIVE_STATE) {
        if(action.data.type === 'state' && state.user.consumer_id != null) {
            const body = action.data.state;
            const newState = {
                quidem: {
                    settings: body.settings,
                    votes: body.votes,
                    phase: body.phase,
                    nominations: body.nominations,
                    users: body.users,
                    calculated_votes: body.calculated_votes
                },
                user: {
                    votes: body.vote,
                    consumer_id: state.user.consumer_id
                },
                socket: state.socket
            };

            return newState;
        }
        else if(action.data.type === 'join') {
            const newState = {
                quidem: {
                    phase: 1,
                    settings: {},
                    votes: {},
                    nominations: [],
                    users: {},
                    calculated_votes: []
                },
                user: {
                    votes: [],
                    consumer_id: action.data.consumer_id
                },
                socket: state.socket
            }
            return newState
        }
        else {
            alert('error');
        }
    }
    return state;
};

const resetState = (state={}, action) => (action.type === RESET_STATE) ? {} : state;

const mainReducer = (state={}, action) => {
    return resetState(receiveState(socket(state, action), action), action)
}

export default mainReducer;
