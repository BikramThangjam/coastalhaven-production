import React from 'react';
import { useState, useEffect } from 'react';
import {categories} from "../data.js";
import "../styles/Categories.scss";
import {Link} from "react-router-dom";

// Shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const Categories = () => {

  const [randomCategories, setRandomCategories] = useState([]);

  useEffect(() => {
    // Filter out the category with label "all"
    const filteredCategories = categories.filter(category => category.label !== "All");

    // Shuffle the filtered categories array
    const shuffledCategories = shuffleArray(filteredCategories);

    // Slice the first 7 categories
    const randomCategoriesSlice = shuffledCategories.slice(0, 8);

    // Set the state with the random categories
    setRandomCategories(randomCategoriesSlice);
}, [categories]);
  
  return (
    <div className='categories'>
      <h1>Explore top categories</h1>
      <p>Discover our diverse vacation rentals for every traveler. Immerse in local culture, enjoy home comforts, and create lasting memories. Your dream destination awaits.</p>

      <div className='categories_list'>
          {
              randomCategories.map((category, index) => (
                  <Link to={`/properties/category/${category.label}`} key={index}>
                      <div className="category" >
                          <img src={category.img} alt={category.label} />
                          <div className="overlay"></div>
                        <div className="category_text">
                          <div className="category_text_icon">
                              {category.icon && <category.icon />}
                          </div>
                          <p>{category.label}</p>
                        </div>

                      </div>
                  </Link>
              ))
          }
      </div>
    </div>
  )
}

export default Categories
