"use server";
import Link from "next/link";
import React from "react";
import StudentRegistrationForm from "../_components/student/StudentRegistrationForm";
import { getAllProgramsAction } from "../_actions/programActions";
import { getAllDepartmentsAction } from "../_actions/departmentActions";

const StudentRegistrationPage = async () => {
  const programResult = await getAllProgramsAction({});
  const departmentResult = await getAllDepartmentsAction();
  const programs = programResult?.data || [];
  const departments = departmentResult?.data || [];
  return (
    <div className="grid lg:grid-cols-3">
      <div className="col-span-3 flex flex-col gap-4">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <StudentRegistrationForm
              programs={programs}
              departments={departments}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationPage;
