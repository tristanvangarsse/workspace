document.addEventListener('DOMContentLoaded', () => {
  // For each slideshow on the page
  document.querySelectorAll('.slideshow').forEach((slideshow, index) => {
    const slides = slideshow.querySelectorAll('.slide');
    const indicatorContainers = slideshow.parentElement.querySelectorAll('.indicator-container');
    let currentSlide = 0;
    let interval;

    function showSlide(n) {
      slides.forEach(slide => slide.classList.remove('active'));
      indicatorContainers.forEach(ind => ind.classList.remove('active'));

      slides[n].classList.add('active');
      indicatorContainers[n].classList.add('active');
      currentSlide = n;
    }

    function startSlideshow() {
      interval = setInterval(() => {
        let nextSlide = (currentSlide + 1) % slides.length;
        showSlide(nextSlide);
      }, 8000);
    }

    indicatorContainers.forEach((indicator, i) => {
      indicator.onclick = () => {
        clearInterval(interval);
        showSlide(i);
        startSlideshow();
      };
    });

    // Add click event to current slide to go to next
    slides.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        if (i === currentSlide) {
          clearInterval(interval);
          let nextSlide = (currentSlide + 1) % slides.length;
          showSlide(nextSlide);
          startSlideshow();
        }
      });
    });

    // Init
    showSlide(0);
    startSlideshow();
  });
});