/**
 * Gut Health & Nutrition — tips for digestion, fueling, and meals
 *
 * Supports the exercise routine: proper fuel + digestion = sustained energy.
 * Hierarchy: Biome + fermented foods first. Pills (probiotics, prebiotics, postbiotics) if needed.
 */

// Biome hierarchy: food first, supplements only when needed
export const BIOME_HIERARCHY = {
  first: {
    title: 'Biome + fermented foods first',
    detail: 'Build and maintain with real food: kimchi, sauerkraut, kefir, yogurt (live cultures), miso, tempeh, natto, kombucha, sourdough. Diversify. Most people can maintain a healthy gut with this alone.',
  },
  ifNeeded: {
    title: 'If needed: probiotics, prebiotics, postbiotics',
    detail: 'After antibiotics, or to reload quicker — consider pill/supplement form. Prebiotics = fiber that feeds good bacteria. Postbiotics = beneficial byproducts. Fermented foods preferred over supplements when possible.',
  },
};

export const GUT_NUTRITION_TIPS = [
  {
    id: 'fiber',
    title: 'Fiber (21–38 g/day)',
    detail: 'Prebiotic for good bacteria. Legumes, whole grains, avocados, sweet potatoes, Brussels sprouts, berries, leafy greens, nuts & seeds.',
    icon: 'leaf-outline' as const,
  },
  {
    id: 'hydration',
    title: 'Hydration',
    detail: '4–6 cups/day. Aids nutrient absorption, digestion, mucus production. Prevents constipation and gut microbiome shift.',
    icon: 'water-outline' as const,
  },
  {
    id: 'stress',
    title: 'Stress management',
    detail: 'Belly breathing, meditation, relaxation. Gut-brain connection is powerful — stress can cause bloating, pain, heartburn.',
    icon: 'heart-outline' as const,
  },
  {
    id: 'sleep',
    title: 'Sleep (7–9 hrs)',
    detail: 'Gut bacteria affect sleep quality. Poor sleep can worsen gut health. Sleep hygiene + exercise support both.',
    icon: 'moon-outline' as const,
  },
  {
    id: 'movement',
    title: 'Movement',
    detail: '150–270 min/week moderate-to-high intensity. Aerobic + resistance. Exercise improves gut microbiota diversity.',
    icon: 'fitness-outline' as const,
  },
];

// Fueling for exercise — when to eat before/after routines
export const FUELING_FOR_EXERCISE = {
  before: {
    title: 'Before routine',
    detail: 'Light snack 30–60 min before if hungry: banana, small oatmeal, handful of nuts. Or fasted if morning routine works.',
  },
  after: {
    title: 'After routine',
    detail: 'Protein + carbs within 1–2 hrs: eggs + whole grain, yogurt + fruit, smoothie. Recovery and muscle repair.',
  },
  daily: {
    title: 'Daily basics',
    detail: 'Whole foods, balanced meals. Mediterranean-style: vegetables, olive oil, fish, legumes, whole grains. Supports gut + longevity.',
  },
};

// Meal structure suggestions (not prescriptive)
export const MEAL_STRUCTURE = [
  { meal: 'Breakfast', examples: 'Oatmeal + berries, eggs + avocado, yogurt + nuts, smoothie' },
  { meal: 'Lunch', examples: 'Salad + protein, grain bowl, soup + whole grain bread' },
  { meal: 'Dinner', examples: 'Vegetables + fish/chicken/legumes, stir-fry, roasted vegetables' },
  { meal: 'Snacks', examples: 'Fruit, nuts, hummus + veggies, fermented foods (kefir, yogurt)' },
];

// Diversify gut — variety matters
export const GUT_DIVERSITY_TIPS = [
  'Eat 30+ different plants per week (fruits, veggies, grains, legumes, nuts, seeds)',
  'Rotate fermented foods — don\'t rely on one type',
  'Include resistant starch: cooled rice, potatoes, green bananas',
  'Polyphenol-rich: berries, dark chocolate, green tea, olive oil',
];
