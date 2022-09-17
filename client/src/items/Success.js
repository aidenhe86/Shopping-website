import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ShoppingApi from "../api";

const Success = () => {
  // first load show all categories
  const id = useParams().id;

  useEffect(() => {
    const success = async () => {
      await ShoppingApi.success(id);
    };
    success();
  }, [id]);

  return (
    <div className="Common">
      <h1>Purchase Successfully! Thank you for your purchase!</h1>
    </div>
  );
};

export default Success;
