import Footer from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { getMe } from "@/service/getMe";
import React from "react";

const PublicGroupLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getMe();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <div id="main-content" className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default PublicGroupLayout;
