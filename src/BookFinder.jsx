import React, { useState, useEffect } from "react";
import BookCard from "./BookCard";
import Logo from "./Logo";
import { supabase, getUserId } from "./supabaseClient";

const BookFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [filterYear, setFilterYear] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

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

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const userId = getUserId();
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId);

    if (!error && data) {
      setFavorites(data);
    }
  };

  const toggleFavorite = async (book) => {
    const userId = getUserId();
    const isFavorited = favorites.some(fav => fav.book_key === book.key);

    if (isFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('book_key', book.key);

      if (!error) {
        setFavorites(favorites.filter(fav => fav.book_key !== book.key));
      }
    } else {
      const { data, error } = await supabase
        .from('favorites')
        .insert([{
          user_id: userId,
          book_key: book.key,
          book_title: book.title,
          book_author: book.author,
          book_cover: book.cover,
          book_year: book.year,
          book_publisher: book.publisher
        }])
        .select();

      if (!error && data) {
        setFavorites([...favorites, data[0]]);
      }
    }
  };

  const getFilteredAndSortedBooks = () => {
    let filtered = showFavoritesOnly
      ? favorites.map(fav => ({
          key: fav.book_key,
          title: fav.book_title,
          author: fav.book_author,
          cover: fav.book_cover,
          year: fav.book_year,
          publisher: fav.book_publisher,
          subjects: [],
          pageCount: "Unknown"
        }))
      : books;

    if (filterYear) {
      filtered = filtered.filter(book =>
        book.year.toString().includes(filterYear)
      );
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "year_asc":
        sorted.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          return yearA - yearB;
        });
        break;
      case "year_desc":
        sorted.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          return yearB - yearA;
        });
        break;
      case "author":
        sorted.sort((a, b) => a.author.localeCompare(b.author));
        break;
      default:
        break;
    }

    return sorted;
  };

  const displayedBooks = getFilteredAndSortedBooks();
  const totalPages = Math.ceil(displayedBooks.length / booksPerPage);
  const paginatedBooks = displayedBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, filterYear, showFavoritesOnly, books]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center mb-6">
          <Logo size={100} />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Book Finder
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover your next great read from millions of books worldwide
        </p>
        {favorites.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg
                ${showFavoritesOnly
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300'
                }`}
            >
              {showFavoritesOnly ? '❤️ Showing Favorites' : `🤍 View ${favorites.length} Favorites`}
            </button>
          </div>
        )}
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

        {!showFavoritesOnly && books.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white
                           focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                           transition-all duration-200"
                >
                  <option value="relevance">Relevance</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="author">Author (A-Z)</option>
                  <option value="year_desc">Newest First</option>
                  <option value="year_asc">Oldest First</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by year
                </label>
                <input
                  type="text"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  placeholder="e.g., 2020"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white
                           focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                           transition-all duration-200"
                />
              </div>

              {(sortBy !== "relevance" || filterYear) && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSortBy("relevance");
                      setFilterYear("");
                    }}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200
                             transition-all duration-200 font-medium whitespace-nowrap"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
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

      {displayedBooks.length > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <p className="text-green-800 font-medium flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              {showFavoritesOnly
                ? `${displayedBooks.length} favorite book${displayedBooks.length !== 1 ? 's' : ''}`
                : `Found ${displayedBooks.length} amazing book${displayedBooks.length !== 1 ? 's' : ''}`
              }
            </span>
            {!showFavoritesOnly && (filterYear || sortBy !== "relevance") && (
              <span className="text-sm text-green-600">
                (filtered & sorted)
              </span>
            )}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {paginatedBooks.map((book, index) => (
          <div
            key={`${book.key}-${index}`}
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BookCard
              book={book}
              onToggleFavorite={toggleFavorite}
              isFavorite={favorites.some(fav => fav.book_key === book.key)}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
            }`}
          >
            Previous
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === currentPage - 2 ||
                pageNum === currentPage + 2
              ) {
                return <span key={pageNum} className="px-2 py-2 text-gray-400">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {displayedBooks.length === 0 && !loading && !error && showFavoritesOnly && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <span className="text-4xl">🤍</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No favorites yet</h3>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
            Start adding books to your favorites by clicking the heart icon on any book card.
          </p>
          <button
            onClick={() => setShowFavoritesOnly(false)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl
                     font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200
                     shadow-md hover:shadow-lg"
          >
            Browse Books
          </button>
        </div>
      )}

      {books.length === 0 && !loading && searchQuery && !error && !showFavoritesOnly && (
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
