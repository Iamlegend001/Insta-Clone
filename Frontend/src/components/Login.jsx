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
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Loader icon

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/");
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <Card className="w-[400px] p-6 shadow-xl border border-gray-200 rounded-2xl">
        <form onSubmit={signupHandler}>
          <CardHeader className="text-center mb-4">
            <CardTitle className="text-2xl font-bold">LOGO</CardTitle>
            <CardDescription>
              Login to see photos and videos of your friends.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
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

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center text-sm mt-2 text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Signup
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default Login;
