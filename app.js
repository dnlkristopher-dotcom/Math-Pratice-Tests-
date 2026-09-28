/* Static quiz engine: local topic packs and Gaussian questions use the same scoring flow. */
const screens = { setup: document.querySelector('#setup-screen'), quiz: document.querySelector('#quiz-screen'), result: document.querySelector('#result-screen') };
const ui = {
  start: document.querySelector('#start-button'), quit: document.querySelector('#quit-button'),
  countButtons: [...document.querySelectorAll('.count-button')], form: document.querySelector('#answer-form'),
  equations: document.querySelector('#equation-list'), fields: document.querySelector('#answer-fields'),
  visual: document.querySelector('#topic-visual'),
  answerLabel: document.querySelector('#answer-label-row'), prompt: document.querySelector('#question-prompt'),
  current: document.querySelector('#current-number'), total: document.querySelector('#total-number'),
  streak: document.querySelector('#streak-value'), score: document.querySelector('#score-value'),
  progress: document.querySelector('#progress-fill'), progressLabel: document.querySelector('#progress-label'),
  difficulty: document.querySelector('#difficulty-tag'), feedback: document.querySelector('#feedback'),
  resultPanel: document.querySelector('#result-panel'), replay: document.querySelector('#play-again-button'),
  home: document.querySelector('#home-button'), topicForm: document.querySelector('#topic-form'),
  topicSelect: document.querySelector('#topic-select'), topicMessage: document.querySelector('#topic-error'),
  generate: document.querySelector('#generate-button')
};
let selectedCount = 5;
let session;

for (const topic of window.practiceTopics) {
  const option = document.createElement('option');
  option.value = topic.id; option.textContent = topic.title;
  ui.topicSelect.append(option);
}
ui.countButtons.forEach(button => button.addEventListener('click', () => {
  selectedCount = Number(button.dataset.count);
  ui.countButtons.forEach(option => {
    const selected = option === button;
    option.classList.toggle('selected', selected);
    option.setAttribute('aria-pressed', String(selected));
  });
}));
ui.start.addEventListener('click', startGaussianRun);
ui.topicForm.addEventListener('submit', startTopicRun);
ui.form.addEventListener('submit', submitAnswer);
ui.quit.addEventListener('click', () => showScreen('setup'));
ui.replay.addEventListener('click', () => session.kind === 'gaussian' ? startGaussianRun() : startTopicRun(null));
ui.home.addEventListener('click', () => showScreen('setup'));

function startGaussianRun() {
  const questions = Array.from({ length: selectedCount }, generateGaussianQuestion);
  beginRun({ kind: 'gaussian', title: 'Gaussian elimination', questions });
}

function startTopicRun(event) {
  event?.preventDefault();
  const topic = window.practiceTopics.find(item => item.id === ui.topicSelect.value);
  if (!topic) return;
  const questions = [];
  while (questions.length < selectedCount) {
    const pack = shuffle(topic.questions);
    for (const question of pack) {
      if (questions.length === selectedCount) break;
      questions.push({ ...question, choices: shuffle(question.choices) });
    }
  }
  ui.topicMessage.textContent = `This quiz uses built-in ${topic.title} exercises. Longer runs reshuffle the question pack.`;
  ui.topicMessage.classList.remove('hidden');
  beginRun({ kind: 'topic', title: topic.title, topicId: topic.id, questions });
}

function beginRun({ kind, title, topicId = '', questions }) {
  session = { kind, title, topicId, questions, index: 0, score: 0, streak: 0, bestStreak: 0, answered: false };
  ui.total.textContent = String(questions.length);
  showScreen('quiz');
  showQuestion();
}

