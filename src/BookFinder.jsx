import React, { useState } from "react";
import BookCard from "./BookCard";

const BookFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Search Function ---
  const searchBooks = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let searchParam = "";
      if (searchType === "title") {
        searchParam = `title=${encodeURIComponent(searchQuery)}`;
      } else if (searchType === "author") {
        searchParam = `author=${encodeURIComponent(searchQuery)}`;
      } else if (searchType === "subject") {
        searchParam = `subject=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(
        `https://openlibrary.org/search.json?${searchParam}&limit=12`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();

      const formattedBooks = data.docs.map((book) => ({
        key: book.key,
        title: book.title,
        author: book.author_name
          ? book.author_name.join(", ")
          : "Unknown Author",
        year: book.first_publish_year || "Unknown",
        cover: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null,
        publisher: book.publisher ? book.publisher[0] : "Unknown Publisher",
        subjects: book.subject ? book.subject.slice(0, 3) : [],
        isbn: book.isbn ? book.isbn[0] : null,
        pageCount: book.number_of_pages_median || "Unknown",
      }));

      setBooks(formattedBooks);
    } catch (err) {
      setError("❌ Error searching books. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchBooks();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ---------- Header ---------- */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
          <span className="text-3xl">📚</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Book Finder
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover your next great read from millions of books worldwide
        </p>
      </header>

      {/* ---------- Search Section ---------- */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter book title, author, or subject..."
            className="flex-1 min-w-[300px] p-4 text-lg border-2 border-gray-200 rounded-xl 
                     focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
                     transition-all duration-200 bg-white shadow-sm"
          />

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-4 text-lg border-2 border-gray-200 rounded-xl bg-white 
                     focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
                     transition-all duration-200 shadow-sm min-w-[140px]"
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="subject">Subject</option>
          </select>

          <button
            onClick={searchBooks}
            disabled={loading}
            className={`px-8 py-4 text-lg font-bold rounded-xl text-white transition-all duration-200 
                      shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[160px] ${
              loading
                ? "bg-gray-400 cursor-not-allowed transform-none shadow-md"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Searching...
              </div>
            ) : (
              "Search Books"
            )}
          </button>
        </div>
      </div>

      {/* ---------- Error Message ---------- */}
      {error && (
        <div className="text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl mb-8 
                      shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* ---------- Loading State ---------- */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-xl text-gray-600 font-medium">Searching for books...</p>
          <p className="text-gray-500 mt-2">This may take a moment</p>
        </div>
      )}

      {/* ---------- Results Count ---------- */}
      {books.length > 0 && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-800 font-medium flex items-center gap-2">
            <span className="text-lg">✨</span>
            Found {books.length} amazing books for you
          </p>
        </div>
      )}

      {/* ---------- Books Grid ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {books.map((book, index) => (
          <div 
            key={`${book.key}-${index}`}
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <BookCard book={book} />
          </div>
        ))}
      </div>

      {/* ---------- No Results ---------- */}
      {books.length === 0 && !loading && searchQuery && !error && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <span className="text-4xl">📖</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No books found</h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            We couldn't find any books matching your search. Try different keywords or check your spelling.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-lg mx-auto">
            <p className="text-blue-800 font-medium mb-2">💡 Search Tips:</p>
            <ul className="text-blue-700 text-sm space-y-1 text-left">
              <li>• Try broader terms (e.g., "fantasy" instead of "epic fantasy adventure")</li>
              <li>• Check for typos in author names</li>
              <li>• Use the subject search for topics like "science" or "history"</li>
            </ul>
          </div>
        </div>
      )}

      {/* ---------- Welcome Message ---------- */}
      {books.length === 0 && !searchQuery && !loading && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-8">
            <span className="text-6xl">🎓</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome to Book Finder!
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Search for books by title, author, or subject to discover your next favorite read from our vast collection.
          </p>
          <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
            <p className="text-lg font-semibold text-gray-800 mb-4">✨ Popular searches to get you started:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Harry Potter", "Stephen King", "Programming", "Psychology", "Science Fiction", "Biography"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    setSearchType(term === "Stephen King" ? "author" : "title");
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full 
                           hover:from-blue-600 hover:to-purple-600 transition-all duration-200 
                           transform hover:-translate-y-0.5 hover:shadow-lg text-sm font-medium"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default BookFinder;
