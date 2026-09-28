import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };
const usage = new Map();
const maxRequestsPerHour = 12;

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/generate-quiz') {
    await generateQuiz(req, res);
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return respond(res, 405, 'Method not allowed');
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, requested);
  if (!file.startsWith(`${root}${path.sep}`)) return respond(res, 403, 'Forbidden');
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    respond(res, 404, 'Not found');
  }
});

async function generateQuiz(req, res) {
  if (!process.env.OPENAI_API_KEY) return json(res, 503, { error: 'The AI quiz service is not configured yet. The site owner needs to add the private AI key.' });
  const clientId = req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recent = (usage.get(clientId) || []).filter(time => now - time < 60 * 60 * 1000);
  if (recent.length >= maxRequestsPerHour) return json(res, 429, { error: 'That is a lot of quizzes for now. Please try again later.' });
  let body;
  try { body = await readJson(req); } catch { return json(res, 400, { error: 'Please send a valid quiz request.' }); }
  const topic = typeof body.topic === 'string' ? body.topic.trim().slice(0, 160) : '';
  const count = Number(body.count);
  if (!topic || ![5, 10, 15, 30].includes(count)) return json(res, 400, { error: 'Enter a topic and choose 5, 10, 15, or 30 questions.' });
  usage.set(clientId, [...recent, now]);

  const schema = {
    type: 'object', additionalProperties: false, required: ['title', 'questions'],
    properties: {
      title: { type: 'string' },
      questions: { type: 'array', items: {
        type: 'object', additionalProperties: false, required: ['prompt', 'choices', 'answer', 'explanation'],
        properties: {
          prompt: { type: 'string' },
          choices: { type: 'array', items: { type: 'string' } },
          answer: { type: 'string' },
          explanation: { type: 'string' }
        }
      } }
    }
  };
  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        instructions: 'Create accurate, age-appropriate educational multiple-choice practice quizzes. Make original questions about the requested topic. Each question must have exactly four distinct choices, exactly one correct answer, and a short helpful explanation. The answer must exactly match one of the four choices. Do not include the answer in the question prompt. If the topic is too broad, focus on its core school-level concepts. Return only data matching the requested schema.',
        input: `Create exactly ${count} distinct questions for this practice topic: ${topic}`,
        text: { format: { type: 'json_schema', name: 'practice_quiz', strict: true, schema } },
        max_output_tokens: Math.min(10000, count * 230)
      })
    });
    const result = await upstream.json();
    if (!upstream.ok) {
      console.error('OpenAI API request failed:', upstream.status, result.error?.type || 'unknown');
      return json(res, 502, { error: upstream.status === 429 ? 'The AI quiz maker is busy. Please wait a little and try again.' : 'The AI could not make that quiz right now. Please try again.' });
    }
    const output = result.output?.flatMap(item => item.content || []).find(part => part.type === 'output_text')?.text;
    if (!output) return json(res, 502, { error: 'The AI returned no quiz. Please try again.' });
    const quiz = JSON.parse(output);
    if (!Array.isArray(quiz.questions) || quiz.questions.length !== count || quiz.questions.some(question =>
      typeof question.prompt !== 'string' || !question.prompt.trim() ||
      typeof question.answer !== 'string' || !question.choices?.includes(question.answer) ||
      question.choices.length !== 4 || new Set(question.choices).size !== 4 ||
      question.choices.some(choice => typeof choice !== 'string' || !choice.trim())
    )) return json(res, 502, { error: 'The AI made an incomplete quiz. Please try again.' });
    return json(res, 200, quiz);
  } catch (error) {
    console.error('Quiz generation failed:', error.message);
    return json(res, 502, { error: 'The AI quiz maker could not be reached. Please try again later.' });
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = ''; let tooLarge = false;
    req.on('data', chunk => { data += chunk; if (data.length > 4096) { tooLarge = true; reject(new Error('too large')); } });
    req.on('end', () => {
      if (tooLarge) return;
      try { resolve(JSON.parse(data)); } catch { reject(new Error('invalid json')); }
    });
    req.on('error', reject);
  });
}
function json(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(value));
}
function respond(res, status, value) { res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(value); }

server.listen(port, () => console.log(`Gauss Quest is running at http://localhost:${port}`));
