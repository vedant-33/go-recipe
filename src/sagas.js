import {call, put, takeLatest, all} from 'redux-saga/effects'
import {Client, Databases, ID, Query} from 'appwrite'
import conf from './conf';

import{
    fetchRecipeDetailsFail,
    fetchRecipeDetailsSuccess,
    fetchRecipesFail,
    fetchRecipesSuccess,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    fetchUserRecipes,
} from './slice/recipeSlice'

const KEY= conf.apiKEY;



const client = new Client()
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);

const databases = new Databases(client);

function * fetchRecipes(action){
    try {

        const cachedRecipes = JSON.parse(localStorage.getItem('recipes'));
        const lastFetched = localStorage.getItem('lastFetched');
        const now = new Date();
        const oneDay = 24*60*60*1000;
        console.log('cached recipes: ',cachedRecipes);

        if(cachedRecipes && lastFetched && (now - new Date(lastFetched) < oneDay)){ 
            //if recipes are present in localStorage and are less than 1 day old
            yield put(fetchRecipesSuccess(cachedRecipes));
        }
        else{
            //call for new recipes, if time expired or first time fetch
            const res = yield call(fetch, `https://api.spoonacular.com/recipes/random?=5&apiKey=${KEY}`);
            const data= yield res.json();
            console.log('api response:  ',data);

            if(data && data.recipes){
                localStorage.setItem('recipes', JSON.stringify(data.recipes));
                localStorage.setItem('lastFetched', now.toISOString());
                yield put(fetchRecipesSuccess(data.recipes));
            }
            else{
                yield put(fetchRecipesFail('failure'));
            }
        }
    } catch (error) {
        yield put(fetchRecipesFail(error.toString())) // find error handling
    }
}

function * fetchRecipeDetails(action) {
    try {
        const res = yield call(fetch, `https://api.spoonacular.com/recipes/${action.payload}/information?apiKey=${KEY}`);
        const data= res.json();
        if(res.ok){
            yield put(fetchRecipeDetailsSuccess(data));
        }
    } catch (error) {
        yield put(fetchRecipeDetailsFail(error.toString()));
    }
}

function * createRecipe(action){
    try {
        const res= yield call([databases, databases.createDocument], 
            conf.appwriteDatabaseId, 
            conf.appwriteCollectionId,
            ID.unique(),
            action.payload
        );
        yield put(addRecipe(res));
    } catch (error) {
        console.log('error in createRecipe saga: ', error);
        throw error;
    }
}

function * changeRecipe(){
    try {
        const res= yield call([databases, databases.updateDocument], 
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            action.payload.$id,
            action.payload,
        )
        yield put(updateRecipe(res));
    } catch (error) {
        console.log('error in changeRecipe saga: ',  error);
        throw error;
    }
}

function * removeRecipe(action) {
    try {
        yield call([databases, databases.deleteDocument], 
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            action.payload,
        )
        yield put(deleteRecipe(action.payload));
    } catch (error) {
        console.log('error in removeRecipe saga, error');
        throw error;
    }
}

function * getUserRecipes(action){
    try {
        const res= yield call([databases, databases.listDocuments],
            conf.appwriteCollectionId,
            conf.appwriteDatabaseId,
            [Query.equal('userId',action.payload)],
        )
        yield put(fetchUserRecipes(res));
    } catch (error) {
        console.log('error in getUserRecipesSaga: ', error);
        throw error;
    }
}

function * watchFetchRecipes() {
    yield takeLatest('recipes/fetchRecipes', fetchRecipes);
}
function * watchFetchRecipeDetails() {
    yield takeLatest('recipes/fetchRecipeDetails', fetchRecipeDetails);
}
function * watchAddRecipe() {
    yield takeLatest('recipes/addRecipe', createRecipe);
}
function * watchDeleteRecipe() {
    yield takeLatest('recipes/deleteRecipe', removeRecipe);
}
function * watchUpdateRecipe() {
    yield takeLatest('recipes/update', changeRecipe);
}
function * watchFetchUserRecipes() {
    yield takeLatest('recipes/fetchUserRecipes', getUserRecipes);
}

export default function * rootSaga() {
    yield all([watchFetchRecipes(), watchFetchRecipeDetails(), watchAddRecipe(), watchDeleteRecipe(), watchUpdateRecipe(), watchFetchUserRecipes()]);
}