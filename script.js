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
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatHistory = [];

function addChatMessage(message, sender, extraClass = "") {
  const bubble = document.createElement("div");
  bubble.className = `chatbot-message ${sender} ${extraClass}`.trim();
  bubble.textContent = message;
  chatbotMessages.appendChild(bubble);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return bubble;
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
  return items.join(", ");
}

function formatProjects() {
  return chatbotData.projects
    .map(project => `${project.name}: ${project.description}`)
    .join(" ");
}

function isPortfolioQuestion(question) {
  const portfolioPhrases = [
    "software testing",
    "admin support",
    "data entry",
    "word vba",
    "ai tools"
  ];
  const portfolioWords = [
    "roj",
    "suganob",
    "you",
    "your",
    "skill",
    "project",
    "experience",
    "background",
    "contact",
    "email",
    "github",
    "resume",
    "hire",
    "work",
    "automation",
    "assistant",
    "testing",
    "denso",
    "excel",
    "word",
    "python",
    "react",
    "next",
    "c",
    "vba",
    "ai"
  ];
  const lowerQuestion = ` ${question.toLowerCase()} `;
  return portfolioPhrases.some(term => lowerQuestion.includes(term)) ||
    portfolioWords.some(term => new RegExp(`\\b${term}\\b`).test(lowerQuestion));
}

function buildFallbackReply(question) {
  const lowerQuestion = question.toLowerCase();

  if (!isPortfolioQuestion(question)) {
    return "I focus on Roj's professional profile. You can ask me about his skills, projects, software testing background, automation experience, resume highlights, or contact information.";
  }

  if (lowerQuestion.includes("contact") || lowerQuestion.includes("email") || lowerQuestion.includes("github")) {
    return `You can contact ${chatbotData.name} by email at ${chatbotData.contact.email}. His GitHub is ${chatbotData.contact.github}.`;
  }

  if (lowerQuestion.includes("project") || lowerQuestion.includes("portfolio") || lowerQuestion.includes("queue") || lowerQuestion.includes("gobohol")) {
    return `${chatbotData.name}'s projects include ${formatProjects()}`;
  }

  if (lowerQuestion.includes("skill") || lowerQuestion.includes("tech") || lowerQuestion.includes("excel") || lowerQuestion.includes("python") || lowerQuestion.includes("react") || lowerQuestion.includes("next") || lowerQuestion.includes("word")) {
    return `${chatbotData.name}'s skills include ${listItems(chatbotData.skills)}. His strengths are ${listItems(chatbotData.strengths)}.`;
  }

  if (lowerQuestion.includes("experience") || lowerQuestion.includes("background") || lowerQuestion.includes("denso") || lowerQuestion.includes("testing") || lowerQuestion.includes("ecu")) {
    const experience = chatbotData.experience[0];
    return `${chatbotData.name} has ${experience.duration} of experience as a ${experience.title} at ${experience.company}. He worked on ECU automotive software unit testing with a focus on quality, precision, documentation, and reliable output.`;
  }

  if (lowerQuestion.includes("achievement") || lowerQuestion.includes("resume") || lowerQuestion.includes("highlight") || lowerQuestion.includes("strength")) {
    return `Resume highlights: ${chatbotData.summary} Key achievement: ${chatbotData.achievements[0]} Strengths: ${listItems(chatbotData.strengths)}.`;
  }

  return `${chatbotData.name} is a ${chatbotData.role}. ${chatbotData.summary} You can ask me about his skills, projects, experience, resume highlights, or contact details.`;
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

if (chatbotData && chatbot && chatbotToggle && chatbotClose && chatbotForm) {
  addChatMessage(chatbotData.chatbot.starterMessage, "bot");
  chatHistory.push({
    role: "assistant",
    content: chatbotData.chatbot.starterMessage
  });

  chatbotToggle.addEventListener("click", () => {
    setChatbotOpen(!chatbot.classList.contains("open"));
  });

  chatbotClose.addEventListener("click", () => {
    setChatbotOpen(false);
    chatbotToggle.focus();
  });

  chatbotForm.addEventListener("submit", async event => {
    event.preventDefault();

    const message = chatbotInput.value.trim();
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
  });
}
