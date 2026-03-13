import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes, isLoading }) => {
  if (isLoading) {
    return (
      <div className="recipe-grid loading">
        {[1, 2, 3].map((placeholder) => (
          <div key={placeholder} className="recipe-card-skeleton">
            <div className="skeleton-title"></div>
            <div className="skeleton-meta">
              <div className="skeleton-tag"></div>
              <div className="skeleton-tag"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;