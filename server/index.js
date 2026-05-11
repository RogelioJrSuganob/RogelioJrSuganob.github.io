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

function listItems(items) {
  return items.map(item => `- ${item}`).join("\n");
}

function formatProjects() {
  return portfolioData.projects
    .map(project => `- **${project.name}:** ${project.description}`)
    .join("\n");
}

function hasAny(question, terms) {
  return terms.some(term => question.includes(term));
}

function hasWord(question, words) {
  return words.some(word => new RegExp(`\\b${word}\\b`).test(question));
}

function fallbackReply(message) {
  const question = message.toLowerCase().trim();
  const experience = portfolioData.experience[0];

  if (hasAny(question, ["contact", "email", "github", "reach"])) {
    return `**Contact Roj**

You can reach Roj through:

- **Email:** ${portfolioData.contact.email}
- **GitHub:** ${portfolioData.contact.github}
- **Portfolio:** ${portfolioData.contact.website}

*For work opportunities, email is the best starting point.*`;
  }

  if (hasAny(question, ["resume", "cv"])) {
    return `**Resume**

${portfolioData.resume.note}

**Resume highlights:**
- ${portfolioData.summary}
- ${portfolioData.achievements[0]}
- Skills include software testing, automation, Excel, Word, Python, React.js, Next.js, and admin support.

You can request Roj's latest resume through **${portfolioData.contact.email}**.`;
  }

  if (hasAny(question, ["hire", "why should", "different", "candidate", "applicant"])) {
    return `**Why Roj Is a Strong Candidate**

Roj brings a useful combination of **software engineering discipline** and **professional support skills**.

**What makes him valuable:**
- 2.5 years of ECU automotive software unit testing experience
- Strong attention to detail from quality-critical software work
- Experience with unit testing, cross-checking, and documentation
- Automation mindset with a proven 30% productivity improvement
- Adaptable skill set across coding, admin support, data entry, and AI tools

*He is a good fit for teams that need someone reliable, precise, and quick to learn.*`;
  }

  if (hasAny(question, ["remote", "work from home"])) {
    return `**Remote Work Fit**

Roj is a good fit for remote-friendly professional roles because he is:

${listItems(portfolioData.strengths)}
- Comfortable with software tools, AI tools, and automation workflows`;
  }

  if (hasAny(question, ["virtual assistant", "va", "admin support", "data entry"])) {
    return `**Virtual Assistant Skills**

Roj is transitioning toward virtual assistant and automation-focused roles.

Relevant skills include:

- Microsoft Excel
- Microsoft Word
- Word VBA
- AI tools
- Documentation
- Data entry
- Admin support
- Process improvement`;
  }

  if (hasAny(question, ["automation", "automate", "workflow", "ai tool", "ai tools"])) {
    return `**Automation Experience**

Yes. Roj is interested in automation and created a productivity tool that increased work efficiency by **30%**.

His automation-related skills include:

- Python
- Word VBA
- AI tools
- Workflow improvement
- Documentation and repeatable process design`;
  }

  if (hasAny(question, ["excel", "word", "vba", "microsoft"])) {
    return `**Microsoft Excel and Word Skills**

Yes. Roj has productivity and documentation skills that include:

- **Microsoft Excel**
- **Microsoft Word**
- **Word VBA**
- Documentation
- Data entry
- Admin support`;
  }

  if (hasAny(question, ["programming", "coding", "code", "developer", "development"]) || hasWord(question, ["c", "python", "react", "next"])) {
    return `**Programming Background**

Yes. Roj has programming and software development skills, including:

- **C programming**
- **Python**
- **React.js**
- **Next.js**
- Software testing and unit testing experience`;
  }

  if (hasAny(question, ["project", "projects", "portfolio", "queue", "gobohol", "chatbot"])) {
    return `**Roj's Projects**

Here are the main projects and concepts in Roj's portfolio:

${formatProjects()}`;
  }

  if (hasAny(question, ["achievement", "achievements", "accomplishment", "productivity", "30%"])) {
    return `**Main Achievement**

- ${portfolioData.achievements[0]}

This shows Roj's ability to identify repetitive work, improve processes, and build tools that create measurable productivity gains.`;
  }

  if (hasAny(question, ["experience", "background", "company", "denso", "testing", "unit tester", "cross-checker", "ecu", "software engineering"])) {
    return `**Roj's Work Experience**

Roj has **${experience.duration} of experience** as a **${experience.title}** at **${experience.company}**.

**Key Experience:**
${listItems(experience.highlights)}

His background is built around **quality**, **precision**, **documentation**, and **reliable output**.`;
  }

  if (hasAny(question, ["skill", "skills", "tech stack", "technology", "tools"])) {
    return `**Roj's Main Skills**

Roj has a strong mix of **software engineering**, **testing**, **automation**, and **productivity** skills.

**Technical Skills:**
- C programming
- Python
- React.js
- Next.js
- Software testing
- Unit testing
- Cross-checking
- Automation

**Productivity and Support Skills:**
- Microsoft Excel
- Microsoft Word
- Word VBA
- AI tools
- Documentation
- Data entry
- Admin support`;
  }

  if (hasAny(question, ["available", "availability", "looking for", "role", "roles", "career", "work", "opportunity", "opportunities"])) {
    return `**Career Direction**

${portfolioData.careerDirection}

**Roles that fit Roj well:**
- Software development support
- Automation-focused roles
- Virtual assistant roles
- Data entry and documentation roles
- Admin support roles
- Remote-friendly professional roles`;
  }

  if (hasAny(question, ["who is", "about roj", "about him", "summary", "profile", "strength", "strengths"]) || hasWord(question, ["roj", "suganob"])) {
    return `**Who Is Roj Suganob?**

${portfolioData.summary}

**Strengths:**
${listItems(portfolioData.strengths)}

**Career Direction:**
${portfolioData.careerDirection}`;
  }

  return `I focus on **Roj Suganob's professional profile**.

You can ask me about:

- His skills
- Work experience
- Projects
- Automation background
- Resume highlights
- Contact information`;
}

async function createOpenAIReply(message, history = []) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackReply(message);
  }

  const instructions = [
    "You are Roj Suganob's professional portfolio assistant. Answer questions using only the provided portfolio knowledge base. Keep responses clear, professional, and easy to read. Use Markdown formatting such as bold text, bullet points, spacing, and short sections. If the question is unrelated to Roj's portfolio, politely redirect the user back to Roj's skills, experience, projects, or contact information. Do not invent information that is not in the knowledge base.",
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
