import React from "react";
import CreateDepartmentForm from "../_components/CreateDepartment/CreateDepartmentForm";

const DepartmentCreatePage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="flex flex-col col-span-3 gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <CreateDepartmentForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCreatePage;
