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
