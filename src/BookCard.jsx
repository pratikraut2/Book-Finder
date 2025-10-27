import React from "react";

const BookCard = ({ book }) => {
  return (
    <div
      className="group bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-lg 
                 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer
                 hover:bg-white/95 hover:border-white/60"
    >
      {/* ---------- Book Cover ---------- */}
      <div className="text-center mb-4 relative">
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

        {/* Fallback if no cover */}
        <div
          className={`w-[140px] h-[180px] bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center mx-auto rounded-xl border-2 border-gray-300 shadow-md ${
            book.cover ? "hidden" : "flex"
          }`}
        >
          <span className="text-4xl opacity-60">📚</span>
        </div>
      </div>

      {/* ---------- Book Details ---------- */}
      <div>
        <h3
          className="mb-3 text-lg font-bold text-gray-800 leading-tight line-clamp-2 h-14
                   group-hover:text-blue-600 transition-colors duration-200"
        >
          {book.title}
        </h3>

        <p className="text-sm text-gray-700 mb-2 flex items-center gap-2">
          <span className="text-blue-500">👤</span>
          <strong className="text-gray-800">Author:</strong> 
          <span className="text-gray-600">{book.author}</span>
        </p>
        <p className="text-sm text-gray-700 mb-2 flex items-center gap-2">
          <span className="text-green-500">📅</span>
          <strong className="text-gray-800">Year:</strong> 
          <span className="text-gray-600">{book.year}</span>
        </p>
        <p className="text-sm text-gray-700 mb-2 flex items-center gap-2">
          <span className="text-purple-500">🏢</span>
          <strong className="text-gray-800">Publisher:</strong> 
          <span className="text-gray-600">{book.publisher}</span>
        </p>

        {book.pageCount !== "Unknown" && (
          <p className="text-sm text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-orange-500">📄</span>
            <strong className="text-gray-800">Pages:</strong> 
            <span className="text-gray-600">{book.pageCount}</span>
          </p>
        )}

        {book.isbn && (
          <p className="text-xs text-gray-600 mb-3 flex items-center gap-2">
            <span className="text-gray-400">🔢</span>
            <strong>ISBN:</strong> {book.isbn}
          </p>
        )}

        {book.rating && (
          <div className="text-sm mb-3 flex items-center gap-2">
            <span className="text-yellow-500">⭐</span>
            <strong className="text-gray-800">Rating:</strong>
            <span className="text-gray-600">{book.rating}/5</span>
            {book.ratingsCount && (
              <span className="text-xs text-gray-500">({book.ratingsCount} reviews)</span>
            )}
          </div>
        )}

        {book.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-3 leading-relaxed">
            {book.description.replace(/<[^>]*>/g, '')}
          </p>
        )}

        {/* Subjects / Tags */}
        {book.subjects.length > 0 && (
          <div className="mt-3 mb-4">
            {book.subjects.slice(0, 3).map((subject, index) => (
              <span
                key={index}
                className="inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1
                           rounded-full text-xs mr-2 mb-2 font-medium border border-blue-200
                           hover:from-blue-200 hover:to-cyan-200 transition-colors duration-200"
              >
                {subject}
              </span>
            ))}
          </div>
        )}

        {/* View Full Details Button */}
        <a
          href={`https://books.google.com/books?id=${book.key}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center mt-4 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white
                     rounded-xl text-sm font-bold hover:from-green-700 hover:to-blue-700
                     transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                     group-hover:scale-105"
        >
          <span className="flex items-center justify-center gap-2">
            📖 View on Google Books
            <span className="text-xs opacity-75">↗</span>
          </span>
        </a>
      </div>
    </div>
  );
};

export default BookCard;
