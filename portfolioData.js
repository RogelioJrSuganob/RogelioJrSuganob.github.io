const portfolioData = {
  name: "Roj Suganob",
  role: "Detail-oriented Software Engineer exploring software development, automation, virtual assistance, data entry, and admin support roles",
  summary:
    "Roj is a detail-oriented Software Engineer with 2.5 years of experience in ECU automotive software unit testing. He has experience as a unit tester and cross-checker at Denso Techno Philippines, where quality, accuracy, documentation, and reliability were highly important. He is currently exploring opportunities in software development, automation, virtual assistance, data entry, and admin support.",
  careerDirection:
    "Roj is interested in software development, automation, virtual assistance, data entry, admin support, and other remote-friendly professional roles.",
  availability:
    "Roj is open to opportunities where he can apply his software testing background, automation mindset, documentation discipline, and admin support skills.",
  experience: [
    {
      company: "Denso Techno Philippines",
      title: "Software Engineer / Unit Tester",
      duration: "2.5 years",
      highlights: [
        "Worked on ECU automotive software unit testing.",
        "Performed unit testing and cross-checking.",
        "Focused on quality, precision, documentation, and reliable output.",
        "Reviewed and cross-checked outputs to support consistent test quality."
      ]
    }
  ],
  achievements: [
    "Created a productivity tool that increased productivity by 30%."
  ],
  skills: [
    "C programming",
    "Python",
    "React.js",
    "Next.js",
    "Software testing",
    "Unit testing",
    "Cross-checking",
    "Microsoft Excel",
    "Microsoft Word",
    "Word VBA",
    "AI tools",
    "Automation",
    "Documentation",
    "Data entry",
    "Admin support",
    "Problem solving"
  ],
  strengths: [
    "Detail-oriented",
    "Fast learner",
    "Adaptable",
    "Quality-focused",
    "Reliable",
    "Professional",
    "Strong problem-solving mindset"
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
      name: "Portfolio chatbot",
      description:
        "A professional portfolio assistant that answers visitor questions about Roj's skills, experience, projects, achievements, and contact information."
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
  resume: {
    status: "Available upon request",
    note:
      "A downloadable resume is not currently linked on the site. Visitors can contact Roj by email to request the latest resume."
  },
  chatbot: {
    assistantName: "Roj's portfolio assistant",
    starterMessage:
      "Hi! I'm Roj's portfolio assistant. You can ask me about his skills, projects, experience, or how to contact him.",
    quickQuestions: [
      "What are Roj's skills?",
      "What is his work experience?",
      "What projects has he built?",
      "Why should we hire him?",
      "How can we contact him?"
    ]
  }
};

if (typeof window !== "undefined") {
  window.portfolioData = portfolioData;
}

if (typeof module !== "undefined") {
  module.exports = portfolioData;
}
