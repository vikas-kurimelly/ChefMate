// src/data/foodItems.js
import { indianFoodItems } from './indianFoodItems';

export const foodItems = [
  // Breakfast Items
  {
    id: 1,
    name: 'Oatmeal with Banana',
    category: 'Breakfast',
    calories: 400,
    protein: 15,
    carbs: 70,
    fats: 8,
    image:
      'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&auto=format&fit=crop&q=60',
    description: 'Healthy oatmeal topped with fresh banana slices',
    cuisine: 'Western',
  },
  {
    id: 2,
    name: 'Greek Yogurt with Berries',
    category: 'Breakfast',
    calories: 250,
    protein: 20,
    carbs: 25,
    fats: 5,
    image:
      'https://images.unsplash.com/photo-1583577612013-4fec2b74c03b?w=800&auto=format&fit=crop&q=60',
    description: 'Creamy Greek yogurt with mixed berries',
    cuisine: 'Western',
  },
  {
    id: 3,
    name: 'Protein Shake',
    category: 'Breakfast',
    calories: 200,
    protein: 30,
    carbs: 10,
    fats: 2,
    image:
      'https://images.unsplash.com/photo-1626208834723-bc96f82b7a86?w=800&auto=format&fit=crop&q=60',
    description: 'Nutritious protein shake with fruits',
    cuisine: 'Western',
  },

  // Lunch Items
  {
    id: 4,
    name: 'Chicken Rice Bowl',
    category: 'Lunch',
    calories: 600,
    protein: 40,
    carbs: 80,
    fats: 15,
    image:
      'https://images.unsplash.com/photo-1624726175512-19b9baf9fbd1?w=800&auto=format&fit=crop&q=60',
    description: 'Grilled chicken with brown rice and vegetables',
    cuisine: 'Western',
  },
  {
    id: 5,
    name: 'Grilled Chicken Salad',
    category: 'Lunch',
    calories: 400,
    protein: 35,
    carbs: 20,
    fats: 15,
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60',
    description: 'Fresh salad with grilled chicken breast',
    cuisine: 'Western',
  },
  {
    id: 6,
    name: 'Quinoa Bowl',
    category: 'Lunch',
    calories: 450,
    protein: 15,
    carbs: 70,
    fats: 12,
    image:
      'https://images.unsplash.com/photo-1626371802903-08a1343603ea?w=800&auto=format&fit=crop&q=60',
    description: 'Protein-rich quinoa with vegetables',
    cuisine: 'Western',
  },

  // Dinner Items
  {
    id: 7,
    name: 'Salmon with Sweet Potato',
    category: 'Dinner',
    calories: 700,
    protein: 45,
    carbs: 60,
    fats: 25,
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=60',
    description: 'Baked salmon with roasted sweet potato',
    cuisine: 'Western',
  },
  {
    id: 8,
    name: 'Baked Fish with Vegetables',
    category: 'Dinner',
    calories: 450,
    protein: 40,
    carbs: 30,
    fats: 15,
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=60',
    description: 'Healthy baked fish with seasonal vegetables',
    cuisine: 'Western',
  },
  {
    id: 9,
    name: 'Vegetable Stir Fry',
    category: 'Dinner',
    calories: 400,
    protein: 15,
    carbs: 50,
    fats: 18,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60',
    description: 'Colorful vegetable stir fry with tofu',
    cuisine: 'Western',
  },

  // Snacks
  {
    id: 10,
    name: 'Mixed Nuts',
    category: 'Snacks',
    calories: 300,
    protein: 10,
    carbs: 15,
    fats: 25,
    image:
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&auto=format&fit=crop&q=60',
    description: 'Healthy mix of nuts and seeds',
    cuisine: 'Western',
  },
  {
    id: 11,
    name: 'Protein Bar',
    category: 'Snacks',
    calories: 250,
    protein: 20,
    carbs: 25,
    fats: 8,
    image:
      'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=800&auto=format&fit=crop&q=60',
    description: 'High-protein energy bar',
    cuisine: 'Western',
  },
  {
    id: 12,
    name: 'Fruit Smoothie',
    category: 'Snacks',
    calories: 200,
    protein: 5,
    carbs: 40,
    fats: 2,
    image:
      'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&auto=format&fit=crop&q=60',
    description: 'Refreshing fruit smoothie',
    cuisine: 'Western',
  },

  // Add all Indian food items
  ...indianFoodItems,
];

export const getFoodItemsByCategory = (category) => {
  return foodItems.filter((item) => item.category === category);
};

export const getFoodItemsByCalories = (minCalories, maxCalories) => {
  return foodItems.filter(
    (item) => item.calories >= minCalories && item.calories <= maxCalories
  );
};

export const getFoodItemsByMacros = (minProtein, minCarbs, minFats) => {
  return foodItems.filter(
    (item) =>
      item.protein >= minProtein &&
      item.carbs >= minCarbs &&
      item.fats >= minFats
  );
};

export const getFoodItemsByCuisine = (cuisine) => {
  return foodItems.filter((item) => item.cuisine === cuisine);
};

export const getAvailableCuisines = () => {
  return [...new Set(foodItems.map((item) => item.cuisine))];
};
