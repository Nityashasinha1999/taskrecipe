'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strIngredients: string[];
  strInstructions: string;
}

interface RecipeListProps {
  initialRecipes: Recipe[];
}

const RecipeList: React.FC<RecipeListProps> = ({ initialRecipes }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = initialRecipes.filter((recipe) =>
    recipe.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.idMeal} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold">{recipe.strMeal}</h2>
            <h3 className="font-semibold mt-2">Ingredients:</h3>
            <ul className="list-disc list-inside">
              {recipe.strIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h3 className="font-semibold mt-2">Instructions:</h3>
            <p>{recipe.strInstructions}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default RecipeList; 