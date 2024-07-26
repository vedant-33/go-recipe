import {configureStore} from '@reduxjs/toolkit'
import authSlice from '../slice/authSlice'
import recipeSlice from '../slice/recipeSlice'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas'

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        auth: authSlice,
        recipes: recipeSlice,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }).concat(sagaMiddleware),
    
});
sagaMiddleware.run(rootSaga);

export default store;