function showQuestion() {
  const question = session.questions[session.index];
  session.answered = false;
  ui.current.textContent = String(session.index + 1);
  ui.streak.textContent = String(session.streak);
  ui.score.textContent = String(session.score);
  const percent = Math.round((session.index / session.questions.length) * 100);
  ui.progress.style.width = `${percent}%`;
  ui.progressLabel.textContent = `${percent}% COMPLETE`;
  ui.difficulty.textContent = `${session.title.toUpperCase()} · QUESTION ${session.index + 1}`;
  ui.equations.replaceChildren();
  ui.fields.replaceChildren();
  const visual = session.kind === 'gaussian'
    ? { label: 'Augmented matrix for this system', svg: drawAugmentedMatrix(question) }
    : drawTopicVisual(session.topicId, question);
  ui.visual.innerHTML = `<div class="visual-caption">${visual.label}</div>${visual.svg}`;
  ui.visual.classList.remove('hidden');
  const checkButton = document.createElement('button');
  checkButton.id = 'check-button'; checkButton.className = 'primary-button check-button';
  checkButton.type = 'submit'; checkButton.innerHTML = 'CHECK ANSWER <span>↵</span>';

  if (session.kind === 'gaussian') {
    ui.prompt.innerHTML = 'Use Gaussian elimination to solve the system. Enter the values of <i>x</i>, <i>y</i>, and <i>z</i>.';
    ui.answerLabel.innerHTML = '<label class="field-label" for="answer-x">YOUR SOLUTION</label><span>Numbers, fractions, or decimals</span>';
    ui.fields.className = 'answer-fields';
    ['x', 'y', 'z'].forEach(name => {
      const label = document.createElement('label'); label.className = 'answer-field';
      label.innerHTML = `<span>${name} =</span><input id="answer-${name}" name="${name}" inputmode="decimal" autocomplete="off" aria-label="${name} value" required>`;
      ui.fields.append(label);
    });
    ui.equations.className = 'equations';
    ui.equations.setAttribute('aria-label', 'System of linear equations');
    ui.equations.replaceChildren(...question.matrix.map((row, index) => {
      const line = document.createElement('div'); line.className = 'equation';
      line.textContent = `${formatTerm(row[0], 'x', true)} ${formatTerm(row[1], 'y')} ${formatTerm(row[2], 'z')} = ${question.constants[index]}`;
      return line;
    }));
  } else {
    ui.prompt.textContent = question.prompt;
    ui.answerLabel.innerHTML = '<span class="field-label">CHOOSE YOUR ANSWER</span><span>Answers show after you check</span>';
    ui.fields.className = 'choice-grid';
    ui.fields.replaceChildren(...question.choices.map((choice, i) => {
      const label = document.createElement('label'); label.className = 'choice-option';
      const radio = document.createElement('input'); radio.type = 'radio'; radio.name = 'quiz-choice'; radio.value = choice; radio.required = true;
      const letter = document.createElement('span'); letter.className = 'choice-letter'; letter.textContent = String.fromCharCode(65 + i);
      const text = document.createElement('span'); text.className = 'choice-text'; text.textContent = choice;
      label.append(radio, letter, text); return label;
    }));
  }
  ui.fields.append(checkButton);
  ui.feedback.className = 'feedback hidden';
  ui.feedback.replaceChildren();
  ui.fields.querySelector('input')?.focus({ preventScroll: true });
}

function submitAnswer(event) {
  event.preventDefault();
  if (session.answered) return;
  const question = session.questions[session.index];
  let correct; let solution;
  if (session.kind === 'gaussian') {
    const inputs = ['x', 'y', 'z'].map(name => ui.fields.querySelector(`[name="${name}"]`));
    const values = inputs.map(input => parseNumber(input.value.trim()));
    const invalid = inputs.find((input, i) => !input.value.trim() || values[i] === null);
    if (invalid) { invalid.focus(); showFeedback('incorrect', 'Enter a number or fraction for x, y, and z before checking.'); return; }
    correct = values.every((value, index) => Math.abs(value - question.answer[index]) < 1e-7);
    solution = question.answer.map((value, index) => `${'xyz'[index]} = ${value}`).join('   ·   ');
  } else {
    const chosen = ui.fields.querySelector('input[name="quiz-choice"]:checked');
    if (!chosen) { showFeedback('incorrect', 'Choose an answer first.'); return; }
    correct = chosen.value === question.answer;
    solution = `${question.answer}${question.explanation ? ` — ${question.explanation}` : ''}`;
  }
  session.answered = true;
  if (correct) {
    session.score++; session.streak++;
    session.bestStreak = Math.max(session.bestStreak, session.streak);
    showFeedback('correct', 'Correct! Great work. ', solution);
  } else {
    session.streak = 0;
    showFeedback('incorrect', 'Not quite. The answer is ', solution);
  }
  ui.streak.textContent = String(session.streak);
  ui.score.textContent = String(session.score);
  ui.fields.querySelectorAll('input').forEach(input => { input.disabled = true; });
  const button = ui.fields.querySelector('#check-button');
  button.type = 'button';
  button.innerHTML = session.index + 1 === session.questions.length ? 'SEE RESULTS →' : 'NEXT QUESTION →';
  button.addEventListener('click', () => {
    if (session.index + 1 < session.questions.length) { session.index++; showQuestion(); }
    else showResults();
  }, { once: true });
}

