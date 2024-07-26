import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: '',
    recipes: [],
    recipeDetails:{},
    userRecipes: [],
    error: null,
    lastFetched: null,
}

const recipeSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers:{

        fetchRecipes(state, action) {}, // placeholder function
        // this action is dispatched to the store; 
        // triggers the fetchRecipes method defined in sagas.js,
        // under a watcher function, watchFetchRecipes().

        fetchRecipesSuccess: (state, action) => {
            state.status= 'success';
            state.recipes= action.payload;
            state.lastFetched = new Date().toISOString();            
        },
        fetchRecipesFail: (state, action) => {
            state.status= 'failure';
            state.error= action.payload;
        },
        fetchRecipeDetailsSuccess: (state, action) => {
            state.status= 'success';
            state.recipeDetails= action.payload;
        },
        fetchRecipeDetailsFail: (state, action) => {
            state.status= 'failure';
            state.recipeDetails= action.payload;
        },
        addRecipe: (state, action) => {
            state.userRecipes.push(action.payload);
        },
        fetchUserRecipes: (state, action) => {
            state.userRecipes = action.payload;
        },
        updateRecipe: (state, action) => {
            const index= state.userRecipes.findIndex(
                recipe => recipe.$id === action.payload.$id
            )
            if(index!=-1){
                state.userRecipes[index]= action.payload;
            }
            else{
                state.status = 'failure';
            }
        },
        deleteRecipe:(state, action) => {
            state.userRecipes = state.userRecipes.filter(
                recipe => recipe.$id !== action.payload.$id
            )
        }
    }
})

export const {fetchRecipes, addRecipe, fetchUserRecipes, updateRecipe, deleteRecipe, fetchRecipesSuccess, fetchRecipesFail, fetchRecipeDetailsSuccess, fetchRecipeDetailsFail} = recipeSlice.actions;
export default recipeSlice.reducer;