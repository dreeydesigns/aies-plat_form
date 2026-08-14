import { Textbook } from '../types';

export const initialTextbooks: Textbook[] = [
  {
    id: 'sat-reading-central-ideas',
    title: 'Digital SAT Reading & Writing: Information & Ideas Mastery',
    author: 'AIES Reading & Humanities Faculty',
    publisherOrOwner: 'AIES Academic Press (Original Content)',
    coverColor: 'from-teal-600 to-emerald-800',
    pages: [
      {
        pageNumber: 1,
        content: `Central Ideas and Details in Literary Passages:
Literary passages on the Digital SAT evaluate your ability to identify the primary theme, emotional subtext, or central action of short excerpts from classic and contemporary literature.

Key Principles:
1. Focus on the whole passage, not an isolated detail: A correct "main idea" must encapsulate the overarching arc of the excerpt rather than a single sentence.
2. Track character interiority and relationships: Notice how characters' thoughts, feelings, and actions reveal their internal motivations and external standing.
3. Distinguish tone and subtext: Notice when reactions represent delight rather than fear, fond admiration rather than jealousy, or subtle communication rather than direct assertion.`,
        sections: [
          {
            heading: 'Literature Case Study 1: Jane Austen’s Sense and Sensibility (Elinor Dashwood)',
            text: 'Passage Analysis: Elinor, though "only nineteen," possesses a "strength of understanding, and coolness of judgment" that qualifies her to be the counsellor of her mother. While she has strong feelings, she knows how to govern them—a skill her mother and sister lack. Thus, the text establishes that Elinor is remarkably mature beyond her years.'
          },
          {
            heading: 'Literature Case Study 2: Oscar Wilde’s The Picture of Dorian Gray',
            text: 'Passage Analysis: When Dorian views his portrait painted by Hallward, his cheeks flush with pleasure and a look of joy enters his eyes. He is in wonder and so entranced that he barely hears Hallward. Thus, the text directly supports that Dorian is delighted and revelatory about his painted portrait.'
          },
          {
            heading: 'Literature Case Study 3: Jack London’s The Call of the Wild (Buck & John Thornton)',
            text: 'Passage Analysis: "Thornton alone held Buck. The rest of mankind was as nothing." Buck only tolerates other travelers if they are close to Thornton. Thus, Buck holds John Thornton in far higher regard than any other human being.'
          },
          {
            heading: 'Literature Case Study 4: Anton Chekhov’s "Ionitch" & Mark Haber’s "Saint Sebastian’s Abyss"',
            text: 'Passage Analysis: In Chekhov, the citizens of S. point to the Turkins as the "most accomplished and most enlightened family of all," showing their unique social status. In Haber, Schmidt sighs, winces, and invents a fake appointment to convey his intense displeasure with a dining companion who dislikes painting without explicitly stating it.'
          }
        ]
      },
      {
        pageNumber: 2,
        content: `Arts, Culture, and Social Expression in Digital SAT Passages:
Passages in the humanities examine how artists, performers, and cultural innovators use creative mediums to challenge conventions, promote education, and unite communities.

Key Principles:
1. Identify the artist\'s motivation and societal impact: Connect the physical medium (e.g. wire sculptures, linocut prints, ranchera music, beadwork) to the broader cultural or educational objective.
2. Note how innovative adaptations alter traditional genres: When an artist slows down tempo (Chavela Vargas) or pairs high and low culture (Jeffrey Gibson combining punching bags with women\'s jingle dress beadwork), identify the deliberate rejection of gender roles or artistic boundaries.`,
        sections: [
          {
            heading: 'Arts & Education: Ruth Asawa & San Francisco Arts Programs',
            text: 'Passage Analysis: Ruth Asawa was dedicated to bringing art to children in San Francisco, cofounding the Alvarado School Arts Workshop in 1968 and a public arts high school in 1982. Her primary legacy highlighted in the text is her initiative in creating accessible public school art programs.'
          },
          {
            heading: 'Cultural Innovation: Jeffrey Gibson & Native Beadwork',
            text: 'Passage Analysis: Jeffrey Gibson decorates boxing punching bags with leather fringe and jingles from Ojibwe women\'s dance dressmaking, intentionally merging masculine sports objects with traditional female Native crafts to reject rigid gender divisions.'
          },
          {
            heading: 'Social Advocacy: Elizabeth Catlett’s Linocut Series',
            text: 'Passage Analysis: In "The Black Woman" (1946–1947), Catlett uses mass-produced linocut prints to depict everyday and renowned Black women side by side, using accessible art to connect, celebrate, and unite Black women.'
          },
          {
            heading: 'Musical Expression: Chavela Vargas & Richard Wagner',
            text: 'Passage Analysis: Chavela Vargas performed classic ranchera songs much more slowly with raspy solo guitar to express emotional nuances. In 19th-century opera, Richard Wagner achieved extreme volume by expanding brass sections (horns, trombones, tubas).'
          }
        ]
      },
      {
        pageNumber: 3,
        content: `Historical Perspectives, Primary Sources, and Oral Traditions:
Historical and social studies passages examine how historical evidence, documentation methods, and diverse source materials expand our understanding of key historical figures and movements.

Key Principles:
1. Examine evidentiary reliability: Differentiate between contemporary written records, later chronicles based on oral tradition, and newly discovered archival articles.
2. Recognize historiographical expansion: Notice when modern historians (such as Ashley D. Farmer) expand traditional source archives to include print ephemera, cartoons, and advertisements to illuminate underrepresented figures.`,
        sections: [
          {
            heading: 'Historical Historiography: Ashley D. Farmer on Black Women in Black Power',
            text: 'Passage Analysis: While earlier histories relied predominantly on essays by male leaders, Farmer incorporates political cartoons, ads, and artwork to demonstrate the diverse, vital contributions of Black women to the movement.'
          },
          {
            heading: 'Textual Forebears: Viscardo y Guzmán & Francisco de Miranda',
            text: 'Passage Analysis: Peruvian thinker Viscardo wrote "Letter to the Spanish Americans" in 1791, but Venezuelan revolutionary Miranda circulated, edited, and added footnotes, making him central to the text’s distribution and impact.'
          },
          {
            heading: 'Documentary Certainty: The US Pledge of Allegiance',
            text: 'Passage Analysis: Francis Bellamy long claimed to author the pledge in August 1892, but a newspaper article published months earlier describes students reciting the pledge, calling the original authorship into question.'
          },
          {
            heading: 'Oral Traditions: West African Jalis & Polish Piast Dynasty',
            text: 'Passage Analysis: West African jalis preserve oral family histories and community stories despite modern tech. In Polish history, Mieszko II Lambert is verified by written records, while 10th-century Siemomysł relies on oral tradition in later chronicles.'
          }
        ]
      },
      {
        pageNumber: 4,
        content: `Natural Sciences, Ecology, and Paleontology:
Scientific passages test your comprehension of hypotheses, experimental designs, biological adaptations, and evolutionary discoveries.

Key Principles:
1. Pinpoint the primary finding: What did the researchers observe or discover (e.g. a 164-million-year-old flower bud fossil, coral microplastic storage, or seal water spitting)?
2. Connect adaptation to environment: Identify the specific physical mechanism (longer helicopter blades on Mars, thicker downy feathers in cold Himalayan elevations, tree bark tubes in rubber trees) that enables functioning under distinct environmental conditions.`,
        sections: [
          {
            heading: 'Planetary Engineering: Amelia Quon & the NASA Mars Helicopter',
            text: 'Passage Analysis: Because Mars’s atmosphere is only 1% as dense as Earth’s, standard blades cannot generate lift. Quon’s team engineered blades that are longer and rotate faster to compensate for atmospheric thinness.'
          },
          {
            heading: 'Paleobotany: Discovery of Florigerminis jurassica',
            text: 'Passage Analysis: Xin Wang and colleagues uncovered a 164-million-year-old fossil flower bud in China, providing evidence that angiosperms (flowering plants) emerged in the Jurassic period (145–201 million years ago).'
          },
          {
            heading: 'Marine Ecology: Corals, Microplastics, and Bleaching',
            text: 'Passage Analysis: Jessica Reichert found reef corals capture and store up to 20 million kg of microplastics annually. When bleached from environmental stress, corals produce bright pigments to shield sensitive recolonizing algae from intense sunlight.'
          },
          {
            heading: 'Behavioral Biology: Honeybee Shimmering & Songbird Feathers',
            text: 'Passage Analysis: Giant honeybees flip bodies in waves ("shimmering") specifically to repel hornets. In the Himalayas, Sahas Barve demonstrated high-elevation songbirds possess longer feathers with more downy insulation.'
          }
        ]
      },
      {
        pageNumber: 5,
        content: `Astrophysics, Planetary Astronomy, and Geophysics:
Astrophysical passages report on planetary dynamics, subsurface oceans, galactic structures, and the conditions necessary for extraterrestrial life.

Key Principles:
1. Relate observed anomalies to physical models: Connect an unusual wobble or surface feature to the underlying physical cause (e.g. liquid oceans beneath Mimas and Europa).
2. Distinguish confirmed discoveries from ongoing hypotheses: Note what has been verified (e.g. Wigner crystal imaging with graphene, SOFIA magnetic fields) versus proposed models.`,
        sections: [
          {
            heading: 'Subsurface Oceans: Saturn\'s Mimas & Jupiter\'s Europa',
            text: 'Passage Analysis: Cassini detected a rotational wobble in Mimas consistent with a deep liquid ocean. On Europa, parallel ridges mirror water pocket fissures on Greenland ice sheets, suggesting subsurface ocean activity.'
          },
          {
            heading: 'Quantum Physics: Confirmation of the Wigner Crystal',
            text: 'Passage Analysis: Eugene Wigner posited an electron honeycomb crystal in 1934. In 2021, Feng Wang’s team cooled trapped electrons and used an ultrathin graphene sheet to capture the first visual confirmation.'
          },
          {
            heading: 'Astrophysics: NASA Aspera & SOFIA Telescope',
            text: 'Passage Analysis: Aspera aims to observe previously unseen "warm-hot" circumgalactic medium gas crucial to galaxy evolution. SOFIA mapped galactic bone G47 and surprisingly found a non-uniform, disordered magnetic field.'
          },
          {
            heading: 'Exobiology: Stern & Gerya on Plate Tectonics',
            text: 'Passage Analysis: Stern and Gerya propose that beyond the habitable zone and atmosphere, active plate tectonics is an essential condition for accelerating the evolution of complex extraterrestrial life.'
          }
        ]
      },
      {
        pageNumber: 6,
        content: `Social Sciences, Behavioral Psychology, and Technology:
Social science passages investigate human behavior, decision-making, consumer psychology, and how new technologies interact with cognitive expectations.

Key Principles:
1. Identify the causal variable in experiments: What was manipulated (e.g. counting rewards out loud, device type used for surveys, social media integration in fashion forecasts)?
2. Recognize cognitive reconciliation: Notice how participants resolve dissonance or adjust perceptions when reality diverges from expectations (e.g. negative disconfirmation in smart home adoption).`,
        sections: [
          {
            heading: 'Developmental Psychology: Children and Perceptions of Fairness',
            text: 'Passage Analysis: When teachers distributed equal rewards, 73% of children aged 4–6 rated the teacher who counted aloud as fairer, showing that the method of delivery affects children\'s judgment of equity.'
          },
          {
            heading: 'Consumer Technology: Negative Disconfirmation in Smart Homes',
            text: 'Passage Analysis: Davit Marikyan found that although smart home tech frequently causes initial frustration by falling short of high expectations, users employ cognitive coping strategies to achieve long-term satisfaction.'
          },
          {
            heading: 'Methodology: Survey Interactions on PCs vs Smartphones',
            text: 'Passage Analysis: Décieux and Sischka proved device type alters survey behavior: PC users multitask more frequently but achieve higher completion rates than mobile respondents.'
          },
          {
            heading: 'Applied Analytics: Fashion Demand & Social Media Data',
            text: 'Passage Analysis: Fu and Fisher demonstrated that combining retailers\' historical sales data with real-time social media signals boosts fashion demand forecast accuracy by 24% to 57%.'
          }
        ]
      }
    ]
  },
  {
    id: 'sat-math-foundations',
    title: 'Foundations of Digital SAT Math',
    author: 'AIES STEM Editorial Board',
    publisherOrOwner: 'AIES Academic Press (Original Content)',
    coverColor: 'from-blue-600 to-indigo-700',
    pages: [
      {
        pageNumber: 14,
        content: 'Linear equations in one and two variables represent straight-line relationships. The standard slope-intercept form is y = mx + b, where m is the slope and b is the y-intercept. When solving systems of linear equations, a system has infinitely many solutions if and only if both equations represent identical lines with equal slopes and equal y-intercepts. A system has no solution when lines are parallel with identical slopes and distinct y-intercepts.',
        sections: [
          {
            heading: 'Linear Relationships and Slope',
            text: 'The rate of change between two coordinates (x1, y1) and (x2, y2) is given by m = (y2 - y1) / (x2 - x1). Parallel lines have identical slopes and distinct intercepts. Perpendicular lines have negative reciprocal slopes (m1 * m2 = -1).'
          },
          {
            heading: 'Systems with Infinite or No Solutions',
            text: 'In a linear system Ax + By = C and Dx + Ey = F, if A/D = B/E != C/F, the lines are parallel and have no solution. If A/D = B/E = C/F, the lines are coincident and yield infinitely many solutions.'
          }
        ]
      },
      {
        pageNumber: 28,
        content: 'Quadratic expressions take the form ax^2 + bx + c = 0. The discriminant Delta = b^2 - 4ac determines the nature of the roots: Delta > 0 indicates two distinct real solutions, Delta = 0 indicates exactly one repeated real solution, and Delta < 0 indicates two complex conjugate solutions with no real x-intercepts on the Cartesian plane.',
        sections: [
          {
            heading: 'The Vertex and Axis of Symmetry',
            text: 'For any parabola y = ax^2 + bx + c, the vertex occurs at x = -b / (2a). The vertex form y = a(x - h)^2 + k explicitly gives the extremum at (h, k). If a > 0, the parabola opens upward and has a minimum value of k at x = h.'
          },
          {
            heading: 'Discriminant Analysis & Tangency',
            text: 'A quadratic equation has exactly one real solution if and only if b^2 - 4ac = 0. When intersecting a line y = mx + c with a parabola, substitute and equate the resulting quadratic discriminant to zero for tangency.'
          }
        ]
      },
      {
        pageNumber: 45,
        content: 'Percentages, rates, and proportional relationships form the core of Problem Solving & Data Analysis. When a quantity increases by p% and subsequently decreases by p%, the final value is strictly less than the initial value by a factor of (1 - (p/100)^2). Relative risk and conditional probability require isolating the specific subpopulation in the two-way contingency table denominator.',
        sections: [
          {
            heading: 'Percent Change and Compound Growth',
            text: 'Percent change is defined as ((New - Original) / Original) * 100%. Exponential growth is modeled by f(t) = P(1 + r)^t, where r is the growth rate per period.'
          },
          {
            heading: 'Conditional Probability in Tables',
            text: 'The probability of event A given event B, P(A|B), is computed by taking the joint count of (A and B) divided by the total count in row/column B only.'
          }
        ]
      },
      {
        pageNumber: 62,
        content: 'Geometry on the SAT tests properties of similar triangles, right triangle trigonometry, and circle equations. In similar triangles, corresponding side lengths are strictly proportional while corresponding angles are equal. The standard circle equation is (x - h)^2 + (y - k)^2 = r^2 with center (h, k) and radius r.',
        sections: [
          {
            heading: 'Complementary Angle Trigonometry',
            text: 'For complementary angles alpha and beta where alpha + beta = 90 degrees (or pi/2 radians), sin(alpha) = cos(beta) and cos(alpha) = sin(beta). This identity is frequently tested in right triangle problems.'
          },
          {
            heading: 'Circle Arc Length and Sector Area',
            text: 'Arc length s = r * theta and sector area A = (1/2) * r^2 * theta when angle theta is measured in radians. To convert degrees to radians, multiply by pi / 180.'
          }
        ]
      }
    ]
  },
  {
    id: 'sat-advanced-math-guide',
    title: 'SAT Advanced Math & Functions Mastery',
    author: 'Panda SAT & STEM Editorial',
    publisherOrOwner: 'Panda SAT Curriculum Series',
    coverColor: 'from-purple-700 to-indigo-900',
    pages: [
      {
        pageNumber: 18,
        content: 'Polynomial division, factor theorem, and remainder theorem. If a polynomial P(x) is divided by (x - a), the remainder is P(a). If P(a) = 0, then (x - a) is a factor of P(x). Equivalent rational expressions require finding common denominators and identifying extraneous solutions that make denominators equal zero.',
        sections: [
          {
            heading: 'Remainder & Factor Theorem',
            text: 'For polynomial P(x), evaluating P(c) gives the remainder when P(x) is divided by (x - c). If P(c) = 0, then (x - c) is a factor, meaning x = c is a zero/root.'
          },
          {
            heading: 'Rational Function Asymptotes',
            text: 'Vertical asymptotes occur at zeros of the denominator that are not cancelled by the numerator. Horizontal asymptotes depend on comparing degrees of numerator and denominator.'
          }
        ]
      },
      {
        pageNumber: 36,
        content: 'Exponential and radical equations. To solve exponential equations with different bases, express both sides in terms of common prime bases or take logarithms. For radical equations sqrt(ax + b) = cx + d, always check for extraneous solutions introduced by squaring both sides.',
        sections: [
          {
            heading: 'Radical Expressions & Fractional Exponents',
            text: 'The n-th root of x^m is represented as x^(m/n). When squaring both sides of radical equations, extraneous solutions often arise when the resulting linear expression is negative.'
          },
          {
            heading: 'Exponential Decay & Half-Life',
            text: 'Half-life decay is given by N(t) = N0 * (1/2)^(t / t_half). The base rate remains constant over equal fractional intervals.'
          }
        ]
      }
    ]
  },
  {
    id: 'sat-rw-mastery',
    title: 'Mastering Digital SAT Reading & Writing',
    author: 'AIES Humanities Editorial Board',
    publisherOrOwner: 'AIES Academic Press (Original Content)',
    coverColor: 'from-emerald-600 to-teal-700',
    pages: [
      {
        pageNumber: 12,
        content: 'Information & Ideas questions test your ability to synthesize central themes, evaluate textual evidence, and complete logical conclusions. When determining the main idea of a scientific passage, look beyond supporting data points and identify the overarching hypothesis and experimental validation.',
        sections: [
          {
            heading: 'Command of Textual Evidence',
            text: 'An answer choice is valid only if it directly substantiates the specific claim without introducing extraneous assumptions. Avoid choices that state true facts not directly cited in the prompt.'
          },
          {
            heading: 'Completing Logical Inferences',
            text: 'When completing a sentence at the end of a passage, the correct option must act as the natural deduction of the preceding evidence rather than introducing an unsupported pivot.'
          }
        ]
      },
      {
        pageNumber: 34,
        content: 'Craft & Structure questions evaluate vocabulary in context, text structure, and rhetorical purpose. High-scoring SAT test takers recognize that common words frequently carry nuanced, domain-specific definitions (e.g., "qualify" meaning to limit or moderate a claim rather than to meet criteria).',
        sections: [
          {
            heading: 'Words in Context Methodology',
            text: 'Always mask the target word with a blank before looking at options. Identify tone, direction, and semantic clues in the sentence to supply your own synonym before comparing with choices.'
          },
          {
            heading: 'Cross-Text Connections',
            text: 'When comparing Text 1 and Text 2, note whether Author 2 extends, refutes, or qualifies Author 1. Summarize both authors in two words (e.g. "Optimistic" vs "Skeptical").'
          }
        ]
      },
      {
        pageNumber: 52,
        content: 'Expression of Ideas evaluates transitions and rhetorical synthesis notes. Transitions create specific logical relationships: addition (furthermore, moreover), contrast (however, nevertheless), cause-and-effect (consequently, thus), or exemplification (for instance, specifically). Choose the transition that precisely reflects the logical relationship between adjacent ideas.',
        sections: [
          {
            heading: 'Transition Taxonomy',
            text: 'Never rely on sound alone. Contrast transitions require opposing claims; cause-and-effect transitions require that Sentence 2 directly follows from the causality established in Sentence 1.'
          },
          {
            heading: 'Rhetorical Synthesis Strategy',
            text: 'Read the specific goal prompt before the bulleted notes. Eliminate any option that does not directly fulfill the prompt goal, even if the option is factually accurate according to the notes.'
          }
        ]
      },
      {
        pageNumber: 76,
        content: 'Standard English Conventions enforce grammatical boundaries, subject-verb agreement, pronoun-antecedent clarity, and modifier placement. Two independent clauses cannot be joined by a comma alone (comma splice) or without punctuation (run-on). They must be joined by a period, semicolon, or comma with a coordinating conjunction (FANBOYS).',
        sections: [
          {
            heading: 'Sentence Boundaries and Semicolons',
            text: 'A semicolon must be flanked by independent clauses on both sides. A colon must follow an independent clause and introduces an explanation, list, or dramatic elaboration.'
          },
          {
            heading: 'Dangling and Misplaced Modifiers',
            text: 'An introductory participial phrase (e.g., "Walking through the forest, ...") must be immediately followed by the noun that logically performs the action.'
          }
        ]
      }
    ]
  },
  {
    id: 'sat-grammar-conventions',
    title: 'Standard English Conventions & Grammar Rules',
    author: 'Panda SAT Writing & Grammar Board',
    publisherOrOwner: 'Panda SAT Writing Series',
    coverColor: 'from-amber-600 to-orange-700',
    pages: [
      {
        pageNumber: 22,
        content: 'Punctuation boundaries: commas, semicolons, dashes, and colons. A single dash or colon requires an independent clause preceding it. Paired dashes, paired commas, or paired parentheses enclose non-essential parenthetical information that can be removed without breaking sentence structure.',
        sections: [
          {
            heading: 'Non-Essential Clauses & Paired Punctuation',
            text: 'If a descriptive phrase is set off by commas or dashes, test it by mentally removing the clause. The remaining sentence must be grammatically complete.'
          },
          {
            heading: 'Subject-Verb Agreement Across Prepositional Phrases',
            text: 'The verb must agree with the true head subject, not the intervening nouns within prepositional phrases (e.g., "The box of old books is heavy", not "are heavy").'
          }
        ]
      },
      {
        pageNumber: 48,
        content: 'Pronoun ambiguity and parallelism. Every pronoun (it, they, this) must have an unambiguous, grammatically aligned antecedent noun. Parallel structure requires that lists and comparisons maintain identical grammatical forms (e.g., gerund with gerund, infinitive with infinitive).',
        sections: [
          {
            heading: 'Pronoun Case & Number Agreement',
            text: 'Singular indefinite pronouns (everyone, each, neither) require singular verbs and pronouns. Avoid ambiguous "this" or "they" without explicit referents.'
          },
          {
            heading: 'Comparative Parallelism & Illogical Comparisons',
            text: 'Compare equivalent entities: "The score of student A was higher than that of student B", not "than student B".'
          }
        ]
      }
    ]
  }
];
