
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";
import { resetPassword } from "@/lib/auth-client";

const ResetPassForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPass = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.danger("Invalid or missing reset token.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword");

    if (
      typeof newPassword !== "string" ||
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      toast.danger(
        "Password must be at least 8 characters with 1 uppercase letter and 1 number."
      );
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await resetPassword({
        newPassword,
        token,
      });

      if (error) {
        toast.danger(
          error.message || "Failed to reset password."
        );
        return;
      }

      toast.success("Your password has been reset successfully.");
      e.currentTarget.reset();
    } catch (error) {
      console.error("Password reset error:", error);
      toast.danger("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-default-200 p-6 shadow-lg">
      <h3 className="mb-2 text-2xl font-bold">
        Reset Your Password
      </h3>

      <p className="mb-6 text-sm text-default-500">
        Enter a new password for your account.
      </p>

      <Form
        className="flex w-full flex-col gap-5"
        onSubmit={handleResetPass}
      >
        <TextField
          isRequired
          minLength={8}
          name="newPassword"
          type="password"
          className="w-full"
          validate={(value) => {
            if (value.length < 8) {
              return "Password must be at least 8 characters.";
            }

            if (!/[A-Z]/.test(value)) {
              return "Password must contain at least one uppercase letter.";
            }

            if (!/[0-9]/.test(value)) {
              return "Password must contain at least one number.";
            }

            return null;
          }}
        >
          <Label>New Password</Label>
          <Input
            placeholder="Enter your new password"
            autoComplete="new-password"
          />
          <Description>
            At least 8 characters, 1 uppercase letter, and 1 number.
          </Description>
          <FieldError />
        </TextField>

        <div className="flex w-full gap-3">
          <Button
            type="submit"
            isDisabled={isLoading || !token}
            className="flex-1"
          >
            <Check />
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>

          <Button
            type="reset"
            variant="secondary"
            isDisabled={isLoading}
          >
            Clear
          </Button>
        </div>
      </Form>
    </div>
  );
};

const ResetPassPage = () => {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center">
          Loading password reset form...
        </div>
      }
    >
      <ResetPassForm />
    </Suspense>
  );
};

export default ResetPassPage;








///////////

// 'use client',
// import { useSearchParams } from "next/navigation";
// import {Check} from "@gravity-ui/icons";
// import {Button, Description, FieldError, Form, Input, Label, TextField, toast} from "@heroui/react";
// import { resetPassword } from "@/lib/auth-client";




// const ResetPassForm = () => {
//      const searchParams = useSearchParams();
//      const token = searchParams.get('token');

//      const handleResetPass = async(e) => {
//        e.preventDefault();
//        const formData = new FormData(e.currentTarget);
//        const userData = Object.fromEntries(formData.entries());

//        const resData = await resetPassword({
//         newPassword: userData.newPassword, // required, The new password to set
//     token,
//        })

//        console.log('after submit reset data', resData);
//        toast.success('Your password reset successfully')
//      }
//     return (
//         <div>
//             <h3>Now Give Me New Password</h3>
//              <Form className="flex w-96 flex-col gap-4" onSubmit={handleResetPass}>
      
//       <TextField
//         isRequired
//         minLength={8}
//         name="password"
//         type="password"
//         validate={(value) => {
//           if (value.length < 8) {
//             return "Password must be at least 8 characters";
//           }
//           if (!/[A-Z]/.test(value)) {
//             return "Password must contain at least one uppercase letter";
//           }
//           if (!/[0-9]/.test(value)) {
//             return "Password must contain at least one number";
//           }
//           return null;
//         }}
//       >
//         <Label>Password</Label>
//         <Input placeholder="Enter your password" />
//         <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
//         <FieldError />
//       </TextField>
//       <div className="flex gap-2">
//         <Button type="submit">
//           <Check />
//           Submit
//         </Button>
//         <Button type="reset" variant="secondary">
//           Reset
//         </Button>
//       </div>
//     </Form>
//         </div>
//     );
// };

// export default ResetPassForm;