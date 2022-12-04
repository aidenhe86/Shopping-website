import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import CategoryDetail from "./CategoryDetail";
import useGetCategories from "../hooks/useGetCategories";

// Show a list of categories
const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const getCategories = useGetCategories();
  // first load show all categories
  useEffect(() => {
    const list = async () => {
      let categories = await getCategories();
      setCategories(categories);
    };
    list();
  }, [getCategories]);

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
