/**
 * Content Bank - Simplifit's Voice
 *
 * Philosophy: Biology, Not Magic.
 * Tone: Scientific accuracy + Quiet support + Deadpan observation.
 *
 * This file contains all static content for the app, organized by category.
 * The voice is that of a brilliant, slightly weary fitness scientist who
 * has seen every fad diet come and go, and just wants to tell you the truth.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface GoldenRule {
  id: string;
  title: string;
  subtitle: string;
  paragraphs: [string, string, string]; // Exactly 3 paragraphs
  readTime: '1 min';
  category: 'thermodynamics' | 'nutrition' | 'physiology' | 'lifestyle' | 'metabolism' | 'behavior';
  level: 'foundation' | 'intermediate' | 'advanced';
}

export interface PracticalTactic {
  id: string;
  title: string;
  tactic: string; // One-sentence summary
  logic: [string, string]; // Exactly 2 paragraphs explaining the science
  category: 'shopping' | 'eating' | 'environment' | 'restaurant' | 'muscle-building';
}

export interface DailyDrop {
  id: string;
  content: string;
}

export interface PlateReact {
  id: string;
  type: 'perfect' | 'meh' | 'oops';
  content: string;
}

export interface LoadingLine {
  id: string;
  content: string;
}

// ============================================================================
// CATEGORY A: THE GOLDEN RULES (Macro-Lessons)
// ============================================================================

export const GOLDEN_RULES: GoldenRule[] = [
  // ===========================================================================
  // FOUNDATION LEVEL (The Basics)
  // ===========================================================================
  {
    id: 'golden-001',
    title: 'Energy Balance',
    subtitle: 'The First Law of Thermodynamics',
    paragraphs: [
      "Here's the thing about energy balance: it's physics. It's the First Law of Thermodynamics. You can't negotiate with it. It's like gravity. You can hate gravity all you want, but if you jump off a roof, you're still going down. The energy you consume minus the energy you expend equals the change in your stored energy. That's it. That's the whole thing. People have written thousands of books trying to find a loophole, and there isn't one.",

      "Now, this doesn't mean calories are the only thing that matters. Hormones affect hunger. Sleep affects willpower. Protein affects satiety. Stress affects cortisol, which affects water retention, which affects what the scale says tomorrow morning. It's complicated. But underneath all that complexity, the thermodynamics remain stubbornly simple. Energy in, energy out, energy stored. Your body is not exempt from the laws of the universe.",

      "The good news is that once you accept this, you can stop looking for magic. There's no superfood that burns fat. There's no meal timing trick that unlocks your metabolism. There's no detox that accelerates anything. There's just you, making decisions about energy, day after day, in a way that's sustainable enough to actually stick. That's boring. But boring works.",
    ],
    readTime: '1 min',
    category: 'thermodynamics',
    level: 'foundation',
  },
  {
    id: 'golden-002',
    title: 'Protein Leverage',
    subtitle: 'Why Hunger Has an Off Switch',
    paragraphs: [
      "Your body has a protein thermostat. Researchers call it the Protein Leverage Hypothesis, which sounds like something from a business seminar, but it's actually quite elegant. The idea is simple: your appetite doesn't shut off until you've consumed enough protein. If your meals are low in protein, you'll keep eating—not because you lack willpower, but because your body is still searching for what it needs. You'll overshoot on total calories trying to hit your protein target. It's not a character flaw. It's biology.",

      "This explains a lot of things. It explains why a 400-calorie chicken breast leaves you satisfied and a 400-calorie bagel leaves you hungry an hour later. It explains why high-protein diets consistently outperform low-protein diets in studies, even when calories are matched. It explains why you can eat an entire sleeve of crackers and still feel like something's missing. Because something is missing. Protein.",

      "The practical application is straightforward: prioritize protein at every meal. We're talking about a palm-sized portion of something that was recently alive, or a reasonable plant-based equivalent. Do that, and your hunger will regulate itself more than you'd expect. You won't need to white-knuckle your way through the afternoon. The protein thermostat will do a lot of the work for you. It's not a trick. It's just how the machine works.",
    ],
    readTime: '1 min',
    category: 'nutrition',
    level: 'foundation',
  },
  {
    id: 'golden-003',
    title: 'The Scale Lies',
    subtitle: 'Water, Glycogen, and Other Illusions',
    paragraphs: [
      "Let me tell you about water. Your body is about 60% water. A well-hydrated adult can easily fluctuate 2-5 pounds in a single day based on water retention alone. Eat a salty meal? You'll hold water. Eat more carbs than usual? Each gram of glycogen stores 3-4 grams of water with it. Start a new exercise program? Inflammation from muscle repair holds water. Have a stressful week? Cortisol promotes water retention. The scale captures all of this and presents it to you as if it means something.",

      "It mostly doesn't. What matters is the trend over time, not today's number. One pound of actual fat contains about 3,500 calories of stored energy. If you ate 500 calories over maintenance yesterday, you gained about 0.14 pounds of fat. But the scale might show you up 3 pounds because you also had pasta, which stored glycogen, which stored water. You didn't gain 3 pounds of fat overnight. That would require eating about 10,500 extra calories, which is impressive but unlikely.",

      "This is why we track the 7-day moving average, not the daily weigh-in. The daily number is noise. The trend is signal. Weigh yourself consistently—same time, same conditions—but don't react to individual data points. Your body is not a precision instrument. It's a complex biological system doing a thousand things at once, and weight is just one crude measurement of all that chaos. Watch the trend. Ignore the noise.",
    ],
    readTime: '1 min',
    category: 'physiology',
    level: 'foundation',
  },
  {
    id: 'golden-004',
    title: 'Sleep is a Nutrient',
    subtitle: 'The Recovery You Can Not Outwork',
    paragraphs: [
      "When you don't sleep enough, two hormones shift in exactly the wrong direction. Ghrelin, which tells your brain you're hungry, goes up. Leptin, which tells your brain you're full, goes down. This is not subtle. Studies show that one night of poor sleep can increase calorie intake by 300-400 calories the next day. Not because you're weak. Because your hormones are screaming at you to eat. You're fighting biology with willpower, and biology usually wins.",

      "But it gets worse. Sleep deprivation also impairs your prefrontal cortex—the part of your brain responsible for decision-making and impulse control. So not only are you hungrier, you're also less equipped to resist the hunger. Meanwhile, your insulin sensitivity drops, which means your body handles carbohydrates less efficiently. And your muscle protein synthesis decreases, which means you recover from exercise more slowly. Everything gets harder when you're tired. Everything.",

      "The culture tells you that sleeping less is productive. That you can 'sleep when you're dead.' That grinding through exhaustion is admirable. This is incorrect. Sleep is when your body repairs muscle tissue, consolidates memories, regulates hormones, and clears metabolic waste from your brain. It's not laziness. It's maintenance. You wouldn't skip oil changes and expect your car to run forever. Your body is the same. Seven to nine hours. Non-negotiable.",
    ],
    readTime: '1 min',
    category: 'lifestyle',
    level: 'foundation',
  },
  {
    id: 'golden-005',
    title: 'Liquid Calories',
    subtitle: 'The Stealth Saboteur',
    paragraphs: [
      "Your brain has different satiety circuits for liquid and solid food. When you chew and swallow solid food, it triggers a cascade of signals: stretch receptors in your stomach, hormones from your gut, even the act of chewing itself. These signals tell your brain that food is arriving and it should start feeling full. Liquids largely bypass this system. You can drink 500 calories of orange juice and feel approximately nothing. You could not easily eat 6 oranges, which is roughly what that juice contains.",

      "This is a problem in the modern environment, where liquid calories are everywhere. Soda, juice, smoothies, fancy coffee drinks with names longer than this paragraph, alcohol—they all add up fast while providing minimal satiety. A large mocha from certain coffee chains can exceed 500 calories. That's a full meal, nutritionally speaking, but your hunger won't know it happened. You'll still eat lunch. You've just added an invisible meal to your day.",

      "The solution is straightforward but requires attention: drink things with zero or minimal calories. Water. Black coffee. Tea. Sparkling water if you need the fizz. Save your calories for actual food that you can chew and that will tell your brain you've eaten. This isn't deprivation. It's efficiency. You're trading invisible, unsatisfying calories for real ones that actually contribute to feeling full. Your brain will thank you, once it figures out what's happening.",
    ],
    readTime: '1 min',
    category: 'nutrition',
    level: 'foundation',
  },

  // ===========================================================================
  // INTERMEDIATE LEVEL (The Deeper Science)
  // ===========================================================================
  {
    id: 'golden-006',
    title: 'Insulin Resistance',
    subtitle: 'When the Key Stops Fitting the Lock',
    paragraphs: [
      "Insulin is a hormone that acts like a key. When you eat carbohydrates, your blood sugar rises, and your pancreas releases insulin. Insulin unlocks your cells so glucose can enter and be used for energy. This is a beautifully elegant system that has kept humans alive for a very long time. The problem arises when this happens too frequently, with too much sugar, for too many years. The locks start to get worn. The cells stop responding as well to the key. This is insulin resistance, and it's the metabolic equivalent of your neighbors ignoring you because you knock on their door too often.",

      "When your cells resist insulin, your pancreas doesn't shrug and give up. It produces more insulin. Now you have high blood sugar and high insulin circulating together. This promotes fat storage, especially around the midsection. It causes energy crashes after meals—that 2 PM slump isn't in your head. It makes you hungrier, because your cells are technically starving even though there's plenty of glucose in your blood. It's all stuck in traffic, unable to get where it needs to go.",

      "The good news is that insulin resistance is largely reversible through the same boring advice you've heard before: reduce processed carbohydrates, prioritize protein and fiber, move your body, sleep adequately. Walking after meals is particularly effective—it helps clear glucose from the blood using muscle contraction, which doesn't require insulin. Your muscles are helpful like that. They can bypass the broken locks entirely, if you just get them moving.",
    ],
    readTime: '1 min',
    category: 'metabolism',
    level: 'intermediate',
  },
  {
    id: 'golden-007',
    title: 'The Gut Microbiome',
    subtitle: "You Are a Mech Suit for Bacteria",
    paragraphs: [
      "There are more bacterial cells in your gut than there are human cells in your entire body. You are, in a very real sense, a walking ecosystem. A vehicle. A highly sophisticated mech suit being piloted by trillions of microorganisms who have their own agendas, their own dietary preferences, and their own ways of communicating those preferences to your brain. When people say they're 'craving' something, that craving might not be entirely their idea. The gut bacteria send signals via the vagus nerve, influencing mood, appetite, and food choices. It's a little unsettling when you think about it.",

      "These bacteria eat what you eat, but they have preferences. Beneficial bacteria thrive on fiber—the indigestible plant material found in vegetables, fruits, legumes, and whole grains. They ferment this fiber into short-chain fatty acids, which reduce inflammation, improve insulin sensitivity, and strengthen the gut lining. Harmful bacteria, on the other hand, thrive on sugar and processed foods. When you feed the wrong bacteria, they multiply. They crowd out the helpful ones. They produce inflammatory compounds. And they make you crave more of what they want to eat. It's like letting your worst tenants pick the groceries.",

      "The practical implication is straightforward: eat fiber. A lot of it. Diverse fiber from diverse sources, because different bacteria eat different things. Vegetables, beans, whole grains, nuts, seeds—variety matters. Think of yourself as a landlord selecting for good tenants. Feed the ones you want to keep, and they'll take care of a lot of things for you: digestion, immunity, even mood regulation. Neglect them, and they'll riot. Metaphorically. Also sometimes literally, depending on what you ate.",
    ],
    readTime: '1 min',
    category: 'nutrition',
    level: 'intermediate',
  },
  {
    id: 'golden-008',
    title: 'Cortisol and Body Fat',
    subtitle: "Stress Isn't Just a Feeling",
    paragraphs: [
      "Cortisol is your stress hormone. It's released when your body perceives threat, and in the ancestral environment, this was helpful. You see a tiger, cortisol spikes, you run faster. Very useful. The problem is that your cortisol system can't distinguish between a tiger and a work deadline and your phone buzzing with bad news and the general anxiety of existing in the modern world. It just sees threat, threat, threat, all day, every day. And it keeps releasing cortisol. This is where things get metabolically inconvenient.",

      "Chronically elevated cortisol promotes fat storage, particularly visceral fat—the dangerous kind that accumulates around your organs and midsection. It increases appetite, especially for high-calorie, high-sugar foods. It breaks down muscle tissue for energy. It impairs sleep, which raises cortisol further, which impairs sleep further. It's a feedback loop designed for short-term survival that becomes profoundly destructive when activated chronically. Your body is preparing for a famine that never comes while you sit at a desk eating snacks.",

      "Managing cortisol requires addressing stress, which is frustrating advice because stress is often not optional. But the tools are real: sleep lowers cortisol. Exercise helps, though too much intense exercise without recovery can raise it. Meditation and deep breathing activate the parasympathetic nervous system. Social connection helps. Even just being outside in nature measurably reduces cortisol levels. You can't eliminate stress, but you can give your body regular signals that the tiger has left. That you're safe. That it's okay to stop preparing for disaster.",
    ],
    readTime: '1 min',
    category: 'physiology',
    level: 'intermediate',
  },
  {
    id: 'golden-009',
    title: 'NEAT',
    subtitle: 'Non-Exercise Activity Thermogenesis',
    paragraphs: [
      "When people think about 'burning calories,' they usually picture the gym. The treadmill. The spin class. Structured exercise. But here's an uncomfortable truth: for most people, formal exercise accounts for only about 5% of daily energy expenditure. Your basal metabolic rate—just keeping you alive—accounts for 60-70%. The thermic effect of food is another 10%. And the rest? That's NEAT: Non-Exercise Activity Thermogenesis. It's everything else you do that isn't sleeping or intentionally exercising. Walking to the bathroom. Cooking dinner. Fidgeting. Tapping your foot. Standing instead of sitting.",

      "NEAT varies wildly between individuals, and this variation explains a lot. Some people naturally burn 500-800 additional calories per day just by being 'restless.' They pace when they talk on the phone. They take the stairs without thinking about it. They don't sit still. Other people are naturally more sedentary—they sit quietly, move efficiently, conserve energy at every opportunity. Neither group is morally superior to the other, but metabolically, they're playing very different games. The fidgety person can eat more without gaining weight, and they don't know why.",

      "The practical application is less about 'fidget more' (that's hard to force) and more about designing your environment for movement. Take calls standing up. Park farther away. Use a smaller water bottle so you have to refill it more often. These sound trivial, but they compound. An extra 200 steps here, 50 steps there—it adds up to hundreds of calories over a day, thousands over a week, tens of thousands over a month. You don't need to train for a marathon. You need to make sitting slightly less convenient.",
    ],
    readTime: '1 min',
    category: 'thermodynamics',
    level: 'intermediate',
  },
  {
    id: 'golden-010',
    title: 'Hyper-Palatability',
    subtitle: 'Why You Cannot Eat Just One',
    paragraphs: [
      "Certain foods are engineered to override your satiety signals. This isn't a conspiracy theory—it's literally the job of food scientists at major corporations. They call it the 'bliss point': the precise combination of salt, sugar, fat, and crunch that maximizes pleasure without triggering fullness. Potato chips are the canonical example. You eat one, you want another. You eat ten, you want more. Your body's normal 'stop eating' signals don't activate because the food is designed to evade them. It's like trying to close a door that someone is actively holding open.",

      "In nature, foods rarely combine high fat and high sugar together. Fruit has sugar but no fat. Meat has fat but no sugar. Your brain evolved to treat each as a reward, but not simultaneously. When they appear together—as they do in ice cream, cookies, pizza, and most processed foods—your reward system gets confused. It registers something unprecedented, something that shouldn't exist, and it says 'more of this, immediately, before it disappears.' Because in evolutionary terms, finding such a calorie-dense food was rare and worth gorging on. The problem is it's not rare anymore. It's everywhere.",

      "This isn't about willpower. You're not weak for struggling to stop eating chips. The chips were designed by people with advanced degrees specifically to make you unable to stop. The only reliable defense is environment design: don't keep them in your house. Don't open the bag. Make the default choice the healthier one, and make the hyper-palatable stuff require effort to obtain. It's not about being stronger than the food. It's about not fighting a battle you're designed to lose.",
    ],
    readTime: '1 min',
    category: 'behavior',
    level: 'intermediate',
  },

  // ===========================================================================
  // ADVANCED LEVEL (The Nuanced Details)
  // ===========================================================================
  {
    id: 'golden-011',
    title: 'Alcohol Metabolism',
    subtitle: 'The Metabolic Pause Button',
    paragraphs: [
      "When you drink alcohol, your body has a problem. Ethanol is technically a toxin, and your liver prioritizes getting rid of it. Everything else—including fat burning—gets put on hold. It's not that alcohol makes you gain fat directly (though it often does, because of the calories and the late-night pizza). It's that while your liver is processing alcohol, it can't process much else. Fat oxidation essentially pauses. Whatever you eat alongside the drinks gets stored more readily. Your metabolism has a one-track mind, and that track is currently occupied by the vodka.",

      "The numbers aren't encouraging either. Alcohol contains 7 calories per gram—almost as calorie-dense as fat, but without any of the satiety signals. Your body doesn't register liquid calories well, and it registers alcohol calories even less. You can drink 500 calories and feel nothing but pleasant. Meanwhile, alcohol impairs judgment and lowers inhibitions, which is why you suddenly decide at 11 PM that nachos are an excellent idea. The combination of paused fat burning, hidden calories, and impaired decision-making is metabolically unfortunate.",

      "This doesn't mean you can never drink. But understanding the mechanism helps you make informed choices. If fat loss is a priority, alcohol directly opposes that goal. If you do drink, doing so less frequently and in smaller amounts limits the damage. Eating a protein-rich meal beforehand slows absorption. Avoiding sugary mixers reduces calorie load. And accepting that the next 4-8 hours of fat burning are essentially canceled helps you plan accordingly. Your liver is doing important work. Sometimes that work is metabolizing whiskey instead of burning fat. Trade-offs.",
    ],
    readTime: '1 min',
    category: 'metabolism',
    level: 'advanced',
  },
  {
    id: 'golden-012',
    title: 'Fiber',
    subtitle: 'The Brakes on Your Digestion',
    paragraphs: [
      "Fiber is the indigestible part of plants. You eat it, but you can't absorb it. It passes through mostly intact. This might seem useless, but it's actually one of the most powerful tools for managing hunger and blood sugar. Fiber slows everything down. It forms a gel-like matrix in your stomach that delays gastric emptying. It coats carbohydrates and prevents them from being absorbed too quickly. It's like adding brakes to a car that otherwise has only an accelerator. Without fiber, food rushes through your system, blood sugar spikes and crashes, and you're hungry again in an hour.",

      "There are two types of fiber, and both matter. Soluble fiber dissolves in water and forms that gel—it's particularly good for blood sugar control and cholesterol management. Insoluble fiber doesn't dissolve; it adds bulk to your stool and keeps things moving through your intestines. Both types contribute to satiety by physically stretching your stomach and taking up space. A meal with adequate fiber will keep you satisfied far longer than the same calories without fiber. It's not about eating less. It's about eating in a way that makes eating less feel natural.",

      "Most people eat about 15 grams of fiber per day. The recommendation is 25-35 grams. The difference between these numbers explains a lot of unnecessary hunger. Vegetables, fruits, legumes, whole grains, nuts, seeds—all high in fiber. Processed foods, refined grains, and animal products—virtually none. If you're always hungry despite eating enough calories, fiber is probably the missing piece. It's not glamorous. It doesn't have a marketing budget. It's just the structural foundation that makes the rest of your diet work.",
    ],
    readTime: '1 min',
    category: 'nutrition',
    level: 'advanced',
  },
  {
    id: 'golden-013',
    title: 'Visceral vs. Subcutaneous',
    subtitle: 'The Fat That Matters',
    paragraphs: [
      "Not all body fat is equal. Subcutaneous fat is the soft, pinchable fat under your skin. It's the fat that shows up on your thighs, arms, and hips. It's not particularly dangerous—in fact, it's relatively inert, metabolically speaking. Your body stores energy there, and that's mostly it. Visceral fat is different. It accumulates around your organs, deep in your abdominal cavity. It's the hard fat that makes bellies firm rather than soft. And it's metabolically active in ways that are profoundly unhealthy.",

      "Visceral fat doesn't just sit there. It secretes inflammatory compounds that circulate throughout your body. It releases hormones that promote insulin resistance. It increases risk for heart disease, type 2 diabetes, and certain cancers. Two people can weigh exactly the same, but if one carries their fat viscerally and the other subcutaneously, their health outcomes can be dramatically different. This is why waist circumference often predicts health risk better than BMI. The location matters as much as the amount.",

      "The good news is that visceral fat is often the first to go when you create a calorie deficit. It's more metabolically active, which means it's more responsive to change. Exercise, particularly a combination of cardio and resistance training, preferentially reduces visceral fat. Reducing refined carbohydrates and added sugars helps. Managing stress helps, since cortisol promotes visceral fat storage. You can't spot-reduce—you can't do crunches and target belly fat specifically. But you can create conditions where your body preferentially burns the dangerous fat first. It usually does.",
    ],
    readTime: '1 min',
    category: 'physiology',
    level: 'advanced',
  },
  {
    id: 'golden-014',
    title: 'The Whoosh Effect',
    subtitle: 'Why Weight Loss is Never Linear',
    paragraphs: [
      "Here's something weird that happens during fat loss: you're eating at a deficit, you're doing everything right, and the scale doesn't move for a week. Then one morning you wake up three pounds lighter. This isn't magic. It's water. When your fat cells release their stored energy, they don't immediately shrink. Instead, they temporarily fill with water, maintaining their volume. Your weight stays the same, even though you're losing fat. Then, often overnight, the water is released all at once. This is the 'whoosh' effect, and it explains a lot of the frustration people experience with the scale.",

      "Scientists have observed this in controlled studies. Participants in a calorie deficit would show no weight change for days, then suddenly drop several pounds. The fat loss was occurring the whole time—it just wasn't showing up on the scale because the fat cells were replacing lipids with water. Various triggers seem to cause the whoosh: a slightly higher calorie day, alcohol (ironically), stress reduction, adequate sleep. No one knows exactly why, but it seems like the body needs a signal that it's 'safe' to release the water.",

      "The practical implication is simple: trust the process even when the scale doesn't reflect it. If you're in a deficit, you are losing fat. The scale just might not show it today, or this week. Weigh yourself consistently, track the trend, and don't panic when progress seems to stall. The whoosh is coming. It's a reminder that your body isn't a simple input-output machine—it's a complex system with buffers and delays. The physics are still working. The results just sometimes arrive all at once.",
    ],
    readTime: '1 min',
    category: 'physiology',
    level: 'advanced',
  },
  {
    id: 'golden-015',
    title: 'Volume Eating',
    subtitle: 'The Physics of Stomach Stretch',
    paragraphs: [
      "Your stomach has stretch receptors. When food expands your stomach, these receptors send signals to your brain that you're filling up. This is part of how satiety works—it's not just about calories or nutrients, but about physical volume. The practical implication is that you can feel more full while eating fewer calories by choosing foods with low calorie density. Vegetables, for instance, are mostly water and fiber. You can eat a genuinely absurd amount of broccoli for very few calories. Your stomach will be full. Your calorie count will be low. Physics.",

      "Compare a 300-calorie salad (a giant bowl of greens, vegetables, and light dressing) to 300 calories of cookies (maybe three cookies). The salad physically stretches your stomach. The cookies don't. Both contain the same energy, but only one triggers the fullness signals. This is volume eating: prioritizing foods that take up space relative to their calorie content. Vegetables, fruits, lean proteins, soups, and high-fiber foods all qualify. Oils, nuts, cheese, and processed snacks are the opposite—calorie-dense and easy to overeat.",

      "This doesn't mean you can only eat salads forever. But it does mean that structuring your meals around high-volume, low-calorie foods makes the whole process easier. Start with vegetables. Add lean protein. Fill up on the low-calorie stuff first, and you'll naturally eat less of the calorie-dense stuff later. It's not about restriction. It's about sequencing. Your stomach doesn't know how many calories it's receiving—it only knows how full it is. Use that to your advantage.",
    ],
    readTime: '1 min',
    category: 'nutrition',
    level: 'advanced',
  },
  {
    id: 'golden-016',
    title: 'Resistance Training',
    subtitle: 'The Most Underrated Tool in Your Arsenal',
    paragraphs: [
      "If I could prescribe one intervention for almost every health goal—weight loss, muscle gain, metabolic health, longevity, mental wellbeing—it would be resistance training. Lifting weights. Pushing and pulling against resistance. It doesn't matter whether you're trying to lose fat or build muscle; resistance training helps with both. During a calorie deficit, it signals your body to preserve muscle mass, ensuring the weight you lose is primarily fat. During a surplus, it's what actually builds the muscle. Either way, it's doing something cardio alone cannot do.",

      "The benefits extend far beyond body composition. Resistance training increases bone density, reducing osteoporosis risk. It improves insulin sensitivity, helping your cells respond better to blood sugar. It elevates your resting metabolic rate—muscle tissue burns more calories at rest than fat tissue, so the more muscle you carry, the more energy you expend just existing. Studies show it reduces symptoms of depression and anxiety. It improves balance and functional strength, which matters more and more as you age. It's associated with reduced all-cause mortality. This is not a short list.",

      "You don't need a gym membership or complicated equipment to start. Bodyweight exercises—push-ups, squats, lunges—are legitimate resistance training. Resistance bands work. Dumbbells work. The key is progressive overload: gradually doing more over time. Two to three sessions per week, hitting major muscle groups, is enough for most people to see significant benefits. Start light. Focus on form. Add weight or reps as you get stronger. It's not complicated. It's just hard work repeated consistently. And it's worth it. I promise you it's worth it.",
    ],
    readTime: '1 min',
    category: 'lifestyle',
    level: 'foundation',
  },
  {
    id: 'golden-017',
    title: 'The Calorie Hierarchy',
    subtitle: 'Why All Macros Are Not Created Equal',
    paragraphs: [
      "A calorie is a calorie, thermodynamically speaking. But the three macronutrients—protein, carbohydrates, and fat—deliver those calories in very different packages. Protein and carbohydrates both contain 4 calories per gram. Fat contains 9 calories per gram. This is just chemistry. It means that a tablespoon of olive oil (about 14 grams, 120 calories) contains the same energy as roughly 30 grams of chicken breast. Same calories, very different volumes. Very different satiety responses. This is why being mindful of fat intake matters for caloric balance—not because fat is bad, but because it's dense.",

      "Here's the thing: dietary fat is essential. Literally essential. Your body cannot produce certain fatty acids on its own—omega-3s and omega-6s must come from food. Fat is required for hormone production, including testosterone and estrogen. It's necessary for absorbing vitamins A, D, E, and K, which are fat-soluble. Your brain is about 60% fat by dry weight. Demonizing dietary fat, as we did in the 1990s, was a mistake that led to an explosion of low-fat, high-sugar processed foods. Fat isn't the enemy. Excessive calories are the enemy, and fat just happens to pack more of them per bite.",

      "The practical takeaway is nuanced: include healthy fats—olive oil, avocados, nuts, fatty fish—but be aware of portions. A handful of almonds is nutritious; half a jar of almonds is a caloric event. Cook with oil, but measure it rather than free-pouring. Don't fear fat, but respect its density. Meanwhile, protein has the highest thermic effect (your body burns 20-30% of protein calories just digesting it) and the strongest satiety signals. Carbs fall in the middle. Understanding these differences lets you structure meals that satisfy you without accidentally overshooting on energy.",
    ],
    readTime: '1 min',
    category: 'nutrition',
    level: 'intermediate',
  },
  {
    id: 'golden-018',
    title: 'The Bulking Myth',
    subtitle: 'You Will Not Accidentally Get Too Big',
    paragraphs: [
      "A lot of people, especially women, avoid lifting weights because they're afraid of getting 'too bulky.' This fear is based on a fundamental misunderstanding of how difficult it is to build muscle. Building significant muscle mass requires years of progressive overload, a substantial calorie surplus, meticulous protein intake, and often favorable genetics or pharmaceutical assistance. The bodybuilders you're picturing? They've dedicated their entire lives to looking like that. It didn't happen by accident. You will not wake up one morning accidentally jacked. That's like saying you don't want to start jogging because you might accidentally qualify for the Olympics.",

      "The reality is that most people—men and women alike—struggle to build muscle. It's metabolically expensive. Your body resists it. Women, in particular, have about 1/15th the testosterone of men, which is the primary anabolic hormone for muscle growth. A woman lifting weights three times a week will get stronger, more defined, and more 'toned' (a word that means nothing physiologically but let's use it anyway). She will not turn into a competitive bodybuilder. That outcome requires intention, dedication, and usually decades of work. It's not something that happens to you. It's something you chase.",

      "What actually happens when you lift weights is this: you build some muscle, you lose some fat, your shape changes, your clothes fit better, and you get stronger. You develop definition and curves in places you want them. The 'bulky' look people fear is often not from too much muscle but from muscle underneath a layer of body fat that obscures definition. Ironically, the solution to looking 'bulky' is often more resistance training, not less, combined with appropriate nutrition. The fear of weights has kept many people from the single most effective tool for the body composition they actually want. Don't let an irrational fear of an outcome that requires immense effort hold you back from the benefits that come easily.",
    ],
    readTime: '1 min',
    category: 'lifestyle',
    level: 'foundation',
  },
  {
    id: 'golden-019',
    title: 'The Processing Paradox',
    subtitle: 'Not All Processing is Evil',
    paragraphs: [
      "Let's talk about processed food, because the discourse around it has become confused. 'Processed' simply means food that has been altered from its natural state. By this definition, cooking is processing. Fermentation is processing. Pasteurization is processing. Greek yogurt is processed. Whey protein is processed. Canned beans, frozen vegetables, tofu—all processed. And all perfectly healthy. The problem isn't processing per se. The problem is a specific category: ultra-processed foods designed primarily for shelf stability, convenience, and hyper-palatability, often at the expense of nutrition.",

      "Ultra-processed foods—chips, candy, fast food, processed meats, sugary drinks—tend to share certain characteristics. They're calorie-dense but nutrient-poor. They combine fat, sugar, and salt in ratios that don't exist in nature, hijacking your reward systems. They're low in fiber and protein, the nutrients that promote satiety. They're engineered to be eaten quickly and in large quantities. Observational studies consistently link high ultra-processed food intake with worse health outcomes. The mechanisms aren't fully understood—is it the processing itself, or just the nutrient profile? Probably some of both. Either way, minimizing these foods is sensible.",

      "But here's where we need to be careful: the opposite extreme is also wrong. The idea that 'natural' automatically means 'healthy' is a logical fallacy—the appeal to nature. Raw milk, for instance, is natural; it can also contain Listeria, Salmonella, and E. coli, which is why pasteurization was invented. Organic produce isn't meaningfully more nutritious than conventional; meta-analyses consistently show no significant difference. Arsenic is natural. Hemlock is natural. 'Natural' is not a synonym for 'safe' or 'healthy.' The 80/20 principle applies here: build your diet around whole and minimally processed foods, but don't stress about the occasional protein bar or canned soup. Context and dose matter more than purity.",
    ],
    readTime: '1 min',
    category: 'nutrition',
    level: 'advanced',
  },
];

// ============================================================================
// CATEGORY B: PRACTICAL TACTICS
// ============================================================================

export const PRACTICAL_TACTICS: PracticalTactic[] = [
  // ===========================================================================
  // WEIGHT LOSS / GENERAL TACTICS
  // ===========================================================================
  {
    id: 'tactic-001',
    title: 'The Grocery Perimeter',
    tactic: 'Shop the outside edges of the store; the middle aisles are where the chemistry experiments live.',
    logic: [
      "Grocery stores are designed with a specific layout. The perimeter contains the refrigerated sections: produce, meat, dairy, eggs. These are whole foods with short shelf lives—things that spoil because they're actually food. The interior aisles contain the processed stuff: chips, cookies, crackers, cereals, sodas. These have long shelf lives because they've been engineered to resist decomposition. If bacteria won't eat it, that should tell you something.",

      "This isn't a moral judgment about processed food. It's a practical observation about calorie density, satiety, and nutrition. The perimeter foods are generally higher in protein, fiber, and micronutrients. The interior foods are generally higher in refined carbohydrates, seed oils, and ingredients you can't pronounce. If you do most of your shopping on the edges and only venture into the center for specific items (olive oil, spices, canned beans), your cart will naturally fill with things that support your goals. Environment shapes behavior. Design the environment.",
    ],
    category: 'shopping',
  },
  {
    id: 'tactic-002',
    title: 'The 20-Minute Rule',
    tactic: 'Eat slowly and wait 20 minutes before deciding if you need more food; your satiety signals are on a delay.',
    logic: [
      "When you eat, your gut releases hormones—CCK, PYY, GLP-1—that signal fullness to your brain. But this signaling isn't instantaneous. It takes time for food to reach the small intestine, where most of these hormones are released. It takes time for the hormones to travel through your bloodstream to your brain. It takes time for your brain to process the signals and update your conscious experience of hunger. The whole process takes roughly 15-20 minutes from first bite to 'I'm full' awareness. During that lag, you can easily keep eating past the point of satiety.",

      "The practical application is to slow down. Chew thoroughly. Put your fork down between bites. Have a conversation if you're eating with someone. When you think you might be full, wait 20 minutes before getting seconds. This isn't a psychological trick—it's giving your body's signaling system time to catch up with your stomach. Many people discover that the urge to keep eating evaporates entirely if they just wait. The food isn't going anywhere. Your satiety signals will arrive. Give them time.",
    ],
    category: 'eating',
  },
  {
    id: 'tactic-003',
    title: 'The Environment Reset',
    tactic: 'If cookies are on the counter, you will eat them; make the healthy choice the easy choice.',
    logic: [
      "There's a researcher named James Clear who wrote a book called 'Atomic Habits,' and one of his core insights is this: you don't rise to the level of your goals, you fall to the level of your systems. Your environment is a system. If unhealthy food is visible and accessible, you will eat it—not because you're weak, but because humans are fundamentally lazy about decisions. We take the path of least resistance. We eat what's in front of us. This isn't a character flaw. It's how we're wired. The question isn't whether you can resist the cookies on the counter. The question is why the cookies are on the counter.",

      "Redesign your environment for success. Put the fruit bowl on the counter, not the cookie jar. Keep vegetables pre-cut and at eye level in the fridge. Don't buy the chips in the first place—make acquiring them require a separate trip. Move the candy dish to a drawer, then to a high shelf, then out of the house entirely. Each barrier adds friction. Each bit of friction reduces consumption. You're not relying on willpower, which is finite and depletes throughout the day. You're relying on laziness, which is infinite and reliable. Make the default choice the one you want to make.",
    ],
    category: 'environment',
  },
  {
    id: 'tactic-004',
    title: 'The Water Bookends',
    tactic: 'Drink a full glass of water before and after each meal.',
    logic: [
      "Water takes up space. Your stomach has stretch receptors. When your stomach stretches, it sends fullness signals to your brain. This is basic physiology. A glass of water before a meal pre-loads your stomach with zero-calorie volume, so you reach that stretch threshold sooner. You eat slightly less without trying. You don't feel deprived because you're physically full. It's not a magic trick—it's just physics applied to appetite regulation.",

      "The after-meal glass serves a different purpose. It aids digestion, helps with nutrient absorption, and provides a clear endpoint to the eating experience. Many people continue eating not because they're hungry, but because the meal hasn't officially 'ended.' The water bookends create a ritual, a signal that this eating occasion is complete. Combined with the 20-minute satiety delay, drinking water after a meal fills the gap while you wait for fullness signals to arrive. It's a small habit with compounding effects.",
    ],
    category: 'eating',
  },
  {
    id: 'tactic-005',
    title: 'The Restaurant Protocol',
    tactic: 'Order protein first, ask for the to-go box immediately, and request sauces on the side.',
    logic: [
      "Restaurant portions are designed for perceived value, not nutrition. They're often two to three times what you'd serve yourself at home. The economics of restaurants favor calorie density—fat and sugar are cheap, protein is expensive. The menu is structured to highlight profitable, hyper-palatable dishes. None of this is in your best interest. But you can navigate it with a simple protocol: order the protein first (scan the menu for grilled chicken, fish, steak), request a to-go box when your food arrives and immediately box half, and ask for dressings and sauces on the side.",

      "This approach solves multiple problems at once. Prioritizing protein ensures you're getting satiety-promoting nutrients, not just empty carbs covered in sauce. Boxing half immediately prevents the 'clean plate' mentality—what's in the box is tomorrow's lunch, not tonight's second helping. Sauces on the side let you control the damage; restaurant sauces are often butter bombs masquerading as flavor. You still enjoy the meal. You still eat out. You just do it strategically. Most restaurants will accommodate these requests without issue. They want you to come back.",
    ],
    category: 'restaurant',
  },
  {
    id: 'tactic-006',
    title: 'The Post-Meal Walk',
    tactic: 'Walk for 10-15 minutes after eating to improve blood sugar and digestion.',
    logic: [
      "When you eat carbohydrates, your blood sugar rises. Normally, insulin is released to shuttle that glucose into cells. But there's a shortcut: muscle contraction. When your muscles contract, they can absorb glucose without needing insulin. This is why walking after meals is so effective for blood sugar management—you're giving the glucose somewhere to go that doesn't depend on your insulin sensitivity. Studies show that a 15-minute walk after meals can reduce blood sugar spikes by 20-30%. It's one of the simplest interventions with the biggest returns.",

      "Beyond blood sugar, walking after meals aids digestion by stimulating gut motility. It reduces the sluggish, overly-full feeling that comes from big meals. It's low-intensity enough that it doesn't interfere with digestion (unlike intense exercise, which diverts blood flow away from your gut). And it's an opportunity to stack habits—maybe you take a phone call, listen to a podcast, or just enjoy being outside. You don't need a gym membership for this. You just need legs and 15 minutes. The post-meal walk is boring and effective. Our favorite combination.",
    ],
    category: 'eating',
  },

  // ===========================================================================
  // MUSCLE BUILDING / BULKING TACTICS
  // ===========================================================================
  {
    id: 'tactic-007',
    title: 'The Protein Window',
    tactic: 'Distribute protein evenly across meals rather than loading it all at dinner.',
    logic: [
      "Your body can only synthesize so much muscle protein at once. The research suggests that about 25-40 grams of protein per meal maximally stimulates muscle protein synthesis, depending on your size and age. Eating 100 grams of protein in one meal doesn't stimulate four times as much muscle building—a significant portion gets oxidized for energy instead. This means the timing and distribution of protein matters, especially if you're trying to build muscle.",

      "The practical application is straightforward: aim for protein at every meal, spread relatively evenly throughout the day. Instead of a protein-light breakfast, a modest lunch, and a giant steak for dinner, try for 30+ grams at each meal. This gives your muscles multiple anabolic signals throughout the day, maximizing the amount of dietary protein that actually gets used for tissue building. It's not about obsessive timing or protein shakes every two hours. It's about not front-loading or back-loading all your protein into one meal.",
    ],
    category: 'muscle-building',
  },
  {
    id: 'tactic-008',
    title: 'The Caloric Surplus',
    tactic: "To build muscle, you must eat more than you burn; you can't build a house without buying extra materials.",
    logic: [
      "Muscle is tissue. Tissue requires raw materials. If you're in a calorie deficit, your body is breaking down tissue for energy, not building new tissue. This is why 'body recomposition'—simultaneously gaining muscle and losing fat—is notoriously slow and only really works for beginners or people returning from a layoff. For most people trying to build meaningful muscle, a calorie surplus is required. Not a huge one—200-500 calories above maintenance—but a surplus nonetheless.",

      "This is psychologically difficult for many people, especially those who've spent years trying to lose weight. The scale will go up. Some of that will be muscle. Some will be fat. Some will be water and glycogen. This is the trade-off. You can minimize fat gain by keeping the surplus modest, prioritizing protein, training hard, and sleeping well. But you can't avoid it entirely. Building muscle requires accepting that the scale moves up, at least temporarily. The goal is to make that increase mostly muscle. Then, later, you can diet down and reveal what you've built.",
    ],
    category: 'muscle-building',
  },
  {
    id: 'tactic-009',
    title: 'The Sleep Priority',
    tactic: 'Growth hormone peaks during deep sleep; your gains are literally made in bed.',
    logic: [
      "Your body does its repair work while you sleep. Growth hormone, which promotes muscle protein synthesis, is released primarily during deep sleep stages. Testosterone, another anabolic hormone, follows similar patterns. Sleep deprivation measurably reduces both, which is why chronic poor sleep hampers muscle growth regardless of how hard you train. You can lift all the weights you want, but if you're not sleeping, you're not recovering. And if you're not recovering, you're not adapting.",

      "This means prioritizing sleep isn't optional for muscle building—it's as important as the training itself. Seven to nine hours, consistently. In a dark, cool room. With limited screens before bed. The same advice you've heard a thousand times, but now with an additional reason: your biceps depend on it. Some people treat sleep as the thing that happens between workouts. They have it backwards. The workout is the stimulus. Sleep is when the growth actually happens. Respect the process.",
    ],
    category: 'muscle-building',
  },
  {
    id: 'tactic-010',
    title: 'The Progressive Overload',
    tactic: 'Do slightly more than last time—more weight, more reps, or more sets; that is the entire secret.',
    logic: [
      "Muscle grows in response to stress. Specifically, it grows when you challenge it beyond what it's currently adapted to. This is progressive overload: the principle that you must continually increase the demands on your muscles to continue seeing results. It doesn't have to be dramatic. Adding 2.5 pounds to the bar, doing one more rep, adding a single set—these are all forms of progression. The key is that last week's workout eventually becomes too easy, and you make it slightly harder.",

      "The mistake most people make is doing the same workout, with the same weights, for months or years. They're not progressing; they're just maintaining. Their body has already adapted to those demands, so it has no reason to build more muscle. A simple training log solves this: write down what you did, and next session, try to beat it. You won't always succeed—recovery, sleep, stress, and life interfere. But over time, the trend should be upward. More weight, more reps, more total work. That's the secret. There's no secret.",
    ],
    category: 'muscle-building',
  },
];

// ============================================================================
// CATEGORY C: THE DAILY DROP (Micro-Lessons)
// ============================================================================

export const DAILY_DROPS: DailyDrop[] = [
  {
    id: 'drop-001',
    content:
      "A lot of people ask me about 'starvation mode.' It's a fascinating theory. It implies your body can create energy out of nothing. Violate the laws of physics. If that were true, we should be studying you, not feeding you. We could solve the world energy crisis. But it's probably just the extra handful of almonds you forgot about.",
  },
  {
    id: 'drop-002',
    content:
      "Your muscle doesn't 'turn into fat' when you stop exercising. That's not how tissue works. They're different cell types. That's like saying your liver turns into your pancreas if you stop drinking. What actually happens is you lose muscle (from disuse) and gain fat (from eating the same amount while burning less). Two separate processes. Both reversible.",
  },
  {
    id: 'drop-003',
    content:
      "The thermic effect of food is real. Your body burns calories digesting food. Protein costs the most to process—about 20-30% of the calories you eat. Carbs cost about 5-10%. Fat costs about 0-3%. This is one reason high-protein diets work well. You're not just more full. You're actually burning more energy processing what you ate.",
  },
  {
    id: 'drop-004',
    content:
      "There's no such thing as 'toning.' That word doesn't describe a physiological process. What people mean is they want to build some muscle and lose some fat—those are the only two things you can actually do. You can't make muscle 'longer' or 'leaner.' You can only grow it or shrink it. 'Toning' is marketing language invented to sell gym memberships to people afraid of the word 'muscle.' Just lift the weights.",
  },
  {
    id: 'drop-005',
    content:
      "Your metabolism doesn't 'break' from dieting. It adapts. Metabolic adaptation is real—your body becomes more efficient when you eat less. But it's modest. We're talking 10-15% reduction at most, not the 50% people fear. And it reverses when you eat more. Your metabolism is resilient. It's been keeping humans alive through famines for 200,000 years.",
  },
  {
    id: 'drop-006',
    content:
      "Spot reduction doesn't work. You cannot do crunches to lose belly fat. When your body mobilizes fat for energy, it pulls from everywhere according to its own genetic preferences, not from wherever you're exercising. If crunches burned belly fat, everyone would have visible abs and love handles. The body doesn't work that way.",
  },
  {
    id: 'drop-007',
    content:
      "I see you bought a 'detox' tea. That's nice. You know, you have a liver. It's right there, just below your ribs. It's free. It's been detoxing you since the day you were born. Filters about 1.5 liters of blood per minute. Very efficient. But sure, maybe the tea knows something the liver doesn't.",
  },
  {
    id: 'drop-008',
    content:
      "Muscle weighs the same as fat. A pound is a pound. What people mean is that muscle is denser—it takes up less space for the same weight. So yes, you can get smaller while staying the same weight if you're building muscle and losing fat. The scale won't show it. Your clothes will.",
  },
  {
    id: 'drop-009',
    content:
      "Eating late at night doesn't make you gain more weight than eating the same food earlier. A calorie is a calorie regardless of when you consume it. What actually happens is people who eat late tend to eat more total, often mindlessly. It's the quantity, not the clock, that matters.",
  },
  {
    id: 'drop-010',
    content:
      "Your body stores about 2,000 calories of glycogen, mostly in your muscles and liver. When you start a diet, you deplete this first. Glycogen binds to water—about 3 grams of water per gram of glycogen. This is why people lose 5-10 pounds in the first week of any diet. It's mostly water. The fat loss comes later, slower, and without the fanfare.",
  },
  {
    id: 'drop-011',
    content:
      "Raw milk is having a moment. People say it's more 'natural.' They're right—it is more natural. You know what else is natural? Listeria. Salmonella. E. coli. Campylobacter. These bacteria occur naturally in unpasteurized milk. That's why Louis Pasteur invented pasteurization in 1864. It's been working ever since. But sure, maybe your immune system is stronger than science.",
  },
  {
    id: 'drop-012',
    content:
      "Organic food isn't more nutritious than conventional. Multiple meta-analyses—Stanford in 2012, the British Journal of Nutrition in 2014—found no meaningful difference in vitamin or mineral content. Organic may have slightly lower pesticide residues, but conventional residues are already well below safety thresholds. 'Organic' is a farming method, not a nutrition upgrade.",
  },
  {
    id: 'drop-013',
    content:
      "Fat has 9 calories per gram. Protein and carbs have 4. This is chemistry, not opinion. A tablespoon of olive oil has the same calories as a medium apple. Both are healthy. One is just a lot denser. This is why portion awareness matters more for fats—not because they're bad, but because they're concentrated.",
  },
  {
    id: 'drop-014',
    content:
      "Every pound of muscle you add burns an extra 6-10 calories per day at rest. That sounds small until you do the math over years. Ten pounds of muscle, maintained for a decade, is roughly 25,000 extra calories burned—about 7 pounds of fat. Resistance training is a long game. Play it anyway.",
  },
  {
    id: 'drop-015',
    content:
      "Whey protein is processed. Greek yogurt is processed. Tofu is processed. Canned beans are processed. Frozen vegetables are processed. These are all healthy foods. 'Processed' isn't the problem. Ultra-processed foods engineered for overconsumption are the problem. Precision in language matters.",
  },
  {
    id: 'drop-016',
    content:
      "The appeal to nature is a logical fallacy. 'Natural' doesn't mean 'healthy' or 'safe.' Arsenic is natural. Poison ivy is natural. Smallpox is natural. Meanwhile, synthetic insulin is made in a lab and keeps diabetics alive. ",
  },
  {
    id: 'drop-017',
    content:
      "Your body needs dietary fat to absorb vitamins A, D, E, and K. These are fat-soluble—without fat in your meal, they pass through unabsorbed. So yes, putting olive oil on your salad isn't just for taste. It's for actually getting the nutrients from the vegetables. Biology is occasionally convenient.",
  },
  {
    id: 'drop-018',
    content:
      "Resistance training reduces all-cause mortality. Not just heart disease. Not just diabetes. All causes. A 2022 analysis found people who did strength training had 10-20% lower risk of dying from cancer, heart disease, and other causes compared to those who didn't. Picking up heavy things and putting them down extends your life. Somehow.",
  },
  {
    id: 'drop-019',
    content:
      "One Lunchable will not destroy your health. Neither will a slice of birthday cake, a fast food meal on a road trip, or processed cheese on your sandwich. The dose makes the poison. What you do most of the time matters. What you do occasionally matters very little. Relax.",
  },
  {
    id: 'drop-020',
    content:
      "The 80/20 principle applies to nutrition: if 80% of your diet is whole, minimally processed food—vegetables, fruits, lean proteins, whole grains—the other 20% can be whatever you want. Perfect is the enemy of sustainable. Sustainable beats perfect every time.",
  },
  {
    id: 'drop-021',
    content:
      "Breakfast is not 'the most important meal of the day.' That slogan was invented by cereal companies in the early 20th century. Some people thrive eating breakfast; others prefer to skip it. There's no metabolic magic to morning eating. Eat when it works for your schedule and hunger. The total calories and quality over the day matter more than the timing.",
  },
  {
    id: 'drop-022',
    content:
      "You don't need to eat every 2-3 hours to 'stoke your metabolism.' This myth suggests that frequent eating keeps your metabolic fire burning. It doesn't. Your metabolic rate is determined by your size, muscle mass, and activity level—not meal frequency. Eat three meals, eat six small ones, eat one giant meal—as long as the totals are the same, your metabolism doesn't care.",
  },
  {
    id: 'drop-023',
    content:
      "Carbs don't make you fat. Excess calories make you fat. Carbohydrates are your body's preferred energy source. They fuel your brain, your muscles, your daily activities. Populations with the longest lifespans—Okinawans, Sardinians—eat plenty of carbs. The issue is when carbs come packaged with no fiber, no protein, and unlimited access. That's not the carb's fault. That's the Dorito's fault.",
  },
  {
    id: 'drop-024',
    content:
      "Egg yolks aren't bad for you. The dietary cholesterol fear was based on flawed 1960s research. Your liver produces most of your blood cholesterol regardless of what you eat, and adjusts production based on dietary intake. Eggs are one of the most nutritious foods available—protein, choline, vitamins A, D, B12. The yolk is where the nutrients live. Eat the whole egg.",
  },
  {
    id: 'drop-025',
    content:
      "'I'm just big boned' is a phrase that's doing a lot of work. Bone structure does vary between individuals, but the actual weight difference is about 2-4 pounds across the entire skeleton. Not 30. Not 50. You cannot have 40 extra pounds of skeleton. What people usually mean is they have a larger frame, which might support more muscle. Which would be great. That's not the issue they're describing.",
  },
  {
    id: 'drop-026',
    content:
      "Cardio is not the best exercise for weight loss. Resistance training is often more effective because it preserves muscle mass during a deficit, keeps your metabolism higher, and creates changes in body composition that cardio alone cannot. The best exercise for weight loss is the one you'll actually do consistently, but if forced to choose, pick the weights.",
  },
  {
    id: 'drop-027',
    content:
      "Fat burners don't work. Not in any meaningful way. Most contain caffeine, which slightly increases metabolic rate (about 50-100 calories), and a bunch of other ingredients with zero evidence behind them. You could just drink coffee. Or accept that the supplement industry makes billions selling hope in capsule form. The only thing getting thinner is your wallet.",
  },
  {
    id: 'drop-028',
    content:
      "Running does not ruin your knees. In fact, runners have lower rates of knee osteoarthritis than non-runners. The cartilage adapts to stress and becomes more resilient. What damages knees is being overweight, which puts constant stress on them 24/7. Running a few times per week? Your knees can handle it. They were designed for it. That's literally why you have them.",
  },
  {
    id: 'drop-029',
    content:
      "You don't need supplements to build muscle. Protein powder is convenient, not magical. Creatine has solid evidence, but you can build plenty of muscle without it. BCAAs are useless if you eat enough protein. Most supplements are solutions looking for problems. Eat enough protein from food, train hard, sleep well, be patient. That's 95% of the equation.",
  },
  {
    id: 'drop-030',
    content:
      "'Slow metabolism' is rarely why people are overweight. Metabolic rate varies by about 200-300 calories between similar-sized individuals—the difference of a large cookie. Most overweight people actually have higher metabolisms because larger bodies require more energy. The issue is usually underestimating intake, overestimating expenditure, or both. The metabolism isn't slow. The accounting is off.",
  },
  {
    id: 'drop-031',
    content:
      "Gluten-free is not inherently healthier. Unless you have celiac disease (about 1% of people) or a genuine gluten sensitivity (maybe another 5-6%), gluten is fine. It's a protein found in wheat. Many gluten-free products replace it with refined starches and added sugars to improve texture. You've traded gluten for something arguably worse. Just eat the bread.",
  },
  {
    id: 'drop-032',
    content:
      "Sweating more doesn't mean you're burning more fat. Sweat is thermoregulation, not fat leaving your body. You sweat to cool down, and how much you sweat depends on genetics, humidity, and fitness level. Some people drip while doing nothing; others barely glisten during intense exercise. Neither is working harder. The calorie burn is determined by the work, not the moisture.",
  },
  {
    id: 'drop-033',
    content:
      "There's no such thing as 'negative calorie foods.' The idea that celery or cucumbers require more energy to digest than they provide is a persistent myth. The thermic effect of digestion is real but modest—it cannot exceed the calories in the food. Celery has about 6 calories per stalk and costs maybe 0.5 calories to digest. You still net 5.5 calories. Math.",
  },
  {
    id: 'drop-034',
    content:
      "Stretching before exercise doesn't prevent injury. Static stretching before activity can actually reduce power and performance. What helps is a proper warm-up: light cardio, dynamic movements, gradually increasing intensity. Save the static stretching for after the workout, or skip it entirely. Flexibility is nice but overrated for injury prevention.",
  },
  {
    id: 'drop-035',
    content:
      "You cannot 'boost' your immune system with supplements, superfoods, or cleanses. That's not how immunity works. An overactive immune system is called an autoimmune disease. What you can do is not suppress it: sleep enough, manage stress, eat adequate nutrients, don't smoke, limit alcohol. But that's not 'boosting.' That's just not self-sabotaging.",
  },
  {
    id: 'drop-036',
    content:
      "Your metabolism didn't slow down when you turned 30. Or 40. Or 50. A landmark 2021 study analyzing 6,400 people found that metabolic rate stays essentially flat from age 20 to 60, only declining about 0.7% per year after that. The weight you gained in your 30s wasn't your metabolism's fault. It was the beer. And the desk job. And the cookies. Compounded over a decade. The math checks out without blaming your mitochondria.",
  },
  {
    id: 'drop-037',
    content:
      "What does change with age is muscle mass—if you let it. Sarcopenia, the gradual loss of muscle tissue, begins around age 30 if you don't actively resist it. Less muscle means lower energy expenditure, which looks like a 'slower metabolism' but is actually just less metabolically active tissue. The fix isn't accepting decline. The fix is resistance training. Your muscles don't know how old you are. They only know if you're using them.",
  },
  {
    id: 'drop-038',
    content:
      "Falls are the leading cause of injury death in adults over 65. One in four older adults falls each year. The difference between a fall being a minor inconvenience and a life-altering hip fracture often comes down to muscle strength and bone density—both of which improve with resistance training. This isn't about aesthetics anymore. It's about whether you can catch yourself when you trip. It's about staying out of the nursing home.",
  },
  {
    id: 'drop-039',
    content:
      "It's never too late to start strength training. Studies have shown that people in their 80s and 90s can still build muscle and gain strength. One study had nursing home residents averaging age 87 increase their leg strength by 113% in just 8 weeks. Your body's ability to adapt to resistance doesn't expire. It just waits for you to ask something of it.",
  },
  {
    id: 'drop-040',
    content:
      "The activities that keep you independent—getting up from a chair, climbing stairs, carrying groceries, playing with grandchildren—all require muscle strength. Lose that strength, and you lose your independence. This is why resistance training becomes more important as you age, not less. Every squat you do now is a future chair you can stand up from without help. Every deadlift is a grandchild you can pick up.",
  },
];

// ============================================================================
// CATEGORY C: PLATE CHECK REACTS
// ============================================================================

export const PLATE_REACTS: PlateReact[] = [
  // ===========================================================================
  // PERFECT PLATE (Protein + Plants)
  // ===========================================================================
  {
    id: 'perfect-001',
    type: 'perfect',
    content:
      "You had the protein. You had the plants. This is what you're supposed to do. I don't know what else to tell you. Good job.",
  },
  {
    id: 'perfect-002',
    type: 'perfect',
    content:
      "Protein. Vegetables. A complete meal. You've done exactly what we asked. I'm running out of ways to say 'this is correct.'",
  },
  {
    id: 'perfect-003',
    type: 'perfect',
    content:
      "This is a balanced plate. You nailed it. No notes. I'll just be over here with nothing to critique.",
  },
  {
    id: 'perfect-004',
    type: 'perfect',
    content:
      "Efficient. Effective. Boring. I love it.",
  },
  {
    id: 'perfect-005',
    type: 'perfect',
    content:
      "Protein and plants present. Your gut bacteria send their regards. They're well fed.",
  },
  {
    id: 'perfect-006',
    type: 'perfect',
    content:
      "You did the thing. The exact thing we asked you to do. Not more, not less. This is peak performance.",
  },
  {
    id: 'perfect-007',
    type: 'perfect',
    content:
      "Satiety, fiber, micronutrients—all accounted for. Your body's regulatory systems are pleased. So am I.",
  },
  {
    id: 'perfect-008',
    type: 'perfect',
    content:
      "A complete plate. Both boxes checked. Your hunger hormones will be quiet for hours. That's the goal.",
  },
  {
    id: 'perfect-009',
    type: 'perfect',
    content:
      "Protein for structure. Plants for fiber and nutrients. This is what a meal looks like. You figured it out.",
  },
  {
    id: 'perfect-010',
    type: 'perfect',
    content:
      "Well done. And I mean that literally—you made good food decisions. Also well done.",
  },
  {
    id: 'perfect-011',
    type: 'perfect',
    content:
      "Textbook plate. Some might say boring. I say sustainable. Keep being boring.",
  },
  {
    id: 'perfect-012',
    type: 'perfect',
    content:
      "Adequate protein, adequate vegetables. You've just done more for your health than most supplement stacks ever could.",
  },
  {
    id: 'perfect-013',
    type: 'perfect',
    content:
      "Your gut microbiome thanks you. Your satiety hormones thank you. I thank you for not making me write a concerned message.",
  },

  // ===========================================================================
  // MEH PLATE (Protein only, no plants)
  // ===========================================================================
  {
    id: 'meh-001',
    type: 'meh',
    content:
      "You got the protein. That's the important part. The vegetables seem to have gone missing, but we'll address that next time. Half credit.",
  },
  {
    id: 'meh-002',
    type: 'meh',
    content:
      "Protein present. Plants absent. Look, you got the harder part right. Throwing some vegetables on there is the easy fix. You'll get there.",
  },
  {
    id: 'meh-003',
    type: 'meh',
    content:
      "The protein's here. The fiber and micronutrients from vegetables are not. We're not mad, just... you know. Vegetables exist. They're waiting for you.",
  },
  {
    id: 'meh-004',
    type: 'meh',
    content:
      "Protein logged. Fiber missing. Your gut bacteria are currently staring at an empty plate, wondering what they did to deserve this.",
  },
  {
    id: 'meh-005',
    type: 'meh',
    content:
      "Half the equation is solved. The protein part. The other half—the vegetables—remains unsolved. It's okay. Math takes time.",
  },
  {
    id: 'meh-006',
    type: 'meh',
    content:
      "Muscle protein synthesis will proceed as planned. Fiber intake will not. One out of two isn't bad. It's just... one out of two.",
  },
  {
    id: 'meh-007',
    type: 'meh',
    content:
      "The protein is doing its job. The fiber that slows digestion and feeds your microbiome is notably absent. Your call.",
  },
  {
    id: 'meh-008',
    type: 'meh',
    content:
      "Protein: yes. Plants: no. Your satiety will be moderate rather than optimal. But satiety was achieved. Progress.",
  },
  {
    id: 'meh-009',
    type: 'meh',
    content:
      "You prioritized protein. Good. You forgot the vegetables. Less good. But the foundation is there. We build from here.",
  },
  {
    id: 'meh-010',
    type: 'meh',
    content:
      "The protein thermostat is happy. The gut bacteria are less happy. Next time, maybe throw them a vegetable. Just one.",
  },
  {
    id: 'meh-011',
    type: 'meh',
    content:
      "Amino acids acquired. Fiber not acquired. Your colon will remember this tomorrow. But today, you did okay.",
  },
  {
    id: 'meh-012',
    type: 'meh',
    content:
      "Protein present. Vegetables mysteriously absent. Did they escape? Were they never there? The world may never know.",
  },
  {
    id: 'meh-013',
    type: 'meh',
    content:
      "You got the building blocks. You missed the roughage. It's like building a house but forgetting the insulation. Livable, but not ideal.",
  },

  // ===========================================================================
  // OOPS PLATE (Neither protein nor plants)
  // ===========================================================================
  {
    id: 'oops-001',
    type: 'oops',
    content:
      "So, that was a meal. Technically. It contained calories. It sustained life. Was it optimal? No. But you're still here, so we'll call it progress.",
  },
  {
    id: 'oops-002',
    type: 'oops',
    content:
      "No protein, no plants. Just... carbohydrates living their best life. Look, it happens. Tomorrow's another opportunity to remember that protein exists.",
  },
  {
    id: 'oops-003',
    type: 'oops',
    content:
      "This meal was light on the things we track. That's okay. It's data, not judgment. The next meal is a clean slate. Protein and vegetables will still be there.",
  },
  {
    id: 'oops-004',
    type: 'oops',
    content:
      "No structural materials detected. Just energy. Your body will use it, but it won't build anything new with it. That's fine sometimes.",
  },
  {
    id: 'oops-005',
    type: 'oops',
    content:
      "Carbs and fat, probably. Protein and fiber, probably not. You'll be hungry again soon. That's just how this works.",
  },
  {
    id: 'oops-006',
    type: 'oops',
    content:
      "This meal lacked protein and plants. Your hunger will return shortly, confused about what happened. We'll do better next time.",
  },
  {
    id: 'oops-007',
    type: 'oops',
    content:
      "Neither protein nor fiber showed up. The calories did. They always do. No judgment here, just observation.",
  },
  {
    id: 'oops-008',
    type: 'oops',
    content:
      "This was a meal of convenience, not optimization. That's okay. Convenience has its place. Just maybe not every meal.",
  },
  {
    id: 'oops-009',
    type: 'oops',
    content:
      "Protein absent. Vegetables absent. Satiety will be brief. This is physics, not punishment. The next meal awaits.",
  },
  {
    id: 'oops-010',
    type: 'oops',
    content:
      "No building blocks, no fiber. Just quick energy. Your body used it. The transaction is complete. Onward.",
  },
  {
    id: 'oops-011',
    type: 'oops',
    content:
      "The meal happened. It lacked the components we prioritize. Life is long. There will be other meals. Many other meals.",
  },
  {
    id: 'oops-012',
    type: 'oops',
    content:
      "Sometimes you eat for fuel. Sometimes you eat for nutrition. This was the first kind. Both are valid. The second is just better for goals.",
  },
  {
    id: 'oops-013',
    type: 'oops',
    content:
      "Zero protein. Zero plants. Just vibes and carbohydrates. We don't track vibes, but we acknowledge they exist.",
  },
];

// ============================================================================
// CATEGORY D: LOADING SCREEN ONE-LINERS
// ============================================================================

export const LOADING_LINES: LoadingLine[] = [
  {
    id: 'loading-001',
    content: "Loading... I'm doing a lot of math right now. You just sit there. Relax.",
  },
  {
    id: 'loading-002',
    content:
      "Searching for your data... it's in the cloud. Which is really just a server farm in Virginia. But 'cloud' sounds nicer.",
  },
  {
    id: 'loading-003',
    content:
      "Calculating your trend... using an exponentially weighted moving average, which sounds impressive but is actually pretty basic statistics.",
  },
  {
    id: 'loading-004',
    content:
      "Syncing... This would be faster if we were both in the same room. But we're not. So we wait.",
  },
  {
    id: 'loading-005',
    content:
      "Processing... Your data is traveling through fiber optic cables at the speed of light right now. And yet, you're still waiting. Technology.",
  },
  {
    id: 'loading-006',
    content: "One moment... I'm consulting the database. It knows things. Many things.",
  },
  {
    id: 'loading-007',
    content:
      "Loading your information... which is really just electrons representing numbers representing you. It's all very abstract when you think about it.",
  },
  {
    id: 'loading-008',
    content:
      "Fetching data... not like a dog fetches. More like a very organized librarian. But with fewer cardigans.",
  },
  {
    id: 'loading-009',
    content:
      "Almost there... The computer is working. It doesn't complain. It just computes. We should all be more like the computer.",
  },
  {
    id: 'loading-010',
    content:
      "Working on it... If this were the 1990s, you'd see an animated hourglass. Progress.",
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a random item from an array
 */
