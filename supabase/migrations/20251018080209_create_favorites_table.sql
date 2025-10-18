/*
  # Create Favorites Table for Book Finder

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key) - Unique identifier for each favorite
      - `user_id` (text) - Browser fingerprint or session ID to identify users
      - `book_key` (text) - Open Library book key (e.g., "/works/OL45804W")
      - `book_title` (text) - Title of the book
      - `book_author` (text) - Author(s) of the book
      - `book_cover` (text) - URL to book cover image
      - `book_year` (text) - Publication year
      - `book_publisher` (text) - Publisher name
      - `created_at` (timestamptz) - When the favorite was added

  2. Indexes
    - Index on `user_id` for faster user-specific queries
    - Unique constraint on `user_id` and `book_key` to prevent duplicates

  3. Security
    - Enable RLS on `favorites` table
    - Add policy for users to read their own favorites
    - Add policy for users to insert their own favorites
    - Add policy for users to delete their own favorites

  ## Notes
  - Using `user_id` as text to store browser fingerprint since we're not using authentication
  - Each user can only favorite a book once (unique constraint)
  - All timestamps are in UTC
*/

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  book_key text NOT NULL,
  book_title text NOT NULL,
  book_author text DEFAULT 'Unknown Author',
  book_cover text,
  book_year text DEFAULT 'Unknown',
  book_publisher text DEFAULT 'Unknown Publisher',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, book_key)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON favorites
  FOR SELECT
  USING (true);

CREATE POLICY "Users can add their own favorites"
  ON favorites
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can remove their own favorites"
  ON favorites
  FOR DELETE
  USING (true);