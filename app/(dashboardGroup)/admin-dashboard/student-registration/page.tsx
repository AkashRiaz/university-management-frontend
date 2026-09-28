"use server";
import Link from "next/link";
import React from "react";
import StudentRegistrationForm from "../_components/StudentRegistration/StudentRegistrationForm";
import { getAllProgramsAction } from "../_actions/programActions";
import { getAllDepartmentsAction } from "../_actions/departmentActions";

const StudentRegistrationPage = async () => {
  const programResult = await getAllProgramsAction();
  const departmentResult = await getAllDepartmentsAction();
  const programs = programResult?.data || [];
  const departments = departmentResult?.data || [];
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="flex flex-col col-span-3 gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <StudentRegistrationForm programs={programs} departments={departments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationPage;