function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Get a Golden Rule by ID
 */
export function getGoldenRule(id: string): GoldenRule | undefined {
  return GOLDEN_RULES.find((rule) => rule.id === id);
}

/**
 * Get today's Golden Rule (rotates daily)
 */
export function getDailyGoldenRule(): GoldenRule {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return GOLDEN_RULES[dayOfYear % GOLDEN_RULES.length];
}

/**
 * Get a random Daily Drop
 */
export function getRandomDailyDrop(): DailyDrop {
  return getRandomItem(DAILY_DROPS);
}

/**
 * Get today's Daily Drop (rotates daily, different from Golden Rules)
 */
export function getDailyDrop(): DailyDrop {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  // Offset by 3 so it's not the same rotation as Golden Rules
  return DAILY_DROPS[(dayOfYear + 3) % DAILY_DROPS.length];
}

/**
 * Get a Plate Check reaction based on meal quality
 */
export function getPlateReact(hasProtein: boolean, hasPlants: boolean): PlateReact {
  let type: 'perfect' | 'meh' | 'oops';

  if (hasProtein && hasPlants) {
    type = 'perfect';
  } else if (hasProtein) {
    type = 'meh';
  } else {
    type = 'oops';
  }

  const options = PLATE_REACTS.filter((react) => react.type === type);
  return getRandomItem(options);
}

