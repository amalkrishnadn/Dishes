import React, { useEffect, useState } from "react";
import "./recipes.css";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = async () => {
    try {
      const response = await fetch("https://dummyjson.com/recipes");
      const data = await response.json();

      setRecipes(data.recipes);
    } catch (error) {
      console.log(error);
    }
  };

  // Get unique cuisines
  const cuisines = ["All", ...new Set(recipes.map((recipe) => recipe.cuisine))];

  // Search + Cuisine Filter
  let filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCuisine =
      selectedCuisine === "All" || recipe.cuisine === selectedCuisine;

    const matchesFavorites = !showFavorites || favorites.includes(recipe.id);

    return matchesSearch && matchesCuisine && matchesFavorites;
  });

  // Sorting
  if (sortBy === "rating") {
    filteredRecipes.sort((a, b) => b.rating - a.rating);
  }

  if (sortBy === "time") {
    filteredRecipes.sort((a, b) => a.prepTimeMinutes - b.prepTimeMinutes);
  }

  if (sortBy === "name") {
    filteredRecipes.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Favorite toggle
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Statistics
  const totalRecipes = recipes.length;

  const averageRating =
    recipes.length > 0
      ? (
          recipes.reduce((total, recipe) => total + recipe.rating, 0) /
          recipes.length
        ).toFixed(1)
      : 0;

  const totalCuisines = new Set(recipes.map((recipe) => recipe.cuisine)).size;

  return (
    <div className="recipes-page">
      {/* NAVBAR */}

      <nav className="navbar">
        <div className="logo">
          SAVOR<span>IA</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#recipes">Recipes</a>
          <button
            className={`favorites-nav ${showFavorites ? "active" : ""}`}
            onClick={() => {
              setShowFavorites(!showFavorites);
              setSelectedCuisine("All");
            }}
          >
            Favorites ❤️ {favorites.length}
          </button>
        </div>
      </nav>

      {/* HERO */}

      <section className="hero" id="home">
        <p className="subtitle">DISCOVER • COOK • ENJOY</p>

        <h1>
          Delicious <span>Recipes</span>
        </h1>

        <p className="hero-text">
          Discover delicious recipes from around the world and find something
          new to cook today.
        </p>

        {/* SEARCH */}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for a recipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <span>⌕</span>
        </div>
      </section>

      {/* STATISTICS */}

      <section className="stats">
        <div className="stat">
          <h2>{totalRecipes}+</h2>
          <p>RECIPES</p>
        </div>

        <div className="stat">
          <h2>{averageRating}</h2>
          <p>AVG RATING</p>
        </div>

        <div className="stat">
          <h2>{totalCuisines}</h2>
          <p>CUISINES</p>
        </div>

        <div className="stat">
          <h2>{favorites.length}</h2>
          <p>FAVORITES</p>
        </div>
      </section>

      {/* RECIPES */}

      <main className="recipes-container" id="recipes">
        <div className="section-header">
          <div>
            <p className="small-title">OUR COLLECTION</p>

            <h2>{showFavorites ? "Your Favorites" : "Explore Recipes"}</h2>
          </div>

          {/* SORT */}

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Sort By</option>

            <option value="rating">Highest Rated</option>

            <option value="time">Quickest First</option>

            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* CUISINE FILTER */}

        <div className="cuisine-filter">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              className={selectedCuisine === cuisine ? "active" : ""}
              onClick={() => setSelectedCuisine(cuisine)}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {/* RECIPE GRID */}

        <div className="recipe-grid">
          {filteredRecipes.length === 0 ? (
            <div className="no-results">
              <h2>No recipes found 😕</h2>
              <p>Try searching for something else.</p>
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <div className="recipe-card" key={recipe.id}>
                {/* IMAGE */}

                <div className="image-container">
                  <img src={recipe.image} alt={recipe.name} />

                  <span className="rating">★ {recipe.rating}</span>

                  {/* FAVORITE */}

                  <button
                    className={`favorite ${
                      favorites.includes(recipe.id) ? "liked" : ""
                    }`}
                    onClick={() => toggleFavorite(recipe.id)}
                  >
                    {favorites.includes(recipe.id) ? "♥" : "♡"}
                  </button>
                </div>

                {/* CONTENT */}

                <div className="recipe-content">
                  <p className="cuisine">{recipe.cuisine}</p>

                  <h2>{recipe.name}</h2>

                  <div className="recipe-info">
                    <span>⏱ {recipe.prepTimeMinutes} min</span>

                    <span>🍽 {recipe.servings}</span>
                  </div>

                  <div className="tags">
                    {recipe.tags?.slice(0, 2).map((tag, index) => (
                      <span key={index}>{tag}</span>
                    ))}
                  </div>

                  <button
                    className="view-btn"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    Explore Recipe <span>→</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* RECIPE MODAL */}

      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedRecipe(null)}
            >
              ×
            </button>

            <img src={selectedRecipe.image} alt={selectedRecipe.name} />

            <div className="modal-content">
              <p className="cuisine">{selectedRecipe.cuisine}</p>

              <h2>{selectedRecipe.name}</h2>

              <div className="modal-info">
                <span>⭐ {selectedRecipe.rating}</span>

                <span>⏱ {selectedRecipe.prepTimeMinutes} min</span>

                <span>🍽 {selectedRecipe.servings}</span>
              </div>

              {/* INGREDIENTS */}

              <h3>Ingredients</h3>

              <ul>
                {selectedRecipe.ingredients?.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>

              {/* INSTRUCTIONS */}

              <h3>Instructions</h3>

              <ol>
                {selectedRecipe.instructions?.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
      {showFavorites && (
  <button
    className="back-recipes"
    onClick={() => setShowFavorites(false)}
  >
    ← Back to all recipes
  </button>
)}
    </div>
  );
};

export default Recipes;
