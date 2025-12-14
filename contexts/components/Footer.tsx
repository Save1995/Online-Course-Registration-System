import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-2">
      <div className="container mx-auto px-6 text-center">
        <div className="text-gray-400 text-xs sm:text-sm flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span className="mx-2 hidden sm:inline">‖</span>
          <a href="#" className="hover:underline">Terms of Service</a>
          <span className="mx-2 hidden sm:inline">‖</span>
          <a href="#" className="hover:underline">Contact Us  </a>
         <p>‖ © 2025 College of Public Health Administration ‖ Design and Developer By.Pantamit</p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;