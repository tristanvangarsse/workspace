window.addEventListener("load", () => {
  const loader = document.querySelector(".page-loader-main");
  if (loader) {
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 1);
  }
});