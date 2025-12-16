import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import { authApi } from "@/features/auth/authApi";
import authReducer from "@/features/auth/authSlice";
import { availabilityApi } from "@/features/availability/availabilityApi";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"], // ✅ only auth is persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [availabilityApi.reducerPath]: availabilityApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware, availabilityApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
