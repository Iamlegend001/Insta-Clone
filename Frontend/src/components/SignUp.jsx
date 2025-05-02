import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";

const SignUp = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "content-type": "application/json",
          },
          withCredentials: true,
        }
      );
      if(res.data.success){
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <Card className="w-[380px] shadow-xl border-none">
        <form onSubmit={signupHandler}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">LOGO</CardTitle>
            <CardDescription>
              Signup to see photos and videos of your friends.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                name="username"
                value={input.username}
                onChange={changeEventHandler}
                placeholder="Enter your username"
                className="mt-2"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="Enter your email"
                className="mt-2"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Enter your password"
                className="mt-2"
              />
            </div>

            <Button type="submit" className="mt-4 w-full">
              Sign Up
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
