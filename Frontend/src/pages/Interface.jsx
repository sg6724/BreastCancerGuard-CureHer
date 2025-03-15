import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Interface = () => {
  const [animate, setAnimate] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-center px-4">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex items-center p-4 md:p-6 bg-zinc-900 shadow-md">
        <h1 className="font-bold text-pink-600 ml-4 text-3xl">CureHer.</h1>
        
        {/* Hamburger Menu Button */}
        <button className="ml-auto md:hidden text-3xl text-pink-500" onClick={toggleMenu}>
          ☰
        </button>
        
        {/* Navbar Links */}
        <div className={`ml-auto flex space-x-6 mr-8 md:flex ${isMenuOpen ? 'flex flex-col absolute top-16 right-0 bg-zinc-900 p-4' : 'hidden md:flex'}`}>
          <Link to="/" className="text-pink-500 font-semibold hover:bg-white rounded-md transition">Home</Link>
          <Link to="/about" className="text-pink-500 font-semibold hover:bg-white rounded-md transition">About</Link>
          <Link to="/diagnostic" className="text-pink-500 font-semibold hover:bg-white rounded-md transition">Diagnosis</Link>
          <Link to="/batch" className="text-pink-500 font-semibold hover:bg-white rounded-md transition">Upload Dataset</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`relative text-center text-white max-w-3xl transition-all duration-1000 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h1 className="text-4xl md:text-5xl text-pink-500 drop-shadow-lg font-mono font-bold">CureHer</h1>
        <p className="mt-4 text-lg md:text-xl text-slate-900 drop-shadow-md text-wrap font-serif font-bold">
          Breast Cancer Diagnosis & Recommendation System
        </p>
        <p className="mt-2 text-base md:text-lg text-slate-900 drop-shadow-md text-wrap font-serif font-bold">
          Your Breast Guard is here to help you!
        </p>
        <Link to="/diagnostic">
          <button className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-lg shadow-lg text-lg md:text-xl hover:bg-pink-600 transition transform hover:scale-105">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Interface;
