import { Textbook } from '../types';

export const initialTextbooks: Textbook[] = [
  // =========================================================================
  // TEXTBOOK 1: Foundations of Digital SAT Math
  // =========================================================================
  {
    id: 'sat-foundations-math',
    title: 'Foundations of Digital SAT Math',
    author: 'AIES STEM & Quantitative Research Board',
    publisherOrOwner: 'AIES Academic Press (Original Curriculum Series)',
    coverColor: 'from-blue-600 via-indigo-600 to-sky-700',
    pages: [
      {
        pageNumber: 1,
        content: `CHAPTER 1: ALGEBRA — LINEAR EQUATIONS IN ONE VARIABLE

1. Concept Introduction
Linear equations in one variable describe constant rates of change where the variable is raised only to the first power ($x^1$). On the Digital SAT, linear equation problems range from fundamental multi-step isolate-and-solve questions to questions testing structural equivalence, clearing rational denominators, and recognizing conditions that yield infinitely many solutions or no solution.

2. The Core Method: Systematic Isolation & Structural Recognition
Step 1: Simplify Both Sides — Expand all parentheses using the distributive property and combine like terms on each side independently.
Step 2: Clear Fractions — If equations contain rational coefficients, multiply the entire equation by the Least Common Multiple (LCM) of all denominators.
Step 3: Collect Variable Terms — Move all terms containing the variable to one side and all constant terms to the opposite side using inverse operations.
Step 4: Solve and Verify — Isolate the variable and check against the exact quantity requested by the prompt (e.g. solve for $2x - 3$, not just $x$).

3. Special Structural Cases:
- Exactly One Solution: $ax + b = cx + d$ where $a \\neq c$.
- No Solution (Parallel): $ax + b = ax + d$ where $b \\neq d$ (e.g., $0x = 5$, impossible).
- Infinitely Many Solutions (Identity): $ax + b = ax + b$ (e.g., $0x = 0$, true for all real numbers).`,
        ocrText: 'Linear equations in one variable, distributive property, isolate variable, no solution, infinitely many solutions, least common multiple.',
        sections: [
          {
            heading: '1.1 Worked Example (Easy Tier)',
            text: `Problem: If $4(x - 3) + 7 = 27$, what is the value of $x + 5$?
Step-by-step Solution:
1. Distribute 4: $4x - 12 + 7 = 27$
2. Combine constants: $4x - 5 = 27$
3. Add 5 to both sides: $4x = 32$
4. Divide by 4: $x = 8$
5. Answer the prompt: The question asks for $x + 5 = 8 + 5 = 13$.
Common Trap: Students often stop at $x = 8$ without computing $x + 5$. Always double check the target expression.`
          },
          {
            heading: '1.2 Worked Example (Medium Tier)',
            text: `Problem: For what value of $k$ does the equation $\\frac{3x - 5}{4} + \\frac{x + 1}{2} = \\frac{k x - 3}{4}$ have infinitely many solutions?
Step-by-step Solution:
1. Multiply the entire equation by LCM 4: $(3x - 5) + 2(x + 1) = k x - 3$
2. Expand: $3x - 5 + 2x + 2 = k x - 3$
3. Combine like terms: $5x - 3 = k x - 3$
4. For infinitely many solutions, coefficients of $x$ and constants must match identically: $5x = k x \\implies k = 5$.`
          },
          {
            heading: '1.3 Worked Example (Hard Tier)',
            text: `Problem: In the equation $a(2x - 5) + 3x = 11x - 20$, $a$ is a constant. If the equation has no solution, what condition must be true?
Step-by-step Solution:
1. Expand left side: $2ax - 5a + 3x = 11x - 20$
2. Group variable terms: $(2a + 3)x - 5a = 11x - 20$
3. For no solution, slopes must be equal ($2a + 3 = 11$) while constant terms differ ($-5a \\neq -20$).
4. Solve for $a$: $2a = 8 \\implies a = 4$.
5. Check constants: $-5(4) = -20$, which equals $-20$. That would yield infinitely many solutions! Thus, if $-5a \\neq -20$, no value of constant $a$ with $2a+3=11$ produces no solution; the equation is an identity when $a = 4$.`
          },
          {
            heading: '1.4 Practice Checkpoint & Self-Drill',
            text: `Q1 (Easy): If $5x - 8 = 32$, what is the value of $10x$? (Ans: 80)
Q2 (Medium): Solve for $x$: $\\frac{2}{3}(x - 6) = \\frac{1}{2}x + 1$. (Ans: $x = 30$)
Q3 (Hard): The equation $3(kx - 2) = 15x - 6$ has infinitely many solutions for all $x$. What is the value of $k$? (Ans: $k = 5$)`
          }
        ]
      },
      {
        pageNumber: 2,
        content: `CHAPTER 1: ALGEBRA — LINEAR FUNCTIONS, SLOPE, AND CARTESIAN GRAPHS

1. Concept Introduction
A linear function is a mathematical relationship with a constant rate of change. On the Digital SAT, questions test your ability to interpret the slope $m$ and $y$-intercept $b$ in contextual word problems (such as cost models, physics rate problems, and depreciation), convert between standard form ($Ax + By = C$) and slope-intercept form ($y = mx + b$), and analyze parallel and perpendicular lines.

2. The Core Method: Rate of Change & Intercept Analysis
- Slope Formula: $m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\Delta y}{\\Delta x} = \\frac{\\text{Change in Output}}{\\text{Change in Input}}$
- Contextual Meaning of Slope: The rate at which the dependent variable changes for every single unit increase in the independent variable.
- Contextual Meaning of $y$-intercept ($b$): The baseline or initial value when the input variable $x = 0$.
- Parallel Lines: Slopes are equal ($m_1 = m_2$).
- Perpendicular Lines: Slopes are negative reciprocals ($m_1 \\cdot m_2 = -1 \\implies m_2 = -\\frac{1}{m_1}$).`,
        ocrText: 'Linear functions, slope intercept form, rate of change, Cartesian plane, parallel lines, perpendicular lines, y intercept.',
        sections: [
          {
            heading: '2.1 Contextual Interpretation & Word Problems',
            text: `Example: A certified electrician charges a flat diagnostic fee of $85 plus $65 per hour of labor. The total charge $C$ for $h$ hours is modeled by $C(h) = 65h + 85$.
- Interpretation: The slope 65 represents the hourly labor cost ($65/hour). The y-intercept 85 represents the initial diagnostic fee incurred before any labor begins ($h = 0$).`
          },
          {
            heading: '2.2 Worked Example: Perpendicular Line Equations (Medium Tier)',
            text: `Problem: Line $k$ passes through points $(2, -3)$ and $(6, 5)$. Line $p$ is perpendicular to line $k$ and passes through $(4, 1)$. What is the equation of line $p$?
Step-by-step Solution:
1. Find slope of line $k$: $m_k = \\frac{5 - (-3)}{6 - 2} = \\frac{8}{4} = 2$.
2. Determine perpendicular slope: $m_p = -\\frac{1}{2}$.
3. Use point-slope form with $(4, 1)$: $y - 1 = -\\frac{1}{2}(x - 4)$
4. Expand: $y - 1 = -\\frac{1}{2}x + 2 \\implies y = -\\frac{1}{2}x + 3$.`
          },
          {
            heading: '2.3 Common Traps & Desmos Verification Strategy',
            text: `Common Trap: Misinterpreting horizontal vs vertical line equations. $y = c$ is horizontal (slope = 0); $x = c$ is vertical (slope undefined).
Desmos Tip: In the Digital SAT interface, open the Desmos calculator and type equations directly to visually inspect intercepts, intersections, and slopes instantly.`
          }
        ]
      },
      {
        pageNumber: 3,
        content: `CHAPTER 1: ALGEBRA — SYSTEMS OF TWO LINEAR EQUATIONS

1. Concept Introduction
A system of linear equations consists of two or more equations sharing the same variables. Solutions correspond to the coordinate points $(x, y)$ where the lines intersect on the Cartesian coordinate plane.

2. The Three Algebraic Methods:
- Substitution: Solve one equation for one variable and substitute the resulting expression into the other equation. Ideal when one variable has a coefficient of 1 or -1.
- Elimination (Linear Combinations): Multiply one or both equations by constants so that the coefficients of one variable become opposites, then add the equations to eliminate that variable.
- Geometric Analysis of Solutions:
  * 1 Solution: Lines intersect at exactly one point (different slopes, $m_1 \\neq m_2$).
  * 0 Solutions: Parallel lines (same slope, different y-intercepts: $\\frac{A_1}{A_2} = \\frac{B_1}{B_2} \\neq \\frac{C_1}{C_2}$).
  * $\\infty$ Solutions: Coincident lines (same slope, same y-intercept: $\\frac{A_1}{A_2} = \\frac{B_1}{B_2} = \\frac{C_1}{C_2}$).`,
        ocrText: 'Systems of equations, elimination method, substitution method, intersection, parallel lines, infinitely many solutions.',
        sections: [
          {
            heading: '3.1 Elimination Method Worked Example',
            text: `Problem: Solve the system:
(1) $3x + 4y = 26$
(2) $5x - 2y = 4$
Step-by-step Solution:
1. Multiply equation (2) by 2: $10x - 4y = 8$
2. Add to equation (1): $(3x + 4y) + (10x - 4y) = 26 + 8 \\implies 13x = 34 \\implies x = 2$.
3. Check: $3(2) + 4y = 26 \\implies 6 + 4y = 26 \\implies 4y = 20 \\implies y = 5$.
Solution: $(x, y) = (2, 5)$.`
          },
          {
            heading: '3.2 Infinite Solutions Parameter Problem (Hard Tier)',
            text: `Problem: If $6x - 15y = 21$ and $2x - ky = 7$ have infinitely many solutions, what is $k$?
Step-by-step Solution:
1. Notice ratio of leading coefficients: $\\frac{6}{2} = 3$.
2. Ratio of constants: $\\frac{21}{7} = 3$.
3. For identical lines, ratio of y-coefficients must also equal 3: $\\frac{-15}{-k} = 3 \\implies 15 = 3k \\implies k = 5$.`
          }
        ]
      },
      {
        pageNumber: 4,
        content: `CHAPTER 2: PROBLEM-SOLVING & DATA ANALYSIS — RATIOS, RATES & PERCENTAGES

1. Concept Introduction
Problem-Solving and Data Analysis accounts for approximately 15% of the Digital SAT Math section. Questions assess proportional reasoning, unit conversions (dimensional analysis), multi-step percentage change, and exponential growth/decay models.

2. Key Formulas & Proportional Methods:
- Unit Conversion (Factor-Label Method): Multiply by conversion fractions equal to 1 until desired units are achieved.
- Percent Change Formula:
  $$\\text{Percent Change} = \\left( \\frac{\\text{New Value} - \\text{Original Value}}{\\text{Original Value}} \\right) \\times 100\\%$$
- Multiplier Method for Successive Percentages:
  * An increase of $p\\%$ corresponds to multiplier $(1 + \\frac{p}{100})$.
  * A decrease of $p\\%$ corresponds to multiplier $(1 - \\frac{p}{100})$.
  * Successive changes multiply: An increase of 20% followed by a decrease of 20% equals $(1.20)(0.80) = 0.96$ (a net 4% decrease, NOT 0%).`,
        ocrText: 'Ratios, rates, unit conversion, percent change, exponential growth, successive percentage discounts.',
        sections: [
          {
            heading: '4.1 Dimensional Analysis Worked Example',
            text: `Problem: A vehicle travels at a constant speed of 72 kilometers per hour. What is its speed in meters per second?
Step-by-step Solution:
1. Set up conversion factors: $1\\text{ km} = 1000\\text{ m}$ and $1\\text{ hour} = 3600\\text{ seconds}$.
2. Calculation: $\\frac{72\\text{ km}}{1\\text{ hr}} \\times \\frac{1000\\text{ m}}{1\\text{ km}} \\times \\frac{1\\text{ hr}}{3600\\text{ s}} = \\frac{72000}{3600} = 20\\text{ m/s}$.`
          },
          {
            heading: '4.2 Successive Percentage Trap (Medium Tier)',
            text: `Problem: A laptop originally priced at $800 is discounted by 25%. During a holiday sale, an additional 10% discount is applied to the sale price. What is the final price?
Step-by-step Solution:
1. Apply first multiplier: $800 \\times (1 - 0.25) = 800 \\times 0.75 = 600$.
2. Apply second multiplier: $600 \\times (1 - 0.10) = 600 \\times 0.90 = 540$.
Common Trap: Adding percentages $(25\\% + 10\\% = 35\\%)$ gives $800 \\times 0.65 = 520$, which is incorrect because the second discount applies only to the reduced price.`
          }
        ]
      },
      {
        pageNumber: 5,
        content: `CHAPTER 2: PROBLEM-SOLVING & DATA ANALYSIS — TWO-WAY TABLES & STATISTICS

1. Concept Introduction
Two-way frequency tables display categorical data for two variables across rows and columns. Statistical questions evaluate measures of center (mean, median), measures of spread (range, standard deviation), line of best fit residuals, and conditional probability.

2. Core Probability & Statistical Definitions:
- Conditional Probability: $P(A \\mid B) = \\frac{\\text{Count of }(A \\text{ and } B)}{\\text{Total in Subpopulation } B}$
  * "Of the students who play soccer, what fraction play chess?" $\\implies$ Denominator is total soccer players only.
- Mean vs Median & Skewness:
  * Mean: Sensitive to extreme outliers.
  * Median: Resistant to outliers (middle value when ordered).
  * Right-skewed distribution (tail to the right) $\\implies \\text{Mean} > \\text{Median}$.
  * Left-skewed distribution (tail to the left) $\\implies \\text{Mean} < \\text{Median}$.
- Standard Deviation: Quantifies how closely data cluster around the mean. Larger spread $\\implies$ larger standard deviation.`,
        ocrText: 'Two way tables, conditional probability, mean, median, standard deviation, scatterplots, line of best fit, residuals.',
        sections: [
          {
            heading: '5.1 Two-Way Table Conditional Probability',
            text: `Example Table:
| Group | Juniors | Seniors | Total |
| App Dev | 45 | 55 | 100 |
| Robotics | 35 | 65 | 100 |
| Total | 80 | 120 | 200 |

Problem: If a student enrolled in Robotics is chosen at random, what is the probability that the student is a Senior?
Solution: The condition restricts our denominator to the Robotics row (Total = 100). The number of Seniors in Robotics is 65.
$P(\\text{Senior} \\mid \\text{Robotics}) = \\frac{65}{100} = 0.65$.`
          },
          {
            heading: '5.2 Scatterplots and Residuals',
            text: `Definition: A residual is the vertical distance between an observed data point and the regression line of best fit:
$$\\text{Residual} = y_{\\text{observed}} - y_{\\text{predicted}}$$
- If the point lies above the line, the residual is positive (model underestimates).
- If the point lies below the line, the residual is negative (model overestimates).`
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TEXTBOOK 2: SAT Advanced Math & Functions Mastery
  // =========================================================================
  {
    id: 'sat-advanced-math-mastery',
    title: 'SAT Advanced Math & Functions Mastery',
    author: 'Panda SAT STEM Editorial & Advanced Curriculum Group',
    publisherOrOwner: 'Panda SAT Curriculum Series',
    coverColor: 'from-purple-800 via-indigo-900 to-violet-950',
    pages: [
      {
        pageNumber: 1,
        content: `CHAPTER 1: ADVANCED MATH — QUADRATIC FUNCTIONS, FACTORING & VERTEX FORM

1. Concept Introduction
Quadratic functions take the standard form $f(x) = ax^2 + bx + c$ ($a \\neq 0$). Digital SAT Advanced Math problems require fluid movement between standard form, factored form $a(x - r_1)(x - r_2)$, and vertex form $a(x - h)^2 + k$.

2. Key Formulas & Algebraic Landmarks:
- Vertex Coordinates: $(h, k) = \\left( -\\frac{b}{2a}, f\\left(-\\frac{b}{2a}\\right) \\right)$
- Axis of Symmetry: $x = -\\frac{b}{2a}$
- Quadratic Formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
- Discriminant Analysis ($\\Delta = b^2 - 4ac$):
  * $\\Delta > 0$: 2 distinct real solutions ($2$ distinct $x$-intercepts).
  * $\\Delta = 0$: Exactly 1 real repeated solution ($1$ $x$-intercept, vertex touches $x$-axis).
  * $\\Delta < 0$: 0 real solutions (2 complex conjugate solutions, parabola does not intersect $x$-axis).`,
        ocrText: 'Quadratic functions, vertex form, quadratic formula, discriminant, axis of symmetry, factoring, parabola.',
        sections: [
          {
            heading: '1.1 Vertex Form Conversion by Completing the Square',
            text: `Problem: Write $y = 2x^2 - 12x + 23$ in vertex form and state its minimum value.
Step-by-step Solution:
1. Factor out leading coefficient 2 from variable terms: $y = 2(x^2 - 6x) + 23$
2. Complete the square inside: take half of $-6$ (which is $-3$) and square it ($(-3)^2 = 9$).
3. Add and balance: $y = 2(x^2 - 6x + 9) + 23 - 2(9)$
4. Simplify: $y = 2(x - 3)^2 + 23 - 18 \\implies y = 2(x - 3)^2 + 5$.
5. The vertex is at $(3, 5)$. Since $a = 2 > 0$, the parabola opens upward with a minimum value of $5$ at $x = 3$.`
          },
          {
            heading: '1.2 Tangency & Line-Parabola Intersections (Hard Tier)',
            text: `Problem: For what value of $c$ does the line $y = 4x + c$ intersect the parabola $y = x^2 + 2x + 7$ at exactly one point?
Step-by-step Solution:
1. Equate the two equations: $x^2 + 2x + 7 = 4x + c$
2. Set to standard quadratic form: $x^2 - 2x + (7 - c) = 0$
3. For exactly one intersection, the discriminant must equal zero:
   $\\Delta = b^2 - 4ac = (-2)^2 - 4(1)(7 - c) = 0$
4. Expand: $4 - 28 + 4c = 0 \\implies -24 + 4c = 0 \\implies 4c = 24 \\implies c = 6$.`
          }
        ]
      },
      {
        pageNumber: 2,
        content: `CHAPTER 1: ADVANCED MATH — POLYNOMIAL THEOREMS & RATIONAL EXPRESSIONS

1. Concept Introduction
Higher-order polynomials and rational expressions test factorization, root multiplicity, end behavior, and asymptotes.

2. The Remainder & Factor Theorems:
- Remainder Theorem: When polynomial $P(x)$ is divided by linear factor $(x - c)$, the remainder is equal to $P(c)$.
- Factor Theorem: $(x - c)$ is a factor of $P(x)$ if and only if $P(c) = 0$, which means $x = c$ is an $x$-intercept (root) of the graph.
- Multiplicity of Roots:
  * Odd multiplicity (e.g. $(x - c)^1, (x - c)^3$): Graph crosses the $x$-axis at $x = c$.
  * Even multiplicity (e.g. $(x - c)^2, (x - c)^4$): Graph touches and turns around at the $x$-axis.`,
        ocrText: 'Polynomial division, remainder theorem, factor theorem, rational expressions, vertical asymptotes, extraneous solutions.',
        sections: [
          {
            heading: '2.1 Remainder Theorem Application',
            text: `Problem: If $P(x) = 3x^3 - 5x^2 + k x - 8$ is divided by $(x - 2)$, the remainder is 14. What is the value of $k$?
Step-by-step Solution:
1. Apply Remainder Theorem: $P(2) = 14$.
2. Substitute $x = 2$: $3(2)^3 - 5(2)^2 + k(2) - 8 = 14$
3. Compute: $3(8) - 5(4) + 2k - 8 = 14 \\implies 24 - 20 + 2k - 8 = 14 \\implies 2k - 4 = 14 \\implies 2k = 18 \\implies k = 9$.`
          },
          {
            heading: '2.2 Radical Equations & Extraneous Solutions',
            text: `Problem: Solve $\\sqrt{2x + 15} = x$ for all real solutions.
Step-by-step Solution:
1. Square both sides: $2x + 15 = x^2$
2. Rearrange to standard quadratic: $x^2 - 2x - 15 = 0$
3. Factor: $(x - 5)(x + 3) = 0 \\implies x = 5$ or $x = -3$.
4. Check for extraneous roots:
   * For $x = 5$: $\\sqrt{2(5) + 15} = \\sqrt{25} = 5$ (Valid).
   * For $x = -3$: $\\sqrt{2(-3) + 15} = \\sqrt{9} = 3 \\neq -3$ (Extraneous!).
5. The only valid real solution is $x = 5$.`
          }
        ]
      },
      {
        pageNumber: 3,
        content: `CHAPTER 2: GEOMETRY & TRIGONOMETRY — CIRCLES & RIGHT TRIANGLE TRIGONOMETRY

1. Concept Introduction
The Digital SAT tests circle equations in standard Cartesian form, central and inscribed angles, arc length, sector area, and right-triangle trigonometric identities.

2. Key Formulas:
- Standard Circle Equation: $(x - h)^2 + (y - k)^2 = r^2$ where center is $(h, k)$ and radius is $r$.
- Arc Length ($s$) and Sector Area ($A$) in Radians:
  $$s = r\\theta, \\quad A = \\frac{1}{2}r^2\\theta \\quad (\\theta \\text{ in radians})$$
- Radian-Degree Conversion: $180^\\circ = \\pi\\text{ radians} \\implies 1\\text{ rad} = \\frac{180^\\circ}{\\pi}$
- Complementary Angle Trigonometric Identity:
  $$\\sin(x) = \\cos(90^\\circ - x) \\quad \\text{or} \\quad \\sin(x) = \\cos\\left(\\frac{\\pi}{2} - x\\right)$$
  If $\\sin(A) = \\cos(B)$ in an acute triangle, then $A + B = 90^\\circ$.`,
        ocrText: 'Circle equation, completing the square for circles, arc length, sector area, sine cosine complementary identity, radians.',
        sections: [
          {
            heading: '3.1 Circle Equation by Completing the Square',
            text: `Problem: Find the radius and center of the circle given by $x^2 + y^2 - 8x + 6y - 11 = 0$.
Step-by-step Solution:
1. Group $x$ and $y$ terms: $(x^2 - 8x) + (y^2 + 6y) = 11$
2. Complete the square for $x$: half of $-8$ is $-4$, squared is $16$.
3. Complete the square for $y$: half of $6$ is $3$, squared is $9$.
4. Balance equation: $(x^2 - 8x + 16) + (y^2 + 6y + 9) = 11 + 16 + 9$
5. Factor: $(x - 4)^2 + (y + 3)^2 = 36$
6. The center is $(4, -3)$ and the radius is $r = \\sqrt{36} = 6$.`
          },
          {
            heading: '3.2 Complementary Angle Identity (Medium Tier)',
            text: `Problem: In a right triangle, $\\sin(3x - 12^\\circ) = \\cos(2x + 7^\\circ)$. What is the value of $x$?
Step-by-step Solution:
1. Apply the identity: Since $\\sin(A) = \\cos(B)$, $A + B = 90^\\circ$.
2. Set up sum: $(3x - 12) + (2x + 7) = 90$
3. Combine terms: $5x - 5 = 90 \\implies 5x = 95 \\implies x = 19^\\circ$.`
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
    author: 'AIES Humanities & Evidence-Based Reading Faculty',
    publisherOrOwner: 'AIES Academic Press (Original Curriculum Series)',
    coverColor: 'from-emerald-700 via-teal-800 to-cyan-950',
    pages: [
      {
        pageNumber: 1,
        content: `CHAPTER 1: INFORMATION & IDEAS — CENTRAL IDEAS AND SUPPORTING DETAILS

1. Concept Introduction
Central Ideas questions assess your ability to synthesize the primary argument or overarching theme of a short passage (25–150 words). Supporting Details questions require identifying specific factual claims explicitly established in the text.

2. The Core 4-Step Method:
Step 1: Read for the Macro-Claim — Summarize the passage in one sentence before looking at the choices. Ask: "What is the author ultimately trying to prove or describe?"
Step 2: Differentiate Thesis from Evidence — Do not mistake an illustrative piece of evidence (e.g. an experiment participant count or a single character action) for the central idea.
Step 3: Check Answer Scope — The correct answer must match the entire scope of the passage:
  * Too Narrow: Accurate to one sentence, but misses the broader conclusion.
  * Too Extreme: Introduces unsupported absolutes ("always", "never", "only", "proved definitively").
  * Inverted Relationship: Swaps cause and effect or reverses character dynamics.
Step 4: Verify Direct Textual Grounding — Every claim in the correct option must be supported by words in the text.`,
        ocrText: 'Central ideas, main idea, supporting details, too narrow trap, too extreme trap, scope check, textual grounding.',
        sections: [
          {
            heading: '1.1 Worked Example (Easy Tier — Literature)',
            text: `Passage: In an 1890 novella, Arthur reflects on his quiet country cottage. While his urban acquaintances frequently pity his isolation, Arthur finds deep tranquility in tending his vegetable garden and observing the migrating swallows. The daily routine, far from feeling monotonous, provides him with a profound sense of purpose.
Question: Which choice best states the main idea of the text?
(A) Arthur regrets leaving his busy life in the city.
(B) Arthur's acquaintances visit him regularly to help with his garden.
(C) Arthur derives genuine fulfillment and peace from his quiet rural lifestyle. [CORRECT]
(D) Arthur plans to return to the city once his swallow observations conclude.
Analysis: Choice C captures the full passage theme (tranquility, purpose, rural life). Choice A is directly contradicted; Choice B and D introduce unsupported assumptions.`
          },
          {
            heading: '1.2 Worked Example (Medium Tier — Science & Technology)',
            text: `Passage: Marine biologist Dr. Elena Rostova investigated bioluminescent signaling in deep-sea cephalopods. While previous researchers hypothesized that photophore flashing served primarily to attract prey, Rostova's synchronized camera footage revealed that squid flash patterns became active predominantly when predators were detected within 5 meters. This strongly indicates that the glowing flashes function as an antipredator startle mechanism.
Question: Which choice best describes the main discovery of Rostova's research?
(A) Deep-sea squid utilize bioluminescence primarily to disorient and deter predators. [CORRECT]
(B) Cephalopod photophores are more complex than those found in shallow-water organisms.
(C) Deep-sea predators are incapable of detecting light within a 5-meter radius.
(D) Squid flash patterns fail to attract prey in deep oceanic trenches.
Analysis: Choice A directly summarizes the main discovery (flashing functions as an antipredator mechanism). Choice B and C introduce false comparisons.`
          },
          {
            heading: '1.3 Worked Example (Hard Tier — Experimental Controls & Alternative Hypotheses)',
            text: `Passage: To investigate how microclimatic warming impacts fungal-mediated soil carbon respiration in subalpine spruce ecosystems, Dr. Julian Vance transplanted intact soil cores from 2,800m elevation to 2,200m, where ambient temperatures were 2.5°C warmer. Vance documented a 35% surge in carbon flux among the transplanted cores; critically, metagenomic sequencing verified that microbial community taxonomy and species density remained unaltered throughout the experiment, enabling Vance to attribute the increased respiration strictly to thermal metabolic acceleration.
Question: It can most reasonably be inferred that the finding regarding microbial community composition was vital because it:
(A) proved that subalpine spruce trees accelerate carbon uptake at lower elevations.
(B) ruled out a change in species composition as an alternative explanation for the accelerated carbon flux. [CORRECT]
(C) demonstrated that cold-adapted fungi migrate rapidly when temperatures increase.
(D) confirmed that soil respiration rates vary depending on which species dominate the fungal community.
Analysis: Choice B is correct because holding the species composition constant provides an essential experimental control: if species had changed, the increased flux might have been caused by new invasive species rather than temperature acceleration of existing microbes.`
          },
          {
            heading: '1.4 Hard-Tier Distractor Taxonomy & Elimination Protocol',
            text: `At the Hard difficulty tier, wrong answers are engineered to sound sophisticated while failing on subtle logical boundaries:
1. The "Alternative Causality" Trap: A choice assumes the finding was caused by factor X when the text explicitly demonstrates factor Y (or shows that factor X was an experimental control).
2. The "Unwarranted Absolutism" Trap: A choice claims a discovery "disproved" or "conclusively settled" a historical debate when the author merely presented "preliminary evidence" or a "nuanced qualification".
3. The "Secondary Detail Echo" Trap: A choice takes an accurate clause from line 2 and elevates it to the overarching theme of the text, ignoring the main conclusion in the final sentences.
4. The "Subtext Inversion" Trap: In literary texts, taking a character's sarcastic, theatrical, or polite pretense at face value rather than interpreting their true underlying motive.`
          }
        ]
      },
      {
        pageNumber: 2,
        content: `CHAPTER 1: INFORMATION & IDEAS — COMMAND OF EVIDENCE & INFERENCES

1. Concept Introduction
Inferences and Logical Completion questions test your capacity to determine the single unavoidable conclusion from a set of premises. On the Digital SAT, these questions often end with an unfilled blank ("This finding suggests that ______" or "It can therefore be inferred that ______").

2. The 3-Step "Premise-Bridge" Inferences Method:
Step 1: Identify the Established Premises — Pinpoint the core facts: Fact A (the baseline condition) and Fact B (the observed outcome or trade-off).
Step 2: Trace the Direction of the Bridge — Where does Fact A + Fact B logically point?
  * If an impediment/cost is eliminated $\\implies$ activity increases or becomes more accessible.
  * If a physical trait confers stability in storms at the cost of height $\\implies$ survival rate offsets lower individual yield.
  * If animals safeguard a specific crafted tool over basic sticks $\\implies$ the crafted tool holds higher perceived utility/value.
Step 3: Reject Speculative & Extreme Leaps — The correct inference is CONSERVATIVE. It never assumes unstated future events, universal replacements, or moral motivations unless explicitly given.`,
        ocrText: 'Inferences, logical completions, command of evidence, premise bridge, trade-off reasoning, conservative deduction.',
        sections: [
          {
            heading: '2.1 Worked Example: Inferences & Economic Trade-Offs (Easy Tier)',
            text: `Passage: In an experiment, researchers allowed one group of shoppers to physically touch and examine ceramic mugs before purchasing, while a second group was permitted only to view images on a screen. When participants recorded the maximum price they would pay, the tactile group offered an average of 40% more than the visual-only group.
Question: Which choice most logically completes the text?
(A) People who shop online purchase fewer household items per year than in-person shoppers do.
(B) Physical tactile interaction with a product can elevate its perceived monetary value. [CORRECT]
(C) Online retailers should reduce prices across all product categories.
(D) Consumers will refuse to buy products online if they cannot touch them first.
Analysis: Choice B is the precise, conservative inference directly supported by the 40% price difference. Choice A, C, and D make unsupported, extreme speculative claims.`
          },
          {
            heading: '2.2 Worked Example: Biological Trade-Offs & Agricultural Inferences (Medium Tier)',
            text: `Passage: Agricultural botanists developing dwarf crop varieties observed that while taller sorghum plants develop more grain heads per stalk, their height makes them highly susceptible to lodging (stalk breakage and uprooting) during autumnal squalls. Because unharvested broken stalks represent total crop loss, researchers argue that cultivating shorter sorghum varieties will actually _____
Question: Which choice most logically completes the text?
(A) produce taller individual plants during severe wind storms.
(B) enhance total harvested yield by increasing the proportion of plants that withstand storm winds until harvest. [CORRECT]
(C) require significantly more acreage than traditional cereal crops.
(D) develop more grain heads per individual stalk than any existing variety.
Analysis: Choice B correctly synthesizes the trade-off: despite fewer grains per stalk, greater wind resistance prevents catastrophic loss, maximizing net harvested yield.`
          },
          {
            heading: '2.3 Worked Example: Quantitative Evidence & Hypothesis Testing (Hard Tier)',
            text: `Hypothesis: Bird species with higher wing-aspect ratios migrate longer annual distances due to aerodynamic lift efficiency.
Data Table:
- Arctic Tern: Aspect Ratio 11.2 | Migration 44,000 km
- Wandering Albatross: Aspect Ratio 12.5 | Migration 30,000 km
- Ruffed Grouse: Aspect Ratio 5.1 | Migration 0 km
- House Sparrow: Aspect Ratio 5.8 | Migration 50 km

Valid Supporting Finding: Species with aspect ratios above 11.0 exhibited migration distances exceeding 30,000 km, whereas species with aspect ratios below 6.0 migrated under 100 km, directly corroborating the hypothesis that high aspect ratios correlate with long-distance flight efficiency.`
          },
          {
            heading: '2.4 The Inferences Trap Elimination Protocol',
            text: `1. The "Too Far" Extrapolation Trap: Inferring that because a trait is advantageous in one setting, it will universally take over the global population.
2. The "Prescriptive" Trap: Assuming that because an effect occurs, policymakers or companies "should" or "must" enact specific regulations.
3. The "Opposite Implication" Trap: Flipping the sign of the causal relationship (e.g. claiming a deterrent actually encourages an activity).`
          }
        ]
      },
      {
        pageNumber: 3,
        content: `CHAPTER 2: CRAFT & STRUCTURE — WORDS IN CONTEXT & CROSS-TEXT CONNECTIONS

1. Concept Introduction
Craft & Structure questions assess high-utility academic vocabulary used in specific disciplinary contexts and cross-text synthesis between two paired perspectives.

2. The 3-Step "Mask and Predict" Vocabulary Method:
Step 1: Cover the Target Word with a Blank — Read the sentence without looking at the 4 options.
Step 2: Harvest Clues from Context — Identify transition words, synonyms, antonyms, or explanatory clauses that define the blank's meaning.
Step 3: Plug in Your Own Word — Generate a simple synonym (e.g. "limit", "clear", "intense") and match it with the choices.

3. Cross-Text Connections Framework (Text 1 vs Text 2):
- Step 1: Label Author 1's Stance (+ / - / Neutral).
- Step 2: Label Author 2's Stance (+ / - / Neutral).
- Step 3: Determine the Dynamic:
  * Rebuttal: Author 2 argues Author 1's methodology or conclusion is flawed.
  * Nuance/Qualification: Author 2 agrees with the premise but limits its applicability.
  * Extension: Author 2 provides additional evidence supporting Author 1.`,
        ocrText: 'Words in context, vocabulary, mask and predict, cross text connections, paired texts, author stance, text structure.',
        sections: [
          {
            heading: '3.1 Words in Context Worked Example (Medium Tier)',
            text: `Passage: Although the initial experimental results appeared promising, the lead researcher took care to qualify her conclusions in the published report, noting that the small sample size precluded definitive generalization.
As used in the text, "qualify" most nearly means:
(A) certify as competent
(B) limit or moderate [CORRECT]
(C) enthusiastically endorse
(D) officially register
Explanation: The context "noting that the small sample size precluded definitive generalization" indicates the researcher was restricting or moderating her claims. Thus, "limit or moderate" is the precise contextual meaning.`
          },
          {
            heading: '3.2 Cross-Text Connections Worked Example (Hard Tier)',
            text: `Text 1 argues that urban vertical farming can fully replace traditional agriculture due to high yield per square meter.
Text 2 points out that the high electricity requirements for LED lighting make vertical farming economically unviable for calorie-dense staple crops like wheat and rice.
Question: How would the author of Text 2 respond to Text 1?
Correct Response: By pointing out that energy costs make vertical farming unsuited for essential staple crops, qualifying the extent to which it can replace traditional farming.`
          }
        ]
      },
      {
        pageNumber: 4,
        content: `CHAPTER 3: EXPRESSION OF IDEAS — TRANSITIONS & RHETORICAL SYNTHESIS

1. Concept Introduction
Expression of Ideas evaluates your ability to select precise logical transitions between ideas and synthesize bulleted research notes to achieve a specified rhetorical goal.

2. Logical Transition Categories:
- Addition / Elaboration: furthermore, moreover, additionally, in fact, indeed
- Contrast / Pivot: however, nevertheless, on the other hand, conversely, despite this
- Cause and Effect: consequently, therefore, thus, as a result, accordingly
- Exemplification / Clarification: for instance, specifically, for example, in other words

3. Rhetorical Synthesis 3-Step Strategy:
Step 1: Read the Question Goal FIRST — Look at the prompt below the bullets: "The student wants to emphasize a contrast between X and Y" or "The student wants to introduce the discovery to an audience unfamiliar with the scientist."
Step 2: Filter for the Specific Goal — 3 of the 4 choices will state true facts from the bullets, but only ONE directly achieves the prompt's stated goal.
Step 3: Eliminate Extra Fluff — Select the concise sentence that directly fulfills the prompt requirement.`,
        ocrText: 'Transitions, logical connectors, rhetorical synthesis, bulleted notes, prompt goal, addition, contrast, cause and effect.',
        sections: [
          {
            heading: '4.1 Transition Analysis Worked Example',
            text: `Sentence 1: Early geologists believed mountain ranges formed solely through the contraction of Earth's cooling crust.
Sentence 2: [Transition], the discovery of mantle convection and tectonic plate subduction demonstrated that mountain uplift is driven by dynamic internal heat currents.
Analysis: Sentence 2 directly overturns the obsolete belief in Sentence 1. The required relationship is contrast. Correct transition: "However" or "Nevertheless".`
          },
          {
            heading: '4.2 Rhetorical Synthesis Strategy Example',
            text: `Goal: The student wants to emphasize the difference in diet between the two bird species.
Bullet Notes:
- Species A lives in cloud forests and feeds exclusively on orchid nectar.
- Species B inhabits lowland savannahs and feeds on insects and seeds.
- Both species belong to the family Trochilidae.
Correct Choice: "While Species A feeds exclusively on floral nectar in cloud forests, Species B subsists on insects and seeds in savannahs." (Directly fulfills the contrast in diet goal).`
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TEXTBOOK 4: Standard English Conventions & Grammar Rules
  // =========================================================================
  {
    id: 'sat-grammar-conventions',
    title: 'Standard English Conventions & Grammar Rules',
    author: 'Panda SAT Writing & Grammar Editorial Board',
    publisherOrOwner: 'Panda SAT Writing Series',
    coverColor: 'from-amber-600 via-orange-600 to-rose-700',
    pages: [
      {
        pageNumber: 1,
        content: `CHAPTER 1: SENTENCE BOUNDARIES — INDEPENDENT CLAUSES, RUN-ONS & COMMA SPLICES

1. Concept Introduction
Every complete English sentence requires at least one independent clause containing a subject and a conjugated verb that expresses a complete thought. Joining two independent clauses incorrectly produces a comma splice (joined only by a comma) or a run-on (joined with no punctuation).

2. The 4 Valid Ways to Connect Two Independent Clauses:
Method 1: Period and Capital Letter ($[IC]. [IC].$)
Method 2: Semicolon ($[IC]; [IC].$)
Method 3: Comma + Coordinating Conjunction (FANBOYS: For, And, Nor, But, Or, Yet, So) ($[IC], \\text{ and } [IC].$)
Method 4: Colon or Single Dash (When the second clause explains, defines, or illustrates the first) ($[IC]: [IC].$)

3. Essential Punctuation Rules:
- Semicolons must be flanked by complete independent clauses on both sides.
- A comma alone CANNOT separate two independent clauses without a FANBOYS conjunction.
- Conjunctive Adverbs (however, therefore, furthermore) are NOT coordinating conjunctions. When placed between two independent clauses, they must be preceded by a semicolon and followed by a comma ($[IC]; \\text{however}, [IC].$).`,
        ocrText: 'Sentence boundaries, independent clauses, comma splices, run on sentences, semicolons, colons, FANBOYS conjunctions.',
        sections: [
          {
            heading: '1.1 Comma Splice Identification & Fix (Easy Tier)',
            text: `Incorrect: The telescope was calibrated by the engineering team, it captured clear images of Jupiter's moons. [Comma Splice!]
Correct Fixes:
1. Semicolon: The telescope was calibrated by the engineering team; it captured clear images of Jupiter's moons.
2. Comma + FANBOYS: The telescope was calibrated by the engineering team, and it captured clear images of Jupiter's moons.
3. Subordination: After the telescope was calibrated by the engineering team, it captured clear images of Jupiter's moons.`
          },
          {
            heading: '1.2 Colons and Single Dashes (Medium Tier)',
            text: `Rule: A colon (:) or single dash (—) MUST follow a complete independent clause and introduces an elaboration, list, or dramatic reveal.
Correct: Dr. Hernandez discovered the unexpected cause of the alloy's failure: microscopic air pockets trapped during cooling.
Incorrect: The causes of the failure were: microscopic air pockets and poor cooling. (Faulty: "The causes of the failure were" is not an independent clause).`
          }
        ]
      },
      {
        pageNumber: 2,
        content: `CHAPTER 1: NON-ESSENTIAL ELEMENTS & PAIRED PUNCTUATION

1. Concept Introduction
Non-essential (parenthetical) clauses provide supplementary information that can be removed from a sentence without altering its core grammatical structure or meaning.

2. The Symmetry Rule for Paired Punctuation:
Non-essential modifiers must be enclosed by MATCHING punctuation marks:
- Two commas: $\\text{Subject}, \\text{non-essential clause}, \\text{verb...}$
- Two dashes: $\\text{Subject} - \\text{non-essential clause} - \\text{verb...}$
- Two parentheses: $\\text{Subject } (\\text{non-essential clause}) \\text{ verb...}$
Never mix and match (e.g. a comma on the left and a dash on the right is always incorrect).

3. Essential vs Non-Essential Modifiers:
- Essential (Restrictive): Specifies which exact person or object is meant. Do NOT use commas. (e.g. "The author George Orwell wrote 1984.")
- Non-Essential (Non-Restrictive): Supplementary detail about a previously identified noun. Use commas. (e.g. "George Orwell, a British essayist and novelist, wrote 1984.")`,
        ocrText: 'Non essential clauses, paired commas, paired dashes, appositives, restrictive modifiers, non restrictive modifiers.',
        sections: [
          {
            heading: '2.1 The "Finger Test" for Non-Essential Clauses',
            text: `Method: Place your finger over the non-essential clause between the paired commas or dashes. Read the remaining sentence aloud. If the remaining words form a grammatically complete, logical sentence, the punctuation is correct.
Example: The ancient library of Alexandria, which housed thousands of papyrus scrolls, was destroyed in antiquity.
Test: "The ancient library of Alexandria was destroyed in antiquity." (Complete and grammatical!).`
          },
          {
            heading: '2.2 Worked Example: Names and Job Titles (Medium Tier)',
            text: `Rule: When a descriptive title precedes a name without a comma or article, the name is essential.
Correct: Marine ecologist Rachel Carson published Silent Spring in 1962.
Incorrect: Marine ecologist, Rachel Carson, published Silent Spring in 1962.
Correct: An acclaimed marine ecologist, Rachel Carson published Silent Spring in 1962.`
          }
        ]
      },
      {
        pageNumber: 3,
        content: `CHAPTER 2: FORM, STRUCTURE & SENSE — SUBJECT-VERB AGREEMENT & MODIFIERS

1. Concept Introduction
Conjugated verbs must agree with their grammatical head subject in number (singular vs plural). Modifier phrases must be placed immediately adjacent to the noun they logically describe.

2. Subject-Verb Agreement Rules:
- Prepositional Phrase Interrupters: Ignore words between the subject and verb:
  * "The box of antique gold coins [is / are] heavy." $\\implies$ Subject is singular "box" $\\implies$ "is heavy."
- Compound Subjects joined by "and" are plural ("The biologist and the chemist are collaborating").
- Indefinite Pronouns (each, everyone, neither, either, anybody) are grammatically singular ("Each of the samples is sterile").

3. Dangling & Misplaced Modifiers:
- Dangling Modifier: An introductory participial phrase (e.g. "Walking through the dense forest, ...") MUST be followed immediately by the noun that logically performs that action.
  * Incorrect: "Walking through the forest, the towering trees impressed Marcus." (Trees do not walk!).
  * Correct: "Walking through the forest, Marcus was impressed by the towering trees."`,
        ocrText: 'Subject verb agreement, prepositional phrases, dangling modifiers, misplaced modifiers, singular indefinite pronouns.',
        sections: [
          {
            heading: '3.1 Inverted Sentence Structure (Hard Tier)',
            text: `Rule: In sentences beginning with prepositional phrases of location, the subject often appears AFTER the verb.
Example: "Beneath the roots of the ancient oak tree [lies / lie] the buried stone foundation."
Analysis: The subject is "foundation" (singular), not "roots" (prepositional object). Correct verb: "lies".`
          },
          {
            heading: '3.2 Parallel Structure and Logical Comparisons',
            text: `Parallel Structure: Items in a series or joined by conjunctions must share identical grammatical forms.
- Incorrect: She enjoys hiking, swimming, and to ride bicycles.
- Correct: She enjoys hiking, swimming, and riding bicycles.
Logical Comparisons: Compare equivalent entities using "that of" or "those of".
- Incorrect: The battery life of Model A is longer than Model B.
- Correct: The battery life of Model A is longer than that of Model B.`
          }
        ]
      }
    ]
  }
];

