/* Static quiz engine: local topic packs and Gaussian questions use the same scoring flow. */
const screens = { setup: document.querySelector('#setup-screen'), quiz: document.querySelector('#quiz-screen'), result: document.querySelector('#result-screen') };
const ui = {
  start: document.querySelector('#start-button'), quit: document.querySelector('#quit-button'),
  countButtons: [...document.querySelectorAll('.count-button')], form: document.querySelector('#answer-form'),
  equations: document.querySelector('#equation-list'), fields: document.querySelector('#answer-fields'),
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
  beginRun({ kind: 'topic', title: topic.title, questions });
}

function beginRun({ kind, title, questions }) {
  session = { kind, title, questions, index: 0, score: 0, streak: 0, bestStreak: 0, answered: false };
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
