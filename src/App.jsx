import { useState, useEffect, useCallback } from 'react';
import CardContainer from './components/CardContainer';
import FilterWidget from './components/FilterWidget';

const App = () => {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    title: "",
    citations: "",
    startYear: "",
    endYear: ""
  });

  // Fetch data from the JSON file
  useEffect(() => {
    fetch('/data/data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.papers && Array.isArray(data.papers)) {
          setPapers(data.papers);
          setFilteredPapers(data.papers); // Initially set all papers as filtered
        } else {
          console.error('Invalid data format: "papers" should be an array');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching papers:', error);
        setIsLoading(false);
      });
  }, []);

  // Memoize applyFilters function to avoid unnecessary re-renders
  const applyFilters = useCallback(() => {
    let filtered = papers;

    if (filter.title) {
      filtered = filtered.filter(paper =>
        paper.title.toLowerCase().includes(filter.title.toLowerCase())
      );
    }
    if (filter.citations) {
      filtered = filtered.filter(paper => paper.citation_count >= filter.citations);
    }
    if (filter.startYear) {
      filtered = filtered.filter(paper => new Date(paper.published_at).getFullYear() >= filter.startYear);
    }
    if (filter.endYear) {
      filtered = filtered.filter(paper => new Date(paper.published_at).getFullYear() <= filter.endYear);
    }

    setFilteredPapers(filtered);
  }, [papers, filter]); // use papers and filter as dependencies

  useEffect(() => {
    applyFilters(); // Reapply filters whenever filter state changes
  }, [filter, applyFilters]); // include applyFilters in the dependency array

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <FilterWidget setFilter={setFilter} />
      <CardContainer papers={filteredPapers} />
    </div>
  );
};

export default App;
