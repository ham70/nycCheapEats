import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaginationControls = ({ query, currentPage, totalPages }) => {
    const navigate = useNavigate();

    const goToPage = (pageNum) => {
        navigate(`/search/${query}?page=${pageNum}`);
    };

    return (
        <div className="pagination-controls">
            {currentPage > 1 && (
            <button onClick={() => goToPage(currentPage - 1)}>Previous</button>
            )}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNum => (
                <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={pageNum === currentPage ? 'active' : ''}
                >
                {pageNum}
                </button>
            ))}
            {currentPage < totalPages && (
                <button onClick={() => goToPage(currentPage + 1)}>Next</button>
            )}
        </div>
    )
}

export default PaginationControls