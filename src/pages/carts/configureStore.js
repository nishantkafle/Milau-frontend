// configureStore.js
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import rootReducer from './reducers'; // Import your root reducer here

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'] // Specify 'cart' as the slice you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
