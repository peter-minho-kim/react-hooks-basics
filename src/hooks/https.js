import { useReducer, useCallback } from 'react';

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null, data: null };
    case 'RESPONSE':
      return { ...currHttpState, loading: false, data: action.responseData };
    case 'ERROR':
      return { loading: false, error: action.errorData };
    case 'CLEAR':
      return { ...currHttpState, error: null };
    default:
      throw new Error('Should not be reached');
  }
};

const useHttp = (params) => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null
  });

  const sendRequest = useCallback((url, method, body) => {
    dispatchHttp({ type: 'SEND' });
    fetch(url, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        dispatchHttp({ type: 'RESPONSE', responseData: responseData });
      })
      .catch((error) => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong' });
      });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest
  };
};

export default useHttp;
