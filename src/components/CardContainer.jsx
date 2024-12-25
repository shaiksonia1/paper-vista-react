import PropTypes from 'prop-types';
import { useState } from 'react';

// Function to clean and extract abstract content
const extractAbstract = (abstractXml) => {
  const regex = /<AbstractText[^>]*>(.*?)<\/AbstractText>/g;
  let matches = [];
  let match;

  while ((match = regex.exec(abstractXml)) !== null) {
    matches.push(match[1].trim());
  }

  return matches.join(' '); // Join the segments into one clean text
};

const CardContainer = ({ papers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const papersPerPage = 5;

  // State to track whether each paper's abstract is expanded or not
  const [expandedIndexes, setExpandedIndexes] = useState({});

  const totalPages = Math.ceil(papers.length / papersPerPage);
  const startIndex = (currentPage - 1) * papersPerPage;
  const currentPapers = papers.slice(startIndex, startIndex + papersPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleAbstract = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-white py-4 mb-6 text-center bg-[#3c096c] rounded-lg shadow-md">
        Paper Vista
      </h1>
      <div className="flex flex-col gap-6">
        {currentPapers.length > 0 ? (
          currentPapers.map((paper, index) => {
            const globalIndex = startIndex + index;

            // Extract the abstract and clean it up
            const abstractText = extractAbstract(paper.abstract);

            // Check if paper.authors is an array; if not, assume it's a string
            const authors = Array.isArray(paper.authors)
              ? paper.authors.join(', ')
              : paper.authors || 'Unknown authors';

            // Check if the abstract for this paper is expanded
            const isExpanded = expandedIndexes[globalIndex];

            return (
              <div key={globalIndex} className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl text-[#3c096c] mb-2">{paper.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{authors}</p>
                <p className="text-sm text-gray-600 mb-2">Published on: {paper.published_at}</p>

                {/* Abstract Section */}
                <div className="mb-2">
                  <strong>Abstract:</strong>
                  {abstractText.length > 300 ? (
                    <>
                      <p>{isExpanded ? abstractText : `${abstractText.slice(0, 300)}...`}</p>
                      <button
                        className="text-[#3c096c] mt-2"
                        onClick={() => toggleAbstract(globalIndex)} // Toggle using the paper index
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                      </button>
                    </>
                  ) : (
                    <p>{abstractText}</p>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  <strong>Citations:</strong> {paper.citation_count}
                </div>
              </div>
            );
          })
        ) : (
          <p>No papers available.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#3c096c] text-white rounded-md hover:bg-[#7b2cbf] disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#3c096c] text-white rounded-md hover:bg-[#7b2cbf] disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

CardContainer.propTypes = {
  papers: PropTypes.array.isRequired, // This should enforce 'papers' to be an array
};

export default CardContainer;
