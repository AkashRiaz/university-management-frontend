import Link from "next/link";
import React from "react";
import StudentRegistrationForm from "../_components/StudentRegistration/StudentRegistrationForm";

const StudentRegistrationPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="flex flex-col col-span-3 gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex items-center gap-2">
              {/* <Logo /> */}
              <span>PH Healthcare</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl">
            <StudentRegistrationForm />
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default StudentRegistrationPage;
