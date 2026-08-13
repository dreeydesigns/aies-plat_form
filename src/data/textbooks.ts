import { Textbook } from '../types';

export const initialTextbooks: Textbook[] = [
  {
    id: 'sat-math-foundations',
    title: 'Foundations of Digital SAT Math',
    author: 'AIES STEM Editorial Board',
    publisherOrOwner: 'AIES Academic Press (Original Content)',
    coverColor: 'from-blue-600 to-indigo-700',
    pages: [
      {
        pageNumber: 14,
        content: 'Linear equations in one and two variables represent straight-line relationships. The standard slope-intercept form is y = mx + b, where m is the slope and b is the y-intercept. When solving systems of linear equations, a system has infinitely many solutions if and only if both equations represent identical lines with equal slopes and equal y-intercepts.',
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
            text: 'For any parabola y = ax^2 + bx + c, the vertex occurs at x = -b / (2a). The vertex form y = a(x - h)^2 + k explicitly gives the extremum at (h, k). If a > 0, the parabola opens upward and has a minimum value of k.'
          },
          {
            heading: 'Discriminant Analysis',
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
  }
];
