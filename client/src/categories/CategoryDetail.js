import React, { useState, useEffect } from "react";
import ItemList from "../items/ItemList";
import useGetCategory from "../hooks/useGetCategory";

/* Renders a category detail. */
const CategoryDetail = ({ cat }) => {
  const [items, setItem] = useState([]);
  const getCategory = useGetCategory();

  // first load show the category
  useEffect(() => {
    // get a list of item base on current category
    const list = async () => {
      let category = await getCategory(cat);
      setItem(category.items);
    };
    list();
  }, [cat, getCategory]);

  // upper case the first letter
  function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  return (
    <div className={cat}>
      <h3>{titleCase(cat)}</h3>
      <ItemList items={items} />
    </div>
  );
};

export default CategoryDetail;
