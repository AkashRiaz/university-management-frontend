"use server";
import Link from "next/link";
import React from "react";
import StudentRegistrationForm from "../_components/StudentRegistration/StudentRegistrationForm";
import { getAllProgramsAction } from "../_actions/programActions";

const StudentRegistrationPage = async () => {
  const programResult = await getAllProgramsAction();
   const programs = programResult?.data || [];
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="flex flex-col col-span-3 gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <StudentRegistrationForm programs={programs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationPage;
