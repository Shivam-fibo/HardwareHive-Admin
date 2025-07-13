import React from "react";
import MachineryForm from "../components/Category/MachineryForm";
import SparePartForm from "../components/Category/SparePartForm";
import BrandForm from "../components/Category/BrandForm";
import AccessiersForm from "../components/Category/AccessiersForm";

const Category = () => {
  return (
    <div className="flex min-h-screen divide-x">
      <MachineryForm />
      <SparePartForm />
      <BrandForm />
      <AccessiersForm />
    </div>
  );
};

export default Category;
