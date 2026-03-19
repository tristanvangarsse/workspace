const apiBase = "https://api.tristanvangarsse.com";

async function loadLikeStatus(button) {
    const likeId = button.dataset.likeId;

    try {
        const res = await fetch(
            `${apiBase}/status?page=${encodeURIComponent(likeId)}`,
        );
        const data = await res.json();

        button.querySelector(".like-count").textContent = data.count;
        button.classList.toggle("liked", data.liked);
        button.setAttribute("aria-pressed", data.liked ? "true" : "false");
    } catch (err) {
        console.error(err);
    }
}

async function toggleLike(button) {
    const likeId = button.dataset.likeId;

    button.disabled = true;

    try {
        const res = await fetch(
            `${apiBase}/toggle?page=${encodeURIComponent(likeId)}`,
            {
                method: "POST",
            },
        );

        const data = await res.json();

        button.querySelector(".like-count").textContent = data.count;
        button.classList.toggle("liked", data.liked);
        button.setAttribute("aria-pressed", data.liked ? "true" : "false");
    } catch (err) {
        console.error(err);
        alert("Something went wrong.");
    } finally {
        button.disabled = false;
    }
}

document.querySelectorAll(".like-button[data-like-id]").forEach((button) => {
    loadLikeStatus(button);

    button.addEventListener("click", () => {
        toggleLike(button);
    });
});
