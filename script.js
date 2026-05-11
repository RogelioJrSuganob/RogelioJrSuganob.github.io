// Simple smooth scroll
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", e => {
    if (link.hash !== "") {
      e.preventDefault();
      document.querySelector(link.hash).scrollIntoView({
        behavior: "smooth"
      });
    }
  });
});

// Dark / Light toggle
const toggle = document.getElementById("toggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Fade-in on scroll
const faders = document.querySelectorAll(".fade");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

faders.forEach(el => observer.observe(el));

// Portfolio chatbot
const chatbotData = window.portfolioData;
const chatbot = document.getElementById("portfolio-chatbot");
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotWindow = document.getElementById("chatbot-window");
const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotQuick = document.getElementById("chatbot-quick");
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatHistory = [];

function addChatMessage(message, sender, extraClass = "") {
  const bubble = document.createElement("div");
  bubble.className = `chatbot-message ${sender} ${extraClass}`.trim();

  if (sender === "bot") {
    bubble.innerHTML = renderMarkdownToHtml(message);
  } else {
    bubble.textContent = message;
  }

  chatbotMessages.appendChild(bubble);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return bubble;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function renderMarkdownToHtml(markdown) {
  const lines = String(markdown).split(/\r?\n/);
  const html = [];
  let listType = "";

  function closeList() {
    if (listType) {
      html.push(`</${listType}>`);
      listType = "";
    }
  }

  lines.forEach(line => {
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      return;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);

    if (bulletMatch) {
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }

      html.push(`<li>${renderInlineMarkdown(bulletMatch[1])}</li>`);
      return;
    }

    if (numberedMatch) {
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }

      html.push(`<li>${renderInlineMarkdown(numberedMatch[1])}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${renderInlineMarkdown(trimmed)}</p>`);
  });

  closeList();
  return html.join("");
}

function setChatbotOpen(isOpen) {
  chatbot.classList.toggle("open", isOpen);
  chatbotWindow.setAttribute("aria-hidden", String(!isOpen));
  chatbotToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    chatbotInput.focus();
  }
}

function listItems(items) {
  return items.map(item => `- ${item}`).join("\n");
}

function formatProjects() {
  return chatbotData.projects
    .map(project => `- **${project.name}:** ${project.description}`)
    .join("\n");
}

function hasAny(question, terms) {
  return terms.some(term => question.includes(term));
}

function hasWord(question, words) {
  return words.some(word => new RegExp(`\\b${word}\\b`).test(question));
}

function getExperience() {
  return chatbotData.experience[0];
}

function contactReply() {
  return `**Contact Roj**

You can reach Roj through:

- **Email:** ${chatbotData.contact.email}
- **GitHub:** ${chatbotData.contact.github}
- **Portfolio:** ${chatbotData.contact.website}

*For work opportunities, email is the best starting point.*`;
}

function skillsReply() {
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
- Admin support

*He is detail-oriented, quality-focused, and experienced in accuracy-critical software tasks.*`;
}

function experienceReply() {
  const experience = getExperience();

  return `**Roj's Work Experience**

Roj has **${experience.duration} of experience** as a **${experience.title}** at **${experience.company}**.

**Key Experience:**
${listItems(experience.highlights)}

His background is built around **quality**, **precision**, **documentation**, and **reliable output**.`;
}

function projectsReply() {
  return `**Roj's Projects**

Here are the main projects and concepts in Roj's portfolio:

${formatProjects()}

*These projects show his interest in automation, web development, workflow improvement, and practical software solutions.*`;
}

function achievementReply() {
  return `**Main Achievement**

- ${chatbotData.achievements[0]}

This shows Roj's ability to identify repetitive work, improve processes, and build tools that create measurable productivity gains.`;
}

function rolesReply() {
  return `**Career Direction**

${chatbotData.careerDirection}

**Roles that fit Roj well:**
- Software development support
- Automation-focused roles
- Virtual assistant roles
- Data entry and documentation roles
- Admin support roles
- Remote-friendly professional roles

*He is open to opportunities where accuracy, reliability, and problem solving matter.*`;
}

