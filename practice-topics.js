/* Offline exercise packs. Each question stores its correct answer and teaching note. */
(() => {
  const q = (prompt, choices, answerIndex, explanation) => ({
    prompt, choices, answer: choices[answerIndex], explanation
  });
  window.practiceTopics = [
    {
      id: 'linear-algebra', title: 'Linear Algebra',
      questions: [
        q('What is the dot product of [1, 2, 3] and [4, −1, 2]?', ['8', '10', '4', '−2'], 0, 'Multiply matching entries and add: 1·4 + 2·(−1) + 3·2 = 8.'),
        q('What is the L₁ norm of the vector [−2, 3, −1]?', ['6', '√14', '4', '2'], 0, 'The L₁ norm adds absolute values: 2 + 3 + 1 = 6.'),
        q('A matrix has 2 rows and 3 columns. What shape does its transpose have?', ['3 rows and 2 columns', '2 rows and 3 columns', '3 rows and 3 columns', '2 rows and 2 columns'], 0, 'Transposing swaps rows and columns.'),
        q('What is the rank of [[1, 2], [2, 4]]?', ['1', '2', '0', '4'], 0, 'The second row is twice the first, so there is only one independent row.'),
        q('What are the eigenvalues of the diagonal matrix [[3, 0], [0, 5]]?', ['3 and 5', '0 and 8', '−3 and −5', '1 and 1'], 0, 'The eigenvalues of a diagonal matrix are its diagonal entries.'),
        q('In PCA, which direction is chosen as the first principal component?', ['The direction with the greatest data variance', 'The direction with the smallest variance', 'A random direction', 'The direction with the most data points'], 0, 'PCA finds a direction that captures as much variance as possible.'),
        q('What does an orthogonal pair of nonzero vectors have as its dot product?', ['0', '1', '−1', 'Their lengths multiplied'], 0, 'Orthogonal vectors meet at a right angle, so their dot product is zero.'),
        q('What is the determinant of [[2, 0], [0, 4]]?', ['8', '6', '2', '0'], 0, 'For a diagonal 2×2 matrix, multiply the diagonal entries: 2·4 = 8.'),
        q('What does a matrix inverse A⁻¹ satisfy?', ['AA⁻¹ = I', 'A + A⁻¹ = I', 'A − A⁻¹ = 0', 'A² = I'], 0, 'Multiplying a square invertible matrix by its inverse gives the identity matrix.'),
        q('In an SVD, what do the singular values describe?', ['How strongly the matrix stretches special directions', 'The matrix row count only', 'The matrix trace only', 'The number of zeros in the matrix'], 0, 'Singular values measure the stretch along the paired singular-vector directions.')
      ]
    },
    {
      id: 'matrix-systems-mm151', title: 'Matrix Algebra & Linear Systems (MM151)',
      questions: [
        q('Matrix A is 2×3 and matrix B is 3×4. What is the shape of AB?', ['2×4', '3×3', '4×2', '2×3'], 0, 'The inner dimensions match (3), and the product has the outer dimensions: 2×4.'),
        q('What does the transpose Aᵀ do to a matrix?', ['Swaps its rows and columns', 'Changes every entry to its negative', 'Turns every entry into 1', 'Adds an identity matrix'], 0, 'Transposition changes rows into columns in the same order.'),
        q('Which condition makes a matrix symmetric?', ['A = Aᵀ', 'A = A⁻¹', 'det(A) = 1', 'A has only zero entries'], 0, 'A matrix is symmetric when it equals its transpose.'),
        q('Let A = [[2, 1, −1], [−1, 2, −2]] and B = [[1, −1], [0, −2], [4, 2]]. What is the (1,1) entry of AB?', ['−2', '2', '−6', '4'], 0, 'Take row 1 of A dotted with column 1 of B: 2·1 + 1·0 + (−1)·4 = −2.'),
        q('What is the rank of [[1, 2], [2, 4]]?', ['1', '2', '0', '4'], 0, 'The second row is twice the first, so there is one independent row.'),
        q('Which operation keeps the solution set of a linear system unchanged?', ['Add a multiple of one equation to another', 'Multiply an equation by zero', 'Change only the right side', 'Delete any equation'], 0, 'Adding a multiple of one row to another is an elementary row operation.'),
        q('A system has coefficient-matrix rank 1 and augmented-matrix rank 2. What does the Frobenius theorem tell us?', ['The system has no solution', 'The system has exactly one solution', 'The system has infinitely many solutions', 'The system has three solutions'], 0, 'A system is consistent exactly when these two ranks are equal.'),
        q('A consistent system has 3 unknowns and coefficient rank 3. How many solutions does it have?', ['Exactly one', 'Infinitely many', 'None', 'Exactly three'], 0, 'A consistent system has a unique solution when its rank equals the number of unknowns.'),
        q('What is the determinant of [[−1, 2], [3, 2]]?', ['−8', '−2', '8', '4'], 0, 'For a 2×2 matrix, ad−bc = (−1)(2) − (2)(3) = −8.'),
        q('When can Cramer’s rule be used to find a unique solution to a square system Ax=b?', ['When det(A) ≠ 0', 'When det(A) = 0', 'When A has a zero row', 'When b is the zero vector only'], 0, 'A nonzero determinant means the coefficient matrix is invertible.'),
        q('What are the eigenvalues of [[0, 2], [3, 1]]?', ['3 and −2', '2 and −3', '1 and 0', '3 and 2'], 0, 'The characteristic equation is λ²−λ−6=0=(λ−3)(λ+2).'),
        q('For an invertible matrix A, what is A⁻¹A?', ['The identity matrix I', 'The zero matrix', 'A', 'A²'], 0, 'A matrix multiplied by its inverse gives the identity matrix.')
      ]
    },
    {
      id: 'calculus', title: 'Calculus & Vector Calculus',
      questions: [
        q('If f(x) = x³ − 4x, what is f′(x)?', ['3x² − 4', 'x² − 4', '3x − 4', 'x³ − 4'], 0, 'The power rule gives d(x³)/dx = 3x², and d(−4x)/dx = −4.'),
        q('For f(x,y) = x² + 2y², what is the gradient at (1, 2)?', ['(2, 8)', '(1, 4)', '(2, 4)', '(4, 8)'], 0, 'The gradient is (2x, 4y); at (1,2), that is (2,8).'),
        q('What is the Hessian of f(x,y) = x² + 3y²?', ['[[2, 0], [0, 6]]', '[[2, 3], [3, 6]]', '[[x, 0], [0, y]]', '[[0, 0], [0, 0]]'], 0, 'The second partial derivatives are fₓₓ = 2, fᵧᵧ = 6, and the mixed partials are 0.'),
        q('What is the definite integral of 3x² from 0 to 2?', ['8', '12', '4', '6'], 0, 'An antiderivative is x³. Evaluate 2³ − 0³ = 8.'),
        q('To minimize x² + y² subject to x + y = 10, which point is the minimum?', ['(5, 5)', '(10, 0)', '(0, 10)', '(6, 4)'], 0, 'The sum of squares is smallest when the two values share the total equally.'),
        q('What is the derivative of sin(x)?', ['cos(x)', '−cos(x)', 'sin(x)', '−sin(x)'], 0, 'The derivative of sine is cosine.'),
        q('What does the gradient of a differentiable function point toward?', ['The direction of steepest increase', 'The direction of zero change everywhere', 'The smallest input value', 'The function’s average value'], 0, 'The gradient points in the direction of the greatest instantaneous increase.'),
        q('What is the derivative of e^(2x)?', ['2e^(2x)', 'e^(2x)', '2e^x', 'e^(x/2)'], 0, 'Apply the chain rule: the derivative of e^u is e^u·u′, with u = 2x.'),
        q('At a smooth local minimum, what is usually true about the gradient?', ['It is zero', 'It points upward in every direction', 'It equals the Hessian', 'It is always one'], 0, 'At an unconstrained differentiable local minimum, the first derivatives are zero.'),
        q('What does the Jacobian of a vector-valued function contain?', ['Its first partial derivatives', 'Only its second derivatives', 'Only its integrals', 'Its eigenvalues only'], 0, 'The Jacobian arranges all first partial derivatives into a matrix.')
      ]
    },
    {
      id: 'functions-domains-graphs', title: 'Functions, Domains & Graphs',
      questions: [
        q('What is the domain of f(x)=x²?', ['All real numbers', 'x ≥ 0 only', 'x ≠ 0 only', 'x > 0 only'], 0, 'A polynomial is defined for every real input.'),
        q('What is the domain of f(x)=−x?', ['All real numbers', 'x ≤ 0 only', 'x ≠ 0 only', 'x > 0 only'], 0, 'A linear function has no input restrictions.'),
        q('What is the domain of f(x)=1/x²?', ['All real x except 0', 'All real numbers', 'x ≥ 0', 'x > 0 only'], 0, 'A denominator cannot equal zero, so x must not be 0.'),
        q('What is the domain of f(x)=√x over the real numbers?', ['[0, ∞)', '(−∞, 0]', 'All real numbers', '(0, ∞)'], 0, 'The value under a real square root must be at least zero.'),
        q('What is the domain of f(x)=ln(x)?', ['(0, ∞)', '[0, ∞)', 'All real numbers', 'All real x except 1'], 0, 'A real logarithm requires a positive input.'),
        q('What is the domain of x² + ln(x)?', ['(0, ∞)', 'All real numbers', '[0, ∞)', 'All real x except 0'], 0, 'The polynomial allows all reals, but ln(x) requires x>0; take the intersection.'),
        q('What is the domain of x²/ln(x)?', ['(0,1) ∪ (1,∞)', '(0,∞)', 'All real numbers except 1', '[0,∞)'], 0, 'Require x>0 for ln(x), and ln(x)≠0; ln(x)=0 at x=1.'),
        q('If f(x)=x² and g(x)=eˣ, what is the domain of f(g(x))?', ['All real numbers', 'x > 0 only', 'x ≠ 0 only', 'x ≥ 0 only'], 0, 'The exponential and squaring functions both accept every real input.'),
        q('What is the domain of ln(1/x)?', ['(0, ∞)', 'All real x except 0', '(−∞, 0)', '[0, ∞)'], 0, 'The logarithm needs 1/x>0, which happens exactly when x>0.'),
        q('What is the domain of 1/ln(x)?', ['(0,1) ∪ (1,∞)', '(0,∞)', 'All real numbers except 1', '[0,∞)'], 0, 'Require x>0 and ln(x)≠0, so exclude x=1.'),
        q('What is the domain of ln(1/x²)?', ['All real x except 0', '(0,∞)', 'All real numbers', 'x ≥ 0'], 0, 'For x≠0, 1/x² is positive, which is a valid logarithm input.'),
        q('What is the range of sin(x) for real x?', ['[−1, 1]', '[0, 1]', 'All real numbers', '(−∞, 0]'], 0, 'Sine oscillates between −1 and 1, including both endpoints.'),
        q('What is the value of cos(0)?', ['1', '0', '−1', 'Undefined'], 0, 'The cosine graph starts at height 1 when x=0.'),
        q('Which way does the graph of y=−x² open?', ['Downward', 'Upward', 'It is a straight line', 'It is a circle'], 0, 'The negative leading coefficient reflects the usual upward parabola across the x-axis.'),
        q('Which input is excluded from the domain of y=1/x²?', ['x=0', 'x=1', 'x=−1', 'No input is excluded'], 0, 'At x=0 the denominator is zero, so the function is undefined.'),
        q('What is the domain of (x²−1)/(x−1)?', ['All real x except 1', 'All real numbers', 'x > 1', 'x ≥ 1'], 0, 'Even though the expression simplifies for x≠1, the original denominator excludes x=1.'),
        q('What is the period of sin(x) in radians?', ['2π', 'π', '1', 'π/2'], 0, 'The sine graph repeats every 2π radians.'),
        q('For a sum (f+g)(x), which inputs are allowed?', ['Inputs in both domains', 'Inputs in either domain only', 'Inputs where f(x)=g(x)', 'Only positive inputs'], 0, 'Both f(x) and g(x) must be defined, so the new domain is the intersection.')
      ]
    },
    {
      id: 'probability', title: 'Probability Theory',
      questions: [
        q('A fair coin is flipped twice. What is the probability of two heads?', ['1/4', '1/2', '3/4', '1'], 0, 'The four equally likely outcomes are HH, HT, TH, and TT; one is HH.'),
        q('A bag has 3 red and 2 blue marbles. What is P(red)?', ['3/5', '2/5', '1/3', '1/2'], 0, 'There are 3 red marbles out of 5 total.'),
        q('If events A and B are independent, what is P(A and B)?', ['P(A) × P(B)', 'P(A) + P(B)', 'P(A) − P(B)', 'P(A) ÷ P(B)'], 0, 'Independence means the probability of both events is the product of their probabilities.'),
        q('A test is 90% accurate for a condition affecting 1% of people. Why can a positive result still be uncertain?', ['The condition is rare, so false positives can be numerous', 'Accuracy means every positive is correct', 'The base rate never matters', 'The test result changes the prevalence'], 0, 'Bayes’ theorem combines test accuracy with how common the condition is.'),
        q('A fair six-sided die is rolled. What is the expected value?', ['3.5', '3', '6', '2.5'], 0, 'The mean of 1, 2, 3, 4, 5, and 6 is 21/6 = 3.5.'),
        q('For a Binomial(n=4, p=0.5) variable, what is the probability of exactly 4 successes?', ['1/16', '1/4', '1/2', '4/5'], 0, 'All four independent trials must succeed: (0.5)⁴ = 1/16.'),
        q('If X is always 7, what is Var(X)?', ['0', '7', '49', '1'], 0, 'A constant has no spread around its mean, so its variance is zero.'),
        q('What does the Central Limit Theorem say about many sample means?', ['They tend toward a normal distribution under common conditions', 'They always equal the population mean', 'They become uniform', 'They stop varying'], 0, 'With suitable conditions, the sample-mean distribution approaches normality as sample size grows.'),
        q('If P(A)=0.4, what is P(not A)?', ['0.6', '0.4', '1.4', '0'], 0, 'An event and its complement add to 1: 1 − 0.4 = 0.6.'),
        q('If X and Y are independent, what is Cov(X,Y)?', ['0', '1', 'Var(X)+Var(Y)', 'Always negative'], 0, 'Independent variables with finite moments have covariance zero.')
      ]
    },
    {
      id: 'statistics', title: 'Mathematical Statistics',
      questions: [
        q('What is the mean of 2, 4, and 6?', ['4', '3', '6', '12'], 0, 'Add the values and divide by 3: (2+4+6)/3 = 4.'),
        q('What is the median of 1, 3, 8, 10, 20?', ['8', '3', '10', '42'], 0, 'The middle value in the ordered list is 8.'),
        q('A p-value of 0.03 is best described as what?', ['How surprising the data would be under the null hypothesis', 'The probability the null hypothesis is true', 'The probability the result is important', 'The size of the treatment effect'], 0, 'A p-value is calculated assuming the null hypothesis; it is not the probability that the null is true.'),
        q('A Type I error means what?', ['Rejecting a true null hypothesis', 'Failing to reject a false null hypothesis', 'Choosing a too-large sample', 'Using a biased estimator'], 0, 'A Type I error is a false positive: rejecting a null hypothesis that is actually true.'),
        q('What does a 95% confidence procedure mean in repeated sampling?', ['About 95% of intervals made this way contain the true parameter', 'There is a 95% chance this fixed interval changes', '95% of data points are inside the interval', 'The null hypothesis is 95% true'], 0, 'The confidence level describes the long-run success rate of the interval procedure.'),
        q('What is the sample variance of 2, 4, 6?', ['4', '8/3', '2', '16'], 0, 'The mean is 4; squared deviations sum to 8, then divide by n−1=2: 4.'),
        q('What does an unbiased estimator have?', ['Expected value equal to the parameter', 'Zero variance always', 'The same value in every sample', 'A guaranteed small error'], 0, 'Unbiasedness means its average over repeated samples equals the parameter.'),
        q('What is the main idea of maximum likelihood estimation?', ['Choose parameter values that make observed data most likely', 'Choose the largest data point', 'Minimize the sample size', 'Always use the prior mean'], 0, 'MLE selects parameter values maximizing the likelihood of the observed data.'),
        q('Why can testing many hypotheses cause more false positives?', ['The chance of at least one false positive increases', 'P-values become probabilities of truth', 'The data become independent', 'The significance level becomes zero'], 0, 'With many tests, false positives accumulate unless methods such as Bonferroni or FDR are used.'),
        q('Correlation between two variables proves what?', ['Association, but not by itself causation', 'That one causes the other', 'That both are normally distributed', 'That there are no confounders'], 0, 'Correlation measures association; confounding or coincidence may explain it.')
      ]
    },
    {
      id: 'optimization', title: 'Optimization & Numerical Methods',
      questions: [
        q('For f(x)=x², take one gradient-descent step from x=3 with learning rate 0.1. What is the new x?', ['2.4', '2.8', '3.6', '0.9'], 0, 'The gradient is 2x=6, so x_new = 3 − 0.1·6 = 2.4.'),
        q('What is a convex function’s key property?', ['The line segment between two points on its graph lies on or above the graph', 'It has exactly one input', 'Its derivative is always zero', 'It must be a straight line'], 0, 'Convexity means the function lies below each chord joining two points on its graph.'),
        q('Why use a smaller learning rate in gradient descent?', ['To take smaller, less likely-to-overshoot steps', 'To increase the number of features', 'To make the loss function convex', 'To remove the gradient'], 0, 'If steps are too large, optimization can overshoot a minimum or diverge.'),
        q('What does a matrix condition number indicate?', ['How sensitive a problem’s answer is to small input changes', 'The number of rows', 'Whether all entries are integers', 'The determinant’s sign only'], 0, 'A large condition number often signals that small input errors can cause large solution errors.'),
        q('What is catastrophic cancellation?', ['Loss of significant digits when nearly equal numbers are subtracted', 'A matrix multiplying itself', 'An algorithm stopping too soon', 'Overflow from a very large positive number'], 0, 'Subtracting close floating-point values can erase leading significant digits.'),
        q('What is the purpose of a regularization penalty such as λ||w||²?', ['Discourage overly large model weights', 'Increase every weight without limit', 'Remove the training data', 'Guarantee zero training error'], 0, 'Regularization adds a cost for large parameters to help control model complexity.'),
        q('What is the gradient of f(x)=x² at x=−2?', ['−4', '4', '−2', '2'], 0, 'Differentiate to get 2x, then substitute −2.'),
        q('In constrained optimization, what does a Lagrange multiplier help describe?', ['How an optimum changes as a constraint is relaxed', 'The number of variables', 'A random starting point', 'The matrix inverse'], 0, 'The multiplier is associated with a constraint and often measures its marginal value.')
      ]
    },
    {
      id: 'information-theory', title: 'Information Theory',
      questions: [
        q('What is the entropy of a fair coin flip, in bits?', ['1 bit', '0 bits', '2 bits', '1/2 bit'], 0, 'Two equally likely outcomes carry log₂(2)=1 bit of uncertainty.'),
        q('What is the KL divergence between identical probability distributions?', ['0', '1', '−1', 'Infinity'], 0, 'There is no divergence when the distributions are identical.'),
        q('What is the cross-entropy loss for a correct class predicted with probability 1?', ['0', '1', '−1', 'Infinity'], 0, 'For the correct class, −log(1) = 0.'),
        q('If two variables are independent, what is their mutual information?', ['0', '1', 'Their covariance', 'Their joint entropy'], 0, 'Independent variables share no information about each other.'),
        q('What happens to the surprise of a very unlikely event?', ['It is high', 'It is zero', 'It is always one bit', 'It is negative'], 0, 'An event with low probability carries more information when it occurs.'),
        q('What is the Jensen–Shannon divergence designed to compare?', ['Two probability distributions', 'Two matrix dimensions', 'Two regression slopes', 'Two sample sizes'], 0, 'It is a symmetric measure comparing probability distributions.')
      ]
    },
    {
      id: 'discrete-graphs', title: 'Discrete Mathematics & Graph Theory',
      questions: [
        q('How many ways can you choose 2 people from a group of 5?', ['10', '20', '25', '5'], 0, 'The number of combinations is 5·4/(2·1) = 10.'),
        q('In an undirected graph, what is the sum of all vertex degrees?', ['Twice the number of edges', 'The number of edges', 'The number of vertices', 'Zero'], 0, 'Each edge touches two endpoints, contributing 2 to the total degree.'),
        q('A simple algorithm compares every pair among n items. What is its time complexity?', ['O(n²)', 'O(n)', 'O(log n)', 'O(1)'], 0, 'There are about n·n pair comparisons, which grows quadratically.'),
        q('Which condition does Dijkstra’s shortest-path method require for edge weights?', ['Nonnegative weights', 'All weights equal 1', 'All weights negative', 'No edges'], 0, 'Dijkstra’s method assumes edge weights are nonnegative.'),
        q('What does a graph adjacency matrix record?', ['Which pairs of vertices have edges', 'Only the shortest path', 'Only vertex names', 'The eigenvectors of every node'], 0, 'Rows and columns represent vertices; entries record connections or edge weights.'),
        q('How many permutations of 3 distinct objects are there?', ['6', '3', '9', '1'], 0, 'There are 3! = 3·2·1 = 6 possible orders.'),
        q('What is a Boolean variable?', ['A value that is true or false', 'Any real number', 'A vector with 3 entries', 'A probability distribution'], 0, 'Boolean logic uses truth values, commonly true and false.'),
        q('In a directed graph, does an edge from A to B always imply an edge from B to A?', ['No', 'Yes, always', 'Only if A=B', 'Only in a tree'], 0, 'Directed edges have a direction; the reverse edge must be added separately.'),
        q('What does PageRank use to estimate?', ['The relative importance of pages in a link network', 'The number of words in a page', 'The shortest spelling of a URL', 'A page’s file size'], 0, 'PageRank assigns importance based partly on links from other important pages.'),
        q('What does the Big-O notation O(n) describe?', ['An upper growth-rate class as input size grows', 'An exact run time in seconds', 'The number of answers', 'The minimum memory of any program'], 0, 'Big-O describes an asymptotic upper bound on growth, ignoring constant factors.')
      ]
    },
    {
      id: 'advanced-foundations', title: 'Real Analysis & Advanced Foundations',
      questions: [
        q('What is the limit of 1/n as n grows without bound?', ['0', '1', 'Infinity', '−1'], 0, 'As n gets larger, 1/n gets closer and closer to zero.'),
        q('In the real numbers, a set is compact if it is what?', ['Closed and bounded', 'Open and unbounded', 'Finite only', 'Neither closed nor bounded'], 0, 'In ℝ, the Heine–Borel theorem says compact sets are exactly closed and bounded sets.'),
        q('What does completeness of the real numbers guarantee for a Cauchy sequence?', ['It converges to a real number', 'It is always constant', 'It diverges', 'It contains every real number'], 0, 'Every Cauchy sequence in a complete space has a limit in that space.'),
        q('A continuous real-valued function on a compact set has what property?', ['It attains a maximum and a minimum', 'It is always linear', 'It has no zeros', 'It is always differentiable'], 0, 'The extreme value theorem guarantees both extrema are attained.'),
        q('What is a metric?', ['A rule for measuring distance that obeys distance axioms', 'A probability distribution', 'A matrix decomposition', 'A derivative'], 0, 'A metric defines nonnegative distances, with symmetry, identity, and the triangle inequality.'),
        q('What does an inner product space provide?', ['A way to measure angles and lengths', 'A sorting algorithm', 'A probability sample', 'A graph path'], 0, 'An inner product generalizes the dot product and induces lengths and angles.'),
        q('What is a manifold, informally?', ['A space that looks locally like ordinary Euclidean space', 'A matrix with no inverse', 'A type of probability test', 'A list of sorted points'], 0, 'A manifold can have curved global shape while looking flat in small neighborhoods.'),
        q('In measure theory, what does measure generalize?', ['Length, area, or volume', 'A derivative only', 'A matrix rank', 'A graph degree'], 0, 'Measure extends familiar notions of size to more general sets.')
      ]
    }
  ];
})();
