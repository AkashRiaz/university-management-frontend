import React from "react";
import CreateProgramForm from "../_components/Program/CreateProgramForm";
import { getAllDepartmentsAction } from "../_actions/departmentActions";

const ProgramCreatePage = async () => {
  const departmentResult = await getAllDepartmentsAction();
  const departments = departmentResult?.data || [];
  return (
    <div className="grid lg:grid-cols-3">
      <div className="col-span-3 flex flex-col gap-4">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <CreateProgramForm departments={departments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCreatePage;
