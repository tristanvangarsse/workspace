// Select all elements with the target classes
const elementsFadeIn = document.querySelectorAll('.trigger-1');
const elementsFadeLeft = document.querySelectorAll('.trigger-2');
const elementsFadeRight = document.querySelectorAll('.trigger-3');

// Function to create an observer for a specific class and animation
const createObserver = (elements, animationClass) => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the animation class when the element is in view
        entry.target.classList.add(animationClass);
        // Optionally, unobserve the element to avoid re-triggering
        observer.unobserve(entry.target);
      }
    });
  });

  // Observe each target element
  elements.forEach(element => observer.observe(element));
};

// Create observers for each set of elements and animations
createObserver(elementsFadeIn, 'fadein-tr-1');
createObserver(elementsFadeLeft, 'fadein-tr-2');
createObserver(elementsFadeRight, 'fadein-tr-3');

