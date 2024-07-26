import React, {useState, useEffect} from "react";
import {Container, Card} from '../components/Index'
import appwriteService from '../appwrite/config'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../slice/recipeSlice';



function AllPosts() {
    const dispatch = useDispatch();
    const {recipes, lastFetched} = useSelector(state => state.recipes);

    useEffect(() => {
        const now = new Date();
        const lastFetchTime = lastFetched ? new Date(lastFetched) :null;
        const timeInADay= 24*60*60*1000;

        if(!lastFetchTime || now - lastFetchTime > timeInADay){
            dispatch(fetchRecipes());
        }
    }, [dispatch, lastFetched])
    
    if (!recipes || recipes.length === 0) return <p>No recipes available.</p>;


    return (
    <div className='w-full py-8'>
            <Container>
                <div className='grid grid-cols-1'>
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="p-4 bg-white shadow-md rounded-lg">

                        {recipe.image && (
                            <img 
                            src={recipe.image}
                            alt={recipe.title} 
                            className="w-full h-48 object-cover rounded-md"
                            />
                        )}
                       
                        
                        <h2 className="mt-4 text-xl font-bold">{recipe.title}</h2>
                        <p className="mt-2"><strong>Servings: </strong> {recipe.servings}</p>
                        <p className="mt-2"><strong>Ready in: </strong> {recipe.readyInMinutes} minutes</p>
                        <p className="mt-2"><strong>Ingredients: </strong></p>
                        <ul className="list-disc list-inside">
                            {recipe.extendedIngredients.map((ingredient, index) => (
                                <li key={index}>{ingredient.original}</li>
                            ))}
                        </ul>
                        <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 text-blue-500 hover:underline">
                            View Full Recipe
                        </a>
                    </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}
export default AllPosts;
