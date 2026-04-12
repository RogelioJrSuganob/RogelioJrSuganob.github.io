// smooth scroll
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", e => {
    if (link.hash) {
      e.preventDefault();
      document.querySelector(link.hash).scrollIntoView({ behavior: "smooth" });
    }
  });
});

// dark mode
document.getElementById("toggle").onclick = () => {
  document.body.classList.toggle("light");
};

// animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
});
document.querySelectorAll(".fade").forEach(el => observer.observe(el));

// copy email
function copyEmail(btn) {
  navigator.clipboard.writeText("rogeliojrsuganob@email.com");
  btn.setAttribute("data-label", "Copied!");
  setTimeout(() => btn.setAttribute("data-label", "Email"), 1500);
}