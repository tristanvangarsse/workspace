let images = document.querySelectorAll(".lazyload");
new LazyLoad(images, {
    root: null,
    rootMargin: "100px",
    threshold: 0
});