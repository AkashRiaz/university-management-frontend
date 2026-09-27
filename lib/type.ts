import { IUser, IUserResponse } from "@/types";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type ISidebarItem = {
  label: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export type ISidebarGroup = {
  title: string;
  items: ISidebarItem[];
};

export interface NavbarProps {
  user: IUserResponse;
}
