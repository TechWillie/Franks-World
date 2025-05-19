import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store/store';
import { BrowserRouter} from 'react-router-dom';
// import Home from './pages/Home';



const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>         {/* Provides routing context */}
        <App />               {/* Main app component */}
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
