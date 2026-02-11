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
import { useForgotPasswordMutation } from "@/features/auth/authAPI";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";

type FormValues = { email: string };

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<FormValues>({
    defaultValues: { email: "" },
  });

  const onSubmit = (values: FormValues) => {
    forgotPassword(values)
      .unwrap()
      .then(() => {
        toast.success("If that email exists, we sent a reset link. Check your inbox.");
        // Optionally navigate to a "check your email" page:
        // navigate(AUTH_ROUTES.SIGN_IN);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.data?.message || "Failed to request password reset");
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter the email address associated with your account.
          </p>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => navigate(AUTH_ROUTES.SIGN_IN)}
              className="underline underline-offset-2"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPassword;