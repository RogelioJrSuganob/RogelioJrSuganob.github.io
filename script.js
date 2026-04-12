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

// Dark mode
document.getElementById("toggle").onclick = () => {
  document.body.classList.toggle("light");
};

// Fade animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});
document.querySelectorAll(".fade").forEach(el => observer.observe(el));

// Copy email (clean UX)
function copyEmail(btn) {
  const email = "rogeliojrsuganob@email.com";

  navigator.clipboard.writeText(email).then(() => {
    btn.setAttribute("data-label", "Copied!");
    setTimeout(() => {
      btn.setAttribute("data-label", "Email");
    }, 1500);
  });
}