import {
    SEND_VOTE,
    SEND_NOMINATION,
    REMOVE_NOMINATION
    UPDATE_QUIDEM_STATE
} from './actionTypes';

const sendVote = () => {
    type: SEND_VOTE,
};

const sendNomination = () => {
    type: SEND_NOMINATION,
};

const removeNomination = () = {
    type: REMOVE_NOMINATION,
};

const updateGameState = () = {
    type: UPDATE_QUIDEM_STATE,
};
