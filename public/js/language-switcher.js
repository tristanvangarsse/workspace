const switchers = document.querySelectorAll(".language-switcher");

switchers.forEach((switcher) => {
    const toggle = switcher.querySelector(".language-toggle");

    if (!toggle) return;

    toggle.addEventListener("click", (event) => {
        event.stopPropagation();

        // close all other switchers first
        switchers.forEach((other) => {
            if (other !== switcher) {
                other.classList.remove("open");
                const otherToggle = other.querySelector(".language-toggle");
                if (otherToggle) {
                    otherToggle.setAttribute("aria-expanded", "false");
                }
            }
        });

        // toggle current one
        const isOpen = switcher.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
});

document.addEventListener("click", () => {
    switchers.forEach((switcher) => {
        switcher.classList.remove("open");
        const toggle = switcher.querySelector(".language-toggle");
        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
        }
    });
});
