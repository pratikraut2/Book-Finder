import React from "react";

const BookCard = ({ book, onToggleFavorite, isFavorite }) => {
  return (
    <div
      className="group bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-lg
                 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300
                 hover:bg-white/95 hover:border-white/60 flex flex-col h-full"
    >
      <div className="relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(book);
          }}
          className="absolute -top-2 -right-2 z-10 w-9 h-9 rounded-full bg-white shadow-md
                     hover:shadow-lg transition-all duration-200 flex items-center justify-center
                     border-2 border-gray-100 hover:scale-110"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <span className={`text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
            {isFavorite ? '❤️' : '🤍'}
          </span>
        </button>

        <div className="text-center mb-4">
          {book.cover ? (
            <img
              src={book.cover}
              alt={`Cover of ${book.title}`}
              className="w-[140px] h-[180px] object-cover rounded-xl border-2 border-gray-200 mx-auto
                       shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}

          <div
            className={`w-[140px] h-[180px] bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center mx-auto rounded-xl border-2 border-gray-300 shadow-md ${
              book.cover ? "hidden" : "flex"
            }`}
          >
            <span className="text-4xl opacity-60">📚</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h3
          className="mb-3 text-lg font-bold text-gray-800 leading-tight line-clamp-2 min-h-[3.5rem]
                   group-hover:text-blue-600 transition-colors duration-200"
          title={book.title}
        >
          {book.title}
        </h3>

        <div className="space-y-2 flex-1">
          <p className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-blue-500 flex-shrink-0 mt-0.5">👤</span>
            <span className="flex-1 min-w-0">
              <strong className="text-gray-800">Author:</strong>{' '}
              <span className="text-gray-600 line-clamp-2" title={book.author}>
                {book.author}
              </span>
            </span>
          </p>

          <p className="text-sm text-gray-700 flex items-center gap-2">
            <span className="text-green-500 flex-shrink-0">📅</span>
            <span className="flex-1">
              <strong className="text-gray-800">Year:</strong>{' '}
              <span className="text-gray-600">{book.year}</span>
            </span>
          </p>

          <p className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-amber-500 flex-shrink-0 mt-0.5">🏢</span>
            <span className="flex-1 min-w-0">
              <strong className="text-gray-800">Publisher:</strong>{' '}
              <span className="text-gray-600 line-clamp-1" title={book.publisher}>
                {book.publisher}
              </span>
            </span>
          </p>

          {book.pageCount !== "Unknown" && (
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <span className="text-orange-500 flex-shrink-0">📄</span>
              <span className="flex-1">
                <strong className="text-gray-800">Pages:</strong>{' '}
                <span className="text-gray-600">{book.pageCount}</span>
              </span>
            </p>
          )}
        </div>

        {book.subjects.length > 0 && (
          <div className="mt-3 mb-3 min-h-[2rem]">
            <div className="flex flex-wrap gap-1.5">
              {book.subjects.slice(0, 2).map((subject, index) => (
                <span
                  key={index}
                  className="inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-2.5 py-1
                             rounded-full text-xs font-medium border border-blue-200
                             hover:from-blue-200 hover:to-cyan-200 transition-colors duration-200
                             truncate max-w-[150px]"
                  title={subject}
                >
                  {subject}
                </span>
              ))}
              {book.subjects.length > 2 && (
                <span className="inline-block bg-gray-100 text-gray-600 px-2.5 py-1
                               rounded-full text-xs font-medium border border-gray-200">
                  +{book.subjects.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        <a
          href={`https://openlibrary.org${book.key}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center mt-auto px-4 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white
                     rounded-xl text-sm font-bold hover:from-emerald-700 hover:to-cyan-700
                     transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <span className="flex items-center justify-center gap-2">
            📖 View Details
            <span className="text-xs opacity-75">↗</span>
          </span>
        </a>
      </div>
    </div>
  );
};

export default BookCard;
