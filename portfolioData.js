const portfolioData = {
  name: "Roj Suganob",
  role: "Software Engineer transitioning into Virtual Assistant / Automation-focused roles",
  summary:
    "Roj is a software engineer with 2.5 years of ECU automotive software unit testing experience. He is moving toward virtual assistant and automation-focused roles where software testing discipline, documentation, admin support, AI tools, and process automation are valuable.",
  experience: [
    {
      company: "Denso Techno Philippines",
      title: "Unit Tester and Cross-checker",
      duration: "2.5 years",
      highlights: [
        "Worked on ECU automotive software unit testing.",
        "Focused on quality, precision, documentation, and reliable output.",
        "Reviewed and cross-checked outputs to support consistent test quality."
      ]
    }
  ],
  achievements: [
    "Created a productivity tool that increased productivity by 30%."
  ],
  skills: [
    "C",
    "Python",
    "React.js",
    "Next.js",
    "Microsoft Excel",
    "Microsoft Word",
    "Word VBA",
    "AI tools",
    "Automation",
    "Software testing",
    "Documentation",
    "Data entry",
    "Admin support"
  ],
  strengths: [
    "Detail-oriented",
    "Fast learner",
    "Adaptable",
    "Quality-focused",
    "Strong problem-solving skills"
  ],
  projects: [
    {
      name: "Productivity automation tool",
      description:
        "A workflow tool built to reduce repetitive work and improve team productivity by 30%."
    },
    {
      name: "GoBohol travel and tour website concept",
      description:
        "A travel website concept for presenting Bohol tour packages, destinations, and booking-oriented content."
    },
    {
      name: "Queue monitoring web app concept",
      description:
        "A queue monitoring app concept for real-time customer flow, counter management, and display screens."
    },
    {
      name: "Social media automation workflow concept",
      description:
        "An automation concept for supporting repeatable social media content and admin workflows."
    },
    {
      name: "QueueFlow",
      description:
        "A real-time queue management system with admin, customer, and display views using React, Node.js, Express, and Socket.IO.",
      liveUrl: "https://queue-system-pi.vercel.app/",
      codeUrl: "https://github.com/RogelioJrSuganob/queue-system"
    }
  ],
  contact: {
    email: "rogeliojrsuganob@email.com",
    github: "https://github.com/RogelioJrSuganob",
    website: "https://RogelioJrSuganob.github.io/"
  },
  chatbot: {
    assistantName: "Roj's portfolio assistant",
    starterMessage:
      "Hi! I'm Roj's portfolio assistant. You can ask me about his skills, projects, experience, or how to contact him."
  }
};

if (typeof window !== "undefined") {
  window.portfolioData = portfolioData;
}

if (typeof module !== "undefined") {
  module.exports = portfolioData;
}
