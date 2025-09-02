import React from "react";

const BookCard = ({ book }) => {
  return (
    <div
      className="border border-gray-300 rounded-lg p-4 bg-white shadow-md 
                 hover:-translate-y-1 hover:shadow-lg transition duration-200 cursor-pointer"
    >
      {/* ---------- Book Cover ---------- */}
      <div className="text-center mb-3">
        {book.cover ? (
          <img
            src={book.cover}
            alt={`Cover of ${book.title}`}
            className="w-[120px] h-[160px] object-cover rounded-md border border-gray-200 mx-auto"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback if no cover */}
        <div
          className={`w-[120px] h-[160px] bg-gray-100 items-center justify-center mx-auto rounded-md border border-gray-300 ${
            book.cover ? "hidden" : "flex"
          }`}
        >
          <span className="text-2xl">📚</span>
        </div>
      </div>

      {/* ---------- Book Details ---------- */}
      <div>
        <h3
          className="mb-2 text-base font-bold text-gray-800 leading-snug line-clamp-2 h-10"
        >
          {book.title}
        </h3>

        <p className="text-sm text-gray-600 mb-1">
          <strong>Author:</strong> {book.author}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Year:</strong> {book.year}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Publisher:</strong> {book.publisher}
        </p>

        {book.pageCount !== "Unknown" && (
          <p className="text-sm text-gray-600 mb-1">
            <strong>Pages:</strong> {book.pageCount}
          </p>
        )}

        {book.isbn && (
          <p className="text-xs text-gray-600 mb-1">
            <strong>ISBN:</strong> {book.isbn}
          </p>
        )}

        {/* Subjects / Tags */}
        {book.subjects.length > 0 && (
          <div className="mt-2">
            {book.subjects.map((subject, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 
                           rounded-full text-[10px] mr-1 mb-1"
              >
                {subject}
              </span>
            ))}
          </div>
        )}

        {/* View Full Details Button */}
        <a
          href={`https://openlibrary.org${book.key}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center mt-3 px-3 py-2 bg-green-600 text-white 
                     rounded-md text-sm font-bold hover:bg-green-700 transition"
        >
          📖 View Full Details
        </a>
      </div>
    </div>
  );
};

export default BookCard;
