"use server";

import React from "react";
import InstructorRegistrationForm from "../_components/instructor/InstructorRegistrationForm";
import { getAllDepartmentsAction } from "../_actions/departmentActions";

const InstructorRegistrationPage = async () => {
  const departmentResult = await getAllDepartmentsAction();
  const departments = departmentResult?.data || [];
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="flex flex-col col-span-3 gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <InstructorRegistrationForm departments={departments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorRegistrationPage;
