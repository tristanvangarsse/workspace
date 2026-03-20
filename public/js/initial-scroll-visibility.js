let lastState = null;
let initialized = false;

function closeLanguageMenus() {
    const switchers = document.querySelectorAll(".language-switcher");

    switchers.forEach((switcher) => {
        switcher.classList.remove("open");

        const toggle = switcher.querySelector(".language-toggle");
        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}

function handleScroll() {
    const targetDivs = document.querySelectorAll(".initial-scroll-visibility");
    const scrollDistance = window.scrollY;
    const isMobile = window.innerWidth < 800;

    targetDivs.forEach(function (targetDiv) {
        if (isMobile) {
            closeLanguageMenus();

            targetDiv.classList.remove(
                "not-initialized",
                "popdown-hide",
                "popdown-show",
            );
            targetDiv.style.transform = "translate(-50%,0px)";
            targetDiv.style.opacity = "1";
            targetDiv.style.pointerEvents = "auto";
            lastState = "shown";
            return;
        }

        if (!initialized) {
            targetDiv.classList.remove("not-initialized");
            initialized = true;
        }

        const shouldBeShown = scrollDistance > 200;

        if (shouldBeShown && lastState !== "shown") {
            targetDiv.classList.remove("popdown-hide", "popdown-show");
            void targetDiv.offsetWidth;
            targetDiv.classList.add("popdown-show");
            lastState = "shown";
        } else if (!shouldBeShown && lastState !== "hidden") {
            closeLanguageMenus();

            targetDiv.classList.remove("popdown-show", "popdown-hide");
            void targetDiv.offsetWidth;
            targetDiv.classList.add("popdown-hide");
            lastState = "hidden";
        }
    });
}

// Event listeners
window.addEventListener("scroll", handleScroll);
window.addEventListener("resize", handleScroll);
window.addEventListener("load", () => {
    handleScroll();
    setTimeout(handleScroll, 100);
});
window.addEventListener("hashchange", handleScroll);
