import loginReducer from './isLoggedIn.js';
import userReducer from './userReducer.js';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    login : loginReducer,
    user : userReducer
})

export default allReducers;