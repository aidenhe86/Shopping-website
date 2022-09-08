import React, { useState, useEffect } from "react";
import ShoppingApi from "../api";
import CategoryDetail from "./CategoryDetail";
import { Container } from "react-bootstrap";

// Show a list of categories
const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  // first load show all categories
  useEffect(() => {
    list();
  }, []);

  const list = async () => {
    let categories = await ShoppingApi.getCategories();
    setCategories(categories);
  };

  return (
    <Container>
      <div className="CategoryList d-grid gap-5">
        {categories.map((c) => (
          <CategoryDetail key={c.category} cat={c.category} />
        ))}
      </div>
    </Container>
  );
};

export default CategoryList;
