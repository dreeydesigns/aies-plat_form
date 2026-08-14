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
  // READING & WRITING — INFORMATION & IDEAS (41 CENTRAL IDEAS & DETAILS)
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
    id: '78b265b2',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'In 2014, Amelia Quon and her team at NASA set out to build a helicopter capable of flying on Mars. Because Mars’s atmosphere is only one percent as dense as Earth’s, the air of Mars would not provide enough resistance to the rotating blades of a standard helicopter for the aircraft to stay aloft. For five years, Quon’s team tested designs in a lab that mimicked Mars’s atmospheric conditions. The craft the team ultimately designed can fly on Mars because its blades are longer and rotate faster than those of a helicopter of the same size built for Earth.\n\nAccording to the text, why would a helicopter built for Earth be unable to fly on Mars?',
    options: [
      'Because Mars and Earth have different atmospheric conditions',
      'Because the blades of helicopters built for Earth are too large to work on Mars',
      'Because the gravity of Mars is much weaker than the gravity of Earth',
      'Because helicopters built for Earth are too small to handle the conditions on Mars'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer because it presents an explanation about a helicopter that is directly supported by the text. The text states that Mars’s atmosphere is much less dense than Earth’s, and as a result, the air on Mars doesn’t provide the resistance required to support the blades of a helicopter built for Earth and to keep the helicopter aloft.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a scientific passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '487a05f8',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is adapted from Sylvia Acevedo’s 2018 memoir Path to the Stars: My Journey from Girl Scout to Rocket Scientist. The narrator is traveling by car with her family to Mexico City. Mario and Laura are her brother and sister.\n\nMario and I played games to see how many different license plates we could spot, and Laura liked to look for children in the back seats of the cars we passed. We were used to the forty-five-minute drive to El Paso and familiar with the six-hour ride to Chihuahua, but I wondered what the long journey to Mexico City would be like.\n\nAccording to the text, what did the narrator and Mario do while riding in the car?',
    options: [
      'They read books.',
      'They sang songs.',
      'They went to sleep.',
      'They played games.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer because it most accurately describes what the narrator and Mario did while riding in the car. The text states that during the car ride, the narrator and Mario "played games" to see how many different license plates they could spot.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a biographical passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '40630cef',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is from David Barclay Moore’s 2022 novel Holler of the Fireflies. The narrator has just arrived at summer camp, which is far away from his home.\n\nThis place was different than I thought it would be. I’d never been somewhere like this before. I did feel scared, but also excited.\n\nAccording to the text, how does the narrator feel about being at summer camp?',
    options: [
      'He feels overjoyed.',
      'He feels peaceful.',
      'He feels both scared and excited.',
      'He feels both angry and jealous.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer because it most accurately states how the narrator feels about being at summer camp. In the text, the narrator states that after arriving at the camp, he found it to be different than he’d expected and that as a result, he felt "scared, but also excited."',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '14189fbb',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Having written the impassioned call to arms “Letter to the Spanish Americans” in 1791, Peruvian intellectual Juan Pablo Viscardo y Guzmán is often considered a forerunner for the independence movements in Latin America. But Viscardo’s role in history would have remained insignificant were it not for Venezuelan revolutionary Francisco de Miranda, who was handed the unpublished letter after Viscardo’s death. Miranda not only helped circulate the letter, but his edits and footnotes to the text position Miranda as a central figure in the text’s creation.\n\nWhich choice best states the main idea of the text?',
    options: [
      'The original authorship of “Letter to the Spanish Americans” is disputed by contemporary historians.',
      'The majority of the most eloquently stated arguments in “Letter to the Spanish Americans” were written by Miranda.',
      'Miranda played a crucial role in influencing the content and distribution of “Letter to the Spanish Americans.”',
      '“Letter to the Spanish Americans” persuaded many people in Latin America to pursue national independence.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The text describes how Miranda circulated, edited, and added footnotes to “Letter to the Spanish Americans,” and it claims that the letter and its author would have “remained insignificant” if it weren’t for Miranda’s efforts.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When evaluating historical and analytical texts'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'b168ce48',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The average age at which people in the United States start businesses is 35. Economist Andrés Hincapié studied why young adults are relatively less likely to start businesses and whether there are ways to increase entrepreneurship in early adulthood. Hincapié found that one impediment is lack of knowledge about the practical details of how businesses are started; he further found that simply providing young adults with good informational resources on the topic significantly alleviates this problem.\n\nBased on the text, what would Hincapié most likely say is a promising way to increase entrepreneurship in early adulthood?',
    options: [
      'Creating social networks of young adults who are interested in starting a business',
      'Encouraging young adults to brainstorm business ideas',
      'Providing young adults with practical information about how to start a business',
      'Giving young adults training opportunities at a variety of businesses'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer because it presents a conclusion about increasing entrepreneurship in early adulthood that can be reasonably inferred from the text. The text explains that Hincapié found lack of practical business knowledge to be an impediment and that providing relevant informational resources helps solve the problem.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When evaluating economic and social science research'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '2592e0de',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Bicycles were first mass-produced in the late nineteenth century throughout Europe and North America, allowing individuals remarkable freedom to travel longer distances quickly and comfortably. This freedom, coupled with the affordability of the vehicle, made the bicycle immensely popular. Individuals were able to live farther from their workplaces, easily visit neighboring towns, and participate in new leisure and sport activities. Bicycling quickly became a popular social endeavor, with enthusiasts forming local cycling clubs to enjoy these newfound activities with others.\n\nWhich choice best states the main idea of the text?',
    options: [
      'The widespread adoption of the bicycle in the late nineteenth century provided new opportunities for people.',
      'The affordability of the bicycle in the late nineteenth century made it the preferred way to travel.',
      'The popularity of the bicycle in the late nineteenth century gave rise to the first cycling clubs.',
      'The mass production of the bicycle in the late nineteenth century made it safer for people to use.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text discusses how the mass production of bicycles in the late nineteenth century allowed people to travel longer distances, live farther from workplaces, visit neighboring towns, and participate in new activities and clubs, providing many new opportunities.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of an informational text'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '69d662af',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is adapted from Ann Petry’s 1946 novel The Street. Lutie lives in an apartment in Harlem, New York.\n\nThe glow from the sunset was making the street radiant. The street is nice in this light, [Lutie] thought. It was swarming with children who were playing ball and darting back and forth across the sidewalk in complicated games of tag. Girls were skipping double dutch rope, going tirelessly through the exact center of a pair of ropes, jumping first on one foot and then the other.\n\nWhich choice best describes what is happening in the text?',
    options: [
      'Lutie is observing the appearance of the street at a particular time of day and the events occurring on it.',
      'Lutie is annoyed by the noise of children playing games on her street.',
      'Lutie is puzzled by the rules of certain children’s games.',
      'Lutie is spending time alone in her apartment because she doesn’t want to interact with her neighbors.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer because it most accurately states what is happening in the text. The narrator notes that Lutie observes the street in the light of the sunset and watches children playing ball, tag, and skipping rope.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '89961e26',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Artist Justin Favela explained that he wanted to reclaim the importance of the piñata as a symbol in Latinx culture. To do so, he created numerous sculptures from strips of tissue paper, which is similar to the material used to create piñatas. In 2017, Favela created an impressive life-size piñata-like sculpture of the Gypsy Rose lowrider car, which was displayed at the Petersen Automotive Museum in Los Angeles, California. The Gypsy Rose lowrider was famously driven by Jesse Valadez, an early president of the Los Angeles Imperials Car Club.\n\nAccording to the text, which piece of Favela’s art was on display in the Petersen Automotive Museum in 2017?',
    options: [
      'A painting of Los Angeles',
      'A sculpture of a lowrider car',
      'A painting of a piñata',
      'A sculpture of Jesse Valadez'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text describes how Favela created a life-size piñata-like sculpture of the Gypsy Rose lowrider car, which was displayed at the Petersen Automotive Museum in 2017.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a biographical passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'b633cc4f',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Few animals are known to spit: among them are humans, cobras, and camels. But in January 2022 at a nature preserve in southern England, bird-watcher Clare Jacobs observed a gray seal spitting a jet of water at a white-tailed eagle flying overhead. Seals had never been seen spitting before. Biologist Sean Twiss, who studies gray seals, believes that the seal may have been attempting to scare the eagle away from a food source or that the seal may have just been playing.\n\nWhich choice best states the main topic of the text?',
    options: [
      'Bird-watching in southern England',
      'A previously unseen behavior of gray seals',
      'How white-tailed eagles defend their territory against other predators',
      'Differences between gray seals and white-tailed eagles'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer because it most accurately states the main topic. The text focuses on the observation that a gray seal spit a jet of water at an eagle, explicitly noting that seals had never been seen spitting before.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a scientific passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '04bcb7a9',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Xin Wang and colleagues have discovered the earliest known example of a flower bud in a 164-million-year-old plant fossil in China. The researchers have named the new species Florigerminis jurassica. They believe that the discovery pushes the emergence of flowering plants, or angiosperms, back to the Jurassic period, which occurred between 145 million and 201 million years ago.\n\nAccording to the text, how old was the fossil that Wang and colleagues discovered?',
    options: [
      '150 million years old',
      '145 million years old',
      '164 million years old',
      '201 million years old'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer because it gives the exact age for the fossil discovered by Wang and colleagues that is directly supported by the text: "a 164-million-year-old plant fossil in China."',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a scientific passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'c889e52e',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'In 1935 Hallie Flanagan was chosen to lead the Federal Theatre Project (FTP). This project was part of the new Works Progress Administration (WPA), a program created by President Franklin D. Roosevelt to provide jobs for unemployed people during the Great Depression. As the director of the FTP, Flanagan created jobs for over 12,500 performers, designers, and other theater professionals across the country. She also kept ticket prices low for the shows they staged, which meant that many people could afford to experience theater for the first time.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Jobs provided by the FTP were intended mainly for performers, designers, and other theater professionals.',
      'President Roosevelt created the WPA to provide jobs for unemployed people.',
      'During the Great Depression, many people couldn’t afford to buy theater tickets.',
      'As the director of the FTP, Flanagan succeeded in creating many jobs and introducing people to theater.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer because it most accurately states the main idea of the text. The text highlights that Flanagan created over 12,500 jobs and kept ticket prices low so many people could experience theater for the first time.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When evaluating historical and biographical passages'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'de0a5b4e',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'In 2022, researchers rediscovered ancient indigenous glyphs, or drawings, on the walls of a cave in Alabama. The cave’s ceiling was only a few feet high, affording no position from which the glyphs, being as wide as ten feet, could be viewed or photographed in their entirety. However, the researchers used a technique called photogrammetry to assemble numerous photos of the walls into a 3D model. They then worked with representatives of tribes originally from the region, including the Chickasaw Nation, to understand the significance of the animal and humanoid figures adorning the cave.\n\nAccording to the text, what challenge did the researchers have to overcome to examine the glyphs?',
    options: [
      'The cave was so remote that the researchers couldn’t easily reach it.',
      'Some of the glyphs were so faint that they couldn’t be photographed.',
      'The researchers were unable to create a 3D model of the cave.',
      'The cave’s dimensions prevented the researchers from fully viewing the glyphs.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text explains that the cave\'s ceiling was only a few feet high, making it impossible from any single position to view or photograph the ten-foot-wide glyphs in their entirety.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of an archaeological passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '2287b040',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'In the 1960s, Chavela Vargas became an unlikely star in ranchera, a style of traditional Mexican music. Most ranchera singers had clear, polished voices and performed with a full band. But Vargas accompanied her raspy voice with just her guitar. Dressed in men’s trousers and a poncho, she would perform classic songs that had been written from a male point of view and were usually sung by men. She also altered those songs by performing them much more slowly than other ranchera singers did. The slower tempo allowed her to express the emotional quality of the lyrics more fully.\n\nAccording to the text, what is one way that Vargas differed from other ranchera singers?',
    options: [
      'She possessed a voice that was clear and polished.',
      'She avoided singing songs written from a male point of view.',
      'She disliked performing classic songs.',
      'She altered classic songs by slowing them down.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer because the text states that Vargas "altered those songs by performing them much more slowly than other ranchera singers did," allowing her to express emotional nuance.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a cultural arts passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '6675c5c3',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is from Shyam Selvadurai’s 1994 novel Funny Boy. The seven-year-old narrator lives with his family in Sri Lanka. Radha Aunty is the narrator’s aunt.\n\nRadha Aunty, who was the youngest in my father’s family, had left for America four years ago when I was three, and I could not remember what she looked like. I went into the corridor to look at the family photographs that were hung there. But all the pictures were old ones, taken when Radha Aunty was a baby or young girl. Try as I might, I couldn’t get an idea of what she looked like now. My imagination, however, was quick to fill in this void.\n\nAccording to the text, why does the narrator consult some family photographs?',
    options: [
      'He wants to use the photographs as inspiration for a story he is writing.',
      'He is curious about how his father dressed a long time ago.',
      'He hopes the photographs will help him recall what his aunt looked like.',
      'He wants to remind his aunt of an event that is shown in an old photograph.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The text states that the narrator could not remember what Radha Aunty looked like, so he went into the corridor to look at family photographs to try to recall her appearance.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '0fd96039',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'It has long been thought that the original author of the US Pledge of Allegiance was Francis Bellamy, who said that he wrote the pledge one evening in August of 1892. But a historian recently discovered a newspaper article that was published several months before August 1892. The article describes students reciting the same pledge that Bellamy claims he first wrote in August. This means that Bellamy may not have created the pledge after all.\n\nBased on the text, what piece of knowledge about the Pledge of Allegiance has recently become uncertain?',
    options: [
      'How many changes were made to the pledge in the 1900s',
      'The identity of the person who first wrote the pledge',
      'The name of the newspaper that first published the pledge',
      'Which part of the pledge students liked best in 1892'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text explains that the discovery of a newspaper article mentioning students reciting the pledge prior to August 1892 calls into question whether Francis Bellamy was its original creator, making the identity of its first author uncertain.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When evaluating historical and analytical texts'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '2edd7ffe',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Archaeologist Veronica Waweru visited the Lewa Wildlife Conservancy in Kenya. While exploring there, Waweru noticed many rows of shallow pits carved into stone. Waweru believed the pits could have been used as game boards to play ancient versions of mancala, a two-person strategy game that is still popular today. Some of the more recent pits were carved on top of older pits. This led Waweru to think that the game was played at the site for a long time.\n\nAccording to the text, why does Waweru think that mancala was played at the site for a long time?',
    options: [
      'Some of the newer pits were carved on top of the older pits.',
      'She noticed many rows of shallow pits carved into stone.',
      'She discovered the pits at the Lewa Wildlife Conservancy.',
      'Some of the pits were shallow and others were quite deep.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text explains that newer pits were carved directly on top of older pits, indicating that generations of people used the site for mancala over an extended period.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of an archaeological passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '0b696a0c',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'NASA’s Cassini probe has detected an unusual wobble in the rotation of Mimas, Saturn’s smallest moon. Using a computer model to study Mimas’s gravitational interactions with Saturn and tidal forces, geophysicist Alyssa Rhoden and colleagues have proposed that this wobble could be due to a liquid ocean moving beneath the moon’s icy surface. The researchers believe other moons should be examined to see if they too might have oceans hidden beneath their surfaces.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Rhoden and colleagues were the first to confirm that several of Saturn’s moons contain hidden oceans.',
      'Research has failed to identify signs that there is an ocean hidden beneath the surface of Mimas.',
      'Rhoden and colleagues created a new computer model that identifies moons with hidden oceans without needing to analyze the moons’ rotation.',
      'Research has revealed that an oddity in the rotation of Mimas could be explained by an ocean hidden beneath its surface.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text describes how an unusual wobble in Mimas\'s rotation could be explained by an ocean moving beneath its icy crust.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of an astronomical passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '3a1f02b0',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is adapted from Frances Hodgson Burnett’s 1911 novel The Secret Garden. Mary, a young girl, recently found an overgrown hidden garden.\n\nMary was an odd, determined little person, and now she had something interesting to be determined about, she was very much absorbed, indeed. She worked and dug and pulled up weeds steadily, only becoming more pleased with her work every hour instead of tiring of it. It seemed to her like a fascinating sort of play.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Mary hides in the garden to avoid doing her chores.',
      'Mary is getting bored with pulling up so many weeds in the garden.',
      'Mary is clearing out the garden to create a space to play.',
      'Mary feels very satisfied when she’s taking care of the garden.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer because the text describes Mary being "very much absorbed" and "only becoming more pleased with her work every hour" while tending the garden, viewing it as fascinating play.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '23a7038f',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Shimmering is a collective defense behavior that researchers have observed in giant honeybee colonies. When shimmering, different groups of bees flip their bodies up and down in what looks like waves. This defense is initiated when hornets hover near a colony, serving to deter the hornets from approaching the bees. Researchers hypothesize that this behavior is a specialized defense response to hornets, as it is not observed when other, larger predators approach the colony.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Researchers are unsure how giant honeybees defend against predators larger than hornets.',
      'Researchers think that shimmering in giant honeybees is a specific defense against hornets.',
      'Hornets are known to be the main predator of giant honeybees.',
      'Several different species of insects use shimmering to defend against hornets.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text states that shimmering is initiated when hornets hover near the colony and hypothesizes that this behavior is a specialized defense response specific to hornets.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a biological passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '7921b86b',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Oluwaseyi Moejoh cofounded U-recycle Initiative Africa when she was only a teenager. Moejoh and her team founded the organization to teach young people how their actions affect the environment and why recycling is important. For example, the organization put on an exhibit of art made using recycled materials.\n\nAccording to the text, what is one reason Moejoh and others founded U-recycle Initiative Africa?',
    options: [
      'To bring attention to overlooked African artists',
      'To teach young people why recycling is important',
      'To help adults gain important outdoor skills',
      'To give teenagers advice about starting businesses'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text explicitly states that Moejoh and her team founded the organization to "teach young people how their actions affect the environment and why recycling is important."',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of an environmental passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'bbfa2bb6',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Hevea brasiliensis, a tree in the Amazon rainforest, is the world’s main source of natural rubber. The tree produces a milky substance called latex that is used to make rubber. The bark of Hevea brasiliensis is helpful for the process of making rubber because it has a unique structure that makes it easy to collect latex. A network of tubes in the tree’s inner bark helps the latex to flow out easily when people make small cuts into the bark.\n\nWhat feature of Hevea brasiliensis does the text say is helpful for the process of making rubber?',
    options: [
      'Its latex produces rubber of an especially high quality.',
      'Its bark has a unique structure that makes it easy to collect latex.',
      'It is able to grow in a wide variety of climates around the world.',
      'It is one of only two trees in the Amazon that produce latex.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer because the text states that the bark of Hevea brasiliensis "has a unique structure that makes it easy to collect latex" due to a network of inner tubes.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining key details in a scientific passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '706046f7',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'In the 1960s, Gloria Richardson led a movement to promote racial equality. Her involvement in this effort was inspired by her daughter, Donna Richardson. In 1961, Donna joined protests organized by the Student Nonviolent Coordinating Committee in Cambridge, Maryland. Following her daughter, Gloria joined these protests too. Gloria soon became the cochair of the Cambridge Nonviolent Action Committee. She was also the leader of what became known as the Cambridge movement.\n\nAccording to the text, what did Gloria Richardson lead?',
    options: [
      'The Cambridge movement',
      'Her daughter Donna’s high school',
      'Protests to support environmental protections',
      'A new business in Cambridge, Maryland'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text directly states that Gloria Richardson "was also the leader of what became known as the Cambridge movement."',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When evaluating historical and civil rights texts'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'dc5edbf6',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Microplastics are pieces of plastic that are smaller than a grain of rice. These small plastics can be found in large quantities in ocean waters. Ecologist Jessica Reichert and her team are studying the role reef-building corals have in capturing microplastics from ocean waters. Through research, her team has found that these corals may be storing up to 20 million kilograms of microplastics each year in their skeletons and tissues.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Ecologists are interested in learning more about how certain corals build large reefs.',
      'Questions remain around the impact certain corals have on ocean ecosystems.',
      'Microplastics are small pieces of plastic that can be found in ocean waters.',
      'Ecologists predict that corals store large amounts of microplastics from ocean waters.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer because the passage focuses on research demonstrating that reef-building corals store substantial quantities (up to 20 million kg annually) of ocean microplastics in their skeletons and tissues.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When evaluating scientific studies and ecology'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'd8758c3b',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Psychologists wanted to test how young children think about rewards and fairness. In an experiment, two teachers handed out rewards while children (ages four to six) watched. The teachers gave out the same number of rewards, but one of them counted the rewards out loud. The children were then asked who was fairer. 73% chose the teacher who counted. The psychologists think that counting showed the children that the teacher wanted to be fair. The children may have believed that the teacher who did not count did not care about fairness.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Psychologists think children cannot understand the concept of fairness until they are six years old.',
      'An experiment found that counting out loud is the best way to teach mathematical concepts to children.',
      'Psychologists think young children expect to be rewarded when the children show that they care about fairness.',
      'An experiment showed that the way rewards are given out may affect whether young children think the situation is fair.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text describes an experiment demonstrating that counting rewards aloud significantly influenced whether young children perceived the distribution as fair.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a psychological study'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '0e3b4967',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Scrapbooks of saved fabric pieces were commonly kept by women in the nineteenth-century United States, but few are as meticulously detailed as Hannah Ditzler Alspaugh’s work. Alongside each piece of fabric, Alspaugh recorded intimate memories, such as dressmaking with her sister. Additionally, she listed the prices and how she used the fabric. Historians note that by representing fifty years of changing textures, patterns, and dress styles, the scrapbook is a record of nineteenth-century textiles and dressmaking as well as Alspaugh’s life.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Alspaugh inspired other women to save pieces of fabric in scrapbooks and provide historical records of nineteenth-century fashions in the United States.',
      'Historians rely on fabric scrapbooks to understand how fashions changed throughout the nineteenth-century United States.',
      'Fabric scrapbooks were a popular hobby for many women in the nineteenth-century United States.',
      'Alspaugh’s scrapbook provides a detailed account of her life and historical record of fashion trends in the nineteenth-century United States.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer because the text highlights how Hannah Ditzler Alspaugh\'s meticulously documented scrapbook serves as both an intimate personal record and a fifty-year historical chronicle of 19th-century American textiles and dressmaking.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When evaluating historical and cultural passages'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'ee41d7e0',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'Arthropods—brine shrimp, hawk moths, and many other invertebrate animals—have a nervous system made up of a brain, nerve cord, and other nerves. Researchers have gained insights about this system in ancient arthropods from traces found in various fossils. For example, in a study of two fossils of the extinct arthropod species Mollisonia symmetrica, Javier Ortega-Hernández, James Weaver, and team observed clear signs of a nerve cord. They also saw possible indications of a synganglion, a brain-like mass of nerves. Researchers hope to identify more features of the nervous systems of prehistoric arthropods as additional fossils are found.\n\nWhich choice best states the main idea of the text?',
    options: [
      'There are several similarities between the brains of hawk moths and the brains of brine shrimp.',
      'Fossil evidence can contribute to the understanding of the nervous system in ancient arthropods.',
      'Newly discovered fossils suggest that ancient hawk moths and ancient brine shrimp had spines.',
      'Researchers need to focus on finding more fossils of ancient arthropods.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text describes how fossil traces (such as nerve cords and synganglia in Mollisonia symmetrica) provide crucial insights into the nervous systems of ancient arthropods.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a paleontological passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '41d5c33e',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is from Beatrice Harraden’s 1894 novel Ships that Pass in the Night.\n\nIn an old second-hand bookshop in London, an old man sat reading Gibbon’s History of Rome. He did not put down his book when the postman brought him a letter. He just glanced indifferently at the letter, and impatiently at the postman. Zerviah Holme did not like to be interrupted when he was reading Gibbon; and as he was always reading Gibbon, an interruption was always regarded by him as an insult.\n\nBased on the text, how did Zerviah Holme most likely feel when the letter was delivered?',
    options: [
      'He felt relieved because he had been expecting an important letter.',
      'He felt excited because the letter was from a good friend.',
      'He felt sad because the postman did not stop to talk with him before leaving.',
      'He felt annoyed because he was interrupted while reading his favorite author.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text states that Holme "did not like to be interrupted when he was reading Gibbon" and regarded interruptions as "an insult," glancing impatiently at the postman.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining character emotions in a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'f2208f98',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'When Kenyan writer Ngũgĩ wa Thiong’o, who had previously published four novels in English, began writing in his native language, Gĩkũyũ, in the 1970s, several fellow writers and critics cautioned that doing so might make his works inaccessible outside his own community. Some noted that Kiswahili—widely spoken in Kenya and elsewhere in Africa—would be a more practical choice. Rejecting their arguments, Ngũgĩ went on to author dozens of acclaimed works in Gĩkũyũ that have been translated into a total of more than thirty languages.\n\nWhich choice best states the main idea of the text?',
    options: [
      'The reaction to Ngũgĩ’s rejection of English illustrates that some literary experts believe that fame is most easily gained by writing in a widely understood language, such as Gĩkũyũ.',
      'Although Ngũgĩ insisted on publishing his first works in Gĩkũyũ, they have since been translated into many other languages.',
      'Although Ngũgĩ’s decision to write in Gĩkũyũ was met with some skepticism, it didn’t prevent him from achieving literary success.',
      'In the 1970s, Ngũgĩ became convinced that literature ought to be written in authors’ native languages, and he proceeded to publish many works in Gĩkũyũ.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The passage explains that despite critics warning that writing in Gĩkũyũ would limit his audience, Ngũgĩ\'s Gĩkũyũ works went on to achieve immense acclaim and were translated into over thirty languages.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of an African literature biography'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '748995b3',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'In the 1700s and 1800s, European composers experimented with volume in their musical works. They did so by increasing the number of musicians playing in the orchestra. For example, in some of his operas, German composer Richard Wagner added more horns, trombones, and tubas to the orchestra. With more instruments playing at the same time, the orchestra could play extremely loudly at key moments in his operas.\n\nAccording to the text, how did Richard Wagner achieve moments of extremely high volume in his operas?',
    options: [
      'By moving the performances of his operas from outdoor stages to indoor ones',
      'By increasing the number of musicians playing horns, trombones, and tubas in the orchestra',
      'By building a concert hall whose shape would cause sounds to echo',
      'By insisting that the singers undergo special training to sing for extended periods of time'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text states that Wagner added more brass instruments (horns, trombones, and tubas) to his orchestra so that more instruments playing simultaneously produced extremely high volume.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When identifying specific factual details in an informational text'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'a842db60',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'To make her art more widely available, graphic artist Elizabeth Catlett turned to linocuts. In linocut printing, an artist carves an image into a sheet of linoleum to create a stamp that is used to mass-produce prints. In the linocut series The Black Woman (1946–1947), Catlett depicts the everyday experiences of Black women alongside the achievements of well-known Black women. This pairing invites the viewer to draw connections among the women. The linocut process enabled Catlett’s work to reach a wide audience and supported her aim to unite Black women through her art.\n\nAccording to the text, what is significant about Catlett’s use of linocut printing?',
    options: [
      'Linocut printing involved using materials that were readily available to Catlett.',
      'Linocut printing helped Catlett use art to connect people, especially Black women.',
      'Catlett became commercially successful once she started using linocut printing.',
      'Catlett was one of the first Black artists to use linocut printing.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text concludes by stating that linocut printing enabled Catlett\'s work to reach a broad audience and supported her objective of uniting Black women through shared art.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When evaluating artistic and cultural movements'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '1e85caa9',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'beginner',
    questionText: 'The following text is from Edith Nesbit’s 1902 novel Five Children and It. Five young siblings have just moved with their parents from London to a house in the countryside that they call the White House.\n\nIt was not really a pretty house at all; it was quite ordinary, and mother thought it was rather inconvenient, and was quite annoyed at there being no shelves, to speak of, and hardly a cupboard in the place. Father used to say that the ironwork on the roof and coping was like an architect’s nightmare. But the house was deep in the country, with no other house in sight, and the children had been in London for two years, without so much as once going to the seaside even for a day by an excursion train, and so the White House seemed to them a sort of Fairy Palace set down in an Earthly Paradise.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Although their parents believe the house has several drawbacks, the children are enchanted by it.',
      'The children don’t like the house nearly as much as their parents do.',
      'Each member of the family admires a different characteristic of the house.',
      'The house is beautiful and well built, but the children miss their old home in London.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text contrasts the parents\' complaints about the inconvenient, flawed house with the children\'s wonder, viewing it as a "Fairy Palace" and "Earthly Paradise."',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 12,
      highlightedText: 'When determining the main idea of a literary passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  // ==========================================
  // READING & WRITING — INFORMATION & IDEAS (52 MEDIUM CENTRAL IDEAS & DETAILS)
  // ==========================================
  {
    id: '87aa7bab',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'A common assumption among art historians is that the invention of photography in the mid-nineteenth century displaced the painted portrait in the public consciousness. The diminishing popularity of the portrait miniature, which coincided with the rise of photography, seems to support this claim. However, photography’s impact on the portrait miniature may be overstated. Although records from art exhibitions in the Netherlands from 1820 to 1892 show a decrease in the number of both full-sized and miniature portraits submitted, this trend was established before the invention of photography.\n\nBased on the text, what can be concluded about the diminishing popularity of the portrait miniature in the nineteenth century?',
    options: [
      'Factors other than the rise of photography may be more directly responsible for the portrait miniature’s decline.',
      'Although portrait miniatures became less common than photographs, they were widely regarded as having more artistic merit.',
      'The popularity of the portrait miniature likely persisted for longer than art historians have assumed.',
      'As demand for portrait miniatures decreased, portrait artists likely shifted their creative focus to photography.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text says that the impact of photography on the portrait miniature might be "overstated," as records show a decrease in portrait miniatures before the invention of photography, implying other factors were responsible.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating historical and art analysis passages'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'd73a908a',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Believing that living in an impractical space can heighten awareness and even improve health, conceptual artists Madeline Gins and Shusaku Arakawa designed an apartment building in Japan to be more fanciful than functional. A kitchen counter is chest-high on one side and knee-high on the other; a ceiling has a door to nowhere. The effect is disorienting but invigorating: after four years there, filmmaker Nobu Yamaoka reported significant health benefits.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Although inhabiting a home surrounded by fanciful features such as those designed by Gins and Arakawa can be rejuvenating, it is unsustainable.',
      'Designing disorienting spaces like those in the Gins and Arakawa building is the most effective way to create a physically stimulating environment.',
      'As a filmmaker, Yamaoka has long supported the designs of conceptual artists such as Gins and Arakawa.',
      'Although impractical, the design of the apartment building by Gins and Arakawa may improve the well-being of the building’s residents.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer because it most accurately states the main idea: conceptual artists Gins and Arakawa designed an impractical, disorienting apartment building that nevertheless produced reported health benefits for its residents.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When determining the main idea of an architecture and design text'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '8c1be131',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'During the World War II era, some Mexican American women adopted a striking new look called pachuca style. They wore altered men’s jackets or zoot suits (wide-legged, long-coated suits) and dramatic makeup, and they combed their hair into high, rounded shapes. Some people criticized pachuca style, saying it was dangerous and women should dress traditionally. But historians see things differently. They see pachuca style as a form of rebellion against the era’s rigid social expectations for women. They say that it showed a desire for self-expression and freedom on the part of women who adopted the style.\n\nAccording to the text, how do historians view pachuca style?',
    options: [
      'They think that pachuca style was such a popular trend that it continues to influence fashion in the United States to the present day.',
      'They think that pachuca style was a way for some Mexican American women to express themselves and resist strict social expectations.',
      'They think that pachuca style was celebrated because it enabled some Mexican American women to show their support for the United States during World War II.',
      'They think that pachuca style was similar to other fashion trends that different groups of women adopted in the same period.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text states that historians view pachuca style as a form of rebellion against rigid social expectations that allowed Mexican American women to express a desire for freedom and self-expression.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing cultural and historical movements'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '92c2564d',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Utah is home to Pando, a colony of about 47,000 quaking aspen trees that all share a single root system. Pando is one of the largest single organisms by mass on Earth, but ecologists are worried that its growth is declining in part because of grazing by animals. The ecologists say that strong fences could prevent deer from eating young trees and help Pando start thriving again.\n\nAccording to the text, why are ecologists worried about Pando?',
    options: [
      'It isn’t growing at the same rate it used to.',
      'It isn’t producing young trees anymore.',
      'It can’t grow into new areas because it is blocked by fences.',
      'Its root system can’t support many more new trees.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text directly states that ecologists are worried that Pando’s growth is declining, partly because animals are grazing on the young trees.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating ecological claims and biological details'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '602b47c7',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Biologists have predicted that birds’ feather structures vary with habitat temperature, but this hadn’t been tested in mountain environments. Ornithologist Sahas Barve studied feathers from 249 songbird species inhabiting different elevations—and thus experiencing different temperatures—in the Himalaya Mountains. He found that feathers of high-elevation species not only have a greater proportion of warming downy sections to flat and smooth sections than do feathers of low-elevation species, but high-elevation species’ feathers also tend to be longer, providing a thicker layer of insulation.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Barve’s investigation shows that some species of Himalayan songbirds have evolved feathers that better regulate body temperature than do the feathers of other species, contradicting previous predictions.',
      'Barve found an association between habitat temperature and feather structure among Himalayan songbirds, lending new support to a general prediction.',
      'Barve discovered that songbirds have adapted to their environment by growing feathers without flat and smooth sections, complicating an earlier hypothesis.',
      'The results of Barve’s study suggest that the ability of birds to withstand cold temperatures is determined more strongly by feather length than feather structure, challenging an established belief.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text describes how Barve found an association between elevation/temperature and feather downiness/length among Himalayan songbirds, supporting the general prediction that feather structure varies with temperature.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When determining the main idea of an ornithology and ecology study'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '2312021b',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'In a study by Mika R. Moran, Daniel A. Rodriguez, and colleagues, residents of Quito, Ecuador, and Lima, Peru, were surveyed about parks in their cities. Of the 618 respondents from Quito, 82.9% indicated that they use the city’s parks, and of the 663 respondents from Lima, 72.7% indicated using city parks. Given that the percentage of Quito respondents who reported living within a 10-minute walk of a park was much lower than that reported by Lima respondents, greater proximity alone can’t explain the difference in park use.\n\nThe text makes which point about the difference between the proportions of Quito residents and Lima residents using parks?',
    options: [
      'It was much larger than the researchers conducting the study expected.',
      'It is caused by something other than the parks’ proximity to city residents.',
      'It could be due to inaccuracies in the survey results.',
      'It was calculated using sources that predate the survey.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text concludes that because Quito residents use parks at a higher rate despite living farther away, greater proximity cannot explain the difference, meaning other factors must be responsible.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating sociological and urban research findings'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '11c68ded',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'A contraction of “you all,” the pronoun “y’all” has long been used as a plural version of “you” in the South and in Black communities around the US. In recent decades, most other English-speaking communities in the US have begun to use “y’all.” What explains its rise in popularity? Many varieties of English have no pronoun that specifically addresses more than one person and instead must use “you” to address both one person and more than one. But “y’all” always refers to two or more people. As a result, it conveys the speaker’s meaning more precisely than “you” can.\n\nWhich question does the text most directly attempt to answer?',
    options: [
      'How many other plural versions of the pronoun “you” are there in English, besides “y’all”?',
      'Why has the pronoun “y’all” become more widely used in the US?',
      'When was the first recorded use of the pronoun “y’all” in the English language?',
      'Is “y’all” commonly used in English-speaking regions of the world besides the US?'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text poses the question "What explains its rise in popularity?" and proceeds to explain why "y’all" has spread to wider American English usage (due to its precision in plural address).',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing linguistic developments and rhetorical purpose'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '66c47028',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'In 1934 physicist Eugene Wigner posited the existence of a crystal consisting entirely of electrons in a honeycomb-like structure. The so-called Wigner crystal remained largely conjecture, however, until Feng Wang and colleagues announced in 2021 that they had captured an image of one. The researchers trapped electrons between two semiconductors and then cooled the apparatus, causing the electrons to settle into a crystalline structure. By inserting an ultrathin sheet of graphene above the crystal, the researchers obtained an impression—the first visual confirmation of the Wigner crystal.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Researchers have obtained the most definitive evidence to date of the existence of the Wigner crystal.',
      'Researchers have identified an innovative new method for working with unusual crystalline structures.',
      'Graphene is the most important of the components required to capture an image of a Wigner crystal.',
      'It’s difficult to acquire an image of a Wigner crystal because of the crystal’s honeycomb structure.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer because the passage focuses on how Feng Wang and colleagues achieved the first visual confirmation and definitive evidence of the long-hypothesized Wigner crystal.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When identifying primary claims in physics research'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '2fdfe002',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The following text is adapted from Countee Cullen’s 1926 poem “Thoughts in a Zoo.”\n\nThey in their cruel traps, and we in ours,  \nSurvey each other’s rage, and pass the hours  \nCommiserating each the other’s woe,  \nTo mitigate his own pain’s fiery glow.  \nMan could but little proffer in exchange  \nSave that his cages have a larger range.  \nThat lion with his lordly, untamed heart  \nHas in some man his human counterpart,  \nSome lofty soul in dreams and visions wrapped,  \nBut in the stifling flesh securely trapped.\n\nBased on the text, what challenge do humans sometimes experience?',
    options: [
      'They cannot effectively tame certain wild animals because of a lack of compassion.',
      'They cannot focus on setting attainable goals because of a lack of motivation.',
      'They quickly become frustrated when faced with difficult tasks because of a lack of self-control.',
      'They have aspirations that cannot be fulfilled because of certain limitations.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The poem likens human beings to caged animals, portraying humans as having lofty dreams and visions but remaining trapped by physical and societal constraints.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing poetic metaphors and themes'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '0d81b7d9',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Paleontologist Alan Tennyson and colleagues studied fossil bones found in New Zealand that are more than 55 million years old. The researchers determined that the fossil bones belonged to two previously unknown species of prehistoric penguins. Moreover, they estimated that one of the two penguin species was more than three times the size of the emperor penguin, which is the largest penguin species that exists today.\n\nBased on the text, which choice best describes the two previously unknown penguin species?',
    options: [
      'They are frequently studied by paleontologists.',
      'They are no longer living species.',
      'They were smaller than penguin species that exist today.',
      'They spent little of their lives in water.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text describes the fossils as belonging to prehistoric penguin species that lived 55 million years ago, indicating they are extinct (no longer living).',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating paleontological evidence'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'b38935ab',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Historians point to the rule of the Piast dynasty as crucial to the formation of the Polish state. However, some differentiate between members of the dynasty like Mieszko II Lambert, who ruled as king from 1025 to 1031 CE, and less well-documented figures like Siemomysł, who is said to have ruled in the 10th century but whose historical actuality is disputed. Siemomysł appears in the Gesta principum Polonorum, a chronicle of medieval Polish history written between 1112 and 1118. However, the chronicle’s documentation of Siemomysł relies on oral tradition, unlike its records of later rulers.\n\nAccording to the text, what is a difference between how historians view Siemomysł and how they view Mieszko II Lambert?',
    options: [
      'Historians agree that Mieszko II Lambert existed, but disagree about whether Siemomysł existed.',
      'Historians believe that the Gesta principum Polonorum provides more evidence for Siemomysł’s existence than it does for Mieszko II Lambert’s existence.',
      'Historians agree that Siemomysł ruled Poland much later than Mieszko II Lambert.',
      'Historians find the orally transmitted stories affirming the existence of Mieszko II Lambert to be more convincing than similar stories about Siemomysł.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text contrasts Mieszko II Lambert, whose rule from 1025 to 1031 CE is historical fact, with Siemomysł, whose historical actuality is disputed because records rely solely on oral tradition.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating historiography and historical documentation'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '640b60c2',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Archaeologists have observed similarities in the tools, such as bidirectional blades, uncovered at the Neolithic-period Mesopotamian settlement of Çayönü Tepesi and those uncovered at roughly contemporaneous settlements elsewhere in Southwest Asia, including those in the South Levant, Central Anatolia, and Central Zagros. Although similarities in tools could be attributed to imitative behavior or trade, Nefize Ezgi Altınışık et al. found evidence of genetic affinity among the populations of Çayönü Tepesi, Central Anatolia, the South Levant, and—to a lesser extent—Central Zagros.\n\nInformation in the text best supports which statement about the finding made by Altınışık et al.?',
    options: [
      'It implies that people and tools likely arrived in Çayönü Tepesi from settlements in Central Anatolia and the South Levant at an earlier time than they did from settlements in Central Zagros.',
      'It raises the possibility that similarities in the design of tools found at Neolithic settlements in Southwest Asia emerged due to population blending between those settlements.',
      'It suggests that in the Neolithic period, people in the South Levant and Central Anatolia imitated tool designs originating in Çayönü Tepesi more frequently than people in Central Zagros did.',
      'It helps explain why contemporaneous Neolithic peoples in Southwest Asia had similar tools but lacked other obvious cultural similarities.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. Altınışık et al. discovered genetic affinity among populations with similar stone tools, supporting the hypothesis that tool design similarities resulted from population mixing and intermarriage rather than simple trade or imitation.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When interpreting archaeological and archaeogenetic evidence'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '5325b3cc',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Philadelphia’s Black Pearl Chamber Orchestra, founded by Jeri Lynne Johnson, performs classical music, from well-known compositions by Beethoven to contemporary works by Jessie Montgomery. For the orchestra’s iConduct! program, Johnson invites community members to learn some basic elements of conducting and then experience conducting the Black Pearl orchestra themselves.\n\nWhich choice best states the main idea of the text?',
    options: [
      'The Black Pearl orchestra performs music from all over the world but mostly performs music composed by Philadelphians.',
      'Johnson founded the Black Pearl orchestra to perform classical music by contemporary artist Jessie Montgomery.',
      'The Black Pearl orchestra gives community members the chance to both listen to and participate in classical music performance.',
      'Johnson has community members conduct an orchestra to demonstrate how difficult the task is.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The text describes how the orchestra plays diverse classical works for audiences and actively involves the community in conducting through its iConduct! program.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When summarizing music and performing arts initiatives'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '411739db',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Readers sometimes divide the works of twentieth-century English author Evelyn Waugh into two periods: one consisting of his early satirical novels and the other consisting of his later, more serious—even ponderous—books. Critic Seamus Perry, however, challenges that strict division. Perry argues that Waugh’s writing didn’t change over time as much as some readers have suggested. For instance, Perry contends that some of Waugh’s earliest works, notably his biography of artist Dante Gabriel Rossetti, exhibit the earnest romanticism that would characterize Waugh’s later fiction.\n\nBased on the text, which statement about Waugh’s works would Perry most likely agree with?',
    options: [
      'Waugh’s works can appropriately be separated into two periods by their subject matter and tone.',
      'Regardless of when they were written, Waugh’s works have important similarities that transcend their differences.',
      'The earliest of Waugh’s works exhibit a satirical tone, even if that tone is more apparent in Waugh’s later works.',
      'Over time, Waugh’s works became less humorous and more focused on weightier topics.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. Perry challenges the rigid two-period division of Waugh’s career by identifying key stylistic continuity (earnest romanticism) across his early and late writings.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating literary criticism and author periodization'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '96802cc0',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'For centuries, the widespread acknowledgment of the involvement of the cerebellum—a dense brain structure in vertebrates—in coordinating motor control in humans has hindered recognition of other possible functions of the structure. Neuroscience research from the last two decades now suggests that the cerebellum regulates emotion and social behavior, and recent research by Ilaria Carta and colleagues has identified a pathway connecting the cerebellum to a center for motivation and reward processing known as the ventral tegmental area (VTA).\n\nWhich choice best states the main idea of the text?',
    options: [
      'The recent verification of a pathway between the VTA and the cerebellum confirms the cerebellum’s long-suspected role in motor coordination.',
      'Recent advances in the field of neuroscience have challenged widely accepted claims about the function of a pathway connecting the VTA and the cerebellum.',
      'The cerebellum has primarily been thought to regulate motor functioning, but in recent years neuroscience researchers have been uncovering additional functions.',
      'Technological limitations have historically hindered the study of the cerebellum, but the recent development of new technologies has led to greater insights into its functions.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The text explains that while the cerebellum was historically viewed only as a motor coordinator, recent neuroscience shows it also participates in emotion, social behavior, and reward processing.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing neuroscience and brain anatomy passages'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'b7d51f84',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'In West Africa, jalis have traditionally been keepers of information about family histories and records of important events. They have often served as teachers and advisers, too. New technologies may have changed some aspects of the role today, but jalis continue to be valued for knowing and protecting their peoples’ stories.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Even though there have been some changes in their role, jalis continue to preserve their communities’ histories.',
      'Although jalis have many roles, many of them like teaching best.',
      'Jalis have been entertaining the people within their communities for centuries.',
      'Technology can now do some of the things jalis used to be responsible for.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text explains that despite modern technological changes, West African jalis remain essential custodians and protectors of community and family histories.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When determining the main idea of an African cultural heritage passage'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'd0fbf1ae',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Algae living within the tissues of corals play a critical role in keeping corals, and the marine ecosystems they are part of, thriving. Some coral species appear brown in color when healthy due to the algae colonies living in their tissues. In the event of an environmental stressor, the algae can die or be expelled, causing the corals to appear white. To recover the algae, the bleached corals then begin to produce bright colors, which block intense sunlight, encouraging the light-sensitive algae to recolonize the corals.\n\nWhat does the text most strongly suggest about corals that produce bright colors?',
    options: [
      'These corals have likely been subjected to stressful environmental conditions.',
      'These corals are likely more vulnerable to exposure from intense sunlight than white corals are.',
      'These corals have likely recovered from an environmental event without the assistance of algae colonies.',
      'These corals are more likely to survive without algae colonies than brown corals are.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text states that corals produce bright colors after bleaching (the expulsion of algae due to environmental stressors) to shield themselves and recruit new algae.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating marine biology and coral reef resilience'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'd2c2a7ef',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The following text is from Anton Chekhov’s 1898 short story “Ionitch” (translated by Marian Fell in 1915). The text is set in a Russian city referred to as the city of S.\n\nIf newcomers to the little provincial city of S. complained that life there was monotonous and dull, its inhabitants would answer that, on the contrary, S. was a very amusing place, indeed, that it had a library and a club, that balls were given there, and finally, that very pleasant families lived there with whom one might become acquainted. And they always pointed to the Turkins as the most accomplished and most enlightened family of all.\n\nWhat does the text suggest about the Turkins?',
    options: [
      'They are relative newcomers to the city of S.',
      'They have a unique status in the city of S.',
      'They have long disliked living in the city of S.',
      'They are amused by the other residents of the city of S.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The residents consistently single out the Turkin family as "the most accomplished and most enlightened family of all," showing they hold an exceptional and unique social standing.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing character and social setting in literary fiction'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'dc3ea63e',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'To dye wool, Navajo (Diné) weaver Lillie Taylor uses plants and vegetables from Arizona, where she lives. For example, she achieved the deep reds and browns featured in her 2003 rug In the Path of the Four Seasons by using Arizona dock roots, drying and grinding them before mixing the powder with water to create a dye bath. To intensify the appearance of certain colors, Taylor also sometimes mixes in clay obtained from nearby soil.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Reds and browns are not commonly featured in most of Taylor’s rugs.',
      'Taylor draws on local resources in the approach she uses to dye wool.',
      'Taylor finds it difficult to locate Arizona dock root in the desert.',
      'In the Path of the Four Seasons is widely acclaimed for its many colors and innovative weaving techniques.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text illustrates how Lillie Taylor utilizes indigenous Arizona plants, dock roots, and local clay to produce the natural dyes for her woven rugs.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When identifying main ideas in cultural art passages'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '9fe7aafa',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The ancient writing system used in the Maya kingdoms of southern Mexico and Central America had a symbol for the number zero. The earliest known example of the symbol dates to more than 2,000 years ago. At that time, almost none of the writing systems elsewhere in the world possessed a zero symbol. And the use of zero in Mexico and Central America may be even more ancient. Some historians suggest that Maya mathematicians inherited it from the Olmec civilization, which flourished in the region 2,400–3,600 years ago.\n\nAccording to the text, what do some historians suggest about Maya civilization?',
    options: [
      'Maya civilization acquired the use of zero from the Olmec civilization.',
      'Maya civilization respected its historians more than it respected its mathematicians.',
      'Maya civilization was highly secretive about its intellectual achievements.',
      'Maya civilization tried to introduce its writing system to other civilizations.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text states that some historians suggest Maya mathematicians inherited their concept and symbol for zero from the earlier Olmec civilization.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating Mesoamerican history and mathematical developments'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '2573d64b',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'At over a thousand pages across two volumes, The Fifty-Year Mission, compiled by Edward Gross and Mark A. Altman, is presented as the “complete, uncensored, unauthorized oral history” as told by the people behind the media franchise Star Trek. The work aspires to be comprehensive by, for example, including accounts from cast and crew members of every Star Trek television series and film to date. But while The Fifty-Year Mission is clearly a unique and valuable resource, it has a shortcoming common among oral histories: it lacks a clear authorial point of view that could otherwise unite the various accounts into a cohesive whole.\n\nWhich choice best states the main idea of the text?',
    options: [
      'The compilers of The Fifty-Year Mission had lofty goals for their oral history of the Star Trek franchise, but the published work lacks information about many key events in the franchise’s history.',
      'The Fifty-Year Mission includes more accounts from people involved with Star Trek television shows than it does from people involved with Star Trek films.',
      'The large amount of material compiled into The Fifty-Year Mission is surprising given that many of the people involved in the Star Trek franchise did not participate in the oral history project.',
      'The Fifty-Year Mission represents a worthwhile attempt to thoroughly recount the history of the Star Trek franchise, but its approach has an important limitation.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer because the text praises the comprehensive compilation as a valuable resource while emphasizing its key limitation: the lack of a unifying authorial perspective.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating book reviews and media critiques'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '04dff083',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'In present-day Chiapas, Mexico, archaeologist Robert Rosenswig, remote-sensing specialist Ricardo López-Torrijos, and colleagues have located 41 smaller settlements surrounding the ancient Mesoamerican city of Izapa. The researchers have concluded that these settlements were culturally linked to Izapa because each of the settlements is the same age and configured in the same manner as Izapa, with a pyramid to the north and a plaza to the south. Their shared structural orientation suggests that residents of the settlements likely performed some of the same cultural ceremonies as residents in Izapa did.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Researchers have determined that the arrangement of Izapa’s structures was based on those of other nearby settlements.',
      'Cultural ceremonies in Izapa seem to have played a more important role for its residents than those in smaller, surrounding settlements did.',
      'Although archaeologists have learned much about Izapa over years of research, they have only recently found the smaller settlements that surrounded it.',
      'Researchers have inferred that Izapa was related to the smaller settlements that surrounded it based in part on the similarity of their construction.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text explains that researchers linked Izapa to 41 surrounding settlements because they shared identical architectural layouts (pyramid north, plaza south) and age.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating archaeological surveys and spatial layouts'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'e65dfc41',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Given the immense scope of space, the search for extraterrestrial life is almost necessarily concentrated on the exoplanets deemed to have the most plausible chance of success—typically, atmosphere-bearing terrestrial planets orbiting within a certain range of their stars (termed the habitable zone). Claiming that Earth experienced a long transition from single-lid to plate tectonics that accelerated the emergence and evolution of complex organisms, researchers Robert J. Stern and Taras V. Gerya hold that consideration of tectonics, an often overlooked factor, could help further narrow the search for advanced extraterrestrial species.\n\nBased on the text, what do Stern and Gerya most likely believe about the development of complex life on exoplanets?',
    options: [
      'It is more likely to occur on habitable zone planets with atmospheres and plate tectonics than on otherwise similar planets that lack plate tectonics.',
      'It is more likely to occur if habitable zone planets with atmospheres transition from single-lid to plate tectonics late in their history than if they transition early in their history.',
      'It is unlikely unless the transition from single-lid to plate tectonics occurs before the acquisition of a lasting atmosphere.',
      'It is probably more dependent on the presence of plate tectonics than on orbital distance from a host star or the presence of an atmosphere.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. Stern and Gerya propose that plate tectonics should be added to existing habitable-zone and atmosphere criteria, making planets with tectonics more promising candidates for complex life.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating astrobiological hypotheses'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'a59245a1',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The painter María Izquierdo played an important role in the development of twentieth-century Mexican art, but her work has never been well-known in the United States except among art historians. One reason for Izquierdo’s relative obscurity is the enormous popularity of some of her peers. In particular, the painters Frida Kahlo and Diego Rivera have so captivated the interest of US audiences that Izquierdo and other Mexican artists from the period often get overlooked, despite the high quality of their work.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Izquierdo’s work is not as well-known in the United States as it should be because Kahlo and Rivera draw so much of the public’s attention.',
      'During Izquierdo’s lifetime, her paintings were displayed in galleries in the United States much more frequently than paintings by Kahlo and Rivera were.',
      'Izquierdo painted some of the same subjects that Kahlo and Rivera painted but used different techniques than they used.',
      'Few of Izquierdo’s works are in galleries today because she produced only a small number of paintings.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text explains that despite María Izquierdo’s significant artistic contributions, the immense US fame of contemporaries Frida Kahlo and Diego Rivera has overshadowed her recognition.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating art history and cultural reception'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '64b6427a',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Since its completion in 2014, Bosco Verticale (Vertical Forest)—a pair of residential towers in Milan, Italy, covered by vegetation—has become a striking symbol of environmental sustainability in architecture. Stefano Boeri intended his design, which features balconies that are home to hundreds of trees, to serve as a model for promoting urban biodiversity. However, the concept has faced skepticism: critics note that although the trees used in Bosco Verticale were specifically cultivated for the project, it’s too early to tell if they can thrive in this unusual setting.\n\nAccording to the text, why are some critics skeptical of the concept behind Bosco Verticale?',
    options: [
      'Some essential aspects of Bosco Verticale’s design are difficult to adapt to locations other than Milan.',
      'The plant life on Bosco Verticale ended up being less varied than Boeri had envisioned it would be.',
      'The construction of Bosco Verticale was no less environmentally damaging than the construction of more conventional buildings is.',
      'It is unclear whether Bosco Verticale can support the plant life included in its design.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. Critics are skeptical because they believe it is too early to know whether the trees planted on high-rise balconies will be able to thrive long-term in that environment.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing green architecture and urban ecology'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '66bef967',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Choctaw/Cherokee artist Jeffrey Gibson turns punching bags used by boxers into art by decorating them with beadwork and elements of Native dressmaking. These elements include leather fringe and jingles, the metal cones that cover the dresses worn in the jingle dance, a women’s dance of the Ojibwe people. Thus, Gibson combines an object commonly associated with masculinity (a punching bag) with art forms traditionally practiced by women in most Native communities (beadwork and dressmaking). In this way, he rejects the division of male and female gender roles.\n\nWhich choice best describes Gibson’s approach to art, as presented in the text?',
    options: [
      'He draws from traditional Native art forms to create his original works.',
      'He has been influenced by Native and non-Native artists equally.',
      'He finds inspiration from boxing in designing the dresses he makes.',
      'He rejects expectations about color and pattern when incorporating beadwork.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text describes how Gibson combines boxing gear with traditional Native beadwork, leather fringe, and jingles to create his distinctive artworks.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When determining main ideas in contemporary Indigenous art'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '668f75cb',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The following text is from Ahmet Hamdi Tanpinar’s 1961 novel The Time Regulation Institute (translated from the Turkish in 2014 by Maureen Freely and Alexander Dawe). The narrator was once involved with the Time Regulation Institute, a fictional bureaucracy that regulates the time of Turkey’s clocks.\n\nI may be the most humble and absurd man in the world and, as my wife says, the most slovenly creature you may ever meet—that is, before the founding of our institute—but I did come to know a truly great man who possessed a natural genius for invention. I spent years at his side. I watched the way he worked. I witnessed how an idea would suddenly catch fire in his mind and take shape, like a tree sprouting shoots and branches, before coming into being.\n\nWhich choice best states the main idea of the text?',
    options: [
      'A person was fortunate enough to have found love despite his obvious shortcomings.',
      'An exceptionally talented person professes humility to avoid intimidating others.',
      'A person appreciates the extensive time he passed in the company of someone he deeply admired.',
      'A truly brilliant person lets ideas mature in his mind before expressing them aloud.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The speaker reflects with profound admiration on the years he spent alongside an inventive genius whose creative processes he witnessed.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing character perspective in translated world literature'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '995d55fd',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'A subject of much speculation, distinctive sets of parallel ridges mark the icy crust of Europa, Jupiter’s smallest moon. Researchers now claim that the ridges’ formation mechanism mirrors that of a strikingly similar pair on Greenland’s ice sheet. There, surface water seeped through fissures in the sheet and formed a water pocket that subsequently disrupted the overlying ice, forcing fragments of it upward and outward into peaks, as the pocket froze and expanded. Although Europa lacks liquid surface water, the same process could be driven by the moon’s subsurface ocean.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Researchers think that the ridges on Europa and the ridges in Greenland may have been formed by the same process even though Europa, unlike Greenland, doesn’t have liquid water on its surface.',
      'The primary difference between the ridges on Europa and the ridges in Greenland is that unlike the Europa ridges, the Greenland ridges are parallel.',
      'The pair of ridges found on Greenland’s ice sheet appear to have formed long before the recently discovered sets of ridges on Europa formed.',
      'Researchers don’t understand why Europa is marked by so many sets of ridges when the moon doesn’t have any liquid water on its surface that could have collected and expanded under the icy crust.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text explains that researchers believe the double ridges on Europa and Greenland formed via the same physical mechanism (water pockets freezing and forcing overlying ice upward).',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating planetary geophysics and comparative planetary science'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '12030076',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'NASA’s Aspera mission, led by Carlos Vargas, will investigate the circumgalactic medium (CGM), the huge swaths of low-density gas that fill and surround galaxies. Specifically, the team will focus on portions of the gas that exist in a “warm-hot” phase: these portions haven’t previously been observable but are thought to fuel new star formation and hold most of the mass that makes up a galaxy. Using a telescope capable of revealing these parts of the CGM, the Aspera mission should help answer long-standing questions about how galaxies emerge, change, and even interact.\n\nWhich choice best states the main idea of the text?',
    options: [
      'As the leader of NASA’s Aspera mission, Vargas will be the first person to investigate the makeup of the CGM.',
      'Although galaxies that are surrounded by the CGM have been studied, researchers have been unable to directly observe low-density gas in the CGM in the “warm-hot” phase.',
      'Researchers don’t yet have a complete understanding of the process of galaxy evolution but have raised the possibility that galaxies interact with each other at times.',
      'The Aspera mission is expected to produce the first direct observations of CGM gas in the “warm-hot” phase, which likely has an important role in the evolution of galaxies.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text describes how the upcoming Aspera mission will provide the first direct observations of previously unobservable "warm-hot" circumgalactic gas critical to understanding galaxy evolution.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating astrophysics and space mission objectives'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'f8befe75',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Many intellectual histories of the Black Power movement of the 1960s and 1970s rely heavily on essays and other explicitly ideological works as primary sources, a tendency that can overrepresent the perspectives of a small number of thinkers, most of whom were male. Historian Ashley D. Farmer has shown that expanding the array of primary sources to encompass more types of print material—including political cartoons, advertisements, and artwork—leads to a much better understanding of the movement and the crucial and diverse roles that Black women played in shaping it.\n\nWhich choice best describes the main idea of the text?',
    options: [
      'Farmer’s methods and research have enriched the historical understanding of the Black Power movement and Black women’s contributions to it.',
      'Before Farmer’s research, historians had largely ignored the intellectual dimensions of the Black Power movement.',
      'Other historians of the Black Power movement have criticized Farmer’s use of unconventional primary sources.',
      'The figures in the Black Power movement whom historians tend to cite would have agreed with Farmer’s conclusions about women’s roles in the movement.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text emphasizes that Ashley D. Farmer’s inclusion of non-traditional print sources expanded historical understanding of the Black Power movement and the essential leadership of Black women.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing historiographical methodologies and African American history'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '3cc7d73b',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Using the Stratospheric Observatory for Infrared Astronomy (SOFIA), a team of astronomers mapped out the magnetic field of G47, one of the Milky Way’s galactic bones (dense clouds of gas and dust that run through the middle of the arm of a spiral galaxy). Surprisingly, the map revealed a magnetic field with no clear pattern or direction. The researchers had expected the magnetic field to be similar to the more uniform fields seen in galactic bones in other arms of the Milky Way.\n\nAccording to the text, what was surprising about the researchers’ mapping of the magnetic field of galactic bone G47?',
    options: [
      'It showed a weaker magnetic field than expected.',
      'It implied that previous mappings of the magnetic field were inaccurate.',
      'It produced magnetic field measurements similar to those for other galactic bones.',
      'It revealed a magnetic field that wasn’t uniform.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text states that astronomers expected a uniform magnetic field like those in other galactic bones, but surprisingly found one with no clear pattern or direction (non-uniform).',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When interpreting observational astronomy research'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '3f05e40f',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'In many of his sculptures, artist Richard Hunt uses broad forms rather than extreme accuracy to hint at specific people or ideas. In his first major work, Arachne (1956), Hunt constructed the mythical character Arachne, a weaver who was changed into a spider, by welding bits of steel together into something that, although vaguely human, is strange and machine-like. And his large bronze sculpture The Light of Truth (2021) commemorates activist and journalist Ida B. Wells using mainly flowing, curved pieces of metal that create stylized flame.\n\nWhich choice best states the text’s main idea about Hunt?',
    options: [
      'He often depicts the subjects of his sculptures using an unrealistic style.',
      'He uses different kinds of materials depending on what kind of sculpture he plans to create.',
      'He tends to base his art on important historical figures rather than on fictional characters.',
      'He has altered his approach to sculpture over time, and his works have become increasingly abstract.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text explains that Richard Hunt favors broad, stylized, and abstract forms over realistic anatomical accuracy when sculpting subjects.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When determining main ideas in modern sculpture analysis'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '659c6c1d',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The following text is adapted from Robert Louis Stevenson’s 1883 novel Treasure Island. Bill is a sailor staying at the Admiral Benbow, an inn run by the narrator’s parents.\n\nEvery day when [Bill] came back from his stroll he would ask if any seafaring men had gone by along the road. At first we thought it was the want of company of his own kind that made him ask this question, but at last we began to see he was desirous to avoid them. When a seaman did [stay] at the Admiral Benbow (as now and then some did) he would look in at him through the curtained door before he entered the parlour; and he was always sure to be as silent as a mouse when any such was present.\n\nAccording to the text, why does Bill regularly ask about “seafaring men”?',
    options: [
      'He’s hoping to find an old friend and fellow sailor.',
      'He’s trying to secure a job as part of the crew on a new ship.',
      'He isn’t sure that other guests at the inn will be welcoming of sailors.',
      'He doesn’t want to encounter any other sailor unexpectedly.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text reveals that Bill asks about other seafarers not for companionship, but because he actively wants to avoid running into other sailors unexpectedly.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing character motivation in adventure fiction'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'd5c2a4d4',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The following text is adapted from Guy de Maupassant’s nineteenth-century short story “The Trip of Le Horla” (translated by Albert M. C. McMaster, A. E. Henderson, Mme. Quesada, et al.). The narrator is part of a group traveling in a hot-air balloon at night.\n\nThe earth no longer seems to exist, it is buried in milky vapors that resemble a sea. We are now alone in space with the moon, which looks like another balloon travelling opposite us; and our balloon, which shines in the air, appears like another, larger moon, a world wandering in the sky amid the stars, through infinity. We no longer speak, think nor live; we float along through space in delicious inertia. The air which is bearing us up has made of us all beings which resemble itself, silent, joyous, irresponsible beings, peculiarly alert, although motionless.\n\nWhich choice best states the main idea of the text?',
    options: [
      'The narrator feels a growing sense of isolation even though his companions are nearby during the balloon ride.',
      'The narrator and his companions are completely absorbed in the change in perspective they gain while riding in the balloon.',
      'The narrator and his companions are troubled by the disorienting effects of the altitude while riding in the balloon.',
      'The narrator is pleasantly surprised by his companions’ unrestrained enthusiasm about the sensation of riding in the balloon.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The narrator describes floating serenely above earth in "delicious inertia," completely immersed in the profound change of perspective offered by the balloon ride.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When interpreting descriptive narrative perspective in 19th-century literature'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'ad680167',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The recovery of a 1,000-year-old Chinese shipwreck in the Java Sea near present-day Indonesia has yielded a treasure trove of artifacts, including thousands of small ceramic bowls. Using a portable X-ray fluorescence analyzer tool, Lisa Niziolek and her team were able to detect the chemical composition of these bowls without damaging them. By comparing the chemical signatures of the bowls with those of the materials still at old Chinese kiln sites, Niziolek and her team can pinpoint which Chinese kilns likely produced the ceramic bowls.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Because of a new technology, researchers can locate and recover more shipwrecks than they could in the past.',
      'Researchers have been able to identify the location of a number of Chinese kilns in operation 1,000 years ago.',
      'With the help of a special tool, researchers have determined the likely origin of bowls recovered from a shipwreck.',
      'Before the invention of portable X-ray fluorescence, researchers needed to take a small piece out of an artifact to analyze its components.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The text describes how researchers used portable X-ray fluorescence to non-destructively analyze shipwreck ceramic bowls and match them to specific historical kilns.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating maritime archaeology techniques'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'adbcbce0',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The following text is adapted from Christina Rossetti’s 1881 poem “Monna Innominata 2.”\n\nI wish I could remember that first day,\nFirst hour, first moment of your meeting me,\nIf bright or dim the season, it might be\nSummer or Winter for [all] I can say;\nSo unrecorded did it slip away,\nSo blind was I to see and to foresee,\nSo dull to mark the budding of my tree\nThat would not blossom yet for many a May.\n\nWhich choice best states the main idea of the text?',
    options: [
      'The speaker celebrates how the passage of time has strengthened a relationship that once seemed unimportant.',
      'Because the speaker did not anticipate how important a relationship would become, she cannot recall how the relationship began, which she regrets.',
      'As the anniversary of the beginning of an important relationship approaches, the speaker feels conflicted about how best to commemorate it.',
      'After years of neglecting a once valuable relationship, the speaker worries it may be too late for her to salvage the relationship.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The speaker expresses regret that she cannot remember the exact details of her first meeting with her beloved because she did not anticipate at the time how deeply significant the relationship would become.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing poetic tone and speaker reflections'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '73caa3ab',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The following text is from Mark Haber’s 2022 novel Saint Sebastian’s Abyss. The narrator and Schmidt are both art critics.\n\nWhen my first wife admitted to Schmidt over dinner that she didn’t find art, painting in particular, especially compelling, Schmidt winced, set down his fork, and sighed dramatically; he then excused himself, explaining an appointment he’d forgotten about had suddenly and inexplicably been remembered, while making it abundantly clear there was no appointment at all.\n\nBased on the text, what is notable about Schmidt’s behavior?',
    options: [
      'Schmidt is only given to theatrical behavior when in the company of the narrator and his first wife.',
      'Schmidt’s absentmindedness regarding his schedule is uncharacteristic of him.',
      'Schmidt’s departure is occasioned by the resumption of a previous disagreement with the narrator’s first wife about a particular painting.',
      'Schmidt conveys his feelings about one of his dining companions without explicitly stating them.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. Through dramatic physical reactions (wincing, sighing) and a transparently fake excuse to leave, Schmidt unmistakably communicates his contempt for the wife’s opinion without directly verbalizing it.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing subtext and nonverbal character interactions'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'b7f79059',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The following text is from Ezra Pound’s 1909 poem “Hymn III,” based on the work of Marcantonio Flaminio.\n\nAs a fragile and lovely flower unfolds its gleaming\nfoliage on the breast of the fostering earth, if\nthe dew and the rain draw it forth;\nSo doth my tender mind flourish, if it be fed with the\nsweet dew of the fostering spirit,\nLacking this, it beginneth straightway to languish,\neven as a floweret born upon dry earth, if the\ndew and the rain tend it not.\n\nBased on the text, in what way is the human mind like a flower?',
    options: [
      'It becomes increasingly vigorous with the passage of time.',
      'It draws strength from changes in the weather.',
      'It requires proper nourishment in order to thrive.',
      'It perseveres despite challenging circumstances.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The poem compares the human mind to a flower that will flourish if nourished by a fostering spirit and moisture, but will quickly wither if nourishment is missing.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When interpreting literary metaphors and imagery'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '8fb67890',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Archaeologists have discovered a runestone in Norway that may contain the earliest example of written words in Scandinavia. Carbon dating at the discovery site revealed that the stone was likely carved between 1 and 250 CE. Runologist Kristel Zilmer believes the stone will be helpful in learning more about the use of runic alphabets in early Iron Age Scandinavia.\n\nWhich choice best states the main topic of the text?',
    options: [
      'Battles of the Iron Age',
      'A runestone found in Norway',
      'A new method for dating rock samples',
      'The research interests of Kristel Zilmer'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text focuses on the discovery, dating, and linguistic significance of an ancient Scandinavian runestone recently uncovered in Norway.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When determining the main subject of an archaeological report'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '6540a976',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'To understand how Paleolithic artists navigated dark caves, archaeologist Mª Ángeles Medina-Alcaide and her team tested different lighting methods in a cave in Spain using replicas of artifacts found in European caves with art. They used three different Paleolithic light sources—torches, animal-fat lamps, and fireplaces—determining that each likely had a specific purpose. For instance, the team learned that the animal-fat lamps were less useful than torches while walking because the lamps didn’t illuminate the cave floor.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Medina-Alcaide and her team’s study demonstrated that fireplaces were essential to the creators of Paleolithic cave art.',
      'Medina-Alcaide and her team discovered that Paleolithic cave artists in Spain used animal-fat lamps more often than they used torches.',
      'Medina-Alcaide and her team were reluctant to draw many conclusions from their study because of the difficulty they had replicating light sources based on known artifacts.',
      'Medina-Alcaide and her team tested Paleolithic light sources and learned some details about how Paleolithic artists traveled within dark caves.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text describes experimental archaeology testing reconstructed Paleolithic light sources to understand how early humans moved through cave systems.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating experimental archaeology studies'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'e47d2524',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Microplastics are tiny pieces of plastic waste. Areas of the ocean with higher concentrations of microplastic particles also have smaller and fewer waves. A study by Yukun Sun and colleagues found that the concentration of microplastic particles cannot be the only reason for this reduced wave activity because the concentration of particles that would have the observed effect is much higher than that found in these areas of the ocean. However, they found that surfactants, chemicals often used to manufacture plastics, are released into the water from microplastics and have a much stronger wave-reducing effect.\n\nAccording to the text, what did Sun and colleagues discover about surfactants?',
    options: [
      'They have a much stronger effect on wave activity than microplastics alone do.',
      'They are mainly composed of water.',
      'They are helpful for removing microplastics from the ocean.',
      'They can be used to contain microplastics within certain areas of the ocean.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. Sun and colleagues found that surfactants leaching from microplastics exert a far more potent wave-dampening effect in ocean water than the physical plastic particles themselves.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When identifying specific research discoveries in oceanography'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '95146ebb',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The ice melted on a Norwegian mountain during a particularly warm summer in 2019, revealing a 1,700-year-old sandal to a mountaineer looking for artifacts. The sandal would normally have degraded quickly, but it was instead well preserved for centuries by the surrounding ice. According to archaeologist Espen Finstad and his team, the sandal, like those worn by imperial Romans, wouldn’t have offered any protection from the cold in the mountains, so some kind of insulation, like fabric or animal skin, would have needed to be worn on the feet with the sandal.\n\nWhat does the text indicate about the discovery of the sandal?',
    options: [
      'Temperatures contributed to both protecting and revealing the sandal.',
      'The discovery revealed that the Roman Empire had more influence on Norway than archaeologists previously assumed.',
      'Archaeologists would have found the sandal eventually without help from the general public.',
      'The sandal would have degraded if it hadn’t been removed from the ice.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. Freezing temperatures in the ice preserved the sandal for 1,700 years, while a warm summer temperature melted the ice and revealed it.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating glacial archaeology and preservation'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'd2e0cba5',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'In a study of new technology adoption, Davit Marikyan et al. examined negative disconfirmation (which occurs when experiences fall short of one’s expectations) to determine whether it could lead to positive outcomes for users. The team focused on established users of “smart home” technology, which presents inherent utilization challenges but tends to attract users with high expectations, often leading to feelings of dissonance. The researchers found that many users employed cognitive mechanisms to mitigate those feelings, ultimately reversing their initial sense of disappointment.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Research suggests that most users of smart home technology will not achieve a feeling of satisfaction given the utilization challenges of such technology.',
      'Although most smart home technology is aimed at meeting or exceeding users’ high expectations, those expectations in general remain poorly understood.',
      'Research suggests that users with high expectations for a new technology can feel content with that technology even after experiencing negative disconfirmation.',
      'Although negative disconfirmation has often been studied, little is known about the cognitive mechanisms shaping users’ reactions to it in the context of new technology adoption.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The study showed that smart home users who experienced initial negative disconfirmation used cognitive coping mechanisms to overcome disappointment and ultimately feel content.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating consumer psychology and technology adoption studies'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '7ffae38a',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The following text is adapted from Jack London’s 1903 novel The Call of the Wild. Buck is a sled dog living with John Thornton in Yukon, Canada.\n\nThornton alone held [Buck]. The rest of mankind was as nothing. Chance travellers might praise or pet him; but he was cold under it all, and from a too demonstrative man he would get up and walk away. When Thornton’s partners, Hans and Pete, arrived on the long-expected raft, Buck refused to notice them till he learned they were close to Thornton; after that he tolerated them in a passive sort of way, accepting favors from them as though he favored them by accepting.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Buck has become less social since he began living with Thornton.',
      'Buck mistrusts humans and does his best to avoid them.',
      'Buck has been especially well liked by most of Thornton’s friends.',
      'Buck holds Thornton in higher regard than any other person.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The passage establishes that Thornton alone held Buck’s devotion, while all other humans were treated with coldness or mere passive tolerance.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing character relationships and loyalty in literature'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '409058ee',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'To protect themselves when being attacked, hagfish—jawless marine animals that resemble eels—will release large quantities of slimy, mucus-like threads. Because these threads are unusually strong and elastic, scientist Atsuko Negishi and her colleagues have been trying to recreate them in a lab as an eco-friendly alternative to petroleum-based fibers that are often used in fabrics. The researchers want to reproduce the threads in the lab because farming hagfish for their slime would be expensive and potentially harmful to the hagfish.\n\nWhich choice best states the text’s main idea?',
    options: [
      'The slimy threads that hagfish release might help researchers create a new kind of fabric.',
      'Hagfish have inspired researchers to develop a new petroleum-based fabric.',
      'Hagfish are not well suited to being raised in captivity.',
      'The ability of hagfish to slime their attackers compensates for their being jawless.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text describes how the strong, elastic slime threads released by hagfish are being lab-synthesized as a promising eco-friendly fiber alternative for fabrics.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing biomimicry and sustainable materials research'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'b62cb782',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Culinary anthropologist Vertamae Smart-Grosvenor may be known for her decades of work in national public television and radio, but her book Vibration Cooking: or, the Travel Notes of a Geechee Girl is likely her most influential project. The 1970 book, whose title refers to Smart-Grosvenor’s roots in the Low Country of South Carolina, was unusual for its time. It combined memoir, recipes, travel writing, and social commentary and challenged notions about conventions of food and cooking. Long admired by many, the book and its author have shaped contemporary approaches to writing about cuisine.\n\nWhich choice best describes the main idea of the text?',
    options: [
      'Smart-Grosvenor’s unconventional book Vibration Cooking: or, the Travel Notes of a Geechee Girl is an important contribution to food writing.',
      'Smart-Grosvenor held many different positions over her life, including reporter and food writer.',
      'Smart-Grosvenor’s groundbreaking book Vibration Cooking: or, the Travel Notes of a Geechee Girl didn’t receive the praise it deserved when it was first published in 1970.',
      'Smart-Grosvenor was a talented chef whose work inspired many people to start cooking for themselves.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text centers on Smart-Grosvenor’s groundbreaking 1970 book Vibration Cooking, emphasizing its lasting influence and innovative blend of food, memoir, and cultural commentary.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating culinary history and African American literature'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'c188a397',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Recently, scientists looked at data collected by NASA’s InSight lander to learn more about seismic activity on Mars, known as marsquakes. The data show that the marsquakes all started from the same location on the planet. This discovery was surprising to scientists, as they expected that the marsquakes would originate from all over the planet because of the cooling of the planet’s surface. Now, scientists believe that there could be areas of active magma flows deep beneath the planet’s surface that trigger the marsquakes.\n\nAccording to the text, what was surprising to scientists studying the seismic activity data from NASA’s InSight lander?',
    options: [
      'The surface temperature of Mars has been rising.',
      'There were different types of seismic waves causing marsquakes.',
      'NASA’s InSight lander collected less data than scientists had expected.',
      'All the marsquakes started from the same location on the planet.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The data surprised scientists because all marsquakes originated from a single localized point rather than occurring uniformly across Mars from global cooling.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing planetary geology and seismology'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '923ebfe3',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Businesses selling clothing and other fashion items face obstacles in trying to forecast how much product to order: tastes and styles change quickly, while manufacturing clothing takes a significant amount of time. Researchers Youran Fu and Marshall Fisher have found that combining sellers’ own data with information gathered from social media can dramatically improve the accuracy of such forecasts—by 24 to 57 percent in the cases they directly studied. Better predictions mean demand is easier to meet without retailers becoming overstocked.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Using multiple data sources can enhance the ability of sellers in the fashion industry to anticipate demand.',
      'Social media is revolutionizing how both sellers and researchers view the fashion industry.',
      'Becoming overstocked is the main preoccupation of sellers trying to forecast demand for fashion items.',
      'Retailers can use their own data to accurately predict how tastes and styles are evolving.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text explains that combining internal sales data with external social media data significantly improves demand forecast accuracy for fashion retailers.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating business analytics and predictive modeling'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'f64ff4fb',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'In her 1998 book Blues Legacies and Black Feminism, Angela Y. Davis bases her analysis in part on recordings of songs sung in the 1920s by Gertrude “Ma” Rainey and Bessie Smith. Davis focuses on how Rainey and Smith improvised the lyrics—replacing the original lines with mischievous jokes and wordplay. Davis’s work was particularly labor intensive because in order to transcribe, or write down, the lyrics as Rainey and Smith sang them, Davis had to listen repeatedly to the vinyl recordings, which weren’t very clear.\n\nWhat does the text most strongly suggest about the songs sung by Rainey and Smith?',
    options: [
      'The songs have grown in popularity since Rainey and Smith first sang them.',
      'There were more recordings made of Rainey’s songs than there were of Smith’s.',
      'There were few, if any, reliable transcriptions of Smith’s and Rainey’s improvised lyrics when Davis began her research.',
      'According to Davis, the songs sung by Rainey were more musically innovative than those sung by Smith typically were.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. Because Davis had to painstakingly listen repeatedly to poor-quality vinyl to write down the lyrics herself, the text implies reliable transcriptions did not previously exist.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When interpreting musicological research and blues history'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'dd412b31',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Online surveys are a common tool researchers use to collect information. These surveys are usually designed for use on personal computers (PCs), but more people are using smartphones to complete them than they are PCs. This shift in device usage may change how participants interact with online surveys. When researchers Jean Philippe Décieux and Philipp E. Sischka investigated, they found that PC users were more likely to multitask while taking surveys than smartphone users were, but PC users were also more likely to complete the surveys.\n\nWhich choice best states the main idea of the text?',
    options: [
      'People are choosing to take online surveys on smartphones more often than they are on PCs because smartphones are convenient.',
      'Researchers are investigating why survey completion rates are higher on PCs than they are on smartphones, despite increased multitasking on PCs.',
      'Researchers prefer online surveys to other ways of collecting information because they think online survey results are more reliable.',
      'A study shows that the type of device people use to complete online surveys affects how they interact with these surveys.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text describes findings from Décieux and Sischka showing that whether respondents use PCs or smartphones significantly influences their multitasking and completion behaviors.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When evaluating social science research methodologies'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '835545cd',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'The following text is adapted from Charles W. Chesnutt’s 1901 novel The Marrow of Tradition.\n\nMrs. Ochiltree was a woman of strong individuality, whose comments upon her acquaintance[s], present or absent, were marked by a frankness at times no less than startling. This characteristic caused her to be more or less avoided. Mrs. Ochiltree was aware of this sentiment on the part of her acquaintance[s], and rather exulted in it.\n\nBased on the text, what is true about Mrs. Ochiltree’s acquaintances?',
    options: [
      'They try to refrain from discussing topics that would upset Mrs. Ochiltree.',
      'They are unable to spend as much time with Mrs. Ochiltree as she would like.',
      'They are too preoccupied with their own concerns to speak with Mrs. Ochiltree.',
      'They are likely offended by what Mrs. Ochiltree has said about them.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. Mrs. Ochiltree’s startlingly frank comments cause her acquaintances to avoid her, indicating they are offended by her blunt remarks.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When analyzing character personality and social dynamics'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'a66f9b8d',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'intermediate',
    questionText: 'Cats can judge unseen people’s positions in space by the sound of their voices and thus react with surprise when the same person calls to them from two different locations in a short span of time. Saho Takagi and colleagues reached this conclusion by measuring cats’ levels of surprise based on their ear and head movements while the cats heard recordings of their owners’ voices from two speakers spaced far apart. Cats exhibited a low level of surprise when owners’ voices were played twice from the same speaker, but they showed a high level of surprise when the voice was played once each from the two different speakers.\n\nAccording to the text, how did the researchers determine the level of surprise displayed by the cats in the study?',
    options: [
      'They watched how each cat moved its ears and head.',
      'They examined how each cat reacted to the voice of a stranger.',
      'They studied how each cat physically interacted with its owner.',
      'They tracked how each cat moved around the room.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The researchers explicitly evaluated the cats’ surprise levels by observing and recording how they moved their ears and heads in response to speaker sounds.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 14,
      highlightedText: 'When identifying experimental procedures in animal cognition studies'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  // ==========================================
  // READING & WRITING — INFORMATION & IDEAS (45 HARD CENTRAL IDEAS & DETAILS)
  // ==========================================
  {
    id: 'ed314256',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The most recent iteration of the immersive theater experience Sleep No More, which premiered in New York City in 2011, transforms its performance space—a five-story warehouse—into a 1930s-era hotel. Audience members, who wander through the labyrinthine venue at their own pace and follow the actors as they play out simultaneous, interweaving narrative loops, confront the impossibility of experiencing the production in its entirety. The play’s refusal of narrative coherence thus hinges on the sense of spatial fragmentation that the venue’s immense and intricate layout generates.\n\nWhat does the text most strongly suggest about Sleep No More’s use of its performance space?',
    options: [
      'The choice of a New York City venue likely enabled the play’s creators to experiment with the use of theatrical space in a way that venues from earlier productions could not.',
      'Audience members likely find the experience of the play disappointing because they generally cannot make their way through the entire venue.',
      'The production’s dependence on a particular performance environment would likely make it difficult to reproduce exactly in a different theatrical space.',
      'Audience members who navigate the space according to a recommended itinerary will likely have a better grasp of the play’s narrative than audience members who depart from that itinerary.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer because the passage emphasizes that the production\'s unique refusal of narrative coherence is directly tied to and depends upon the immense, intricate five-story warehouse layout, meaning it cannot be replicated identically in an ordinary or different theatrical venue.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating theater design and experiential narratives'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '458b4a11',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'To understand how temperature change affects microorganism-mediated cycling of soil nutrients in alpine ecosystems, Eva Kaštovská et al. collected plant-soil cores in the Tatra Mountains at elevations around 2,100 meters and transplanted them to elevations of 1,700–1,800 meters, where the mean air temperature was warmer by 2°C. Microorganism-mediated nutrient cycling was accelerated in the transplanted cores; crucially, microorganism community composition was unchanged, allowing Kaštovská et al. to attribute the acceleration to temperature-induced increases in microorganism activity.\n\nIt can most reasonably be inferred from the text that the finding about the microorganism community composition was important for which reason?',
    options: [
      'It provided preliminary evidence that microorganism-mediated nutrient cycling was accelerated in the transplanted cores.',
      'It suggested that temperature-induced changes in microorganism activity may be occurring at increasingly high elevations.',
      'It ruled out a potential alternative explanation for the acceleration in microorganism-mediated nutrient cycling.',
      'It clarified that microorganism activity levels in the plant-soil cores varied depending on which microorganisms comprised the community.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. Because the composition of the microbial community remained identical, the researchers could definitively eliminate the alternative explanation that different, warm-adapted species had colonized the cores and driven the nutrient acceleration.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating experimental controls and hypotheses in ecology'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '1ba5ad7a',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Many literary theorists distinguish between fabula, a narrative’s content, and syuzhet, a narrative’s arrangement and presentation of events. In the film The Godfather Part II, the fabula is the story of the Corleone family, and the syuzhet is the presentation of the story as it alternates between two timelines in 1901 and 1958. But literary theorist Mikhail Bakhtin maintained that fabula and syuzhet are insufficient to completely describe a narrative—he held that systematic categorizations of artistic phenomena discount the subtle way in which meaning is created by interactions between the artist, the work, and the audience.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Literary theorist Mikhail Bakhtin argued that there are important characteristics of narratives that are not fully encompassed by two concepts that other theorists have used to analyze narratives.',
      'Literary theorist Mikhail Bakhtin claimed that meaning is not inherent in a narrative but is created when an audience encounters a narrative so that narratives are interpreted differently by different people.',
      'The storytelling methods used in The Godfather Part II may seem unusually complicated, but they can be easily understood when two concepts from literary theory are utilized.',
      'Narratives that are told out of chronological order are more difficult for audiences to understand than are narratives presented chronologically.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text focuses on Mikhail Bakhtin’s critique that the traditional theoretical dichotomy between fabula and syuzhet fails to capture the dynamic, interactive creation of artistic meaning.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating narrative theory and literary criticism'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '11a9f635',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Paleontologists searching for signs of ancient life have found many fossilized specimens of prehistoric human ancestors, including several from the Pleistocene era discovered in a geological formation in the Minatogawa quarry in Japan. However, to study the emergence of the earliest multicellular organisms to appear on Earth, researchers must turn elsewhere, such as to the Ediacaran geological formation at Mistaken Point in Canada. A UNESCO World Heritage Site, the 146-hectare reserve contains more than 10,000 fossils that together document a critical moment in evolutionary history.\n\nWhat does the text indicate about the geological formation at Mistaken Point?',
    options: [
      'It holds a greater number of fossils but from a smaller variety of species than the formation in the Minatogawa quarry does.',
      'It has provided evidence that the earliest human species may have emerged before the Pleistocene era.',
      'It is widely considered by paleontologists to be the most valuable source of information about prehistoric life forms.',
      'It contains specimens from an older time period than those found in the formation in the Minatogawa quarry.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. Mistaken Point preserves Ediacaran fossils of the earliest multicellular organisms, which date back hundreds of millions of years prior to the Pleistocene era fossils of early humans found at Minatogawa.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing geological epochs and paleontology'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '1a2b29c9',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is adapted from María Cristina Mena’s 1914 short story “The Vine-Leaf.”\n\nIt is a saying in the capital of Mexico that Dr. Malsufrido carries more family secrets under his hat than any archbishop.\n\nThe doctor’s hat is, appropriately enough, uncommonly capacious, rising very high, and sinking so low that it seems to be supported by his ears and eyebrows, and it has a furry look, as if it had been brushed the wrong way, which is perhaps what happens to it if it is ever brushed at all. When the doctor takes it off, the family secrets do not fly out like a flock of parrots, but remain nicely bottled up beneath a dome of old and highly polished ivory.\n\nBased on the text, how do people in the capital of Mexico most likely regard Dr. Malsufrido?',
    options: [
      'Many have come to tolerate him despite his disheveled appearance.',
      'Few feel concerned that he will divulge their confidences.',
      'Some dislike how freely he discusses his own family.',
      'Most would be unimpressed by him were it not for his professional expertise.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text states that secrets entrusted to Dr. Malsufrido "do not fly out... but remain nicely bottled up," showing that people trust him not to reveal their confidential information.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing character reputation and metaphor in literature'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '701126bc',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'In superfluorescence, electrical charges known as dipoles emit light in synchronized bursts so intense that they are visible to the eye. Until recently, this phenomenon has only been observed at extremely cold temperatures because dipoles cannot synchronize at higher temperatures. But in a study, Melike Biliroglu and colleagues observed superfluorescence at room temperature in thin films made of perovskite and other similarly crystalline materials; the researchers propose that the formation of shock-absorbing quasiparticles called polarons in the material protects dipoles from thermal interference.\n\nBased on the text, how are polarons believed to be involved in the superfluorescence observed in Biliroglu and colleagues’ study?',
    options: [
      'Polarons enable superfluorescent bursts to cross from one crystalline material to another.',
      'Polarons allow for the dipoles to synchronize despite higher temperatures.',
      'Polarons accelerate the dipoles’ release of superfluorescent bursts.',
      'Polarons decrease the intensity of the superfluorescent burst.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text explains that polarons shield dipoles from thermal agitation, allowing them to achieve synchronization and superfluorescence at warmer room temperatures.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When interpreting quantum physics and condensed matter research'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '9731a22b',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Paleontologist Lucas E. Fiorelli and colleagues have reported the discovery at a mine in Brazil of several egg clutches, partially preserved single eggs, and egg shells from the Late Cretaceous period. The researchers have concluded that the area was once a nesting and breeding site for titanosaurs, a group of sauropod dinosaurs. The finding is significant given the previous lack of known nesting sites in northern regions of South America, which led many paleontologists to assume that titanosaurs migrated south to lay eggs.\n\nWhat does the text most strongly suggest about the site discovered by the researchers?',
    options: [
      'It is the earliest known example of a titanosaur nesting and breeding site.',
      'It was very difficult to excavate given that it was discovered in a mine.',
      'It may have been occupied by other sauropods in addition to titanosaurs.',
      'It is farther north than any other nesting site discovered in South America.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The discovery challenged the assumption that titanosaurs always migrated south to nest because previous nesting sites were exclusively in the south, making this newly found Brazilian site the northernmost nesting site identified.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing paleontological discoveries and geographic distribution'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '2b252bbd',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Within higher education, studying philosophy requires that students be conversant with the field’s foundational texts and historical figures. By contrast, doing philosophy within or beyond the academy demands the creative, self-directed application of acquired expertise to enduring questions about the nature of existence and knowledge. While both approaches engage with influential figures, those who do philosophy treat such figures as vital interlocutors who facilitate new insights rather than as ossified authorities who, though relevant to the present, primarily represent the discipline’s past.\n\nBased on the text, which choice best describes the relationship between doing philosophy and studying philosophy?',
    options: [
      'Doing philosophy helps students formulate concrete solutions to practical issues, whereas studying philosophy prioritizes engagement with historical arguments in the field.',
      'Doing philosophy involves developing novel ideas through imagined dialogue with past philosophers based on knowledge of those philosophers’ views acquired by studying philosophy.',
      'Doing philosophy requires students to challenge the ideas articulated by past philosophers, especially when these ideas are broadly accepted by other people studying philosophy.',
      'Doing philosophy represents a departure from the norms that govern scholarly inquiry, whereas studying philosophy requires conforming to these norms.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text describes "doing philosophy" as creatively engaging past thinkers as living interlocutors to produce new insights, which builds directly upon the foundational knowledge of those thinkers gained by "studying philosophy."',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing academic distinctions and philosophical methodology'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '70aacc03',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Elizabeth Asiedu has identified a negative correlation between the share of developing countries’ economies derived from natural-resource extraction and those countries’ receipts of foreign investment. This may appear counterintuitive—resource extraction requires initial investments (in extractive technology, for instance) at scales best met by multinational corporations—but Asiedu notes that natural-resource industries’ boom-bust cycle can destabilize local currencies and increase developing countries’ vulnerability to external shocks, creating levels of uncertainty to which foreign investors are typically averse.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Although it may seem surprising that foreign investment declines in developing countries as natural-resource extraction makes up a larger share of those countries’ economies, that decline happens because resource extraction requires initial investments too large for foreign investors to supply.',
      'Although developing countries tend to become less dependent on foreign investment as natural-resource industries make up a larger share of their economies, this change may not occur if the boom-bust cycle of those industries destabilizes local currencies or increases countries’ vulnerability to external shocks.',
      'Although one might expect that foreign investment would increase as natural-resource extraction makes up a larger share of developing countries’ economies, the opposite happens because heavy reliance on natural resources can lead to unattractive conditions for investors.',
      'Although foreign investors tend to avoid initial investments in natural-resource industries in developing countries, foreign investment may increase significantly as those industries stabilize and the risks associated with them decline.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. Asiedu\'s research shows that while natural resource extraction logically seems to demand foreign capital, the macroeconomic volatility and currency instability caused by boom-bust cycles deter foreign investors.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating macroeconomic research and foreign direct investment'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'c5cba39c',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'In episodes of high heat, corals expel symbiotic zooxanthellae from their tissues, leading to coral bleaching and heightened coral mortality. Some researchers have proposed a mitigation strategy of identifying, rearing, and disseminating corals that have evolved strong resistance to heat, but as Nia S. Walker et al. note, if genes conferring such resistance were exclusively advantageous, they should have already propagated through coral populations. Indeed, Walker et al. show that strongly heat-resistant corals display much less growth after heat stress than do moderately heat-resistant corals.\n\nBased on the text, Walker et al. would most likely agree with which statement about the strategy some researchers have proposed?',
    options: [
      'It would involve promoting a trait that protects corals against high heat but that is associated with reduced thriving after episodes of high heat.',
      'It would favor a trait that is advantageous now but would be disadvantageous if episodes of high heat become as infrequent as has been predicted.',
      'It would benefit corals that are frequently exposed to episodes of high heat but would harm corals that are frequently exposed to episodes of moderate heat.',
      'It would require manipulating a trait that is poorly understood and that may be linked to increased coral mortality during episodes of high heat.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. Walker et al. highlight an evolutionary trade-off: corals with high heat resistance survive thermal spikes but show significantly stunted growth and reduced thriving post-stress compared to moderately resistant corals.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating biological trade-offs in conservation genetics'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'f7bd14de',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Several scholars have argued that conditions in England in the late ninth through early eleventh centuries—namely, burgeoning literacy amid running conflicts between England’s Anglo-Saxon kingdoms and Danish invaders—were especially conducive to the production of the Old English epic poem Beowulf, and they have dated the poem’s composition accordingly. It is not inconceivable that Beowulf emerged from such a context, but privileging contextual fit over the linguistic evidence of an eighth- or even seventh-century composition requires a level of justification that thus far has not been presented.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Although there are some grounds for believing that Beowulf was composed between the late ninth and early eleventh centuries, advocates for that view tend to rely on evidence that has been called into question by advocates for an earlier date.',
      'Although several scholars have dated Beowulf to the late ninth through early eleventh centuries, others have argued that doing so privileges a controversial interpretation of the social conditions of the period.',
      'Although Beowulf fits well with the historical context of England in the late ninth through early eleventh centuries, it fits equally well with the historical context of England in the seventh and eighth centuries.',
      'Although the claim of a late ninth- through early eleventh-century composition date for Beowulf has some plausibility, advocates for the claim have not compellingly addressed evidence suggesting an earlier date.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text acknowledges the contextual plausibility of a late 9th–11th century origin for Beowulf, but argues that scholars favoring this date have failed to adequately refute or justify ignoring the linguistic evidence pointing to an earlier composition.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating philological dating and historical context in literature'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '35b46381',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'In their 2022 paper, Christos Dimopoulos et al., having granted that the existence of antigravity—in which antimatter and matter repel rather than attract each other—lacked affirmative experimental support, rightly argued that such antigravity was worth considering on theoretical grounds given that evidence against it was similarly lacking. But a 2023 report by an international team of researchers details the first direct ballistic observations of antihydrogen atoms under gravity inside a CERN particle accelerator. Corresponding most closely to predictions under gravitational attraction, these observations were thoroughly inconsistent with antigravity.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Antihydrogen ballistics observations were conducted at CERN to test specific conclusions about antigravity presented in the 2022 paper by Dimopoulos et al.',
      'Although theoreticians were justified in studying antigravity before the release of the 2023 report, the report’s findings suggest that the rationale for theoretical consideration offered in the 2022 paper by Dimopoulos et al. is no longer applicable.',
      'The theoretical approach represented in the 2022 paper by Dimopoulos et al. assumed that unambiguous proof of antigravity would not be achievable, but the results in the 2023 report undermine that assumption.',
      'Before 2023, researchers’ inordinate focus on theoretical considerations hindered the development of the experimental regimen for direct antihydrogen ballistics observations.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. Dimopoulos et al. were justified in theoretical inquiry when evidence was absent, but the 2023 CERN empirical observations demonstrating antihydrogen falls under standard gravity invalidated the premise that evidence against antigravity was lacking.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When assessing particle physics experiments and antimatter gravity'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'aa0968dd',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Poetry in Classical Nahuatl, the language of the Aztec Empire, relies on difrasismo, or a parallel noun construction that conventionally operates as a single metaphor. For example, the common difrasismo in cuauhtli in ocelotl (literally, “the eagle, the jaguar”) signifies “warrior.” The device’s function is both formal—providing structure to lines of verse—and ritual: semantic relations among the two nouns and the concept they signify can be tenuous, as in the previous example, such that difrasismos are often only intelligible according to the conceptual associations observed in Aztec ceremonial culture.\n\nWhich statement about the difrasismo in cuauhtli in ocelotl is most strongly supported by the text?',
    options: [
      'Its metaphorical significance derives from the semantic equivalence of the two nouns constituting the difrasismo.',
      'Its unintelligibility may cause its formal function within a line of verse to go unnoticed by present-day readers.',
      'Its apparent obscurity can be resolved when considered in the proper cultural context.',
      'Its frequency in Classical Nahuatl poetry confirms its intelligibility to the Aztec audience.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The text explains that because the literal semantic link between "eagle/jaguar" and "warrior" is tenuous, its meaning becomes clear only when interpreted through the conceptual associations of Aztec ceremonial culture.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing Indigenous poetics and Mesoamerican linguistics'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'd0f51067',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Modern dog breeds are largely the result of 160 years of owners crossbreeding certain dogs in order to select for particular physical appearances. Owners often say that some breeds are also more likely than others to have particular personality traits—basset hounds are affectionate; boxers are easy to train—but Kathleen Morrill and colleagues found through a combination of owner surveys and DNA sequencing of 2,000 dogs that while physical traits are predictably heritable among purebred dogs, behavior varies widely among dogs of the same breed.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Dog breeds would not exist without many years of human intervention in dogs’ reproduction.',
      'Research fails to confirm a commonly held belief about dog breeds and behavior.',
      'The dog breeds most popular among owners have often changed over the past 160 years.',
      'A study of dog breeds is notable for its usage of both opinion surveys and DNA sequencing.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The passage centers on research by Morrill et al. demonstrating that popular assumptions about breed-specific canine behaviors are not backed by genetics, as behavior varies widely within each breed.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating behavioural genetics and animal domestication'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '1c69ff20',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'For many years, the only existing fossil evidence of mixopterid eurypterids—an extinct family of large aquatic arthropods known as sea scorpions and related to modern arachnids and horseshoe crabs—came from four species living on the paleocontinent of Laurussia. In a discovery that expands our understanding of the geographical distribution of mixopterids, paleontologist Bo Wang and others have identified fossilized remains of a new mixopterid species, Terropterus xiushanensis, that lived over 400 million years ago on the paleocontinent of Gondwana.\n\nAccording to the text, why was Wang and his team’s discovery of the Terropterus xiushanensis fossil significant?',
    options: [
      'The fossil constitutes the first evidence found by scientists that mixopterids lived more than 400 million years ago.',
      'The fossil helps establish that mixopterids are more closely related to modern arachnids and horseshoe crabs than previously thought.',
      'The fossil helps establish a more accurate timeline of the evolution of mixopterids on the paleocontinents of Laurussia and Gondwana.',
      'The fossil constitutes the first evidence found by scientists that mixopterids existed outside the paleocontinent of Laurussia.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The discovery of Terropterus xiushanensis on Gondwana was significant because all previous fossil evidence of mixopterids had been confined solely to Laurussia.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When interpreting paleontological biogeography'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '36e2868f',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is from Thomas Mann’s 1924 novel The Magic Mountain, translated by John E. Woods in 1995.\n\nThe story of Hans Castorp that we intend to tell here—not for his sake (for the reader will come to know him as a perfectly ordinary, if engaging young man), but for the sake of the story itself, which seems to us to be very much worth telling (although in Hans Castorp’s favor it should be noted that it is his story, and that not every story happens to everybody)—is a story that took place long ago, and is, so to speak, covered with the patina of history and must necessarily be told with verbs whose tense is that of the deepest past.\n\nWhat does the text most strongly suggest about the story of Hans Castorp?',
    options: [
      'Though it is true that stories of even the most uninteresting people are themselves interesting because all people are unique, the reason this story is interesting is nonetheless difficult to understand because of the passage of time.',
      'Even though it is a story of a person of no particular importance, its age and the manner in which it therefore must be told are both indicators that the story itself is important.',
      'Like all stories about the lives of inconsequential people, this story must necessarily be related in a particular way if the reason the story is consequential is to be made evident to the audience.',
      'It is a remarkable story that happened to an unremarkable person, though one could plausibly argue that because the story is valuable, some of its value accrues to the person at its center.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer because it presents a statement about Hans Castorp’s story that is suggested by the text. The narrator indicates that the story about Hans Castorp will be told not because there is something particularly notable about him (he is "perfectly ordinary"), but because the story itself is remarkable ("very much worth telling"). The narrator notes that it is "in Hans Castorp’s favor" that the story is his, and that "not every story happens to everybody." Thus, the text suggests both that the story is remarkable happening to an unremarkable person and that the person at the center takes on some of the story’s value.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing narrative framing and philosophical novels'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '8d88740e',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is adapted from William Shakespeare’s 1597 play The Tragedy of King Richard III. Richard is reflecting on the recent arrest of his brother, the Duke of Clarence, on suspicion of treason against King Edward IV. Derby, Hastings, Buckingham, Rivers, Dorset, and Grey are also members of the English nobility.\n\nRICHARD: I do the wrong, and first begin to brawl.\nThe secret mischiefs that I set [flowing]\nI lay unto the grievous charge of others.\nClarence, whom I indeed have cast in darkness,\nI do beweep to many simple [gullible people],\nNamely, to Derby, Hastings, Buckingham;\nAnd tell them ’tis the Queen and her allies\nThat stir the King against the Duke my brother.\nNow they believe it, and withal whet me\nTo be revenged on Rivers, Dorset, Grey.\n\nWhich choice best describes what happens in the text?',
    options: [
      'Richard describes having wept as he informed Derby, Hastings, and Buckingham that the queen and her allies convinced the king to act against Clarence, and says that the earnestness of his grief caused them to accept his version of events.',
      'Richard attributes Clarence’s troubles to both his own secret plotting and the distrust of Clarence that the queen and her allies Derby, Hastings, and Buckingham have planted in the king’s mind.',
      'Richard indicates that he has pretended to be aggrieved about Clarence’s situation and has proclaimed it to be the fault of the queen and her allies, but in reality, he has caused the hostility the king feels toward Clarence.',
      'Richard acknowledges that his mischievous nature has spurred him to commit misdeeds in the past, including instigating enmity between the king and Clarence, but he reports that he has hitherto not lost the trust of the queen and her allies.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. In this soliloquy, Richard reveals that while he engineered Clarence\'s downfall himself, he feigns sorrow and falsely blames the Queen and her allies to turn the nobility against them.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing dramatic soliloquies and dramatic irony'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'dcca0dfc',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is from Mick Herron’s 2023 novel The Secret Hours. The narrator is describing members of a government committee.\n\nFinally, and adding much-needed gravitas, was Sir Winston Day, whose features seemed moulded to adorn a bust, or possibly a stamp, and whose forehead was so evidently bulging with grey matter that it would have been impertinent to inquire too closely into the actual achievements his half century of public service had produced. His recently published memoirs possibly cast light on this enigma, but given that such details were not provided until after the thirty-page mark, they might as well have remained state secrets.\n\nBased on the text, which choice best describes Sir Winston Day?',
    options: [
      'He has the appearance of a distinguished figure, but it is uncertain whether he has accomplished anything to earn distinction.',
      'He looks like a person worthy of respect, but his memoirs reveal that some of his actions were dishonorable.',
      'He would be a celebrated public figure if his achievements did not have to be kept secret.',
      'He has maintained a modest profile even though he has served the public capably for many years.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text uses satire to convey that while Sir Winston Day looks impressively dignified ("moulded to adorn a bust"), whether he actually accomplished anything notable across fifty years remains an unverified enigma.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing satire and irony in contemporary fiction'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '23ecf625',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Conservationists worldwide are working to protect ecosystems from habitat destruction and biodiversity loss, and in many cases, initiatives that rely on natural features or processes can help address such challenges. In response to a rapidly dwindling population of blueback salmon, the Quinault Indian Nation (a tribe in Washington State) partnered with the conservation organization Wild Salmon Center to restore naturally occurring logjams in the Quinault River. The logjams create shady pools where the blueback salmon can rest and spawn, thus promoting blueback population recovery.\n\nWhich choice best states the main idea of the text?',
    options: [
      'A partnership between the Quinault Indian Nation and Wild Salmon Center shows the importance of collaborative approaches to preserving biodiversity.',
      'Nature-based approaches can be effective ways to achieve conservation goals.',
      'As indicated by a recent project, logjams help the blueback salmon thrive and reproduce.',
      'Scientists now realize that nature-based conservation methods offer better long-term solutions to environmental issues than methods that are not nature-based do.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The text states that initiatives relying on natural processes help protect ecosystems, using the Quinault River logjam restoration as an illustrative example of successful nature-based conservation.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When determining overarching thesis statements in environmental science'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '7f0be746',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is from Milan Kundera’s 1984 novel The Unbearable Lightness of Being (translated by Michael Henry Heim in 1984). Karenin is a dog that belongs to Tomas and Tereza.\n\nKarenin was not overjoyed by the move to Switzerland [from Prague]. Karenin hated change. Dog time cannot be plotted along a straight line; it does not move on and on, from one thing to the next. It moves in a circle like the hands of a clock, which—they, too, unwilling to dash madly ahead—turn round and round the face, day in and day out following the same path. In Prague, when Tomas and Tereza bought a new chair or moved a flower pot, Karenin would look on in displeasure. It disturbed his sense of time. It was as though they were trying to dupe the hands of the clock by changing the numbers on its face.\n\nWhich choice best states the main idea of the text?',
    options: [
      'As a dog, Karenin possesses a sense of time that involves a strong preference for predictability and an aversion to disruption.',
      'After he’s moved to a new home, Karenin’s negative response to changes has become more pronounced.',
      'Similar to Tomas and Tereza, Karenin comprehends time as circular rather than as a straightforward progression.',
      'As is the case for other dogs, Karenin’s sense of time seems to accelerate depending on the objects and places that surround him.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text centers on Karenin\'s circular conception of time, illustrating that any alteration in routine or environment upsets his fundamental need for stability and predictability.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing philosophical metaphors in modern European novels'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '4d3e3c52',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'In a paper about p-i-n planar perovskite solar cells (one of several perovskite cell architectures designed to collect and store solar power), Lyndsey McMillon-Brown et al. describe a method for fabricating the cell’s electronic transport layer (ETL) using a spray coating. Conventional ETL fabrication is accomplished using a solution of nanoparticles. The process can result in a loss of up to 80% of the solution, increasing the cost of manufacturing at scale—an issue that may be obviated by spray coating fabrication, which the researchers describe as “highly reproducible, concise, and practical.”\n\nWhat does the text most strongly suggest about conventional ETL fabrication?',
    options: [
      'It is less suitable for manufacturing large volumes of planar p-i-n perovskite solar cells than an alternative fabrication method may be.',
      'It is more expensive when manufacturing at scale than are processes for fabricating ETLs used in other perovskite solar cell architectures.',
      'It typically entails a greater loss of nanoparticle solution than do other established approaches for ETL fabrication.',
      'It is somewhat imprecise and therefore limits the potential effectiveness of p-i-n planar perovskite solar cells at capturing and storing solar power.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text states that conventional ETL fabrication wastes up to 80% of solution, driving up commercial scaling costs—making it less suitable for high-volume manufacturing than spray coating.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating materials science and solar cell manufacturing'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'd1b8a9ad',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Disco remains one of the most ridiculed popular music genres of the late twentieth century. But as scholars have argued, the genre is far less superficial than many people believe. Take the case of disco icon Donna Summer: she may have been associated with popular songs about love and heartbreak (subjects hardly unique to disco, by the way), but like many Black women singers before her, much of her music also reflects concerns about community and identity. These concerns are present in many of the genre’s greatest songs, and they generally don’t require much digging to reveal.\n\nWhat does the text most strongly suggest about the disco genre?',
    options: [
      'It has been unjustly ignored by most scholars despite the importance of the themes addressed by many of the genre’s songs.',
      'It evolved over time from a superficial genre focused on romance to a genre focused on more serious concerns.',
      'It has been unfairly dismissed for the inclusion of subject matter that is also found in other musical genres.',
      'It gave rise to a Black women’s musical tradition that has endured even though the genre itself faded in the late twentieth century.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The text argues that disco was unfairly derided as superficial for focusing on love and heartbreak—themes common across many respected musical genres—while overlooking its deeper exploration of identity.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating cultural musicology and critical reevaluations'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '8c39592a',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is adapted from William Shakespeare’s 1598 play Henry IV, Part 1. King Henry is addressing several noblemen who are rumored to have been disloyal to him.\n\nKING HENRY: My blood hath been too cold and temperate,\nUnapt to stir at these indignities,\nAnd you have found me, for accordingly\nYou tread upon my patience; but be sure\nI will from henceforth rather be myself,\nMighty and to be fear’d, than my [disposition],\nWhich hath been smooth as oil, soft as young down,\nAnd therefore lost that title of respect\nWhich the proud soul ne’er pays but to the proud.\n\nWhich statement best describes how King Henry presents himself in the text?',
    options: [
      'He declares that he has judged the noblemen’s conduct in an impartial manner, and that despite their attempts to regain his trust through professions of submissiveness, they have irrevocably lost his respect.',
      'He acknowledges to the noblemen that his tolerance of their conduct has undermined their respect for him, and he resolves to display his genuine nature, which is more forceful and compels deference.',
      'He defends his calm disposition, which he sees as fundamental to his personality, and vows to maintain his tranquil demeanor even if it causes him to lose the respect of overly proud noblemen.',
      'He concedes that he has treated the noblemen with indifference, which in part explains why they have defied him, but he asserts that their disrespectful behavior is primarily driven by their excessive pride.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. King Henry admits that his previous mildness caused the nobles to take advantage of his patience, prompting him to discard that soft demeanor and enforce his rightful, formidable authority.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When interpreting royal authority and rhetoric in Shakespearean drama'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'e80ba20d',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Philosophers note that many people have an intuitive sense that while we ought not to lie, there may be circumstances in which lying is permissible. If this intuition is correct and we lack an inviolable duty to speak truthfully, what grounds opposition to lying in the first place? Japa Pallikkathayil has advanced one answer by appealing to a duty to respect others’ agential interests: the possession of false beliefs constrains agency, and thus we ought not to impede the formation of true beliefs unless doing so prevents a greater constraint on someone’s agency or an otherwise impermissible end.\n\nWhich choice best states the main idea of the text?',
    options: [
      'One potential means of justifying opposition to lying is Pallikkathayil’s argument that we have an obligation to respect other people’s agency that entails a commitment to truthfulness except in certain circumstances.',
      'Many people have an intuitive sense that lying is permissible in some circumstances but lack a principled way to identify those circumstances, and Pallikkathayil’s argument may provide a means of resolving that problem.',
      'Pallikkathayil’s argument suggests that if we have a duty to respect other people’s agential interests and if possession of false beliefs constrains agency, then we have an inviolable duty to speak truthfully.',
      'Pallikkathayil’s argument shows that if our intuition that circumstances may make lying permissible is correct, then it is unclear whether there are any grounds for an opposition to lying in the first place.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text presents Japa Pallikkathayil\'s philosophical framework: the moral objection to lying rests on respecting personal agency, which requires truthfulness except when lying avoids a greater violation of agency.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating normative ethics and moral philosophy'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '16025337',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is adapted from William Shakespeare’s 1609 poem “Sonnet 27.” The poem is addressed to a close friend as if he were physically present.\n\nWeary with toil, I [hurry] to my bed,\nThe dear repose for limbs with travel tired;\nBut then begins a journey in my head\nTo work my mind, when body’s work’s expired:\nFor then my thoughts—from far where I abide—\n[Begin] a zealous pilgrimage to thee,\nAnd keep my drooping eyelids open wide,\n\nWhat is the main idea of the text?',
    options: [
      'The speaker is asleep and dreaming about traveling to see the friend.',
      'The speaker is planning an upcoming trip to the friend’s house.',
      'The speaker is too fatigued to continue a discussion with the friend.',
      'The speaker is thinking about the friend instead of immediately falling asleep.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. Although physically exhausted from travel, the speaker lies awake as his thoughts embark on a zealous mental pilgrimage toward his beloved friend, keeping his eyelids open.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing themes and sleeplessness in Renaissance sonnets'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '8f3a200e',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Some astronomers searching for extraterrestrial life have proposed that atmospheric NH3 (ammonia) can serve as a biosignature gas—an indication that a planet harbors life. Jingcheng Huang, Sara Seager, and colleagues evaluated this possibility, finding that on rocky planets, atmospheric NH3 likely couldn’t reach detectably high levels in the absence of biological activity. But the team also found that on so-called mini-Neptunes—gas planets smaller than Neptune but with atmospheres similar to Neptune’s—atmospheric pressure and temperature can be high enough to produce atmospheric NH3.\n\nBased on the text, Huang, Seager, and colleagues would most likely agree with which statement about atmospheric NH3?',
    options: [
      'Its presence is more likely to indicate that a planet is a mini-Neptune than that the planet is a rocky planet that could support life.',
      'Its absence from a planet that’s not a mini-Neptune indicates that the planet probably doesn’t have life.',
      'It should be treated as a biosignature gas if detected in the atmosphere of a rocky planet but not if detected in the atmosphere of a mini-Neptune.',
      'It doesn’t reliably reach high enough concentrations in the atmospheres of rocky planets or mini-Neptunes to be treated as a biosignature gas.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. On rocky planets NH3 requires biological synthesis (making it a biosignature), whereas on mini-Neptunes abiotic thermal and pressure dynamics produce NH3 naturally without life.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating biosignatures in planetary astronomy'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'db2da2bf',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'In 2019, 20 previously unknown moons were confirmed to be orbiting Saturn. Three of the moons have prograde orbits (orbiting in the direction the planet spins), and the other 17 have retrograde orbits (orbiting in the opposite direction of the planet’s spin). All but one of the 20 moons are thought to be remnants of bodies that orbited Saturn until they broke apart in collisions. Although the one exceptional moon orbits in the same direction as the planet’s spin, its orbit is highly eccentric compared to the rest, which may suggest that it has a different origin than the other 19 moons.\n\nBased on the text, which choice best describes the moon with the eccentric orbit?',
    options: [
      'It doesn’t have a retrograde orbit, but it likely has the same origin as the moons with retrograde orbits.',
      'Its orbit is so tilted with respect to the other moons’ orbits that it’s neither prograde nor retrograde.',
      'It has a prograde orbit that is likely the result of having collided with another body orbiting Saturn.',
      'It has a prograde orbit and may not be a remnant of an earlier body that orbited Saturn.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text specifies that 19 moons are collision remnants, while the one moon with a prograde, highly eccentric orbit likely has a different origin and may not be a collision fragment.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing planetary satellite dynamics and orbital mechanics'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '34c2e387',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Jürgen Kocka and other historians of capitalism rarely discuss domestic capitalism in Africa before the period of European colonization, implicitly presenting capitalism as external to and imposed on Africa. Crislayne Alfagali and other Africanist scholars have shown, however, that in parts of Africa, returns-focused investment, the establishment of open markets for wage labor, and other features of capitalism predated colonization. One reason for this discrepancy is that historians of capitalism tend to focus on longitudinal economic data drawn from archival records, which do not exist for much of precolonial Africa.\n\nWhich statement about Alfagali and other Africanist scholars is best supported by information in the text?',
    options: [
      'They likely make use of different types of evidence than historians of capitalism typically rely on.',
      'They likely differ from historians of capitalism in the methods they use to derive longitudinal economic data from archival records.',
      'They likely have a different view about which activities should be considered capitalist in nature than historians of capitalism do.',
      'They likely view capitalism as having been more beneficial for Africa than historians of capitalism do.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. Because traditional archival longitudinal records do not exist for precolonial Africa, Africanist scholars demonstrating indigenous capitalism must rely on alternative evidentiary sources.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating African economic history and historiography'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '2df56712',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Electronic music pioneer Wendy Carlos is credited with the music for three feature films: A Clockwork Orange (1971), The Shining (1980), and Tron (1982). However, her musical score for A Clockwork Orange is mostly made up of her arrangements of Ludwig van Beethoven’s work. Also, almost all the music that she and Rachel Elkind composed for The Shining was unused by director Stanley Kubrick. It did not appear in the film. Of the three films, Tron is the one in which audiences can hear the most of Carlos’s original compositions.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Of the three films for which Carlos is credited, Tron features the most original music from her.',
      'The director of The Shining used most of the music that Carlos composed for it.',
      'Beethoven is widely considered to be a more important composer than Carlos.',
      'Carlos is a notable innovator among film composers in the 1970s and 1980s.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text systematically reviews Wendy Carlos\'s three film credits, showing that Tron contains the greatest proportion of her original compositions.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When summarizing electronic music and film composition history'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '881ba6f1',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Eighteenth-century economist Adam Smith is famed for his metaphor of the invisible hand, which he putatively used to illustrate a robust model of how individuals produce aggregate benefits by pursuing their own economic interests. Note “putatively”: as Gavin Kennedy has shown, Smith deploys this metaphor only once in his economic writings—to make a narrow point about the then-dominant economic theory of mercantilism—and it was largely ignored until some twentieth-century economists eager to secure an intellectual pedigree for their views elevated it to a fully-fledged paradigm.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Although Smith is famed for his metaphor of the invisible hand, the metaphor was largely ignored until economists in the twentieth century came to realize that the metaphor was a robust model that anticipated their own views.',
      'Some twentieth-century economists gave Smith’s metaphor of the invisible hand a significance it does not have in Smith’s work, but it is nevertheless a useful model of how individuals produce aggregate benefits by pursuing their own economic interests.',
      'Smith’s metaphor of the invisible hand has been interpreted as a model of how individuals acting in their own interest produce aggregate benefits, but it was intended as a subtle critique of the economic theory of mercantilism.',
      'The reputation of Smith’s metaphor of the invisible hand is not due to the importance of the metaphor in Smith’s work but rather to the promotion of the metaphor by some later economists for their own ends.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The text highlights that Adam Smith used the invisible hand only once for a narrow critique, and its modern fame was retroactively manufactured by 20th-century economists seeking an intellectual pedigree.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating the history of economic thought'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '7812801f',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The fynbos shrubland is a diverse habitat found only in South Africa. It is adjacent to the Afro-temperate forest, with almost no transition space between the two distinct habitats. Plants in the fynbos have uniquely thin and long root systems that spread out over large distances to absorb nutrients from the soil. Ecologists transplanted tree seedlings from the forest into plots in the fynbos. Seedlings in plots isolated from the roots of fynbos plants exhibited a growth rate five times greater than that of the seedlings in plots in close proximity to the roots of fynbos plants.\n\nBased on the text, what role do fynbos roots most likely have in maintaining the border between the fynbos shrubland and the Afro-temperate forest habitats?',
    options: [
      'Fynbos roots damage the root systems of forest plants, leaving those plants unable to acquire sufficient nutrients.',
      'Fynbos roots extend close enough to the forest plants’ roots that they constitute a physical barrier that forest plants’ roots cannot pass.',
      'The root systems of fynbos plants allow the plants to take in so many soil nutrients that forest plants are prevented from flourishing in the fynbos.',
      'The root systems of fynbos plants enhance the soil immediately surrounding the plants, allowing them to thrive in an otherwise harsh habitat.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. Fynbos root systems are highly efficient at extracting scarce soil nutrients, effectively starving encroaching forest tree seedlings and preventing them from establishing in the shrubland.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating botanical competition and ecosystem boundaries'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '7aa510fb',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'In their meta-analysis of research on advergames (video games developed to promote products or services), Zeph M.C. van Berlo et al. confirm that such games, though they can elicit player interest, may not facilitate subsequent recall of product and brand information. This phenomenon can be explained by the finite nature of cognitive capacity as it is articulated in Annie Lang’s limited capacity model of motivated mediated message processing. In this case, players’ cognitive resources are directed foremost toward the advergame’s mechanics, leaving little or no capacity for encoding and storing the information the advertiser intends to be salient.\n\nWhich choice best states the main idea of the text?',
    options: [
      'The limited capacity model of motivated mediated message processing developed by Lang provides a means of explaining the finding by van Berlo et al. that players may not readily recollect the brand and product information embedded in advergames.',
      'Research by van Berlo et al. corroborates Lang’s conclusion that because people predominantly focus on game mechanics when playing video games, it is difficult for advergames to communicate brand and product information in ways that are highly memorable.',
      'The meta-analysis by van Berlo et al. reveals that higher engagement in advergame mechanics is linked to lower effectiveness in persuading players to purchase particular brands and products.',
      'Although the limited capacity model of motivated mediated message processing developed by Lang suggests otherwise, advergames can succeed as marketing tools, provided that they achieve a balance between game mechanics and the promotion of a brand or product.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text pairs van Berlo’s finding that advergames fail to promote brand recall with Lang\'s limited capacity model, explaining that game mechanics absorb cognitive resources needed to encode brand details.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing cognitive psychology models in media studies'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '5eda42a3',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is from Maggie Pogue Johnson’s 1910 poem “Poet of Our Race.” In this poem, the speaker is addressing Paul Laurence Dunbar, a Black author.\n\nThou, with stroke of mighty pen,\nHast told of joy and mirth,\nAnd read the hearts and souls of men\nAs cradled from their birth.\n\nThe language of the flowers,\nThou hast read them all,\nAnd e’en the little brook\nResponded to thy call.\n\nWhich choice best states the main purpose of the text?',
    options: [
      'To praise a certain writer for being especially perceptive regarding people and nature',
      'To establish that a certain writer has read extensively about a variety of topics',
      'To call attention to a certain writer’s careful and elaborately detailed writing process',
      'To recount fond memories of an afternoon spent in nature with a certain writer'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The poem celebrates Dunbar\'s extraordinary poetic insight, praising his ability to capture human emotion ("read the hearts and souls of men") and understand the natural world ("language of the flowers").',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When determining poetic tribute purpose and imagery'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '251e5281',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Studies of ocean wave breaking have predominantly focused on traveling waves (those propagating along the horizontal plane), so Mark McAllister et al. utilized a circular wave tank to produce and study spike waves, axisymmetric standing waves that can erupt vertically when traveling waves propagating in opposing directions intersect. Traveling waves break when wave steepness (height-to-length ratio) passes a critical threshold; breaking thus constrains wave height. McAllister et al. found that spike waves can exceed that constraint, as other factors than just steepness (e.g., jet stability and cavity shape) mediate spike-wave breaking.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Previous studies have suggested that steepness mediates breaking in traveling waves, but the study by McAllister et al. shows that jet stability and cavity shape may also influence breaking in such waves.',
      'The process of breaking limits the height of traveling waves, but the study by McAllister et al. suggests that spike waves can exceed those limits if their height-to-length ratio reaches a critical threshold.',
      'McAllister et al. suggest that spike waves can form when traveling waves propagating in opposing directions intersect and that spike waves tend to be higher than traveling waves.',
      'The study by McAllister et al. suggests that when traveling waves intersect in specific ways, the resulting wave may be higher than would be expected based on the properties of traveling waves.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. McAllister et al.\'s research shows that intersecting opposing waves can generate vertical spike waves that bypass standard horizontal steepness limits and reach greater heights than expected.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating oceanographic wave mechanics and fluid dynamics'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '024eb2ec',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Through adaptive radiation, multiple species of Tetragnatha—a genus of orb-weaving spiders—have significantly diversified their web architecture over a relatively short timescale. To investigate whether the material properties of Tetragnatha silk have been similarly affected by this evolutionary process, Angela M. Alicea-Serrano et al. examined the chemical composition of both the radial (non-sticky threads extending from the center) and capture (sticky threads that hold prey) silks that form the web as well as tested the tensile strength and viscosity of samples collected from three Tetragnatha species at two sites in the Hawaiian archipelago. The team found significant interspecies variation in these biomaterials.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Research reveals that web architecture among species of Tetragnatha spiders has likely diversified more rapidly than the material properties of Tetragnatha’s silk have.',
      'Research suggests that the material properties of silk from species of Tetragnatha spiders have diversified during adaptive radiation.',
      'A study indicates that variations in web architecture among species of Tetragnatha spiders can likely be explained by corresponding variations in the material properties of their silks.',
      'A study shows that adaptive radiation can explain interspecies variation in the web architecture of Tetragnatha spiders but not in the material properties of the spiders’ silk.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The study confirms that just as Tetragnatha spiders diversified their web architecture during adaptive radiation, the material and chemical properties of their silk also diversified significantly.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating evolutionary biology and biomaterials'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '4a5bda7a',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'In a study of perceptions of listening ability, participants explained their position on a sociopolitical issue and then received a listener’s written summary that expressed agreement or disagreement. Within selected summaries, researchers embedded markers of attentive listening (e.g., references to specific details), hypothesizing that such indications would positively influence perceptions of listening skill even in the context of disagreement. Instead, participants consistently rated listeners who expressed disagreement as less skilled, regardless of the other traits of the listeners’ summaries.\n\nWhat does the text most strongly imply about how participants responded to expressions of disagreement?',
    options: [
      'When participants felt personally invested in the topics they discussed, they were less likely to perceive listeners who expressed disagreement as attentive, regardless of evidence to the contrary in these listeners’ summaries.',
      'When participants encountered summaries from listeners who expressed disagreement with their views, participants tended to disregard evidence that the listeners had in fact been attentive.',
      'Although participants maintained their positions regardless of a summary’s level of detail, they tended to regard listeners who expressed disagreement as more attentive when these listeners provided more detailed summaries.',
      'Although participants were critical of expressions of disagreement, they gave higher ratings to listeners whose summaries included markers of attentiveness than to listeners whose summaries did not include these markers.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. The experiment showed that participants rated disagreeing listeners as less skilled even when the summaries contained explicit proof of attentive listening, indicating participants ignored evidence of attentiveness when disagreement occurred.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating interpersonal communication and cognitive bias'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'a12a83ce',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is from William Shakespeare’s play The Tempest, first performed in 1611. Miranda has lived on an island with her father, Prospero, since she was three years old. Prospero has stated that Miranda likely does not remember anything other than her life on the island.\n\nMIRANDA: ’Tis far off,\nAnd rather like a dream than an assurance\nThat my remembrance warrants. Had I not\nFour or five women once that tended me?\n\nPROSPERO: Thou hadst, and more, Miranda. But how is it\nThat this lives in thy mind? What seest thou else\nIn the dark backward and abysm of time?\nIf thou remember’st ought ere thou camest here,\nHow thou camest here thou mayst.\n\nIn the text, which point does Prospero most directly make about Miranda and her memories?',
    options: [
      'Miranda’s reminiscences about her early childhood have a melancholy quality that betrays her discontented view of her current circumstances.',
      'Miranda’s doubts about the accuracy of one recollection of a place other than the island are clouding her judgment and seem to be making her reluctant to explore her recollection of traveling to the island.',
      'Miranda’s ability to summon details of an experience she had before arriving on the island suggests that she may also be able to summon details of her arrival on the island.',
      'Miranda’s impression of a scene is vague because she is remembering a scenario she had daydreamed about as a child rather than a scenario that had occurred in reality.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. Prospero reasons that since Miranda can recall early memories of the women who attended her prior to arriving on the island, she might also be capable of remembering the voyage that brought them there.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing memory and dialogue in Jacobean drama'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '16ce90d9',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'In 2018, scientists discovered an immense aggregation of Muusoctopus robustus (pearl octopuses) along a hydrothermal vent 3,200 meters beneath the ocean’s surface. Water temperatures at this site—named the Octopus Garden—climb as high as 11°C, much warmer than the ambient 1.6°C typical at this depth. Based on observations made over three years, scientists concluded that temperatures at the site likely confer reproductive benefits and that the site is used exclusively for reproduction—6,000 M. robustus adults, hatchlings, and eggs were observed at the garden, but no juveniles were present.\n\nWhich statement about M. robustus and the Octopus Garden is best supported by the text?',
    options: [
      'M. robustus leave the Octopus Garden upon reaching an intermediary stage of development.',
      'The M. robustus population at the Octopus Garden remains stable despite variations in water temperature.',
      'M. robustus nests in the Octopus Garden contain on average fewer but larger eggs than nests at similar ocean depths.',
      'The Octopus Garden provides an ideal feeding ground for M. robustus hatchlings.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. Because researchers observed only adults, brooding eggs, and newly emerged hatchlings but no intermediate juvenile octopuses, it is inferred that pearl octopuses leave the warm hydrothermal site as juveniles.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating deep-sea ecology and hydrothermal vents'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '5869a196',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Hypothesizing that reliance on smartphones for information retrieval will lead a person to incorrectly remember instances of phone-assisted retrieval as instances of retrieval from memory, researchers asked participants general-knowledge trivia questions, instructing them to answer certain questions using only their smartphone and other questions using only their memory. When surveyed a week later, participants exhibited higher levels of misattribution for answers retrieved in the smartphone condition than for those retrieved in the memory condition, a finding that the researchers claimed supported their hypothesis.\n\nWhich question would be most useful to answer in determining the validity of the researchers’ claim as it is presented in the text?',
    options: [
      'Were participants as likely to remember the source of their information when asked a week later as they would have been if asked immediately after answering the trivia questions?',
      'Were participants less confident about the accuracy of information they were instructed to retrieve from a smartphone than they were of that retrieved from their own memory?',
      'How likely were participants to answer all the trivia questions correctly in both the smartphone and the memory conditions?',
      'How did participants attribute information they were instructed to retrieve from a smartphone in instances when they already knew that information independently of their phone?'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. To evaluate whether reliance on a smartphone genuinely caused false memory attribution, researchers must know whether participants already held that trivia knowledge prior to using the phone.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating cognitive psychology experiments and source memory'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'daa90829',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is adapted from Fanny Burney’s 1778 novel Evelina. The text is an excerpt from a letter by Lady Howard to Evelina’s guardian, Reverend Villars, in which Lady Howard discusses an upcoming trip to London planned by her daughter Mrs. Mirvan’s family.\n\nIt is very earnestly [the Mirvans’] wish to enlarge and enliven their party by the addition of your amiable ward, who would share, equally with her own daughter, the care and attention of Mrs. Mirvan. Do not start at this proposal; it is time that [Evelina] should see something of the world. When young people are too rigidly sequestered from it, their lively and romantic imaginations paint it to them as a paradise of which they have been beguiled; but when they are shown it properly, and in due time, they see it such as it really is, equally shared by pain and pleasure, hope and disappointment.\n\nBased on the text, Lady Howard would most likely agree with which statement about Reverend Villars?',
    options: [
      'Although the manner in which he has raised Evelina is in many ways exemplary, he has been misguided in shielding her from the influence of other young people.',
      'He has imparted to Evelina his own idealistic view of the world, which results in her being unprepared to face inevitable disappointments.',
      'Although his desire to guard Evelina from unscrupulous people is commendable, his general mistrust has led him to be unduly wary of the Mirvans.',
      'He is overly protective of Evelina, who would likely benefit from a greater variety of experiences than she has had thus far.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. Lady Howard urges Reverend Villars not to resist letting Evelina visit London, cautioning that keeping her too sheltered prevents her from gaining a realistic understanding of the world.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing epistolary novels and 18th-century social conventions'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '7c9a65bb',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Optical tweezers are specialized scientific tools—particularly useful in biology and medicine—that use high-powered beams of light to trap and manipulate minuscule particles for study. Use of the tool has led to several scientific and medical breakthroughs over the last few decades, but the particles are often under prolonged exposure to the intense heat of the light beams. To overcome the risk of overheating, and thereby damage, researchers sometimes attach nano-sized glass beads to particles, allowing the light to focus on the beads instead of the particles.\n\nBased on the text, what is one advantage of attaching glass beads to particles when using optical tweezers?',
    options: [
      'It decreases the time it takes for the optical tweezers to locate and capture the particles.',
      'It facilitates the maneuvering of particles without directly heating the particles themselves.',
      'It allows researchers to use weaker light beams to manipulate particles.',
      'It adds a material to which particles can transfer any heat absorbed from the optical tweezers’ light beam.'
    ],
    correctAnswer: 1,
    explanation: 'Choice B is the best answer. By directing laser focus onto nano-sized glass beads, optical tweezers can steer biological samples without subjecting the delicate particles themselves to damaging direct heating.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating biophysics instrumentation and laser technology'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '6762772f',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Artificial leaves are a developing renewable energy technology that mimics the process of photosynthesis in plants. These devices are silicon-based solar cells coated in chemical catalysts that activate reactions that split water molecules into hydrogen and oxygen gas. The technology, while generating lots of interest, is not yet commercially viable as a large-scale energy source. To meet this challenge, scientists from many fields are researching ways to store, transport, and distribute the energy the devices produce while other scientists are working to improve the cost and efficiency of the devices.\n\nWhich choice best states the main idea of the text?',
    options: [
      'Continued research and development in artificial-leaf technology is needed before the devices can be widely used as an energy source.',
      'The recent increase in the commercial use of artificial leaves as an energy source has encouraged many scientists to research ways to improve the technology.',
      'Artificial leaves split water molecules into oxygen and hydrogen gas using catalysts more efficiently than plants do using the process of photosynthesis.',
      'Artificial leaves were developed to mimic the natural process of photosynthesis in plants in order to store energy for long-term commercial use.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The text explains that while artificial leaves show great promise in producing clean hydrogen fuel, extensive ongoing research on cost, efficiency, and storage is necessary before they become commercially viable.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When evaluating renewable energy technology and artificial photosynthesis'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '303537cf',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is adapted from Lewis Carroll’s 1889 satirical novel Sylvie and Bruno. A crowd has gathered outside a room belonging to the Warden, an official who reports to the Lord Chancellor.\n\nOne man, who was more excited than the rest, flung his hat high into the air, and shouted (as well as I could make out) “Who roar for the Sub-Warden?” Everybody roared, but whether it was for the Sub-Warden, or not, did not clearly appear: some were shouting “Bread!” and some “Taxes!”, but no one seemed to know what it was they really wanted.\n\nAll this I saw from the open window of the Warden’s breakfast-saloon, looking across the shoulder of the Lord Chancellor.\n\n“What can it all mean?” he kept repeating to himself. “I never heard such shouting before—and at this time of the morning, too! And with such unanimity!”\n\nBased on the text, how does the Lord Chancellor respond to the crowd?',
    options: [
      'He asks about the meaning of the crowd’s shouting, even though he claims to know what the crowd wants.',
      'He indicates a desire to speak to the crowd, even though the crowd has asked to speak to the Sub-Warden.',
      'He expresses sympathy for the crowd’s demands, even though the crowd’s shouting annoys him.',
      'He describes the crowd as being united, even though the crowd clearly appears otherwise.'
    ],
    correctAnswer: 3,
    explanation: 'Choice D is the best answer. The humor and irony in the scene comes from the Lord Chancellor marveling at the crowd\'s "unanimity" when the narrator explicitly shows that people are shouting entirely contradictory demands.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing irony and satire in Victorian literature'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'b69d821d',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'The following text is Vita Sackville-West’s circa 1920 poem “Evening.” Spars are ships’ masts, moorings are ropes that hold docked ships in place, and a riding-light is a light that a ship shines when it is anchored.\n\nWhen little lights in little ports come out,\nQuivering down through water with the stars,\nAnd all the fishing fleet of slender spars\nRange at their moorings, veer with tide about;\n\nWhen race of wind is stilled and sails are furled,\nAnd underneath our single riding-light\nThe curve of black-ribbed deck gleams palely white,\nAnd slumbrous waters pool a slumbrous world;\n\n—Then, and then only, have I thought how sweet\nOld age might sink upon a windy youth,\nQuiet beneath the riding-light of truth,\nWeathered through storms, and gracious in retreat.\n\nWhich choice best states the main idea of the text?',
    options: [
      'The tranquility of a port in the evening can incline a person to appreciate the stillness of old age.',
      'The difficulty of bringing a ship into port is apt training for dealing with the types of struggles encountered in old age.',
      'A person who leads a long life that is varied and active may find it difficult to stay in a calm place.',
      'The contrast between the peacefulness of a port at night and its activity during the day reflects the contrast between the calm of old age and the vibrancy of youth.'
    ],
    correctAnswer: 0,
    explanation: 'Choice A is the best answer. The speaker watches an evening port settle into calm, anchored stillness, which prompts a peaceful reflection on how sweet old age can be after the storm of a windy youth.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When interpreting extended metaphors in lyric poetry'
    },
    createdAt: '2026-08-14T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: 'a3fb5e77',
    section: 'reading-writing',
    domain: 'information-ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'expert',
    questionText: 'Some animal-behavior studies involve observing wild animals in their natural habitat, and some involve capturing wild animals and observing them in a laboratory. Each approach has advantages over the other. In wild studies, researchers can more easily presume that the animals are behaving normally, and in lab studies, researchers can more easily control factors that might affect the results. But if, for example, the results from a wild study and a lab study of Western scrub-jays (Aphelocoma californica) contradict each other, one or both of the studies must have failed to account for some factor that was relevant to the birds’ behavior.\n\nWhich choice best states the main idea of the text?',
    options: [
      'When the results of a natural-habitat study and those from a lab study of a wild animal such as the Western scrub-jay conflict, the study in the natural habitat is more likely than the lab study to have accurate results.',
      'Studying wild animals such as the Western scrub-jay in both their natural habitat and lab settings is likely to yield conflicting results that researchers cannot fully resolve.',
      'Wild animals such as the Western scrub-jay can be effectively studied in their natural habitat and in the lab, but each approach has drawbacks that could affect the accuracy of the findings.',
      'Differing results between natural-habitat and lab studies of wild animals such as the Western scrub-jay are a strong indication that both of the studies had design flaws that affected the accuracy of their results.'
    ],
    correctAnswer: 2,
    explanation: 'Choice C is the best answer. The passage balances the respective strengths and limitations of field and laboratory studies in ethology, noting that unexamined variables in either setting can lead to discrepancies.',
    textbookRef: {
      textbookId: 'sat-rw-mastery',
      page: 16,
      highlightedText: 'When analyzing methodological comparisons in behavioral ecology'
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
