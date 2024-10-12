import axios from 'axios';

export const setApiUrl = (url) => ({ type: 'SET_API_URL', payload: url });
export const setCurrentUser = (user) => ({ type: 'SET_CURRENT_USER', payload: user });
export const setAccessToken = (token) => ({ type: 'SET_ACCESS_TOKEN', payload: token });

// Example action for fetching user details
export const fetchUserDetails = () => async (dispatch, getState) => {
  const token = getState().accessToken; // Access token from store
  const response = await axios.get(`${getState().apiUrl}/get_user_details`, {
    headers: { Authorization: `Bearer ${token}` }, // Add authorization if needed
  });
  dispatch(setCurrentUser(response.data));
};


export const fetchAdminHomeData = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:8000/api/admin_home'); // Replace with your API URL
    dispatch({ type: 'SET_ADMIN_HOME_DATA', payload: response.data });
  } catch (error) {
    console.error('Error fetching admin home data:', error);
  }
};