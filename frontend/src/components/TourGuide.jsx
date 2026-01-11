import { useEffect } from 'react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TourGuide = () => {
  useEffect(() => {
    // 1. Check if user has already seen the tour
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (hasSeenTour) return;

    // 2. Define the Tour Steps
    const tourDriver = driver({
      showProgress: true,
      animate: true,
      allowClose: false,
      doneBtnText: "Get Started",
      nextBtnText: "Next",
      prevBtnText: "Previous",
      steps: [
        { 
          element: '#tour-welcome', 
          popover: { 
            title: 'Welcome to ECDDrive', 
            description: 'Your secure, zero-knowledge cloud storage vault. Let us show you around.',
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-upload', 
          popover: { 
            title: 'Encrypt & Upload', 
            description: 'Click here to upload files. They are encrypted locally before leaving your device.',
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-create-folder', 
          popover: { 
            title: 'Organize with Folders', 
            description: 'Create folders to keep your encrypted files organized.',
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-search', 
          popover: { 
            title: 'Instant Search', 
            description: 'Quickly find your files. Search works on encrypted filenames securely.',
            side: "bottom", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-theme', 
          popover: { 
            title: 'Dark Mode', 
            description: 'Switch between Architect Light and Navy Dark themes here.',
            side: "left", 
            align: 'start' 
          } 
        },
        { 
          element: '#tour-logout', 
          popover: { 
            title: 'Secure Logout', 
            description: 'Always log out when you are done to clear your encryption keys from memory.',
            side: "left", 
            align: 'start' 
          } 
        }
      ],
      onDestroyed: () => {
        // 3. Save to LocalStorage so it doesn't show again
        localStorage.setItem('hasSeenTour', 'true');
      }
    });

    // 4. Start the tour after a short delay
    setTimeout(() => {
      tourDriver.drive();
    }, 1000);

  }, []);

  return null; // This component doesn't render anything visible itself
};

export default TourGuide;