import { createContext, useReducer } from 'react';
import githubReducer from './GithubReducer';
const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };
  const [state, dispatch] = useReducer(githubReducer, initialState);
  // , {
  //       headers: {
  //         Authorization: `token ${GITHUB_TOKEN}`,
  //       },
  //     }

  // Get a single user
  const getUser = async (login) => {
    setLoading();
    const res = await fetch(`${GITHUB_URL}/users/${login}`);
    if (res.status === 404) {
      window.location = '/notfound';
    } else {
      const data = await res.json();
      console.log(data);
      dispatch({
        type: 'GET_USER',
        payload: data,
      });
    }
  };

  const getUserRepo = async (text) => {
    const res = await fetch(`${GITHUB_URL}/users/${text}/repos`);
    const data = await res.json();
    dispatch({
      type: 'SET_REPOS',
      payload: data,
    });
  };
  const searchUsers = async (text) => {
    setLoading();
    const params = new URLSearchParams({
      q: text,
    });
    const res = await fetch(`${GITHUB_URL}/search/users?${params}`);
    const { items } = await res.json();
    dispatch({
      type: 'GET_USERS',
      payload: items,
    });
  };
  const clearUsers = () => {
    dispatch({
      type: 'CLEAR_USERS',
    });
  };
  //   Set Loadinng
  const setLoading = () => {
    dispatch({ type: 'SET_LOADING' });
  };
  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        user: state.user,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepo,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
