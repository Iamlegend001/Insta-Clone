import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Home,
  Search,
  PlayCircle,
  Send,
  Heart,
  PlusSquare,
  Menu,
} from "lucide-react";

// Sidebar icon array with label and optional profile flag
const sidebarItems = [
  { icon: Home, label: "Home" },
  { icon: Search, label: "Explore" },
  { icon: PlayCircle, label: "Reels" },
  { icon: Send, label: "Messages" },
  { icon: Heart, label: "Notifications" },
  { icon: PlusSquare, label: "Create" },
  { icon: Avatar, label: "Profile", isProfile: true },
  { icon: Menu, label: "More" },
];

const LeftSideBar = () => {
  return (
    <div className="w-64 min-h-screen border-r bg-white flex flex-col justify-between py-6 px-4">
      {/* Instagram Logo */}
      <div className="mb-8">
        <img
          src="/Picture/logo.png"
          alt="Instagram"
          className="h-10"
        />
      </div>

      {/* Sidebar Items */}
      <div className="flex flex-col gap-4">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 rounded-xl p-2 transition-all"
          >
            {item.isProfile ? (
              <Avatar className="w-6 h-6">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : (
              <item.icon className="w-6 h-6" />
            )}
            <span className="text-sm font-semibold">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Optional Footer */}
      <div className="text-xs text-gray-500 text-center mt-8">
        © 2025 Instagram Clone
      </div>
    </div>
  );
};

export default LeftSideBar;
