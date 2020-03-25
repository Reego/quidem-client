import { combineReducers } from 'react-redux';

import commonReducer from './common/reducers';
import createReducer from './create/reducers';
import homeReducer from './home/reducers';
import quidemReducer from './quidem/reducers';

const rootReducer = combineReducers({
    ...commonReducer,
    ...createReducer,
    ...homeReducer,
    ...quidemReducer
});

export default rootReducer;
