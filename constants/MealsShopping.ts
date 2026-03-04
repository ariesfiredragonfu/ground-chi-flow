/**
 * 7-Day Anti-Aging Meal Plan
 *
 * From Age reversal meals. Features: elderberries, chia, turmeric, sauerkraut,
 * green bananas (resistant starch), ghee, lentils. Day 4 = 16:8 fasting.
 */

// 7-Day Anti-Aging Meal Plan — day-by-day
export const AGE_REVERSAL_MEAL_PLAN = [
  {
    day: 1,
    label: 'Day 1',
    breakfast: 'Oatmeal (1/2 cup oats) with 1 tbsp chia seeds, 1/4 cup elderberries, 1 tbsp ghee.',
    lunch: 'Lentil soup (1/2 cup cooked lentils) with 1 tsp grated turmeric root, 1 sliced apple.',
    dinner: 'Sautéed greens (your stash) with 1 tbsp butter, 1/4 cup sauerkraut, 1 cup red grapes.',
    snack: '1 oz dark chocolate, 1 cup Rhodiola tea.',
  },
  {
    day: 2,
    label: 'Day 2',
    breakfast: 'Green banana smoothie (1 banana, 1 tbsp chia, 1 tbsp cocoa powder, water).',
    lunch: 'Onion sauté (1/2 onion) with lentils (1/2 cup), 1 tbsp ghee.',
    dinner: 'Baked chicken or tofu with 1 tsp turmeric, 1/4 cup sauerkraut, 1 apple.',
    snack: '1/4 cup peanuts, 1 cup Coleus tea.',
  },
  {
    day: 3,
    label: 'Day 3',
    breakfast: 'Oats (1/2 cup) with 1/4 cup elderberries, 1 tbsp butter.',
    lunch: 'Salad (greens, 1/2 onion, 1 tbsp chia) with 1 cup red grapes.',
    dinner: 'Lentil patties (1/2 cup lentils) with 1 tbsp ghee, 1/4 cup sauerkraut.',
    snack: '1 oz dark chocolate, 1 cup St. John\'s Wort tea.',
  },
  {
    day: 4,
    label: 'Day 4 (Fasting — 16:8)',
    breakfast: null as string | null,
    lunch: null as string | null,
    dinner: null as string | null,
    snack: null as string | null,
    morning: 'Black coffee (1 cup), Coleus tea (1 cup).',
    breakFast: 'Green banana (1) with 1 tbsp ghee, 1/4 cup elderberries.',
    dinnerAlt: 'Onion-lentil stew (1/2 onion, 1/2 cup lentils), 1 tsp turmeric, 1 apple.',
    snackAlt: '1/4 cup peanuts.',
  },
  {
    day: 5,
    label: 'Day 5',
    breakfast: 'Chia pudding (2 tbsp chia, water, 1 tbsp cocoa powder), 1/4 cup red grapes.',
    lunch: 'Sautéed greens with 1/2 onion, 1 tbsp butter, 1/4 cup sauerkraut.',
    dinner: 'Lentil-turmeric bowl (1/2 cup lentils, 1 tsp turmeric), 1 apple.',
    snack: '1 oz dark chocolate, 1 cup Rhodiola tea.',
  },
  {
    day: 6,
    label: 'Day 6',
    breakfast: 'Oatmeal (1/2 cup) with 1 tbsp chia, 1/4 cup elderberries, 1 tbsp ghee.',
    lunch: 'Green banana (1) with 1 tbsp butter, 1 cup red grapes.',
    dinner: 'Onion stir-fry (1/2 onion) with greens, 1/4 cup sauerkraut, 1 tsp turmeric.',
    snack: '1/4 cup peanuts, 1 cup Coleus tea.',
  },
  {
    day: 7,
    label: 'Day 7',
    breakfast: 'Green banana smoothie (1 banana, 1 tbsp chia, 1 tbsp cocoa, 1/4 cup elderberries).',
    lunch: 'Lentil salad (1/2 cup lentils, 1/2 onion, greens), 1 tbsp ghee.',
    dinner: 'Turmeric-roasted veggies (1 tsp turmeric), 1/4 cup sauerkraut, 1 apple.',
    snack: '1 oz dark chocolate, 1 cup St. John\'s Wort tea.',
  },
];

// Shopping list for 7-Day Anti-Aging Meal Plan
export const AGE_REVERSAL_SHOPPING = [
  { category: 'Produce', items: ['Oats', 'Chia seeds', 'Elderberries', 'Green bananas', 'Onions', 'Apples', 'Red grapes', 'Leafy greens (your stash)', 'Turmeric root'] },
  { category: 'Protein', items: ['Lentils', 'Chicken or tofu'] },
  { category: 'Fermented', items: ['Sauerkraut'] },
  { category: 'Fats', items: ['Ghee', 'Butter'] },
  { category: 'Pantry', items: ['Cocoa powder', 'Dark chocolate'] },
  { category: 'Nuts', items: ['Peanuts'] },
  { category: 'Teas', items: ['Rhodiola tea', 'Coleus tea', 'St. John\'s Wort tea'] },
  { category: 'Beverages', items: ['Black coffee'] },
];

export const LONGEVITY_SHOPPING = AGE_REVERSAL_SHOPPING;
