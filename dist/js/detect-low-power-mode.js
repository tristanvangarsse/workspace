// Function to handle Low Power Mode changes
function handleLowPowerMode(isLowPower) {
  const videoElement = document.getElementById('power-saver');
  
  if (videoElement) {
    if (isLowPower) {
      videoElement.style.display = 'none';
      console.log('Video hidden due to Low Power Mode');
    } else {
      videoElement.style.display = ''; // Reset to default
      console.log('Video shown (normal power mode)');
    }
  }
}

// Check if Low Power Mode detection is supported
if ('matchMedia' in window) {
  const lowPowerModeQuery = window.matchMedia('(prefers-reduced-power)');
  
  // Initial check
  handleLowPowerMode(lowPowerModeQuery.matches);
  
  // Listen for changes
  lowPowerModeQuery.addEventListener('change', (e) => {
    handleLowPowerMode(e.matches);
  });
} else {
  console.log('Low Power Mode detection not supported - showing video by default');
  // Optionally show the video if detection isn't supported
  const videoElement = document.getElementById('power-saver');
  if (videoElement) {
    videoElement.style.display = '';
  }
}