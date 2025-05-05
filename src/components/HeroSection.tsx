
import React from 'react';
import SearchBar from './SearchBar';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const HeroSection = ({ 
  title = "Encontre seu novo lar", 
  subtitle = "Milhares de imóveis para alugar ou comprar", 
  backgroundImage 
}: HeroSectionProps) => {
  const defaultBg = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80";

  return (
    <div 
      className="relative bg-cover bg-center h-[500px] flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage || defaultBg})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8">
          {subtitle}
        </p>
        <SearchBar onSearch={(query) => console.log('Search query:', query)} />
      </div>
    </div>
  );
};

export default HeroSection;
