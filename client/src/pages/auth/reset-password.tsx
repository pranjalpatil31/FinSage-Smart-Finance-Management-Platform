import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useResetPasswordMutation } from "@/features/auth/authAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";

type FormValues = { password: string; confirmPassword: string };

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const location = useLocation();

  // read token from either query or state:
  const token =
    new URLSearchParams(location.search).get("token") ||
    // if you prefer path param, you can read from useParams in router
    "";

  const form = useForm<FormValues>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (values: FormValues) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    resetPassword({ token, password: values.password })
      .unwrap()
      .then(() => {
        toast.success("Password reset successful. Please sign in.");
        navigate(AUTH_ROUTES.SIGN_IN);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.data?.message || "Failed to reset password");
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create a new password</h1>
          <p className="text-sm text-muted-foreground">
            Set a new password for your account.
          </p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="New password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPassword;
