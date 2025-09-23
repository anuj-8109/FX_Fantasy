import React, { useState } from 'react';

// Example data to search in
// const sampleData = [
//   { id: 1, title: 'React Tutorial', category: 'Programming' },
//   { id: 2, title: 'Learn JavaScript', category: 'Programming' },
//   { id: 3, title: 'Healthy Recipes', category: 'Food' },
//   { id: 4, title: 'Travel to India', category: 'Travel' },
// ];

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Filter data based on input
    const filtered = sampleData.filter(item =>
      item.title.toLowerCase().includes(value.toLowerCase()) ||
      item.category.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search here..."
        value={query}
        onChange={handleSearch}
        className="border p-2 rounded w-full mb-4"
      />

      <div>
        {results.length > 0 ? (
          results.map(item => (
            <div key={item.id} className="p-2 border-b">
              <strong>{item.title}</strong> - {item.category}
            </div>
          ))
        ) : query ? (
          <p>No results found.</p>
        ) : null}
      </div>
    </div>
  );
}

export default Search;
