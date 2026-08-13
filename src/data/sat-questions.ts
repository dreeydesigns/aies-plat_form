import { SatQuestion } from '../types';

export const initialSatQuestions: SatQuestion[] = [
  // ==========================================
  // MATH — ALGEBRA
  // ==========================================
  {
    id: 'sat-math-alg-001',
    section: 'math',
    domain: 'algebra',
    skill: 'Linear equations in one variable',
    difficulty: 'beginner',
    questionText: 'If 3x + 7 = 28, what is the value of x - 2?',
    options: ['5', '7', '9', '21'],
    correctAnswer: 0,
    explanation: 'First solve 3x + 7 = 28: subtract 7 to get 3x = 21, then divide by 3 to find x = 7. Then evaluate x - 2 = 7 - 2 = 5.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 14,
      highlightedText: 'The standard slope-intercept form is y = mx + b'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-math-alg-002',
    section: 'math',
    domain: 'algebra',
    skill: 'Systems of two linear equations',
    difficulty: 'intermediate',
    questionText: 'Consider the system of equations:\n4x - 2y = 10\n2x + y = 13\nWhat is the value of xy?',
    options: ['12', '18', '20', '24'],
    correctAnswer: 1,
    explanation: 'From the second equation, y = 13 - 2x. Substitute into the first equation: 4x - 2(13 - 2x) = 10 => 4x - 26 + 4x = 10 => 8x = 36 => x = 4.5. Then y = 13 - 2(4.5) = 13 - 9 = 4. Therefore, xy = 4.5 * 4 = 18.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 14,
      highlightedText: 'When solving systems of linear equations'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-math-alg-003',
    section: 'math',
    domain: 'algebra',
    skill: 'Linear systems with infinite or no solutions',
    difficulty: 'expert',
    questionText: 'In the system of equations below, k is a constant:\n6x - 9y = 15\n2x - ky = 5\nFor what value of k does the system have infinitely many solutions?',
    options: ['2', '3', '4.5', '-3'],
    correctAnswer: 1,
    explanation: 'For a system to have infinitely many solutions, the two equations must be linearly dependent multiples. Notice 6x / 2x = 3 and 15 / 5 = 3. Dividing the first equation by 3 yields 2x - 3y = 5. Comparing with 2x - ky = 5, we have k = 3.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 14,
      highlightedText: 'a system has infinitely many solutions if and only if both equations represent identical lines'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-math-alg-004',
    section: 'math',
    domain: 'algebra',
    skill: 'Linear inequalities in two variables',
    difficulty: 'intermediate',
    questionText: 'Which point (x, y) is in the solution set of the system of inequalities y > 2x - 1 and y <= -x + 6?',
    options: ['(1, 0)', '(2, 4)', '(4, 3)', '(0, -2)'],
    correctAnswer: 1,
    explanation: 'Test point (2, 4): 4 > 2(2) - 1 => 4 > 3 (True). 4 <= -2 + 6 => 4 <= 4 (True). Thus, (2, 4) satisfies both inequalities.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 14,
      highlightedText: 'Linear relationships and Slope'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },

  // ==========================================
  // MATH — ADVANCED MATH
  // ==========================================
  {
    id: 'sat-math-adv-001',
    section: 'math',
    domain: 'advanced-math',
    skill: 'Quadratic equations and factoring',
    difficulty: 'beginner',
    questionText: 'What are the solutions to the quadratic equation x^2 - 8x + 15 = 0?',
    options: ['x = -3 and x = -5', 'x = 3 and x = 5', 'x = 2 and x = 7', 'x = -2 and x = -6'],
    correctAnswer: 1,
    explanation: 'Factor the quadratic: (x - 3)(x - 5) = 0. Setting each factor to zero yields x = 3 and x = 5.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 28,
      highlightedText: 'Quadratic expressions take the form ax^2 + bx + c = 0'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-math-adv-002',
    section: 'math',
    domain: 'advanced-math',
    skill: 'Parabola vertex and extrema',
    difficulty: 'intermediate',
    questionText: 'The function f is defined by f(x) = 2x^2 - 12x + 23. What is the minimum value of f(x)?',
    options: ['3', '5', '6', '11'],
    correctAnswer: 1,
    explanation: 'The x-coordinate of the vertex of a parabola y = ax^2 + bx + c is x = -b / (2a) = 12 / (2 * 2) = 3. Evaluating f(3) = 2(3)^2 - 12(3) + 23 = 18 - 36 + 23 = 5.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 28,
      highlightedText: 'For any parabola y = ax^2 + bx + c, the vertex occurs at x = -b / (2a)'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-math-adv-003',
    section: 'math',
    domain: 'advanced-math',
    skill: 'Discriminant analysis and nonlinear intersections',
    difficulty: 'expert',
    questionText: 'For what value of c does the line y = 4x + c intersect the parabola y = x^2 - 2x + 10 at exactly one point?',
    options: ['-1', '1', '5', '9'],
    correctAnswer: 1,
    explanation: 'Set the equations equal: x^2 - 2x + 10 = 4x + c => x^2 - 6x + (10 - c) = 0. For exactly one intersection, the discriminant must be zero: b^2 - 4ac = (-6)^2 - 4(1)(10 - c) = 0 => 36 - 40 + 4c = 0 => -4 + 4c = 0 => c = 1.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 28,
      highlightedText: 'The discriminant Delta = b^2 - 4ac determines the nature of the roots'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-math-adv-004',
    section: 'math',
    domain: 'advanced-math',
    skill: 'Exponential decay and half-life',
    difficulty: 'expert',
    questionText: 'A radioactive isotope decays according to M(t) = 400 * (1/2)^(t/15), where M(t) is mass in grams and t is time in years. What is the mass remaining after 45 years?',
    options: ['25 grams', '50 grams', '75 grams', '100 grams'],
    correctAnswer: 1,
    explanation: 'Substitute t = 45: M(45) = 400 * (1/2)^(45/15) = 400 * (1/2)^3 = 400 * (1/8) = 50 grams.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 45,
      highlightedText: 'Exponential growth is modeled by f(t) = P(1 + r)^t'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },

  // ==========================================
  // MATH — PROBLEM SOLVING & DATA ANALYSIS
  // ==========================================
  {
    id: 'sat-math-psd-001',
    section: 'math',
    domain: 'problem-solving-data-analysis',
    skill: 'Percentages and unit rates',
    difficulty: 'beginner',
    questionText: 'A laptop originally priced at $800 is on sale for a 25% discount. If an 8% sales tax is applied to the discounted price, what is the final price of the laptop?',
    options: ['$600', '$648', '$680', '$748'],
    correctAnswer: 1,
    explanation: 'The discounted price is $800 * (1 - 0.25) = $600. With 8% sales tax, the final price is $600 * 1.08 = $648.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 45,
      highlightedText: 'Percentages, rates, and proportional relationships form the core'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-math-psd-002',
    section: 'math',
    domain: 'problem-solving-data-analysis',
    skill: 'Conditional probability and two-way tables',
    difficulty: 'intermediate',
    questionText: 'In a survey of 120 students, 70 are enrolled in Biology and 50 are enrolled in Chemistry. If 20 students are enrolled in both courses, what is the probability that a student chosen at random from those in Biology is also enrolled in Chemistry?',
    options: ['2/7', '2/5', '1/6', '7/12'],
    correctAnswer: 0,
    explanation: 'The condition restricts our universe to students enrolled in Biology (70 students). Among these 70 students, 20 are also in Chemistry. P(Chemistry | Biology) = 20 / 70 = 2/7.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 45,
      highlightedText: 'The probability of event A given event B, P(A|B)'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-math-psd-003',
    section: 'math',
    domain: 'problem-solving-data-analysis',
    skill: 'Sequential percentage changes and margin of error',
    difficulty: 'expert',
    questionText: 'The population of an endangered species increased by 20% in 2024 and then decreased by 20% in 2025. Compared to the initial population in early 2024, the final population is:',
    options: ['The exact same', '4% higher', '4% lower', '2% lower'],
    correctAnswer: 2,
    explanation: 'Let initial population be P. After 20% increase: 1.20P. After 20% decrease: 1.20P * 0.80 = 0.96P. This represents a net 4% decrease ((1 - 0.96) * 100% = 4% lower).',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 45,
      highlightedText: 'When a quantity increases by p% and subsequently decreases by p%'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },

  // ==========================================
  // MATH — GEOMETRY & TRIGONOMETRY
  // ==========================================
  {
    id: 'sat-math-geo-001',
    section: 'math',
    domain: 'geometry-trigonometry',
    skill: 'Similar triangles and proportions',
    difficulty: 'beginner',
    questionText: 'Triangle ABC is similar to Triangle DEF, with angle A corresponding to angle D. If AB = 6, BC = 8, and DE = 15, what is the length of EF?',
    options: ['18', '20', '24', '30'],
    correctAnswer: 1,
    explanation: 'Since the triangles are similar, corresponding side lengths are proportional: AB / DE = BC / EF => 6 / 15 = 8 / EF => EF = (8 * 15) / 6 = 120 / 6 = 20.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 62,
      highlightedText: 'In similar triangles, corresponding side lengths are strictly proportional'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-math-geo-002',
    section: 'math',
    domain: 'geometry-trigonometry',
    skill: 'Circle equations and Cartesian radius',
    difficulty: 'intermediate',
    questionText: 'The equation of a circle in the xy-plane is x^2 + y^2 - 6x + 8y = 24. What is the radius of the circle?',
    options: ['5', '7', '24', '49'],
    correctAnswer: 1,
    explanation: 'Complete the square: (x^2 - 6x + 9) + (y^2 + 8y + 16) = 24 + 9 + 16 => (x - 3)^2 + (y + 4)^2 = 49. Since r^2 = 49, radius r = 7.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 62,
      highlightedText: 'The standard circle equation is (x - h)^2 + (y - k)^2 = r^2'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-math-geo-003',
    section: 'math',
    domain: 'geometry-trigonometry',
    skill: 'Complementary angle trigonometric identities',
    difficulty: 'expert',
    questionText: 'In a right triangle with acute angles theta and phi, sin(theta) = 5/13. What is the value of cos(phi)?',
    options: ['5/13', '12/13', '13/5', '1/2'],
    correctAnswer: 0,
    explanation: 'In any right triangle, the two acute angles are complementary: theta + phi = 90 degrees. By the cofunction identity, sin(theta) = cos(90 - theta) = cos(phi) = 5/13.',
    textbookRef: {
      textbookId: 'sat-math-foundations',
      page: 62,
      highlightedText: 'For complementary angles alpha and beta where alpha + beta = 90 degrees'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },

  // ==========================================
  // READING & WRITING — INFORMATION & IDEAS
  // ==========================================
  {
    id: '3543e6e2',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is from Jane Austen’s 1811 novel Sense and Sensibility. Elinor lives with her younger sisters and her mother, Mrs. Dashwood.\n\nElinor, this eldest daughter, whose advice was so effectual, possessed a strength of understanding, and coolness of judgment, which qualified her, though only nineteen, to be the counsellor of her mother, and enabled her frequently to counteract, to the advantage of them all, that eagerness of mind in Mrs. Dashwood which must generally have led to imprudence. She had an excellent heart;—her disposition was affectionate, and her feelings were strong; but she knew how to govern them: it was a knowledge which her mother had yet to learn; and which one of her sisters had resolved never to be taught.\n\nAccording to the text, what is true about Elinor?',
    options: [
      'Elinor often argues with her mother but fails to change her mind.',
      'Elinor can be overly sensitive with regard to family matters.',
      'Elinor thinks her mother is a bad role model.',
      'Elinor is remarkably mature for her age.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer because it provides a detail about Elinor that is established in the text. The text indicates that although Elinor is "only nineteen," she gives good advice and exhibits such a high level of understanding and judgment that she serves as "the counsellor of her mother." Thus, Elinor is mature beyond her years.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'cf956802',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'When fashion designer Lloyd Henri Kiva New opened his store in Scottsdale, Arizona, in 1945, he quickly became known for creating delicately crafted leather goods, like belts and hats. He was perhaps most renowned for his colorful handbags, which he made by hand using a long and painstaking process. As he gained more customers, New began using sewing machines and other tools to help him produce bags more efficiently, though he continued to handcraft the crucial details that made each bag unique.\n\nBased on the text, what would have been the most likely consequence if New had not begun using sewing machines?',
    options: [
      'He would have been unable to ensure that each bag included unique, handcrafted details.',
      'He would have struggled to meet the increasing demand for his bags.',
      'He would have had to individually design each bag he produced.',
      'He would not have been able to generate as much interest in his bags.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer because it presents the most likely consequence if New had not begun using sewing machines. The text states that New gained new customers and that sewing machines allowed him to make bags more efficiently, or in less time than he could when sewing by hand. It’s reasonable to conclude that if New hadn’t reduced the time it took to make each bag by starting to use sewing machines, it would have been hard for him to keep up with the increased demand.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'An answer choice is valid only if it directly substantiates the specific claim'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '714e4c10',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Ruth Asawa was an accomplished artist who worked in many art forms, including her unique tied-wire sculptures, but she was dedicated to more than the creation of art. Asawa also wanted to bring art to children in her hometown of San Francisco, California. To that end, in 1968 she cofounded the Alvarado School Arts Workshop, which brought works of art and artists into public schools, and in 1982 she helped found a San Francisco public arts high school, which was later named after her.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Asawa inspired many other artists to share their work with students in public schools.',
      'Asawa’s unique sculptures were appreciated more by local art communities than they were nationwide.',
      'Asawa’s interest in art education prompted her to create art programs for students in San Francisco.',
      'Asawa left a promising career as a sculptor to work as an art teacher in San Francisco schools.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer because it most accurately states the main idea of the text. The text begins by establishing Ruth Asawa as an artist who worked in several art forms but emphasizes that she was interested in art for reasons other than her desire to create it. The text mentions two ways in which Asawa brought art to children through public schools: cofounding the Alvarado School Arts Workshop in 1968 and helping found a public arts high school in 1982.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a biographical passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '57485f5e',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is adapted from Johanna Spyri’s 1881 novel Heidi (translated by Elisabeth Stork in 1915). Eight-year-old Heidi and her friend’s grandmother are looking at some illustrated books.\n\nHeidi had come and was looking with wondering eyes at the splendid pictures in the large books, that Grandmama was showing her. Suddenly she screamed aloud, for there on the picture she saw a peaceful flock grazing on a green pasture. In the middle a shepherd was standing, leaning on his crook. The setting sun was shedding a golden light over everything. With glowing eyes Heidi devoured the scene.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Heidi is upset until she sees a serene image of a pasture in one of Grandmama’s books.',
      'Heidi is delighted and fascinated by an image she sees in one of Grandmama’s books.',
      'Heidi is initially frightened by an image in one of Grandmama’s books but quickly comes to appreciate its beauty.',
      'Heidi is inspecting an image in one of Grandmama’s books because she has never seen a shepherd with his sheep before.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer because it most effectively states the main idea of the text, which is that Heidi is delighted and fascinated by an image she sees in one of Grandmama’s books. In the text, Heidi screams upon first seeing the picture of the green pasture with "glowing eyes" and "devoured the scene," indicating she is thrilled and intrigued by the image.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'e677fa6c',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is adapted from Edgar Allan Poe’s 1849 story “Landor’s Cottage.”\n\nDuring a pedestrian trip last summer, through one or two of the river counties of New York, I found myself, as the day declined, somewhat embarrassed about the road I was pursuing. The land undulated very remarkably; and my path, for the last hour, had wound about and about so confusedly, in its effort to keep in the valleys, that I no longer knew in what direction lay the sweet village of B——, where I had determined to stop for the night.\n\nWhich choice best states the main idea of the text?',
    options: [
      'The narrator remembers a trip he took and admits to getting lost.',
      'The narrator recalls fond memories of a journey that he took through some beautiful river counties.',
      'The narrator describes what he saw during a long trip through a frequently visited location.',
      'The narrator explains the difficulties he encountered on a trip and how he overcame them.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The narrator is "embarrassed" about the route he took, which ends up leaving him lost and confused about how to get to his destination for the evening.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '8a8236e1',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Scent is tightly interwoven with our daily lives, often evoking significant memories and important social events. This connection is of growing interest to archaeologists who hope to use it to better understand ancient rituals, trade, social hierarchies, and medicine. Although the speed at which odor molecules dissipate makes identifying ancient scents challenging, advancements in biomolecular technologies show promise in unlocking ancient aromas from preserved artifacts. Archaeological studies making use of these advancements may provide new insights into past societies.\n\nAccording to the text, what is one reason some archaeologists are interested in recovering scents from ancient artifacts?',
    options: [
      'They are investigating whether people’s sense of smell has declined in recent centuries.',
      'They believe the scents could illuminate important aspects of ancient life.',
      'They think that ancient scents would be enjoyable to people today.',
      'They hope to develop new medicines using ancient scent molecules.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text states that archaeologists are interested in using scents to better understand "ancient rituals, trade, social hierarchies, and medicine," all of which are important aspects of ancient life.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a scientific passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'c6d7dc78',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Stores often play background music to create a pleasant shopping experience. Based on a survey, Amir Manzoor found that such music was linked to reduced enjoyment among customers. Manzoor thinks that one explanation for this result is that the surveyed customers may have wanted to finish their shopping as quickly as possible. They therefore weren’t focused on enjoying the experience. It’s possible that background music could improve the experience of other customers whose main goal is to have a good time while they shop.\n\nBased on the text, which research question was Manzoor’s study most likely intended to answer?',
    options: [
      'Does the volume of a store’s background music affect how much time customers spend in the store?',
      'How does the use of background music in stores affect customers’ shopping experience?',
      'Do customers spend more money when shopping for music in stores or online?',
      'What genres of music do customers prefer to listen to while they are shopping?'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer because it presents a research question that is clearly addressed by Manzoor’s study as described in the text. The text indicates that Manzoor surveyed customers and found that background music was linked to reduced enjoyment while shopping.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When evaluating research studies and experimental designs'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'c228bd45',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is adapted from Edith Nesbit’s 1906 novel The Railway Children.\n\nMother did not spend all her time in paying dull [visits] to dull ladies, and sitting dully at home waiting for dull ladies to pay [visits] to her. She was almost always there, ready to play with the children, and read to them, and help them to do their home-lessons. Besides this she used to write stories for them while they were at school, and read them aloud after tea, and she always made up funny pieces of poetry for their birthdays and for other great occasions.\n\nAccording to the text, what is true about Mother?',
    options: [
      'She wishes that more ladies would visit her.',
      'Birthdays are her favorite special occasion.',
      'She creates stories and poems for her children.',
      'Reading to her children is her favorite activity.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer because it describes something that is true of Mother, as presented in the text. The text indicates that in addition to other activities, Mother writes stories for her children while they are at school and makes up "funny pieces of poetry" for certain occasions.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '82d2436a',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is from Laila Lalami’s 2019 novel The Other Americans. The narrator is a member of her middle school’s jazz band.\n\nOne day the jazz band was invited to perform at the Summer Festival in Palm Springs. Walking across the stage to the piano, I did what my teacher had advised. Pretend you’re only playing for one person. That way you won’t be so nervous. I glanced at my father, who sat in the front row, leaning his head just so, waiting. Then I closed my eyes, and began to play.\n\nAccording to the text, what does the narrator do as she walks across the stage?',
    options: [
      'She thinks about the differences between playing the piano alone and playing in a band.',
      'She feels excitement about playing in a music festival for the first time.',
      'She remembers how hard she has practiced for the performance.',
      'She follows her teacher’s advice about managing her nervousness.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer because it presents a statement about what the narrator is doing that is directly supported by the text. According to the text, as the narrator walks across the stage to her piano, she recalls her teacher’s advice to pretend that she is playing for only one person to help manage performance nerves.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'baef99a5',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is adapted from Oscar Wilde’s 1891 novel The Picture of Dorian Gray. Dorian Gray is taking his first look at a portrait that Hallward has painted of him.\n\nDorian passed listlessly in front of his picture and turned towards it. When he saw it he drew back, and his cheeks flushed for a moment with pleasure. A look of joy came into his eyes, as if he had recognized himself for the first time. He stood there motionless and in wonder, dimly conscious that Hallward was speaking to him, but not catching the meaning of his words. The sense of his own beauty came on him like a revelation. He had never felt it before.\n\nAccording to the text, what is true about Dorian?',
    options: [
      'He wants to know Hallward’s opinion of the portrait.',
      'He is delighted by what he sees in the portrait.',
      'He prefers portraits to other types of paintings.',
      'He is uncertain of Hallward’s talent as an artist.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer because it presents a statement about Dorian that is directly supported by the text. The narrator of the text says that when Dorian sees his portrait, "his cheeks flushed for a moment with pleasure" and "a look of joy came into his eyes," indicating he is thoroughly delighted with the portrait.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-rw-inf-001',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central ideas and claims',
    difficulty: 'beginner',
    questionText: 'Paleontologists analyzing dinosaur fossils discovered microstructures in Tyrannosaurus bone samples matching collagen fibers in modern birds. This biochemical link provides strong physical evidence supporting which hypothesis?',
    options: [
      'Tyrannosaurus fossils underwent mineral crystallization after burial.',
      'Theropod dinosaurs share a direct evolutionary lineage with modern avian species.',
      'Avian collagen fibers decompose significantly slower than mammalian tissue.',
      'Dinosaur body temperature was identical to modern reptilian ectotherms.'
    ],
    correctAnswer: 1,
    explanation: 'The passage directly connects molecular structural preservation in Tyrannosaurus with avian biology, reinforcing the evolutionary relationship between theropods and birds.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a scientific passage'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-rw-inf-002',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Command of evidence (textual & quantitative)',
    difficulty: 'intermediate',
    questionText: 'Ecologists observed that acacia trees produce sweet nectar in hollow thorns only when colonized by protective stinging ants. When ants were experimentally excluded, trees produced 85% less nectar within two weeks. This finding most strongly indicates that:',
    options: [
      'Nectar production is an energetically expensive mutualistic response triggered by symbiotic partners.',
      'Acacia trees rely primarily on wind pollination rather than insect mutualism.',
      'Ant colonies depend exclusively on tree nectar for survival in arid environments.',
      'Herbivores consume acacia leaves only during periods of low nectar production.'
    ],
    correctAnswer: 0,
    explanation: 'The significant decline in nectar synthesis following ant removal demonstrates that the tree dynamically modulates its physiological resource investment in response to the presence of its protective symbiotic partner.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'An answer choice is valid only if it directly substantiates the specific claim'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-rw-inf-003',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Inferences and logical completion',
    difficulty: 'expert',
    questionText: 'Astronomers previously assumed exoplanet TOI-700d was completely dry due to stellar flare activity. However, new spectroscopic measurements detected stable atmospheric methane alongside water vapor signatures in ratios that would be rapidly destroyed by photochemical reactions unless continuously replenished. This evidence logically suggests that TOI-700d:',
    options: [
      'Lacks any planetary magnetic field sufficient to deflect coronal mass ejections.',
      'Harbors active geological or biological processes that continuously generate volatile gases.',
      'Orbits too far outside its parent star\'s habitable zone to sustain surface water.',
      'Formed from a debris disk entirely devoid of hydrogen compounds.'
    ],
    correctAnswer: 1,
    explanation: 'If unstable atmospheric gases are detected in equilibrium despite rapid photochemical degradation, there must exist an active internal replenishment mechanism (such as volcanism or biological activity).',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When completing a sentence at the end of a passage, the correct option must act as the natural deduction'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },

  // ==========================================
  // READING & WRITING — CRAFT & STRUCTURE
  // ==========================================
  {
    id: 'sat-rw-crf-001',
    section: 'reading-writing',
    domain: 'craft-structure',
    skill: 'Words in context',
    difficulty: 'beginner',
    questionText: 'While the initial architectural designs appeared extravagantly ornate, the engineers insisted that every flying buttress served an entirely _______ structural necessity.',
    options: ['decorative', 'utilitarian', 'fleeting', 'ambiguous'],
    correctAnswer: 1,
    explanation: 'The sentence sets up a contrast between "extravagantly ornate" and the actual structural purpose. "Utilitarian" (functional and practical) provides the exact contrast to decorative ornament.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 34,
      highlightedText: 'Always mask the target word with a blank before looking at options'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-rw-crf-002',
    section: 'reading-writing',
    domain: 'craft-structure',
    skill: 'Words in context (nuanced)',
    difficulty: 'intermediate',
    questionText: 'The lead climatologist was careful to _______ her conclusions, noting that while the preliminary data showed rapid glacial retreat, multi-decade atmospheric anomalies required further calibration before establishing definitive causality.',
    options: ['qualify', 'fabricate', 'repudiate', 'disseminate'],
    correctAnswer: 0,
    explanation: 'To "qualify" a statement means to make it less absolute or add reservations. The climatologist moderated her assertions due to needed calibration.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 34,
      highlightedText: 'common words frequently carry nuanced, domain-specific definitions'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-rw-crf-003',
    section: 'reading-writing',
    domain: 'craft-structure',
    skill: 'Cross-text connections and author perspective',
    difficulty: 'expert',
    questionText: 'Text 1 argues that algorithmic recommendation engines create echo chambers that inevitably restrict intellectual curiosity. Text 2 contends that personalized algorithms actually expose users to niche subcultures they would never otherwise discover in mainstream media.\nBased on the texts, how would the author of Text 2 most likely view the argument in Text 1?',
    options: [
      'As an overly pessimistic view that overlooks serendipitous discovery within specialized communities.',
      'As an accurate assessment that validates strict government censorship of algorithms.',
      'As an empirical proof that search engines should completely abolish personal profiles.',
      'As a misunderstanding of how neural networks process natural language.'
    ],
    correctAnswer: 0,
    explanation: 'Author 2 sees algorithmic personalization as a positive conduit for niche subcultural discovery, and would thus regard Author 1\'s uniform view of echo chambers as excessively negative and incomplete.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 34,
      highlightedText: 'note whether Author 2 extends, refutes, or qualifies Author 1'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },

  // ==========================================
  // READING & WRITING — EXPRESSION OF IDEAS
  // ==========================================
  {
    id: 'sat-rw-exp-001',
    section: 'reading-writing',
    domain: 'expression-of-ideas',
    skill: 'Transitions and discourse markers',
    difficulty: 'beginner',
    questionText: 'Solar panels generate clean, renewable electricity during peak daylight hours. _______, storage systems such as lithium-ion batteries are necessary to ensure uninterrupted power during cloudy periods and nighttime.',
    options: ['Consequently', 'Similarly', 'For instance', 'In contrast'],
    correctAnswer: 0,
    explanation: '"Consequently" establishes the cause-and-effect link: because solar energy generation fluctuates with daylight, energy storage solutions are a direct required result.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 52,
      highlightedText: 'cause-and-effect (consequently, thus)'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-rw-exp-002',
    section: 'reading-writing',
    domain: 'expression-of-ideas',
    skill: 'Rhetorical synthesis',
    difficulty: 'intermediate',
    questionText: 'While researching a topic, a student took the following notes:\n- The Great Green Wall is an African Union initiative to combat desertification across the Sahel.\n- Launched in 2007, it spans 8,000 kilometers from Senegal to Djibouti.\n- The project integrates drought-resistant acacia trees and community farming.\n- By 2023, it had restored over 20 million hectares of degraded land.\nThe student wants to emphasize the geographic scope of the project. Which choice most effectively uses relevant information from the notes?',
    options: [
      'Spanning 8,000 kilometers across the Sahel from Senegal to Djibouti, the Great Green Wall represents an immense landscape restoration initiative.',
      'Launched in 2007, the Great Green Wall integrates community farming and drought-resistant acacia trees.',
      'By restoring 20 million hectares of degraded land, the initiative effectively combats desertification.',
      'The Great Green Wall was created by the African Union to empower local farming communities.'
    ],
    correctAnswer: 0,
    explanation: 'The prompt explicitly requests emphasizing "geographic scope". Only choice A highlights the 8,000 km span across the Sahel from Senegal to Djibouti.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 52,
      highlightedText: 'Read the specific goal prompt before the bulleted notes'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-rw-exp-003',
    section: 'reading-writing',
    domain: 'expression-of-ideas',
    skill: 'Advanced transition selection',
    difficulty: 'expert',
    questionText: 'Many 19th-century geologists maintained that mountain ranges formed exclusively through uniform global cooling and contraction. _______, Alfred Wegener proposed in 1912 that horizontal continental drift drove orogeny, fundamentally challenging the static model of Earth\'s crust.',
    options: ['Furthermore', 'Conversely', 'Namely', 'Accordingly'],
    correctAnswer: 1,
    explanation: '"Conversely" signals the sharp conceptual divergence between the prevailing static cooling model and Wegener\'s radical horizontal drift theory.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 52,
      highlightedText: 'Transitions create specific logical relationships: addition'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },

  // ==========================================
  // READING & WRITING — STANDARD ENGLISH CONVENTIONS
  // ==========================================
  {
    id: 'sat-rw-sec-001',
    section: 'reading-writing',
    domain: 'standard-english-conventions',
    skill: 'Boundaries and semicolons',
    difficulty: 'beginner',
    questionText: 'Microscopic phytoplankton produce over half of Earth\'s atmospheric _______ they absorb immense quantities of carbon dioxide through marine photosynthesis.',
    options: [
      'oxygen, additionally,',
      'oxygen; furthermore,',
      'oxygen, furthermore',
      'oxygen furthermore'
    ],
    correctAnswer: 1,
    explanation: 'Two independent clauses cannot be joined by a comma splice. A semicolon followed by a transition word and comma ("; furthermore,") properly separates and connects the clauses.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 76,
      highlightedText: 'A semicolon must be flanked by independent clauses on both sides'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-rw-sec-002',
    section: 'reading-writing',
    domain: 'standard-english-conventions',
    skill: 'Subject-verb agreement with intervening phrases',
    difficulty: 'intermediate',
    questionText: 'The discovery of hydrothermal vent ecosystems near the Galápagos Rift, which thrive without sunlight through chemosynthesis, _______ biologists to revise long-held assumptions about where life can originate.',
    options: ['has forced', 'have forced', 'are forcing', 'were forcing'],
    correctAnswer: 0,
    explanation: 'The head noun of the subject is the singular noun "discovery" (not "ecosystems" or "vents"). Therefore, the singular verb "has forced" is required.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 76,
      highlightedText: 'Standard English Conventions enforce grammatical boundaries, subject-verb agreement'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'sat-rw-sec-003',
    section: 'reading-writing',
    domain: 'standard-english-conventions',
    skill: 'Dangling and misplaced modifiers',
    difficulty: 'expert',
    questionText: 'Analyzing deep ice cores extracted from the Antarctic ice sheet, _______.',
    options: [
      'atmospheric carbon dioxide concentrations from the past 800,000 years were reconstructed by climatologists',
      'climatologists reconstructed atmospheric carbon dioxide concentrations from the past 800,000 years',
      'past atmospheric carbon dioxide was reconstructed over 800,000 years by scientists',
      'reconstruction of past atmospheric carbon dioxide was achieved across 800,000 years'
    ],
    correctAnswer: 1,
    explanation: 'The introductory modifier "Analyzing deep ice cores..." must logically modify the actor who performed the analysis ("climatologists"). In options A, C, and D, the modifier dangles incorrectly over "concentrations" or "reconstruction".',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 76,
      highlightedText: 'An introductory participial phrase (e.g., "Walking through the forest, ...") must be immediately followed by the noun that logically performs the action'
    },
    createdAt: '2026-08-13T00:00:00Z',
    createdBy: 'system'
  }
];