function showFeedback(kind, message, answer = '') {
  ui.feedback.className = `feedback ${kind}`;
  ui.feedback.replaceChildren(document.createTextNode(message));
  if (answer) { const strong = document.createElement('strong'); strong.textContent = answer; ui.feedback.append(strong); }
}

function showResults() {
  showScreen('result');
  const percent = Math.round((session.score / session.questions.length) * 100);
  const panel = ui.resultPanel;
  const className = percent < 60 ? 'score-low' : percent < 80 ? 'score-average' : 'score-high';
  panel.classList.remove('score-low', 'score-average', 'score-high'); panel.classList.add(className);
  document.querySelector('#final-percent').textContent = `${percent}%`;
  document.querySelector('#final-fraction').textContent = `${session.score} / ${session.questions.length} correct`;
  document.querySelector('#result-meter-fill').style.width = `${percent}%`;
  document.querySelector('#result-xp').textContent = String(session.score * 100);
  document.querySelector('#result-streak').textContent = String(session.bestStreak);
  const title = document.querySelector('#result-title'); const icon = document.querySelector('#result-icon');
  const message = document.querySelector('#result-message');
  if (percent < 60) { title.textContent = 'Keep practicing!'; icon.textContent = '💪'; message.textContent = 'Every run makes you stronger. Take another shot and watch your score climb.'; }
  else if (percent < 80) { title.textContent = 'Nice progress!'; icon.textContent = '🚀'; message.textContent = 'You’re getting the hang of it. A little more practice and you’ll master the topic.'; }
  else { title.textContent = percent === 100 ? 'Perfect run!' : 'Topic mastered!'; icon.textContent = '🏆'; message.textContent = percent === 100 ? 'Flawless work. You got every question right.' : 'Excellent work. You made short work of those questions.'; }
}

function generateGaussianQuestion() {
  const answer = Array.from({ length: 3 }, () => randomInt(-5, 5));
  const matrix = Array.from({ length: 3 }, (_, row) => {
    const values = Array.from({ length: 3 }, (_, col) => col === row ? 0 : randomInt(-3, 3));
    const total = values.reduce((sum, value) => sum + Math.abs(value), 0);
    values[row] = (total + randomInt(1, 4)) * (Math.random() < 0.5 ? -1 : 1);
    return values;
  });
  const constants = matrix.map(row => row.reduce((sum, value, i) => sum + value * answer[i], 0));
  return { matrix, constants, answer };
}
function drawAugmentedMatrix(question) {
  const values = question.matrix.map((row, i) => [...row, question.constants[i]]);
  const cellW = 64; const startX = 70; const rowH = 31; const startY = 32;
  const cells = values.flatMap((row, r) => row.map((value, c) =>
    `<text x="${startX + c * cellW}" y="${startY + r * rowH}" class="diagram-text">${value}</text>`
  )).join('');
  const rightX = startX + 3 * cellW - 15;
  return `<svg viewBox="0 0 390 140" role="img" aria-label="Augmented matrix with the coefficients and constants from this system">
    <path d="M${startX - 18} 15h-8v100h8 M${rightX + 20} 15h8v100h-8" class="matrix-bracket"/>
    <path d="M${rightX - 12} 19v92" class="diagram-divider"/>${cells}
    <text x="${rightX - 2}" y="129" class="diagram-label">augmented matrix</text>
  </svg>`;
}