function hireReply() {
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

function programmingReply() {
  return `**Programming Background**

Yes. Roj has programming and software development skills, including:

- **C programming**
- **Python**
- **React.js**
- **Next.js**
- Software testing and unit testing experience

He also has practical experience building web app concepts and automation-focused workflows.`;
}

function automationReply() {
  return `**Automation Experience**

Yes. Roj is interested in automation and has already created a productivity tool that increased work efficiency by **30%**.

His automation-related skills include:

- Python
- Word VBA
- AI tools
- Workflow improvement
- Documentation and repeatable process design`;
}

function microsoftReply() {
  return `**Microsoft Excel and Word Skills**

Yes. Roj has productivity and documentation skills that include:

- **Microsoft Excel**
- **Microsoft Word**
- **Word VBA**
- Documentation
- Data entry
- Admin support

These skills support his direction toward virtual assistance, automation, data entry, and admin support roles.`;
}

function remoteReply() {
  return `**Remote Work Fit**

Roj is a good fit for remote-friendly professional roles because he is:

- Detail-oriented
- Reliable
- Professional
- Documentation-focused
- Comfortable with software tools, AI tools, and automation workflows
- Adaptable and fast to learn new systems`;
}

function virtualAssistantReply() {
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
- Process improvement

His software testing background also supports careful, accurate, and well-documented work.`;
}

function resumeReply() {
  return `**Resume**

${chatbotData.resume.note}

**Resume highlights:**
- ${chatbotData.summary}
- ${chatbotData.achievements[0]}
- Skills include software testing, automation, Excel, Word, Python, React.js, Next.js, and admin support.

You can request Roj's latest resume through **${chatbotData.contact.email}**.`;
}

function profileReply() {
  return `**Who Is Roj Suganob?**

${chatbotData.summary}

**Strengths:**
${listItems(chatbotData.strengths)}

**Career Direction:**
${chatbotData.careerDirection}`;
}

function buildFallbackReply(question) {
  const lowerQuestion = question.toLowerCase().trim();

  if (hasAny(lowerQuestion, ["contact", "email", "github", "reach"])) {
    return contactReply();
  }

  if (hasAny(lowerQuestion, ["resume", "cv"])) {
    return resumeReply();
  }

  if (hasAny(lowerQuestion, ["hire", "why should", "different", "candidate", "applicant"])) {
    return hireReply();
  }

  if (hasAny(lowerQuestion, ["remote", "work from home"])) {
    return remoteReply();
  }

  if (hasAny(lowerQuestion, ["virtual assistant", "va", "admin support", "data entry"])) {
    return virtualAssistantReply();
  }

  if (hasAny(lowerQuestion, ["automation", "automate", "workflow", "ai tool", "ai tools"])) {
    return automationReply();
  }

  if (hasAny(lowerQuestion, ["excel", "word", "vba", "microsoft"])) {
    return microsoftReply();
  }

  if (hasAny(lowerQuestion, ["programming", "coding", "code", "developer", "development"]) || hasWord(lowerQuestion, ["c", "python", "react", "next"])) {
    return programmingReply();
  }

  if (hasAny(lowerQuestion, ["project", "projects", "portfolio", "queue", "gobohol", "chatbot"])) {
    return projectsReply();
  }

  if (hasAny(lowerQuestion, ["achievement", "achievements", "accomplishment", "productivity", "30%"])) {
    return achievementReply();
  }

  if (hasAny(lowerQuestion, ["experience", "background", "company", "denso", "testing", "unit tester", "cross-checker", "ecu", "software engineering"])) {
    return experienceReply();
  }

  if (hasAny(lowerQuestion, ["skill", "skills", "tech stack", "technology", "tools"])) {
    return skillsReply();
  }

  if (hasAny(lowerQuestion, ["available", "availability", "looking for", "role", "roles", "career", "work", "opportunity", "opportunities"])) {
    return rolesReply();
  }

  if (hasAny(lowerQuestion, ["who is", "about roj", "about him", "summary", "profile", "strength", "strengths"]) || hasWord(lowerQuestion, ["roj", "suganob"])) {
    return profileReply();
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

async function getChatbotReply(message) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        history: chatHistory.slice(-8)
      })
    });

    if (!response.ok) {
      throw new Error("Chat API unavailable");
    }

    const data = await response.json();
    return data.reply || buildFallbackReply(message);
  } catch (error) {
    return buildFallbackReply(message);
  }
}

if (chatbotData && chatbot && chatbotToggle && chatbotClose && chatbotForm && chatbotQuick) {
  addChatMessage(chatbotData.chatbot.starterMessage, "bot");
  chatHistory.push({
    role: "assistant",
    content: chatbotData.chatbot.starterMessage
  });

  chatbotData.chatbot.quickQuestions.forEach(question => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = question;
    button.addEventListener("click", () => {
      submitChatMessage(question);
    });
    chatbotQuick.appendChild(button);
  });

  chatbotToggle.addEventListener("click", () => {
    setChatbotOpen(!chatbot.classList.contains("open"));
  });

  chatbotClose.addEventListener("click", () => {
    setChatbotOpen(false);
    chatbotToggle.focus();
  });

  async function submitChatMessage(message) {
    if (!message) {
      return;
    }

    chatbotInput.value = "";
    addChatMessage(message, "user");
    chatHistory.push({ role: "user", content: message });

    const loadingMessage = addChatMessage("Thinking...", "bot", "loading");
    const reply = await getChatbotReply(message);
    loadingMessage.remove();

    addChatMessage(reply, "bot");
    chatHistory.push({ role: "assistant", content: reply });
  }

  chatbotForm.addEventListener("submit", async event => {
    event.preventDefault();
    submitChatMessage(chatbotInput.value.trim());
  });
}
