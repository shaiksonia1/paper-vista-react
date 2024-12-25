import PropTypes from 'prop-types';
import { useState } from 'react';

const FilterWidget = ({ setFilter, papers }) => {
  const [title, setTitle] = useState("");
  const [citations, setCitations] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const handleFilterChange = () => {
    setFilter({
      title,
      citations,
      startYear,
      endYear,
    });
  };

  const handleDownload = () => {
    try {
      // Filter the papers based on current filters
      const filteredPapers = papers.filter((paper) => {
        const isTitleMatch = title
          ? paper.title.toLowerCase().includes(title.toLowerCase())
          : true;
        const isCitationsMatch = citations
          ? paper.citation_count >= parseInt(citations, 10)
          : true;
        const isStartYearMatch = startYear
          ? new Date(paper.published_at).getFullYear() >= parseInt(startYear, 10)
          : true;
        const isEndYearMatch = endYear
          ? new Date(paper.published_at).getFullYear() <= parseInt(endYear, 10)
          : true;

        return isTitleMatch && isCitationsMatch && isStartYearMatch && isEndYearMatch;
      });

      if (filteredPapers.length === 0) {
        alert("No papers match the filter criteria.");
        return;
      }

      // Convert filtered data to a JSON string
      const jsonStr = JSON.stringify(filteredPapers, null, 2);

      // Create a Blob from the JSON string
      const blob = new Blob([jsonStr], { type: 'application/json' });

      // Create an anchor element to simulate a file download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `filtered_papers_${Date.now()}.json`;

      // Trigger the download
      link.click();

      // Clean up the object URL
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("An error occurred while trying to download the file.");
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-center p-6 bg-white rounded-lg shadow-md m-6">
      <div className="flex-1 mb-4 mr-4">
        <label htmlFor="filter-title" className="block">Title</label>
        <input
          type="text"
          id="filter-title"
          placeholder="Filter by Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex-1 mb-4 mr-4">
        <label htmlFor="filter-citations" className="block">Min Citations</label>
        <input
          type="number"
          id="filter-citations"
          placeholder="Min Citations"
          value={citations}
          onChange={(e) => setCitations(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex-1 mb-4 mr-4">
        <label htmlFor="filter-start-year" className="block">Start Year</label>
        <input
          type="number"
          id="filter-start-year"
          placeholder="Start Year"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex-1 mb-4 mr-4">
        <label htmlFor="filter-end-year" className="block">End Year</label>
        <input
          type="number"
          id="filter-end-year"
          placeholder="End Year"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        className="px-4 py-2 bg-[#3c096c] text-white rounded-md hover:bg-[#7b2cbf] mr-4" // Added margin-right to the first button
        onClick={handleFilterChange}
      >
        Apply Filters
      </button>

      {/* Download Button */}
      <button
        className="px-4 py-2 bg-[#3c096c] text-white rounded-md hover:bg-[#7b2cbf]"
        onClick={handleDownload}
      >
        Download File
      </button>
    </div>
  );
};

// Prop validation for FilterWidget component
FilterWidget.propTypes = {
  setFilter: PropTypes.func.isRequired,
  papers: PropTypes.array.isRequired, // Ensure that 'papers' is passed in as an array
};

export default FilterWidget;
