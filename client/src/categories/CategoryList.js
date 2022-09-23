import React, { useState, useEffect, useRef } from "react";
import ShoppingApi from "../api";
import CategoryDetail from "./CategoryDetail";
import { Container } from "react-bootstrap";

// Show a list of categories
const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const isMounted = useRef(false);
  // first load show all categories
  useEffect(() => {
    isMounted.current = true;
    list();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const list = async () => {
    let categories = await ShoppingApi.getCategories();
    if (isMounted.current) {
      setCategories(categories);
    }
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
