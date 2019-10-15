import React, { useState } from 'react';

interface ResultPaginationProps {
  offset: number
  limit: number
  totalResults: number
  onOffsetChange: (offset: number) => void
}

function ResultPagination({ offset, totalResults, onOffsetChange, limit }: ResultPaginationProps) {
  const [pageOffset, setPageOffset] = useState<number>(offset)

  const goNext = () => {
    const nextOffset = pageOffset + limit
    setPageOffset(nextOffset)
    onOffsetChange(nextOffset)
  }

  const goPrev = () => {
    const prevOffset = pageOffset - limit;
    setPageOffset(prevOffset);
    onOffsetChange(prevOffset);
  }

  return <div className="result-pagination">
    {(pageOffset > 0) && <button onClick={goPrev}> Prev </button>}
    {(pageOffset < (totalResults - limit)) && <button onClick={goNext}> Next </button>}
  </div>
};

export default ResultPagination;
