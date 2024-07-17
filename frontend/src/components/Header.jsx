import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useGetUserQuery } from "../store/slices/userSlices";

const Header = () => {
  const [user, setUser] = useState([]);
  const { data, isSuccess, isLoading } = useGetUserQuery();
  useEffect(() => {
    if (data && isSuccess) {
      setUser(data);
    }
  }, [data, isSuccess]);

  const navigate = useNavigate();
  function getInitials() {
    const initials = user.user?.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
    return initials;
  }

  if (isLoading && !isSuccess) {
    return null;
  }
  return (
    <nav className="flex items-center justify-between sticky z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <Link to="/" className="flex items-center gap-1">
        <p className="text-[26px] font-extrabold text-black max-sm:hidden font-Bricolage">
          ToDo List
        </p>
      </Link>
      <div className="flex items-center gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user?.profile} alt="@shadcn" />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <Button variant="ghost">
                <span>Log out</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Header;
