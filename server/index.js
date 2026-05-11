const http = require("http");
const fs = require("fs");
const path = require("path");
const portfolioData = require("../portfolioData");

const ROOT = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach(line => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadEnvFile(path.join(ROOT, ".env"));

const PORT = process.env.PORT || 3000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", chunk => {
      body += chunk;

      if (body.length > 10000) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function portfolioContext() {
  return JSON.stringify(portfolioData, null, 2);
}

function fallbackReply(message) {
  const question = message.toLowerCase();

  if (question.includes("contact") || question.includes("email") || question.includes("github")) {
    return `You can contact ${portfolioData.name} by email at ${portfolioData.contact.email}. His GitHub is ${portfolioData.contact.github}.`;
  }

  if (question.includes("project") || question.includes("queue") || question.includes("gobohol")) {
    return `${portfolioData.name}'s projects include ${portfolioData.projects.map(project => `${project.name}: ${project.description}`).join(" ")}`;
  }

  if (question.includes("skill") || question.includes("excel") || question.includes("python") || question.includes("react") || question.includes("next") || question.includes("word")) {
    return `${portfolioData.name}'s skills include ${portfolioData.skills.join(", ")}. His strengths are ${portfolioData.strengths.join(", ")}.`;
  }

  if (question.includes("experience") || question.includes("background") || question.includes("denso") || question.includes("testing") || question.includes("ecu")) {
    const experience = portfolioData.experience[0];
    return `${portfolioData.name} has ${experience.duration} of experience as a ${experience.title} at ${experience.company}. He worked on ECU automotive software unit testing with a focus on quality, precision, documentation, and reliable output.`;
  }

  if (question.includes("achievement") || question.includes("resume") || question.includes("highlight")) {
    return `Resume highlights: ${portfolioData.summary} Key achievement: ${portfolioData.achievements[0]} Strengths: ${portfolioData.strengths.join(", ")}.`;
  }

  return `I focus on ${portfolioData.name}'s professional profile. You can ask me about his skills, projects, software testing background, automation experience, resume highlights, or contact information.`;
}

async function createOpenAIReply(message, history = []) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackReply(message);
  }

  const instructions = [
    `You are ${portfolioData.chatbot.assistantName}.`,
    "Answer as a concise, professional portfolio assistant.",
    "Use only the portfolio data provided as the source of truth.",
    "If a question is unrelated to the portfolio, politely redirect the user back to Roj's professional profile.",
    "Do not invent employment history, degrees, phone numbers, or private contact details.",
    `Portfolio data:\n${portfolioContext()}`
  ].join("\n\n");

  const transcript = history
    .slice(-8)
    .map(item => `${item.role === "assistant" ? "Assistant" : "User"}: ${String(item.content || "").slice(0, 1200)}`)
    .join("\n");

  const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions,
      input: `${transcript ? `Recent conversation:\n${transcript}\n\n` : ""}User question: ${message}`,
      max_output_tokens: 350
    })
  });

  if (!openAIResponse.ok) {
    const details = await openAIResponse.text();
    throw new Error(`OpenAI request failed: ${details}`);
  }

  const data = await openAIResponse.json();
  const outputText = data.output_text ||
    data.output
      ?.flatMap(item => item.content || [])
      .filter(content => content.type === "output_text")
      .map(content => content.text)
      .join("\n")
      .trim();

  return outputText || fallbackReply(message);
}

async function handleChat(request, response) {
  let message = "";

  try {
    const body = await readRequestBody(request);
    const payload = JSON.parse(body || "{}");
    message = String(payload.message || "").trim();

    if (!message) {
      sendJson(response, 400, { error: "Message is required." });
      return;
    }

    const reply = await createOpenAIReply(message, Array.isArray(payload.history) ? payload.history : []);
    sendJson(response, 200, { reply });
  } catch (error) {
    sendJson(response, 200, {
      reply: fallbackReply(message),
      fallback: true
    });
  }
}

function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = decodeURIComponent(requestUrl.pathname);
  const filePath = path.normalize(path.join(ROOT, pathname === "/" ? "index.html" : pathname));

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  if (request.method === "POST" && request.url === "/api/chat") {
    handleChat(request, response);
    return;
  }

  if (request.method === "GET" || request.method === "HEAD") {
    serveStatic(request, response);
    return;
  }

  response.writeHead(405);
  response.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Portfolio chatbot server running at http://localhost:${PORT}`);
});
