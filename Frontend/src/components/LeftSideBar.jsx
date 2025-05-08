import React from "react";
import {
  Home,
  Search,
  PlayCircle,
  Send,
  Heart,
  PlusSquare,
  User,
  Menu,
  LogOut,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const sidebarItems = [
  { icon: Home, text: "Home" },
  { icon: Search, text: "Explore" },
  { icon: PlayCircle, text: "Reels" },
  { icon: Send, text: "Messages" },
  { icon: Heart, text: "Notifications" },
  { icon: PlusSquare, text: "Create" },
  { icon: User, text: "Profile" },
  { icon: Menu, text: "More" },
];

const LeftSideBar = () => {
  return (
    <aside className="relative w-64 p-4 flex flex-col gap-6">
      {/* Navigation Items */}
      <div className="flex flex-col gap-6">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 rounded-xl p-2 transition-all"
          >
            <item.icon className="w-6 h-6" />
            <span className="text-base font-medium">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 rounded-xl p-2 transition-all">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="text-base font-medium">Profile</span>
        </div>

        <hr className="border-t border-gray-200" />

        <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 rounded-xl p-2 transition-all">
          <LogOut className="w-6 h-6" />
          <span className="text-base font-medium">Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
 