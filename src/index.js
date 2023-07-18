import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ContextProvider } from './context/ContextProvider';
import { Provider } from 'react-redux';
import {store, persistor} from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <Provider store={store}>
        <PersistGate loading="null" persistor={persistor}>     
          <App />
        </PersistGate>  
      </Provider>
    </ContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