function drawTopicVisual(topicId, question) {
  const prompt = question.prompt.toLowerCase();
  if (topicId === 'functions-domains-graphs') {
    if (/domain|ln\(|sqrt|√|denominator/.test(prompt)) return { label: 'Number line: allowed input values', svg: drawDomainNumberLine(prompt) };
    if (/sin|cos|period/.test(prompt)) return { label: 'A sketch of a repeating trig graph', svg: drawFunctionPlot(prompt.includes('cos') ? 'cos' : 'sin') };
    if (/parabola|x²|x\^2|quadratic|y=−x/.test(prompt)) return { label: 'A sketch of a quadratic function', svg: drawFunctionPlot(prompt.includes('−x²') || prompt.includes('-x') ? 'negative-square' : 'square') };
    return { label: 'How functions connect inputs to outputs', svg: drawFunctionFlow() };
  }
  if (topicId === 'linear-algebra') {
    if (/dot product|orthogonal|norm|vector/.test(prompt)) return { label: 'Vectors on coordinate axes', svg: drawVectors(prompt) };
    return { label: 'A matrix transforms an input vector', svg: drawMatrixMap() };
  }
  if (topicId === 'matrix-systems-mm151') {
    if (/rank|rows|consistent|solution|frobenius/.test(prompt)) return { label: 'Compare coefficient and augmented matrix ranks', svg: drawRankBars() };
    if (/determinant|cramer|inverse|eigenvalue/.test(prompt)) return { label: 'Matrix properties shown as a small matrix sketch', svg: drawMatrixMap() };
    return { label: 'Rows of a system form an augmented matrix', svg: drawMatrixMap() };
  }
  if (topicId === 'calculus') {
    if (/gradient|hessian|optimization|minimum/.test(prompt)) return { label: 'Contours and a downhill optimization step', svg: drawContours() };
    return { label: 'Curve with a tangent showing local change', svg: drawFunctionPlot('square') };
  }
  if (topicId === 'probability') return { label: 'A sample space split into possible outcomes', svg: drawProbabilityBars() };
  if (topicId === 'statistics') return { label: 'A small data distribution sketch', svg: drawHistogram() };
  if (topicId === 'optimization') return { label: 'Contour map with a descent direction', svg: drawContours() };
  if (topicId === 'information-theory') return { label: 'Probability bars and uncertainty', svg: drawProbabilityBars() };
  if (topicId === 'discrete-graphs') return { label: 'A network graph with connected vertices', svg: drawNetwork() };
  return { label: 'A sequence approaching its limit', svg: drawConvergence() };
}

function drawDomainNumberLine(prompt) {
  let shade = 'positive inputs';
  // Recognize common unrestricted polynomial/linear/composition cases first.
  if (/all real|f\(x\)=x²|f\(x\)=−x|f\(g\(x\)\)|polynomial/.test(prompt)) {
    shade = 'all real inputs';
    return `<svg viewBox="0 0 380 105" role="img" aria-label="Number line showing all real inputs"><path d="M28 54H350m-8-6 8 6-8 6 M36 48l-8 6 8 6" class="axis-line"/><path d="M31 54H347" class="domain-line"/><circle cx="190" cy="54" r="4" class="axis-dot"/><text x="190" y="82" class="diagram-label" text-anchor="middle">0</text><text x="33" y="82" class="diagram-label">−∞</text><text x="330" y="82" class="diagram-label">+∞</text></svg>`;
  }
  if (/except 0|x≠0|x \u2260 0|1\/x²|ln\(1\/x²\)/.test(prompt)) {
    shade = 'all real inputs except zero';
    return `<svg viewBox="0 0 380 105" role="img" aria-label="Number line showing every real input except zero"><path d="M28 54H350m-8-6 8 6-8 6 M36 48l-8 6 8 6" class="axis-line"/><path d="M32 54H184 M196 54H346" class="domain-line"/><circle cx="190" cy="54" r="6" class="open-dot"/><text x="190" y="82" class="diagram-label" text-anchor="middle">0</text><text x="33" y="82" class="diagram-label">−∞</text><text x="330" y="82" class="diagram-label">+∞</text></svg>`;
  }
  if (/except 1|x≠1|x \u2260 1|1\/ln|x²\/ln/.test(prompt)) {
    shade = 'positive inputs except one';
    return `<svg viewBox="0 0 380 105" role="img" aria-label="Number line showing positive inputs except one"><path d="M28 54H350m-8-6 8 6-8 6" class="axis-line"/><path d="M190 54H228 M240 54H346" class="domain-line"/><circle cx="190" cy="54" r="6" class="open-dot"/><circle cx="234" cy="54" r="6" class="open-dot"/><text x="190" y="82" class="diagram-label" text-anchor="middle">0</text><text x="234" y="82" class="diagram-label" text-anchor="middle">1</text><text x="330" y="82" class="diagram-label">+∞</text></svg>`;
  }
  if (/sqrt|√x|x ≥ 0/.test(prompt)) shade = 'zero and positive inputs';
  return `<svg viewBox="0 0 380 105" role="img" aria-label="Number line illustrating ${shade}"><path d="M28 54H350m-8-6 8 6-8 6" class="axis-line"/><path d="M190 54H346" class="domain-line"/><circle cx="190" cy="54" r="6" class="filled-dot"/><text x="190" y="82" class="diagram-label" text-anchor="middle">0</text><text x="330" y="82" class="diagram-label">+∞</text></svg>`;
}

function drawFunctionPlot(type) {
  let points = [];
  for (let i = 0; i <= 48; i++) {
    const x = -2.4 + i * 0.1;
    let y = type === 'sin' ? Math.sin(x * 1.5) : type === 'cos' ? Math.cos(x * 1.5) : type === 'negative-square' ? -x * x / 3 : x * x / 3;
    y = Math.max(-2.4, Math.min(2.4, y));
    const px = 190 + x * 55; const py = 54 - y * 20;
    points.push(`${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return `<svg viewBox="0 0 380 110" role="img" aria-label="Function graph sketch">
    <path d="M30 54H350 M190 12V96" class="axis-line"/><path d="${points.join(' ')}" class="curve-line"/>
    <circle cx="190" cy="54" r="3" class="plot-dot"/><text x="346" y="48" class="diagram-label">x</text><text x="198" y="18" class="diagram-label">y</text>
  </svg>`;
}

function drawFunctionFlow() {
  return `<svg viewBox="0 0 380 110" role="img" aria-label="Input passes through a function to become an output">
    <rect x="35" y="30" width="78" height="46" rx="12" class="diagram-box"/><rect x="150" y="22" width="82" height="62" rx="16" class="diagram-box accent-box"/><rect x="267" y="30" width="78" height="46" rx="12" class="diagram-box"/>
    <path d="M113 53h34m-7-6 7 6-7 6 M232 53h34m-7-6 7 6-7 6" class="axis-line"/>
    <text x="74" y="58" text-anchor="middle" class="diagram-text">input x</text><text x="191" y="58" text-anchor="middle" class="diagram-text">f(x)</text><text x="306" y="58" text-anchor="middle" class="diagram-text">output y</text>
  </svg>`;
}

function drawVectors(prompt) {
  const arrays = [...prompt.matchAll(/\[([^\]]+)\]/g)].slice(0, 2).map(match => match[1].split(',').map(value => Number(value.trim().replace('−', '-'))));
  const first = arrays[0] || [3, 2, 1]; const second = arrays[1] || [4, -1, 2];
  const labelA = `u (${first.join(', ')})`; const labelB = `v (${second.join(', ')})`;
  const pointA = projectVector(first); const pointB = projectVector(second);
  return `<svg viewBox="0 0 380 130" role="img" aria-label="Two vectors drawn from the origin on coordinate axes">
    <defs><marker id="vectorArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" class="arrow-head"/></marker></defs>
    <path d="M54 105H332 M54 105V18" class="axis-line"/><path d="M54 105L${pointA.x} ${pointA.y}" class="vector-a" marker-end="url(#vectorArrow)"/><path d="M54 105L${pointB.x} ${pointB.y}" class="vector-b" marker-end="url(#vectorArrow)"/>
    <text x="${pointA.x + 4}" y="${pointA.y - 5}" class="diagram-label">${labelA}</text><text x="${pointB.x + 4}" y="${pointB.y + 14}" class="diagram-label">${labelB}</text><text x="320" y="98" class="diagram-label">x</text><text x="61" y="24" class="diagram-label">y</text>
    <circle cx="54" cy="105" r="3" class="plot-dot"/><text x="68" y="120" class="diagram-label">0</text>
  </svg>`;
}
function projectVector(vector) {
  const [x = 0, y = 0, z = 0] = vector;
  const scale = 14;
  return { x: Math.max(75, Math.min(320, Math.round(54 + (x - z * 0.45) * scale))), y: Math.max(25, Math.min(105, Math.round(105 - (y + z * 0.35) * scale))) };
}

function drawMatrixMap() {
  return `<svg viewBox="0 0 380 120" role="img" aria-label="Matrix A transforms vector x into vector b">
    <rect x="38" y="28" width="88" height="62" rx="8" class="diagram-box accent-box"/><rect x="164" y="38" width="54" height="42" rx="8" class="diagram-box"/><rect x="257" y="28" width="82" height="62" rx="8" class="diagram-box accent-box"/>
    <text x="82" y="65" text-anchor="middle" class="diagram-text">matrix A</text><text x="191" y="65" text-anchor="middle" class="diagram-text">x</text><text x="298" y="65" text-anchor="middle" class="diagram-text">b</text>
    <text x="144" y="64" text-anchor="middle" class="diagram-label">×</text><text x="239" y="64" text-anchor="middle" class="diagram-label">=</text>
    <path d="M340 58h22m-7-6 7 6-7 6" class="axis-line"/>
  </svg>`;
}

function drawRankBars() {
  return `<svg viewBox="0 0 380 130" role="img" aria-label="Rank comparison for coefficient and augmented matrices">
    <text x="45" y="28" class="diagram-label">coefficient rank</text><text x="220" y="28" class="diagram-label">augmented rank</text>
    <rect x="48" y="45" width="110" height="14" rx="7" class="rank-bar"/><rect x="48" y="70" width="110" height="14" rx="7" class="rank-bar"/>
    <rect x="220" y="45" width="110" height="14" rx="7" class="rank-bar"/><rect x="220" y="70" width="110" height="14" rx="7" class="rank-bar"/>
    <path d="M179 65h23m-7-6 7 6-7 6" class="axis-line"/><text x="190" y="111" text-anchor="middle" class="diagram-label">equal ranks mean the system is consistent</text>
  </svg>`;
}

function drawProbabilityBars() {
  return `<svg viewBox="0 0 380 130" role="img" aria-label="Four possible outcomes with equal probability bars">
    <path d="M40 105H350 M52 100V18" class="axis-line"/>
    <rect x="82" y="53" width="42" height="52" rx="5" class="bar-one"/><rect x="151" y="53" width="42" height="52" rx="5" class="bar-two"/><rect x="220" y="53" width="42" height="52" rx="5" class="bar-one"/><rect x="289" y="53" width="42" height="52" rx="5" class="bar-two"/>
    <text x="103" y="121" text-anchor="middle" class="diagram-label">HH</text><text x="172" y="121" text-anchor="middle" class="diagram-label">HT</text><text x="241" y="121" text-anchor="middle" class="diagram-label">TH</text><text x="310" y="121" text-anchor="middle" class="diagram-label">TT</text>
    <text x="210" y="39" text-anchor="middle" class="diagram-label">four equally likely coin-flip outcomes</text>
  </svg>`;
}

function drawHistogram() {
  return `<svg viewBox="0 0 380 130" role="img" aria-label="A small histogram showing a cluster of observations around the center">
    <path d="M42 105H350 M48 105V18" class="axis-line"/>
    <rect x="79" y="83" width="38" height="22" class="hist-bar"/><rect x="119" y="61" width="38" height="44" class="hist-bar"/><rect x="159" y="33" width="38" height="72" class="hist-bar highlight-bar"/><rect x="199" y="50" width="38" height="55" class="hist-bar"/><rect x="239" y="72" width="38" height="33" class="hist-bar"/><rect x="279" y="89" width="38" height="16" class="hist-bar"/>
    <text x="196" y="122" text-anchor="middle" class="diagram-label">observed values</text><text x="57" y="26" class="diagram-label">count</text>
  </svg>`;
}

function drawContours() {
  return `<svg viewBox="0 0 380 140" role="img" aria-label="Nested loss contours and an arrow pointing toward a lower value">
    <ellipse cx="205" cy="68" rx="130" ry="55" class="contour outer-contour"/><ellipse cx="205" cy="68" rx="93" ry="39" class="contour"/><ellipse cx="205" cy="68" rx="55" ry="23" class="contour"/><ellipse cx="205" cy="68" rx="18" ry="8" class="contour inner-contour"/>
    <defs><marker id="contourArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" class="arrow-head"/></marker></defs>
    <path d="M80 25L177 60" class="vector-a" marker-end="url(#contourArrow)"/><text x="64" y="20" class="diagram-label">descent step</text><circle cx="205" cy="68" r="4" class="plot-dot"/>
  </svg>`;
}

function drawNetwork() {
  const edges = [[70,38,170,26],[170,26,285,45],[70,38,95,100],[95,100,205,96],[205,96,285,45],[170,26,205,96],[285,45,320,102],[205,96,320,102]];
  const lines = edges.map(([x1,y1,x2,y2])=>`<path d="M${x1} ${y1}L${x2} ${y2}" class="network-edge"/>`).join('');
  const nodes = [[70,38,'A'],[170,26,'B'],[285,45,'C'],[95,100,'D'],[205,96,'E'],[320,102,'F']].map(([x,y,label])=>`<circle cx="${x}" cy="${y}" r="14" class="network-node"/><text x="${x}" y="${y+4}" text-anchor="middle" class="diagram-label">${label}</text>`).join('');
  return `<svg viewBox="0 0 380 135" role="img" aria-label="Network graph with six vertices and connecting edges">${lines}${nodes}</svg>`;
}

function drawConvergence() {
  return `<svg viewBox="0 0 380 130" role="img" aria-label="Sequence values getting closer to a limit on a number line">
    <path d="M40 68H345m-8-6 8 6-8 6" class="axis-line"/><path d="M310 25V108" class="limit-line"/>
    <circle cx="105" cy="68" r="5" class="sequence-dot"/><circle cx="205" cy="68" r="5" class="sequence-dot"/><circle cx="260" cy="68" r="5" class="sequence-dot"/><circle cx="289" cy="68" r="5" class="sequence-dot"/><circle cx="303" cy="68" r="6" class="filled-dot"/>
    <text x="310" y="21" text-anchor="middle" class="diagram-label">limit</text><text x="108" y="93" class="diagram-label">terms approach the limit →</text>
  </svg>`;
}
function showScreen(name) { Object.entries(screens).forEach(([key, element]) => element.classList.toggle('hidden', key !== name)); }
function formatTerm(coefficient, variable, first = false) {
  const sign = coefficient < 0 ? '−' : '+';
  const amount = Math.abs(coefficient) === 1 ? '' : String(Math.abs(coefficient));
  return `${first ? (coefficient < 0 ? '−' : '') : ` ${sign} `}${amount}${variable}`;
}
function parseNumber(text) {
  if (!text) return null;
  const fraction = text.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/);
  if (fraction) { const denominator = Number(fraction[2]); return denominator === 0 ? null : Number(fraction[1]) / denominator; }
  const value = Number(text); return Number.isFinite(value) ? value : null;
}
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
