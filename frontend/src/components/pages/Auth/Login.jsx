import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button.jsx";
import { Input } from "../../ui/input.jsx";
import { Label } from "../../ui/label.jsx";
import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils.js";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../ui/use-toast.js";
import { useFormik } from "formik";
import { loginSchema } from "@/validation/schemas.js";
import { useLoginUserMutation } from "@/store/slices/userSlices.js";

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [succcessMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();
  const { values, errors, handleSubmit, handleChange } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      try {
        const response = await loginUser(values);

        if (response.data) {
          setSuccessMessage(response.data);
          setErrorMessage("");
          action.resetForm();
          setLoading(false);
          navigate("/");
        }
        if (response.error) {
          console.log(response.error);
          toast({
            title: "Oops Error",
            variant: "destructive",
            description: response.error.data.message,
          });
          setSuccessMessage("");
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },
  });

  return (
    <div className="container h-screen flex items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign In Into an Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to sign to your account
            </p>
          </div>
          <div className={cn("grid gap-6")}>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="sr-only">Email</Label>

                  <Input
                    className="mt-2"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    auto-capitalize="none"
                    auto-complete="email"
                    auto-correct="off"
                    onChange={handleChange}
                  />
                  <Input
                    className="mt-2"
                    id="password"
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={handleChange}
                  />
                </div>
                <Button>Sign In with Email</Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  <Link to="/signup">Don't have an account?</Link>
                </span>
              </div>
            </div>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>
            and
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
