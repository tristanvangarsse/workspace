window.addEventListener("scroll", function () {
  if (window.innerWidth > 1500) { // Only run if screen width is greater than 1500px
    let scrollY = window.scrollY;
    let minWidth = 46;
    let maxWidth = 65;
    let growthRate = 0.04;

    let newWidth = Math.min(minWidth + scrollY * growthRate, maxWidth);
    
    document.querySelectorAll(".scroll-resize").forEach(element => {
      element.style.width = newWidth + "vw";
    });
  } else {
    // Reset to default width if below 1500px
    document.querySelectorAll(".scroll-resize").forEach(element => {
      element.style.width = "85vw";
    });
  }
});