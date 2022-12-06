import React, { useState, useEffect, useRef } from "react";
import ItemList from "../items/ItemList";
import useGetCategory from "../hooks/useGetCategory";

/* Renders a category detail. */
const CategoryDetail = ({ cat }) => {
  const [items, setItem] = useState([]);
  const isMounted = useRef(false);
  const getCategory = useGetCategory();

  // first load show the category
  useEffect(() => {
    isMounted.current = true;
    list();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  const list = async () => {
    let category = await getCategory(cat);
    if (isMounted.current) {
      setItem(category.items);
    }
  };

  // upper case the first letter
  function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  return (
    <div className={cat}>
      <h3 style={{ textAlign: "center" }}>{titleCase(cat)}</h3>
      <ItemList items={items} />
    </div>
  );
};

export default CategoryDetail;
