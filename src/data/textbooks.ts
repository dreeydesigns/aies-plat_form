import { Textbook } from '../types';

export const initialTextbooks: Textbook[] = [
  // =========================================================================
  // TEXTBOOK 1: Foundations of Digital SAT Math
  // =========================================================================
  {
    id: 'sat-foundations-math',
    title: 'Foundations of Digital SAT Math',
    subject: 'math',
    author: 'AIES STEM & Quantitative Research Board',
    publisherOrOwner: 'AIES Academic Press (Original Curriculum Series)',
    coverColor: 'from-blue-600 via-indigo-600 to-sky-700',
    description: 'Mastery curriculum for Algebra, Linear Systems, Problem-Solving, Proportional Reasoning, and Coordinate Geometry.',
    version: 'v4.2',
    lastUpdated: '2026-08-14',
    changelog: [
      {
        id: 'cl-math-01',
        date: '2026-08-14',
        summary: 'Appended 4 worked examples on systems with infinite solutions from Teacher Mock Test #3',
        triggerExamTitle: 'Mid-Term SAT Diagnostic Assessment',
        teacherName: 'Dr. Sarah Chen',
        approvedBy: 'Academic Curriculum Committee',
        sectionsAdded: 2
      },
      {
        id: 'cl-math-02',
        date: '2026-08-01',
        summary: 'Added dimensional analysis rate conversion drills and unit multiplier heuristics',
        triggerExamTitle: 'Quantitative Reasoning Diagnostic Drill',
        teacherName: 'Marcus Vance',
        approvedBy: 'AIES Board of Evaluators',
        sectionsAdded: 3
      }
    ],
    chapters: [
      {
        id: 'ch-alg-01',
        chapterNumber: 1,
        title: 'Algebra: Linear Equations & Inequalities',
        domain: 'algebra',
        description: 'Linear equations in one/two variables, slope-intercept form, Cartesian modeling, and systems of linear equations.',
        sections: [
          {
            id: 'sec-alg-1-1',
            sectionNumber: '1.1',
            title: 'Linear Equations in One Variable',
            skill: 'Linear Equations',
            pageNumber: 1,
            conceptSummary: 'Linear equations describe constant rates of change where the variable is raised only to the first power ($x^1$). Problems range from multi-step isolation to structural equivalence and zero/infinite solution cases.',
            methodSteps: [
              'Step 1: Simplify Both Sides — Expand parentheses via distributive property and combine like terms independently.',
              'Step 2: Clear Fractions — Multiply by the Least Common Multiple (LCM) of all denominators.',
              'Step 3: Collect Variable Terms — Move variable terms to one side and constants to the other using inverse operations.',
              'Step 4: Solve and Verify — Isolate the variable and confirm what the question specifically asks for (e.g. $2x - 3$ vs $x$).'
            ],
            workedExamples: [
              {
                title: 'Multi-Step Isolation with Distributive Property',
                difficulty: 'easy',
                problem: 'If $4(x - 3) + 7 = 27$, what is the value of $x + 5$?',
                solution: '1. Distribute 4: $4x - 12 + 7 = 27 \\implies 4x - 5 = 27$.\n2. Add 5: $4x = 32 \\implies x = 8$.\n3. Target expression: $x + 5 = 8 + 5 = 13$.',
                trap: 'Stopping at $x = 8$ without evaluating the requested expression $x + 5$.'
              },
              {
                title: 'Rational Coefficients & Parameter Match',
                difficulty: 'medium',
                problem: 'For what value of $k$ does $\\frac{3x - 5}{4} + \\frac{x + 1}{2} = \\frac{kx - 3}{4}$ have infinitely many solutions?',
                solution: '1. Multiply by LCM 4: $(3x - 5) + 2(x + 1) = kx - 3$.\n2. Expand: $3x - 5 + 2x + 2 = kx - 3 \\implies 5x - 3 = kx - 3$.\n3. Match coefficients: $kx = 5x \\implies k = 5$.',
                trap: 'Forgetting to multiply the middle term $\\frac{x+1}{2}$ by 2 when clearing the denominator 4.'
              },
              {
                title: 'Conditions for No Solution vs Identity',
                difficulty: 'hard',
                problem: 'In $a(2x - 5) + 3x = 11x - 20$, $a$ is a constant. If the equation has no solution, what condition must hold?',
                solution: '1. Expand left: $2ax - 5a + 3x = 11x - 20 \\implies (2a + 3)x - 5a = 11x - 20$.\n2. For no solution, slopes match ($2a + 3 = 11 \\implies 2a = 8 \\implies a = 4$) while constants differ ($-5a \\neq -20$).\n3. Since $-5(4) = -20$, this produces an identity ($0=0$) when $a=4$, meaning no real value of $a$ creates a strict no-solution case.',
                trap: 'Confusing no solution ($ax+b=ax+c, b \\neq c$) with infinitely many solutions ($ax+b=ax+b$).'
              }
            ],
            commonMistakes: [
              'Failing to distribute negative signs across parentheses: $-(2x - 5) = -2x + 5$, not $-2x - 5$.',
              'Forgetting that dividing by a negative number in inequalities flips the inequality sign.',
              'Solving for $x$ and forgetting the prompt asks for $3x - 4$ or $\\frac{x}{2}$.'
            ],
            featuredQuestionId: 'sat_math_alg_001',
            similarQuestionIds: ['sat_math_alg_002', 'sat_math_alg_003', 'sat_math_alg_004'],
            relatedTopics: [
              {
                title: 'Linear Functions & Cartesian Slope',
                textbookId: 'sat-foundations-math',
                chapterId: 'ch-alg-01',
                sectionId: 'sec-alg-1-2',
                pageNumber: 2,
                domain: 'algebra'
              },
              {
                title: 'Systems of Linear Equations',
                textbookId: 'sat-foundations-math',
                chapterId: 'ch-alg-01',
                sectionId: 'sec-alg-1-3',
                pageNumber: 3,
                domain: 'algebra'
              }
            ]
          },
          {
            id: 'sec-alg-1-2',
            sectionNumber: '1.2',
            title: 'Linear Functions, Slope & Graphs',
            skill: 'Linear Functions',
            pageNumber: 2,
            conceptSummary: 'Linear functions model constant rates of change ($y = mx + b$). Questions assess interpreting slope as rate of change in context, calculating intercepts, and analyzing parallel ($m_1=m_2$) vs perpendicular ($m_1 \\cdot m_2 = -1$) lines.',
            methodSteps: [
              'Step 1: Calculate Slope — Use $m = \\frac{y_2 - y_1}{x_2 - x_1}$.',
              'Step 2: Interpret Context — Slope is the change in output per unit input; $y$-intercept is baseline at $x=0$.',
              'Step 3: Convert Forms — Fluently switch between Standard Form ($Ax + By = C$) and Slope-Intercept Form ($y = mx + b$).',
              'Step 4: Use Desmos — Graph lines to instantly inspect intersections and intercepts.'
            ],
            workedExamples: [
              {
                title: 'Perpendicular Line Calculation',
                difficulty: 'medium',
                problem: 'Line $k$ passes through $(2, -3)$ and $(6, 5)$. Line $p$ is perpendicular to $k$ and passes through $(4, 1)$. What is the equation of line $p$?',
                solution: '1. Slope of $k$: $m_k = \\frac{5 - (-3)}{6 - 2} = \\frac{8}{4} = 2$.\n2. Perpendicular slope: $m_p = -\\frac{1}{2}$.\n3. Point-slope equation: $y - 1 = -\\frac{1}{2}(x - 4) \\implies y = -\\frac{1}{2}x + 3$.',
                trap: 'Using the negative of the slope without taking the reciprocal.'
              }
            ],
            commonMistakes: [
              'Horizontal lines have equation $y = c$ (slope 0); vertical lines have equation $x = c$ (slope undefined).'
            ],
            featuredQuestionId: 'sat_math_alg_002',
            similarQuestionIds: ['sat_math_alg_001', 'sat_math_alg_003'],
            relatedTopics: [
              {
                title: 'Linear Equations in One Variable',
                textbookId: 'sat-foundations-math',
                chapterId: 'ch-alg-01',
                sectionId: 'sec-alg-1-1',
                pageNumber: 1,
                domain: 'algebra'
              }
            ]
          },
          {
            id: 'sec-alg-1-3',
            sectionNumber: '1.3',
            title: 'Systems of Two Linear Equations',
            skill: 'Systems of Equations',
            pageNumber: 3,
            conceptSummary: 'A system of linear equations represents two lines on a plane. Solutions are intersection points $(x, y)$, categorized into one solution (intersecting), zero solutions (parallel), or infinitely many solutions (coincident).',
            methodSteps: [
              'Step 1: Choose Substitution or Elimination.',
              'Step 2: Multiply equations to match coefficients with opposite signs.',
              'Step 3: Add equations to eliminate one variable, then back-substitute.',
              'Step 4: Verify in both original equations.'
            ],
            workedExamples: [
              {
                title: 'Elimination Method',
                difficulty: 'medium',
                problem: 'Solve $3x + 4y = 26$ and $5x - 2y = 4$.',
                solution: '1. Multiply second equation by 2: $10x - 4y = 8$.\n2. Add to first: $13x = 34 \\implies x = 2$.\n3. Substitute $x=2$: $3(2) + 4y = 26 \\implies 4y = 20 \\implies y = 5$. Solution: $(2, 5)$.',
                trap: 'Forgetting to multiply the right-hand constant when scaling an equation.'
              }
            ],
            commonMistakes: [
              'Assuming no solutions means $x=0$. No solution means parallel lines ($0 = k, k \\neq 0$).'
            ],
            featuredQuestionId: 'sat_math_alg_003',
            similarQuestionIds: ['sat_math_alg_001', 'sat_math_alg_004'],
            relatedTopics: [
              {
                title: 'Linear Functions, Slope & Graphs',
                textbookId: 'sat-foundations-math',
                chapterId: 'ch-alg-01',
                sectionId: 'sec-alg-1-2',
                pageNumber: 2,
                domain: 'algebra'
              }
            ]
          }
        ]
      },
      {
        id: 'ch-psda-02',
        chapterNumber: 2,
        title: 'Problem-Solving & Data Analysis: Proportions & Statistics',
        domain: 'problem-solving-data-analysis',
        description: 'Ratios, unit conversions, multi-step percentages, two-way tables, probability, and observational data analysis.',
        sections: [
          {
            id: 'sec-psda-2-1',
            sectionNumber: '2.1',
            title: 'Ratios, Rates & Multi-Step Percentages',
            skill: 'Percentages & Ratios',
            pageNumber: 4,
            conceptSummary: 'Dimensional analysis and proportional multipliers. Focuses on successive percentage changes ($(1+p_1)(1-p_2)$) and unit rates.',
            methodSteps: [
              'Step 1: Set up conversion factors matching units.',
              'Step 2: Apply successive multipliers for compound discounts/taxes.',
              'Step 3: Solve for baseline vs final amounts.'
            ],
            workedExamples: [
              {
                title: 'Dimensional Analysis Speed Conversion',
                difficulty: 'easy',
                problem: 'A car travels at 72 km/h. What is its speed in meters per second?',
                solution: '$\\frac{72\\text{ km}}{1\\text{ hr}} \\times \\frac{1000\\text{ m}}{1\\text{ km}} \\times \\frac{1\\text{ hr}}{3600\\text{ s}} = \\frac{72000}{3600} = 20\\text{ m/s}$.',
                trap: 'Inverting conversion fractions (e.g. dividing by 1000 instead of multiplying).'
              }
            ],
            commonMistakes: [
              'Adding successive percentages directly ($20\\% - 20\\% = 0\\%$) instead of multiplying $(1.20)(0.80) = 0.96$ (a 4% drop).'
            ],
            featuredQuestionId: 'sat_math_psda_001',
            similarQuestionIds: ['sat_math_psda_002', 'sat_math_psda_003'],
            relatedTopics: [
              {
                title: 'Two-Way Tables & Conditional Probability',
                textbookId: 'sat-foundations-math',
                chapterId: 'ch-psda-02',
                sectionId: 'sec-psda-2-2',
                pageNumber: 5,
                domain: 'problem-solving-data-analysis'
              }
            ]
          },
          {
            id: 'sec-psda-2-2',
            sectionNumber: '2.2',
            title: 'Two-Way Tables & Conditional Probability',
            skill: 'Two-Way Tables',
            pageNumber: 5,
            conceptSummary: 'Conditional probabilities from categorized contingency tables. Identifying whether the denominator is the grand total, row total, or column total.',
            methodSteps: [
              'Step 1: Identify given condition (restricts the denominator to a specific row or column).',
              'Step 2: Identify favorable outcomes in that restricted subset (numerator).',
              'Step 3: Calculate $P(A|B) = \\frac{\\text{favorable in } B}{\\text{total in } B}$.'
            ],
            workedExamples: [
              {
                title: 'Conditional Probability from Table',
                difficulty: 'medium',
                problem: 'Out of 50 students, 30 are juniors and 20 are seniors. Of the juniors, 18 take physics. What is the probability a randomly chosen junior takes physics?',
                solution: 'Condition: Given student is a junior (denominator = 30). Favorable: 18. Probability = $\\frac{18}{30} = \\frac{3}{5} = 0.60$.',
                trap: 'Dividing by the overall total 50 instead of the conditioned group 30.'
              }
            ],
            commonMistakes: [
              'Using overall sample size instead of conditional subset size.'
            ],
            featuredQuestionId: 'sat_math_psda_002',
            similarQuestionIds: ['sat_math_psda_001', 'sat_math_psda_003'],
            relatedTopics: [
              {
                title: 'Ratios, Rates & Multi-Step Percentages',
                textbookId: 'sat-foundations-math',
                chapterId: 'ch-psda-02',
                sectionId: 'sec-psda-2-1',
                pageNumber: 4,
                domain: 'problem-solving-data-analysis'
              }
            ]
          }
        ]
      }
    ],
    pages: [
      {
        pageNumber: 1,
        content: `CHAPTER 1: ALGEBRA — LINEAR EQUATIONS IN ONE VARIABLE\n\n1. Concept Introduction\nLinear equations in one variable describe constant rates of change where the variable is raised only to the first power ($x^1$). On the Digital SAT, linear equation problems range from fundamental multi-step isolate-and-solve questions to questions testing structural equivalence, clearing rational denominators, and recognizing conditions that yield infinitely many solutions or no solution.\n\n2. The Core Method: Systematic Isolation & Structural Recognition\nStep 1: Simplify Both Sides — Expand all parentheses using the distributive property and combine like terms on each side independently.\nStep 2: Clear Fractions — If equations contain rational coefficients, multiply the entire equation by the Least Common Multiple (LCM) of all denominators.\nStep 3: Collect Variable Terms — Move all terms containing the variable to one side and all constant terms to the opposite side using inverse operations.\nStep 4: Solve and Verify — Isolate the variable and check against the exact quantity requested by the prompt (e.g. solve for $2x - 3$, not just $x$).`,
        ocrText: 'Linear equations in one variable, distributive property, isolate variable, no solution, infinitely many solutions, least common multiple.',
        sections: [
          {
            heading: '1.1 Worked Example (Easy Tier)',
            text: 'Problem: If $4(x - 3) + 7 = 27$, what is the value of $x + 5$?\nStep-by-step Solution:\n1. Distribute 4: $4x - 12 + 7 = 27$\n2. Combine constants: $4x - 5 = 27$\n3. Add 5 to both sides: $4x = 32$\n4. Divide by 4: $x = 8$\n5. Answer the prompt: The question asks for $x + 5 = 8 + 5 = 13$.'
          },
          {
            heading: '1.2 Worked Example (Medium Tier)',
            text: 'Problem: For what value of $k$ does the equation $\\frac{3x - 5}{4} + \\frac{x + 1}{2} = \\frac{k x - 3}{4}$ have infinitely many solutions?\nStep-by-step Solution:\n1. Multiply the entire equation by LCM 4: $(3x - 5) + 2(x + 1) = k x - 3$\n2. Expand: $3x - 5 + 2x + 2 = k x - 3$\n3. Combine like terms: $5x - 3 = k x - 3$\n4. For infinitely many solutions, coefficients of $x$ and constants must match identically: $5x = k x \\implies k = 5$.'
          }
        ]
      },
      {
        pageNumber: 2,
        content: `CHAPTER 1: ALGEBRA — LINEAR FUNCTIONS, SLOPE, AND CARTESIAN GRAPHS\n\n1. Concept Introduction\nA linear function is a mathematical relationship with a constant rate of change. On the Digital SAT, questions test your ability to interpret the slope $m$ and $y$-intercept $b$ in contextual word problems (such as cost models, physics rate problems, and depreciation), convert between standard form ($Ax + By = C$) and slope-intercept form ($y = mx + b$), and analyze parallel and perpendicular lines.\n\n2. The Core Method: Rate of Change & Intercept Analysis\n- Slope Formula: $m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\Delta y}{\\Delta x}$\n- Contextual Meaning of Slope: The rate at which the dependent variable changes per unit increase in independent variable.\n- Contextual Meaning of $y$-intercept ($b$): Baseline at $x = 0$.`,
        ocrText: 'Linear functions, slope intercept form, rate of change, Cartesian plane, parallel lines, perpendicular lines, y intercept.',
        sections: [
          {
            heading: '2.1 Contextual Interpretation & Word Problems',
            text: 'Example: $C(h) = 65h + 85$. Slope 65 = hourly labor rate ($65/hr). y-intercept 85 = initial diagnostic fee ($85).'
          },
          {
            heading: '2.2 Perpendicular Line Equations (Medium Tier)',
            text: 'Problem: Line $k$ has slope 2 through $(2,-3)$. Line $p$ is perpendicular through $(4,1)$. Equation: $y - 1 = -\\frac{1}{2}(x - 4) \\implies y = -\\frac{1}{2}x + 3$.'
          }
        ]
      },
      {
        pageNumber: 3,
        content: `CHAPTER 1: ALGEBRA — SYSTEMS OF TWO LINEAR EQUATIONS\n\n1. Concept Introduction\nA system of linear equations consists of two or more equations sharing the same variables. Solutions correspond to coordinate intersection points $(x, y)$.\n\n2. Methods: Substitution, Elimination, and Structural Inspection for 0, 1, or infinitely many solutions.`,
        ocrText: 'Systems of equations, elimination method, substitution method, intersection, parallel lines, infinitely many solutions.',
        sections: [
          {
            heading: '3.1 Elimination Method Worked Example',
            text: 'Solve $3x + 4y = 26$ and $5x - 2y = 4$. Multiply second by 2: $10x - 4y = 8$. Add: $13x = 34 \\implies x = 2, y = 5$.'
          }
        ]
      },
      {
        pageNumber: 4,
        content: `CHAPTER 2: PROBLEM-SOLVING & DATA ANALYSIS — RATIOS & PERCENTAGES\n\n1. Concept Introduction\nProblem-Solving & Data Analysis covers dimensional analysis, unit conversion, multi-step percent change, and successive multiplier logic.`,
        ocrText: 'Ratios, rates, unit conversion, percent change, exponential growth, successive percentage discounts.',
        sections: [
          {
            heading: '4.1 Dimensional Analysis Worked Example',
            text: 'Speed 72 km/h in m/s: $\\frac{72\\text{ km}}{1\\text{ hr}} \\times \\frac{1000\\text{ m}}{1\\text{ km}} \\times \\frac{1\\text{ hr}}{3600\\text{ s}} = 20\\text{ m/s}$.'
          }
        ]
      },
      {
        pageNumber: 5,
        content: `CHAPTER 2: PROBLEM-SOLVING & DATA ANALYSIS — TWO-WAY TABLES & STATISTICS\n\n1. Concept Introduction\nConditional probability and contingency table analysis. Understanding restricted denominator subsets vs full population.`,
        ocrText: 'Two-way tables, conditional probability, joint probability, margin of error, sample size.',
        sections: [
          {
            heading: '5.1 Contingency Table Probability',
            text: 'Conditional probability requires restricting the denominator to the conditioned row or column.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TEXTBOOK 2: Advanced Math & Quantitative Mastery
  // =========================================================================
  {
    id: 'sat-advanced-math-mastery',
    title: 'Advanced Math & Quantitative Mastery',
    subject: 'math',
    author: 'AIES STEM & Quantitative Research Board',
    publisherOrOwner: 'AIES Academic Press (Original Curriculum Series)',
    coverColor: 'from-purple-600 via-indigo-700 to-slate-900',
    description: 'Quadratic structures, vertex form, discriminant analysis, polynomial division, exponential modeling, and radical transformations.',
    version: 'v3.8',
    lastUpdated: '2026-08-10',
    changelog: [
      {
        id: 'cl-adv-01',
        date: '2026-08-10',
        summary: 'Added vertex-form conversion via completing the square and Desmos regression shortcuts',
        triggerExamTitle: 'Advanced Quantitative Diagnostic',
        teacherName: 'Elena Rostova',
        approvedBy: 'AIES Board of Evaluators',
        sectionsAdded: 2
      }
    ],
    chapters: [
      {
        id: 'ch-adv-01',
        chapterNumber: 1,
        title: 'Advanced Math: Quadratics & Nonlinear Structures',
        domain: 'advanced-math',
        description: 'Standard, vertex, and factored forms of parabolas, discriminant criteria, and completing the square.',
        sections: [
          {
            id: 'sec-adv-1-1',
            sectionNumber: '1.1',
            title: 'Quadratic Equations & Discriminant Analysis',
            skill: 'Quadratic Equations',
            pageNumber: 1,
            conceptSummary: 'Quadratic equations $ax^2 + bx + c = 0$ represent parabolas. The discriminant $D = b^2 - 4ac$ determines the number and type of real roots ($D > 0$: 2 real roots, $D = 0$: 1 real root, $D < 0$: 0 real roots).',
            methodSteps: [
              'Step 1: Put equation in standard form $ax^2 + bx + c = 0$.',
              'Step 2: Evaluate $D = b^2 - 4ac$ to check root count.',
              'Step 3: Solve via Quadratic Formula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ or factoring.'
            ],
            workedExamples: [
              {
                title: 'Discriminant Parameter Problem',
                difficulty: 'hard',
                problem: 'For what values of $c$ does $2x^2 - 8x + c = 0$ have exactly one real solution?',
                solution: '1. For 1 real solution, $b^2 - 4ac = 0$.\n2. $a = 2, b = -8 \\implies (-8)^2 - 4(2)(c) = 0$.\n3. $64 - 8c = 0 \\implies 8c = 64 \\implies c = 8$.',
                trap: 'Forgetting the negative sign when squaring $b$: $(-8)^2 = +64$.'
              }
            ],
            commonMistakes: [
              'Using $-b^2$ instead of $(-b)^2$ in the discriminant formula.'
            ],
            featuredQuestionId: 'sat_math_adv_001',
            similarQuestionIds: ['sat_math_adv_002', 'sat_math_adv_003'],
            relatedTopics: [
              {
                title: 'Vertex Form & Maximum/Minimum Optimization',
                textbookId: 'sat-advanced-math-mastery',
                chapterId: 'ch-adv-01',
                sectionId: 'sec-adv-1-2',
                pageNumber: 2,
                domain: 'advanced-math'
              }
            ]
          },
          {
            id: 'sec-adv-1-2',
            sectionNumber: '1.2',
            title: 'Vertex Form & Parabola Optimization',
            skill: 'Vertex Form',
            pageNumber: 2,
            conceptSummary: 'Vertex form $f(x) = a(x - h)^2 + k$ displays vertex $(h, k)$ as constants. The vertex gives the minimum (when $a > 0$) or maximum (when $a < 0$). Axis of symmetry is $x = h = -\\frac{b}{2a}$.',
            methodSteps: [
              'Step 1: Find $x$-coordinate of vertex using $h = -\\frac{b}{2a}$.',
              'Step 2: Find $y$-coordinate by evaluating $k = f(h)$.',
              'Step 3: Write in vertex form $f(x) = a(x - h)^2 + k$.'
            ],
            workedExamples: [
              {
                title: 'Maximum Height Projectile Optimization',
                difficulty: 'medium',
                problem: 'The height of an object is modeled by $h(t) = -5t^2 + 20t + 25$. What is the maximum height reached?',
                solution: '1. Find time to vertex: $t = -\\frac{b}{2a} = -\\frac{20}{2(-5)} = \\frac{20}{10} = 2$ seconds.\n2. Compute maximum height: $h(2) = -5(2)^2 + 20(2) + 25 = -20 + 40 + 25 = 45$ meters.',
                trap: 'Providing the time $t = 2$ instead of the actual maximum height $h(2) = 45$.'
              }
            ],
            commonMistakes: [
              'Confusing $(x - h)$ with $(x + h)$: $f(x) = (x - 3)^2 + 5$ has vertex at $(+3, 5)$, not $(-3, 5)$.'
            ],
            featuredQuestionId: 'sat_math_adv_002',
            similarQuestionIds: ['sat_math_adv_001', 'sat_math_adv_003'],
            relatedTopics: [
              {
                title: 'Quadratic Equations & Discriminant Analysis',
                textbookId: 'sat-advanced-math-mastery',
                chapterId: 'ch-adv-01',
                sectionId: 'sec-adv-1-1',
                pageNumber: 1,
                domain: 'advanced-math'
              }
            ]
          }
        ]
      }
    ],
    pages: [
      {
        pageNumber: 1,
        content: `CHAPTER 1: ADVANCED MATH — QUADRATIC EQUATIONS & DISCRIMINANT\n\n1. Concept Introduction\nQuadratic equations ($ax^2 + bx + c = 0$) model parabolas and projectile trajectories. On the Digital SAT, questions test your ability to factor, apply the quadratic formula, and use the discriminant ($D = b^2 - 4ac$) to determine the number and nature of real solutions.\n\n2. The Core Method:\n- Discriminant Criteria:\n  * $b^2 - 4ac > 0$: 2 distinct real solutions ($x$-intercepts).\n  * $b^2 - 4ac = 0$: 1 repeated real solution (vertex touches $x$-axis).\n  * $b^2 - 4ac < 0$: 0 real solutions (parabola does not cross $x$-axis).`,
        ocrText: 'Quadratic formula, discriminant, vertex form, parabolas, completing the square, real roots.',
        sections: [
          {
            heading: '1.1 Discriminant Worked Example',
            text: 'For $2x^2 - 8x + c = 0$ to have 1 real root: $(-8)^2 - 4(2)(c) = 0 \\implies 64 - 8c = 0 \\implies c = 8$.'
          }
        ]
      },
      {
        pageNumber: 2,
        content: `CHAPTER 1: ADVANCED MATH — VERTEX FORM & COMPLETING THE SQUARE\n\n1. Concept Introduction\nVertex form $f(x) = a(x - h)^2 + k$ immediately reveals the extreme value $(h, k)$. For parabolas opening upward ($a > 0$), $k$ is the minimum. For parabolas opening downward ($a < 0$), $k$ is the maximum.`,
        ocrText: 'Vertex form, axis of symmetry, maximum height, projectile motion, minimum value.',
        sections: [
          {
            heading: '2.1 Vertex Form Optimization',
            text: 'For $h(t) = -5t^2 + 20t + 25$, vertex $t = -\\frac{20}{2(-5)} = 2$. Maximum height $h(2) = 45$.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TEXTBOOK 3: Mastering Digital SAT Reading & Writing
  // =========================================================================
  {
    id: 'sat-reading-writing-mastery',
    title: 'Mastering Digital SAT Reading & Writing',
    subject: 'reading-writing',
    author: 'AIES Humanities & Psychometrics Research Group',
    publisherOrOwner: 'AIES Academic Press (Original Curriculum Series)',
    coverColor: 'from-amber-600 via-orange-600 to-rose-700',
    description: 'Evidence-based reading, Words in Context vocabulary mastery, Text Structure & Purpose, Inferences, and Cross-Text Connections.',
    version: 'v5.1',
    lastUpdated: '2026-08-14',
    changelog: [
      {
        id: 'cl-rw-01',
        date: '2026-08-14',
        summary: 'Added 6 high-density Words in Context vocabulary worked examples across all three difficulty tiers',
        triggerExamTitle: 'Reading & Writing Diagnostic Assessment',
        teacherName: 'Prof. Julian Vance',
        approvedBy: 'AIES Editorial Board',
        sectionsAdded: 3
      },
      {
        id: 'cl-rw-02',
        date: '2026-08-04',
        summary: 'Integrated Cross-Text Connections synthesis models and contrastive premise matrix',
        triggerExamTitle: 'R&W Module 2 Mastery Test',
        teacherName: 'Claire Thornton',
        approvedBy: 'Academic Curriculum Committee',
        sectionsAdded: 2
      }
    ],
    chapters: [
      {
        id: 'ch-cs-01',
        chapterNumber: 1,
        title: 'Craft & Structure: Words in Context & Rhetorical Purpose',
        domain: 'craft-structure',
        description: 'Contextual vocabulary decoding, tone analysis, paragraph structure, and function of highlighted sentences.',
        sections: [
          {
            id: 'sec-cs-1-1',
            sectionNumber: '1.1',
            title: 'Words in Context: Decoding High-Utility Academic Lexicon',
            skill: 'Words in Context',
            pageNumber: 1,
            conceptSummary: 'Words in Context evaluates precise academic vocabulary in short literary, scientific, and humanities passages. The Digital SAT rewards predicting a replacement word using surrounding textual clues before reading answer choices.',
            methodSteps: [
              'Step 1: Read for Overall Valence — Determine if the missing word expresses a positive, negative, or neutral cognitive/empirical state.',
              'Step 2: Identify Structural Signal Words — Look for contrast markers (however, whereas, paradoxically) or continuation markers (furthermore, accordingly).',
              'Step 3: Formulate a Blank Replacement — Insert your own simple synonym into the blank before looking at options.',
              'Step 4: Match and Eliminate — Pick the choice that precisely mirrors your predicted synonym; eliminate near-misses that carry an unintended extreme tone.'
            ],
            workedExamples: [
              {
                title: 'Scientific Academic Vocabulary (Medium Tier)',
                difficulty: 'medium',
                problem: 'Although previous researchers characterized the enzyme as chemically inert, recent spectroscopic analysis demonstrated that under high atmospheric pressure it is remarkably _______, initiating catalytic reactions within milliseconds.\nWhich choice completes the text with the most logical and precise word?\nA) dormant\nB) volatile\nC) reactive\nD) impervious',
                solution: '1. Contrast Clue: "Although... chemically inert" signals that the blank must mean the opposite of inert (non-reacting).\n2. Continuation Clue: "...initiating catalytic reactions within milliseconds" proves the enzyme actively reacts.\n3. Prediction: "Active / chemically responsive".\n4. Choice Analysis: A) dormant (opposite), B) volatile (evaporates easily/unstable, not catalytic), C) reactive (perfect match), D) impervious (unaffected, opposite). Correct: C.',
                trap: 'Selecting volatile because it sounds scientific, even though it does not match "initiating catalytic reactions".'
              },
              {
                title: 'High-Difficulty Nuance & Secondary Meanings',
                difficulty: 'hard',
                problem: 'The historian argued that the monarch was by no means an absolutist; rather, her administration was characterized by a pragmatic willingness to _______ local councils on matters of fiscal taxation.\nA) repudiate\nB) defer to\nC) usurp\nD) circumscribe',
                solution: '1. Contrast Clue: "by no means an absolutist; rather..." signals cooperation/yielding power.\n2. Prediction: "listen to / yield to / consult".\n3. Choice Analysis: A) repudiate (reject), B) defer to (submit/yield respectfully), C) usurp (take by force), D) circumscribe (restrict). Correct: B.',
                trap: 'Choosing circumscribe because it relates to boundaries, missing the supportive cooperative contrast.'
              }
            ],
            commonMistakes: [
              'Picking a familiar word because it sounds sophisticated, without checking whether its exact definition fits the contrast clue.',
              'Ignoring polarity words like "not", "hardly", "unprecedented", and "scarcely".'
            ],
            featuredQuestionId: 'sat_rw_cs_001',
            similarQuestionIds: ['sat_rw_cs_002', 'sat_rw_cs_003'],
            relatedTopics: [
              {
                title: 'Text Structure and Purpose',
                textbookId: 'sat-reading-writing-mastery',
                chapterId: 'ch-cs-01',
                sectionId: 'sec-cs-1-2',
                pageNumber: 2,
                domain: 'craft-structure'
              },
              {
                title: 'Command of Evidence (Textual)',
                textbookId: 'sat-reading-writing-mastery',
                chapterId: 'ch-ii-02',
                sectionId: 'sec-ii-2-1',
                pageNumber: 3,
                domain: 'information-ideas'
              }
            ]
          },
          {
            id: 'sec-cs-1-2',
            sectionNumber: '1.2',
            title: 'Text Structure and Purpose',
            skill: 'Text Structure and Purpose',
            pageNumber: 2,
            conceptSummary: 'Questions ask for the main purpose of the entire text or the function of a specific underlined sentence in advancing the author’s rhetorical argument.',
            methodSteps: [
              'Step 1: Map the paragraph flow (Claim -> Evidence -> Counterpoint -> Resolution).',
              'Step 2: Note the function verb in answer choices (Describe, Challenge, Reconcile, Illustrate).',
              'Step 3: Verify the object of the verb against the text.'
            ],
            workedExamples: [
              {
                title: 'Functional Sentence Purpose',
                difficulty: 'medium',
                problem: 'Which choice best describes the function of the underlined sentence in the text as a whole?',
                solution: 'Map the preceding sentence (introduces an accepted theory) and the underlined sentence (presents anomalous data that challenges that theory). The purpose is to introduce an empirical finding that complicates the prevailing model.',
                trap: 'Selecting a choice that describes what the sentence says rather than how it functions in the argument.'
              }
            ],
            commonMistakes: [
              'Confusing content summary with rhetorical function.'
            ],
            featuredQuestionId: 'sat_rw_cs_002',
            similarQuestionIds: ['sat_rw_cs_001', 'sat_rw_cs_003'],
            relatedTopics: [
              {
                title: 'Words in Context: Decoding High-Utility Academic Lexicon',
                textbookId: 'sat-reading-writing-mastery',
                chapterId: 'ch-cs-01',
                sectionId: 'sec-cs-1-1',
                pageNumber: 1,
                domain: 'craft-structure'
              }
            ]
          }
        ]
      },
      {
        id: 'ch-ii-02',
        chapterNumber: 2,
        title: 'Information & Ideas: Evidence, Central Ideas & Inferences',
        domain: 'information-ideas',
        description: 'Central themes, command of textual and quantitative evidence, and logical inferences from data and arguments.',
        sections: [
          {
            id: 'sec-ii-2-1',
            sectionNumber: '2.1',
            title: 'Command of Evidence: Textual & Quantitative Data',
            skill: 'Command of Evidence',
            pageNumber: 3,
            conceptSummary: 'Command of evidence items require selecting the specific finding, quotation, or data point that most directly supports or weakens a researcher’s stated hypothesis.',
            methodSteps: [
              'Step 1: Identify the exact claim/hypothesis being tested.',
              'Step 2: Determine the required direction of support (Support vs Undermine).',
              'Step 3: Evaluate each option strictly against the hypothesis — reject true statements that do not address the core hypothesis.'
            ],
            workedExamples: [
              {
                title: 'Scientific Hypothesis Confirmation',
                difficulty: 'medium',
                problem: 'Which finding, if true, would most directly support Dr. Martinez’s hypothesis?',
                solution: 'Isolate Martinez’s claim: high salinity reduces root respiration in Halophyte B. Look for data showing lower oxygen consumption in Halophyte B under elevated salt concentrations.',
                trap: 'Selecting a true finding about Halophyte A when the hypothesis is specifically about Halophyte B.'
              }
            ],
            commonMistakes: [
              'Picking a factually accurate finding from the passage that does not directly test or validate the specific hypothesis mentioned in the prompt.'
            ],
            featuredQuestionId: 'sat_rw_ii_001',
            similarQuestionIds: ['sat_rw_ii_002', 'sat_rw_ii_003'],
            relatedTopics: [
              {
                title: 'Inferences & Argumentative Completion',
                textbookId: 'sat-reading-writing-mastery',
                chapterId: 'ch-ii-02',
                sectionId: 'sec-ii-2-2',
                pageNumber: 4,
                domain: 'information-ideas'
              }
            ]
          },
          {
            id: 'sec-ii-2-2',
            sectionNumber: '2.2',
            title: 'Inferences & Argumentative Completion',
            skill: 'Inferences',
            pageNumber: 4,
            conceptSummary: 'Inference items ask you to logically complete a text. The correct completion must be a necessary and conservative deduction directly anchored in the premises.',
            methodSteps: [
              'Step 1: Read the premises and identify the connecting logic chain (If A -> B, and B -> C).',
              'Step 2: Avoid extreme speculative leaps — the SAT correct answer is always the most conservative, unassailable logical deduction.',
              'Step 3: Check that the conclusion resolves the premise without introducing unmentioned outside variables.'
            ],
            workedExamples: [
              {
                title: 'Logical Passage Completion',
                difficulty: 'hard',
                problem: 'Which choice most logically completes the text?',
                solution: 'Ensure the final statement directly addresses the unsolved mystery in the penultimate sentence without over-claiming causation.',
                trap: 'Selecting an option with absolute words like "always", "never", "invariably", or "wholly impossible".'
              }
            ],
            commonMistakes: [
              'Choosing an answer that introduces plausible real-world speculation not supported by the passage.'
            ],
            featuredQuestionId: 'sat_rw_ii_002',
            similarQuestionIds: ['sat_rw_ii_001', 'sat_rw_ii_003'],
            relatedTopics: [
              {
                title: 'Command of Evidence: Textual & Quantitative Data',
                textbookId: 'sat-reading-writing-mastery',
                chapterId: 'ch-ii-02',
                sectionId: 'sec-ii-2-1',
                pageNumber: 3,
                domain: 'information-ideas'
              }
            ]
          }
        ]
      }
    ],
    pages: [
      {
        pageNumber: 1,
        content: `CHAPTER 1: CRAFT & STRUCTURE — WORDS IN CONTEXT\n\n1. Concept Introduction\nWords in Context questions evaluate precise vocabulary in academic, scientific, and humanities texts. Digital SAT vocabulary questions reward decoding context clues, sentence polarity, and contrast signals.\n\n2. The Core 4-Step Method:\nStep 1: Read for Overall Valence (positive, negative, neutral).\nStep 2: Identify Structural Signal Words (however, whereas, similarly).\nStep 3: Formulate a Blank Replacement before looking at options.\nStep 4: Match and Eliminate near-misses.`,
        ocrText: 'Words in context, vocabulary, tone, contrast clues, transition words, academic lexicon.',
        sections: [
          {
            heading: '1.1 Words in Context Worked Example (Medium Tier)',
            text: 'Enzyme inert vs catalytically active. Choice C: reactive is the exact opposite of inert and matches initiating reactions.'
          }
        ]
      },
      {
        pageNumber: 2,
        content: `CHAPTER 1: CRAFT & STRUCTURE — TEXT STRUCTURE AND PURPOSE\n\n1. Concept Introduction\nQuestions ask for the overarching purpose of the whole passage or the rhetorical function of an underlined sentence. Focus on structural function verbs: illustrate, qualify, refute, describe, synthesize.`,
        ocrText: 'Text structure, rhetorical purpose, function of underlined sentence, passage flow.',
        sections: [
          {
            heading: '2.1 Text Structure Function',
            text: 'Sentence purpose focuses on how the author constructs the argument (e.g. presenting anomalous evidence to qualify a prior claim).'
          }
        ]
      },
      {
        pageNumber: 3,
        content: `CHAPTER 2: INFORMATION & IDEAS — COMMAND OF EVIDENCE\n\n1. Concept Introduction\nCommand of evidence questions test your ability to evaluate which piece of textual or quantitative evidence most directly supports or weakens a stated claim or research hypothesis.`,
        ocrText: 'Command of evidence, textual evidence, quantitative data, hypothesis testing.',
        sections: [
          {
            heading: '3.1 Scientific Hypothesis Evidence',
            text: 'Focus on finding direct data that tests the specific hypothesis rather than generalized facts.'
          }
        ]
      },
      {
        pageNumber: 4,
        content: `CHAPTER 2: INFORMATION & IDEAS — INFERENCES\n\n1. Concept Introduction\nInference questions ask you to logically complete a passage. The correct answer is always a conservative, direct conclusion guaranteed by the text’s stated premises.`,
        ocrText: 'Inferences, logically completes the text, deductive reasoning, conservative conclusion.',
        sections: [
          {
            heading: '4.1 Conservative Logical Completion',
            text: 'Pick the conclusion that follows necessarily from the premises without introducing unproven assumptions.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TEXTBOOK 4: Standard English Conventions & Rhetoric
  // =========================================================================
  {
    id: 'sat-grammar-conventions',
    title: 'Standard English Conventions & Rhetoric',
    subject: 'reading-writing',
    author: 'AIES Humanities & Psychometrics Research Group',
    publisherOrOwner: 'AIES Academic Press (Original Curriculum Series)',
    coverColor: 'from-emerald-600 via-teal-700 to-slate-900',
    description: 'Sentence boundaries, comma splices, run-ons, subject-verb agreement, modifier placement, logical transitions, and rhetorical synthesis.',
    version: 'v4.0',
    lastUpdated: '2026-08-11',
    changelog: [
      {
        id: 'cl-gram-01',
        date: '2026-08-11',
        summary: 'Added 4 rhetorical synthesis bullet-point note exercises and logical transition taxonomy',
        triggerExamTitle: 'Grammar & Conventions Midterm Assessment',
        teacherName: 'Marcus Vance',
        approvedBy: 'Academic Curriculum Committee',
        sectionsAdded: 2
      }
    ],
    chapters: [
      {
        id: 'ch-sec-01',
        chapterNumber: 1,
        title: 'Standard English Conventions: Sentence Boundaries & Agreement',
        domain: 'standard-english-conventions',
        description: 'Independent vs dependent clauses, semicolons, dashes, apostrophes, subject-verb agreement, and misplaced modifiers.',
        sections: [
          {
            id: 'sec-sec-1-1',
            sectionNumber: '1.1',
            title: 'Sentence Boundaries: Semicolons, Colons & Comma Splices',
            skill: 'Boundaries',
            pageNumber: 1,
            conceptSummary: 'A sentence boundary error occurs when two independent clauses are joined incorrectly without proper punctuation. The SAT rigorously tests three valid ways to link two complete independent clauses: (1) Period/Semicolon, (2) Comma + FANBOYS coordinating conjunction, or (3) Colon/Single Dash when clause two explains clause one.',
            methodSteps: [
              'Step 1: Identify Clause Independence — Check if each side of the punctuation mark has a subject and a conjugated finite verb.',
              'Step 2: Spot Comma Splices — Two independent clauses separated by only a comma is ALWAYS incorrect on the SAT.',
              'Step 3: Evaluate Semicolon Equivalency — A semicolon is grammatically identical to a period on the SAT ($[IC]; [IC]$).',
              'Step 4: Use Colons for Explanation — A colon requires a complete independent clause BEFORE it; what follows can be a list, explanation, or second clause.'
            ],
            workedExamples: [
              {
                title: 'Comma Splice vs Semicolon Resolution',
                difficulty: 'easy',
                problem: 'The restoration of the ancient Roman mosaic required extraordinary _______ carefully cleaned and cataloged over twelve thousand individual tesserae over three years.\nA) patience, the conservators\nB) patience; the conservators\nC) patience the conservators\nD) patience, and the conservators',
                solution: '1. Clause 1: "The restoration... required extraordinary patience" (Complete Independent Clause).\n2. Clause 2: "the conservators carefully cleaned and cataloged..." (Complete Independent Clause).\n3. Two independent clauses require a semicolon or period. Choice A is a comma splice, Choice C is a run-on. Correct: B.',
                trap: 'Selecting A because it creates a natural pause in speech. Commas alone cannot connect two complete sentences.'
              },
              {
                title: 'Dangling Modifier Correction (Hard Tier)',
                difficulty: 'hard',
                problem: 'After conducting extensive microbiological assays on the deep-sea hydrothermal vent samples, _______.\nWhich choice logically and grammatically completes the sentence?\nA) significant concentrations of thermophilic bacteria were identified by the research team\nB) the research team identified significant concentrations of thermophilic bacteria\nC) identification of thermophilic bacteria was achieved by the research team\nD) the deep-sea samples revealed significant concentrations of thermophilic bacteria',
                solution: '1. Introductory Modifying Clause: "After conducting extensive microbiological assays..."\n2. Question: WHO conducted the assays? The subject immediately following the comma MUST be the entity that conducted the assays (the research team).\n3. In A, "concentrations" did not conduct assays; in D, "samples" did not conduct assays. Correct: B.',
                trap: 'Passive voice constructions where the true actor is buried in a prepositional phrase ("by the team").'
              }
            ],
            commonMistakes: [
              'Using a semicolon when one side is a dependent fragment (e.g. "Because the rain fell; the game stopped" is incorrect).',
              'Treating transition words like "however", "therefore", and "moreover" as conjunctions (they require $[IC]; \\text{however}, [IC]$).'
            ],
            featuredQuestionId: 'sat_rw_sec_001',
            similarQuestionIds: ['sat_rw_sec_002', 'sat_rw_sec_003'],
            relatedTopics: [
              {
                title: 'Logical Transitions & Discourse Markers',
                textbookId: 'sat-grammar-conventions',
                chapterId: 'ch-eoi-02',
                sectionId: 'sec-eoi-2-1',
                pageNumber: 2,
                domain: 'expression-of-ideas'
              },
              {
                title: 'Rhetorical Synthesis & Note Integration',
                textbookId: 'sat-grammar-conventions',
                chapterId: 'ch-eoi-02',
                sectionId: 'sec-eoi-2-2',
                pageNumber: 3,
                domain: 'expression-of-ideas'
              }
            ]
          }
        ]
      },
      {
        id: 'ch-eoi-02',
        chapterNumber: 2,
        title: 'Expression of Ideas: Transitions & Rhetorical Synthesis',
        domain: 'expression-of-ideas',
        description: 'Logical discourse connectives, organizing bullet-point notes, and targeted rhetorical synthesis.',
        sections: [
          {
            id: 'sec-eoi-2-1',
            sectionNumber: '2.1',
            title: 'Logical Transitions & Discourse Markers',
            skill: 'Transitions',
            pageNumber: 2,
            conceptSummary: 'Transitions test logical relations between adjacent sentences: Contrast (However, Conversely), Continuance/Addition (Furthermore, Moreover), Cause/Effect (Consequently, Therefore), or Illustration (For instance, Specifically).',
            methodSteps: [
              'Step 1: Read Sentence 1 and Sentence 2 without the transition word.',
              'Step 2: Determine relationship: Are they Agreeing (+), Contradicting (-), Explaining (=), or Cause-Effect (->)?',
              'Step 3: Select the unique category word; eliminate choices in identical categories.'
            ],
            workedExamples: [
              {
                title: 'Contrast vs Cause-Effect Transition',
                difficulty: 'medium',
                problem: 'Solar arrays generate maximal electricity during cloudless midday hours. _______ peak residential energy demand typically surges in the early evening when sunlight diminishes.\nA) Consequently,\nB) However,\nC) In addition,\nD) For example,',
                solution: 'Sentence 1 = Peak generation midday. Sentence 2 = Peak consumption evening. The relationship is a direct timing mismatch / contrast. Choice B (However) is the only contrast transition.',
                trap: 'Picking Consequently, assuming consumption is caused by generation.'
              }
            ],
            commonMistakes: [
              'Ignoring that two choices in the same category (e.g. Furthermore and In addition) automatically eliminate each other.'
            ],
            featuredQuestionId: 'sat_rw_eoi_001',
            similarQuestionIds: ['sat_rw_eoi_002', 'sat_rw_eoi_003'],
            relatedTopics: [
              {
                title: 'Rhetorical Synthesis & Note Integration',
                textbookId: 'sat-grammar-conventions',
                chapterId: 'ch-eoi-02',
                sectionId: 'sec-eoi-2-2',
                pageNumber: 3,
                domain: 'expression-of-ideas'
              }
            ]
          },
          {
            id: 'sec-eoi-2-2',
            sectionNumber: '2.2',
            title: 'Rhetorical Synthesis & Note Integration',
            skill: 'Rhetorical Synthesis',
            pageNumber: 3,
            conceptSummary: 'A student has taken notes on a topic. You must choose the sentence that best fulfills a specifically stated rhetorical goal (e.g. emphasize a difference, introduce a discovery, or present a similarity).',
            methodSteps: [
              'Step 1: READ THE PROMPT GOAL FIRST — The prompt always dictates what must be highlighted.',
              'Step 2: Filter choices that achieve the exact goal — ignore choices that state true facts from the notes but fail the prompt goal.',
              'Step 3: Verify factual accuracy against the bullet points.'
            ],
            workedExamples: [
              {
                title: 'Emphasize a Difference in Findings',
                difficulty: 'medium',
                problem: 'The student wants to emphasize a difference between the two telescope designs. Which choice most effectively accomplishes this goal?',
                solution: 'Look for the choice that uses contrast language (whereas, unlike) and mentions both telescopes and their differing mirror diameters.',
                trap: 'Choosing a sentence that only describes Telescope A, even though the goal is to compare/differentiate both.'
              }
            ],
            commonMistakes: [
              'Reading all bullet points before reading the goal. The goal tells you exactly which 2 notes matter.'
            ],
            featuredQuestionId: 'sat_rw_eoi_002',
            similarQuestionIds: ['sat_rw_eoi_001', 'sat_rw_eoi_003'],
            relatedTopics: [
              {
                title: 'Logical Transitions & Discourse Markers',
                textbookId: 'sat-grammar-conventions',
                chapterId: 'ch-eoi-02',
                sectionId: 'sec-eoi-2-1',
                pageNumber: 2,
                domain: 'expression-of-ideas'
              }
            ]
          }
        ]
      }
    ],
    pages: [
      {
        pageNumber: 1,
        content: `CHAPTER 1: STANDARD ENGLISH CONVENTIONS — SENTENCE BOUNDARIES\n\n1. Concept Introduction\nSentence boundary rules on the Digital SAT evaluate your ability to link independent clauses using periods, semicolons, colons, dashes, or comma + coordinating conjunctions (FANBOYS).\n\n2. Key Rules:\n- Independent + Independent = Period, Semicolon, or Comma + FANBOYS.\n- Comma Splice: Joining two independent clauses with only a comma is ALWAYS incorrect.`,
        ocrText: 'Sentence boundaries, comma splices, run-on sentences, semicolons, colons, coordinating conjunctions, dangling modifiers.',
        sections: [
          {
            heading: '1.1 Semicolon Boundary Worked Example',
            text: 'Two complete independent clauses require a semicolon. Semicolons and periods are functionally interchangeable on the SAT.'
          }
        ]
      },
      {
        pageNumber: 2,
        content: `CHAPTER 2: EXPRESSION OF IDEAS — LOGICAL TRANSITIONS\n\n1. Concept Introduction\nTransitions test discourse connectivity: Contrast (However), Continuance (Furthermore), Cause-and-Effect (Consequently), and Illustration (For example).\n\n2. Method:\nRead both sentences without the transition, determine the conceptual relationship, and select the appropriate category.`,
        ocrText: 'Transitions, however, furthermore, therefore, consequently, discourse markers, cohesion.',
        sections: [
          {
            heading: '2.1 Contrast Transition Analysis',
            text: 'When sentence 1 and sentence 2 express conflicting or opposing points, use contrast markers like However or On the other hand.'
          }
        ]
      },
      {
        pageNumber: 3,
        content: `CHAPTER 2: EXPRESSION OF IDEAS — RHETORICAL SYNTHESIS\n\n1. Concept Introduction\nRhetorical synthesis presents bullet-point notes and asks you to select the sentence that fulfills a specific communication objective.\n\n2. Method:\nRead the prompt goal first, filter out sentences that do not fulfill the goal, and verify details against the notes.`,
        ocrText: 'Rhetorical synthesis, student notes, prompt goal, emphasize difference, introduce discovery.',
        sections: [
          {
            heading: '3.1 Prompt-First Synthesis Strategy',
            text: 'Always read the prompt objective before reading choices. The correct choice must fulfill the prompt goal directly.'
          }
        ]
      }
    ]
  }
];
