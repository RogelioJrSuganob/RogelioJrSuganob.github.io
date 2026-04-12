// Smooth scroll
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

// Fade-in animation
const faders = document.querySelectorAll(".fade");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

faders.forEach(el => observer.observe(el));

// Copy email
function copyEmail() {
  const email = "rogeliojrsuganob@email.com";

  navigator.clipboard.writeText(email).then(() => {
    alert("Email copied!");
  });
}