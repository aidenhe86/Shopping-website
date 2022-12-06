import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import CategoryDetail from "./CategoryDetail";
import useGetCategories from "../hooks/useGetCategories";

// Show a list of categories
const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const isMounted = useRef(false);
  const getCategories = useGetCategories();
  // first load show all categories
  useEffect(() => {
    isMounted.current = true;
    list();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);
  const list = async () => {
    let categories = await getCategories();
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
