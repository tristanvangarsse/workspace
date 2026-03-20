const switcher = document.querySelector(".language-switcher");
const toggle = document.querySelector(".language-toggle");

if (switcher && toggle) {
    toggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = switcher.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", (event) => {
        if (!switcher.contains(event.target)) {
            switcher.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}
