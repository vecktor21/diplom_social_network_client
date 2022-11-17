import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserStore from "./store/UserStore";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./components/Pages/MainPage";
import AdminPage from "./components/Pages/AdminPage";
import UserFavoritesStore from "./store/UserFavoritesStore";

interface IContext {
    userStore:UserStore,
    userFavoritesStore: UserFavoritesStore
}

export const Context = createContext<Partial<IContext>>({})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);



root.render(
  <Context.Provider
    value={{
        userStore: new UserStore(),
        userFavoritesStore: new UserFavoritesStore()
    }}
  >
      <App/>
  </Context.Provider>
);

