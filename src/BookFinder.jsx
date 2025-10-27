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
    <div className="p-6 font-sans max-w-6xl mx-auto">
      {/* ---------- Header ---------- */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Book Finder</h1>
        <p className="text-gray-600">Find your next great read</p>
      </header>

      {/* ---------- Search Section ---------- */}
      <div className="bg-gray-100 p-6 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter book title, author, or subject..."
            className="flex-1 min-w-[250px] p-3 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-3 text-base border-2 border-gray-300 rounded-md bg-white"
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="subject">Subject</option>
          </select>

          <button
            onClick={searchBooks}
            disabled={loading}
            className={`px-6 py-3 text-base font-bold rounded-md text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {loading ? "Searching..." : "Search Books"}
          </button>
        </div>
      </div>

      {/* ---------- Error Message ---------- */}
      {error && (
        <div className="text-red-700 bg-red-100 border border-red-300 p-3 rounded-md mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* ---------- Loading State ---------- */}
      {loading && (
        <div className="text-center py-10 text-gray-600 text-lg">
          🔍 Searching for books...
        </div>
      )}

      {/* ---------- Results Count ---------- */}
      {books.length > 0 && (
        <p className="mb-4 text-gray-600 text-sm">Found {books.length} books</p>
      )}

      {/* ---------- Books Grid ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-6">
        {books.map((book, index) => (
          <BookCard key={`${book.key}-${index}`} book={book} />
        ))}
      </div>

      {/* ---------- No Results ---------- */}
      {books.length === 0 && !loading && searchQuery && !error && (
        <div className="text-center py-16 text-gray-600">
          <h3 className="text-lg font-semibold">📖 No books found</h3>
          <p>Try searching with different keywords or check your spelling.</p>
        </div>
      )}

      {/* ---------- Welcome Message ---------- */}
      {books.length === 0 && !searchQuery && !loading && (
        <div className="text-center py-16 text-gray-600">
          <h2 className="text-xl font-bold mb-2">
            Welcome to Book Finder! 🎓
          </h2>
          <p>Search for books by title, author, or subject to get started.</p>
          <div className="mt-4 text-sm">
            <p className="font-semibold">Try searching for:</p>
            <p>"Harry Potter" • "Stephen King" • "Programming" • "Psychology"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFinder;
