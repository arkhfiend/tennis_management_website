import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // For asynchronous actions

const initialState = {
  apiUrl: 'http://localhost:8000/api',
  currentUser: null,
  accessToken: null, 
  adminHomeData: {},
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_API_URL':
      return { ...state, apiUrl: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_ACCESS_TOKEN':
      return { ...state, accessToken: action.payload };
    // ... Add other state update cases
    default:
      return state;
  }
}

const store = createStore(reducer, applyMiddleware(thunk));

export default store;