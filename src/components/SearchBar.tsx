
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-2">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Busque por bairro, cidade ou endereço"
            className="w-full pl-10 h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-12 px-8">
          Buscar
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