/**
 * Get a random loading line
 */
export function getLoadingLine(): LoadingLine {
  return getRandomItem(LOADING_LINES);
}

/**
 * Get all Golden Rules (for admin/testing)
 */
export function getAllGoldenRules(): GoldenRule[] {
  return [...GOLDEN_RULES];
}

/**
 * Get all Daily Drops (for admin/testing)
 */
export function getAllDailyDrops(): DailyDrop[] {
  return [...DAILY_DROPS];
}

/**
 * Get all Practical Tactics (for admin/testing)
 */
export function getAllPracticalTactics(): PracticalTactic[] {
  return [...PRACTICAL_TACTICS];
}

/**
 * Get Practical Tactics by category
 */
export function getTacticsByCategory(
  category: PracticalTactic['category']
): PracticalTactic[] {
  return PRACTICAL_TACTICS.filter((tactic) => tactic.category === category);
}

/**
 * Get a specific tactic by ID
 */
export function getTacticById(id: string): PracticalTactic | undefined {
  return PRACTICAL_TACTICS.find((tactic) => tactic.id === id);
}

/**
 * Get Golden Rules by level
 */
export function getRulesByLevel(level: GoldenRule['level']): GoldenRule[] {
  return GOLDEN_RULES.filter((rule) => rule.level === level);
}

/**
 * Get a random tactic from a specific category (or all if no category)
 */
export function getRandomTactic(
  category?: PracticalTactic['category']
): PracticalTactic {
  const pool = category
    ? PRACTICAL_TACTICS.filter((t) => t.category === category)
    : PRACTICAL_TACTICS;
  return pool[Math.floor(Math.random() * pool.length)];
}

