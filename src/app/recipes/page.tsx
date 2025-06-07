'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}

interface MealsResponse {
  meals: Meal[] | null;
}

const fetchMeals = async (): Promise<Meal[]> => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  const data: MealsResponse = await response.json();
  return data.meals || [];
};

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: meals, isLoading, error } = useQuery({
    queryKey: ['meals'],
    queryFn: fetchMeals,
  });

  const filteredMeals = meals?.filter(meal => 
    meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIngredients = (meal: Meal) => {
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof Meal];
      const measure = meal[`strMeasure${i}` as keyof Meal];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure || ''} ${ingredient}`.trim());
      }
    }
    return ingredients;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading recipes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error loading recipes. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Recipe Collection</h1>
          <Link href="/">
            <Button 
              className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Back to Tasks
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>

        <div className="grid gap-8">
          {filteredMeals?.map((meal) => (
            <div 
              key={meal.idMeal} 
              className="bg-slate-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex gap-6">
                <img 
                  src={meal.strMealThumb} 
                  alt={meal.strMeal}
                  className="w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-white mb-2">{meal.strMeal}</h2>
                  <div className="flex gap-4 mb-4">
                    <span className="text-slate-300">{meal.strCategory}</span>
                    <span className="text-slate-300">{meal.strArea}</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">Ingredients</h3>
                      <ul className="list-disc list-inside space-y-2 text-slate-300">
                        {getIngredients(meal).map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">Instructions</h3>
                      <p className="text-slate-300 whitespace-pre-line">
                        {meal.strInstructions}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 