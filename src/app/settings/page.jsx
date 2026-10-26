
"use client";

import { useState } from "react";
import { authClient, changePassword } from "@/lib/auth-client";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [revokeSessions, setRevokeSessions] = useState(true);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      toast.danger("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.danger("New password must be different.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await changePassword({
        currentPassword: currentPassword.toString(),
        newPassword: newPassword.toString(),
        revokeOtherSessions: revokeSessions,
      });

      if (error) {
        console.error("Change password error:", error);
        toast.danger(
          error.message || "Failed to change password."
        );
        return;
      }

      console.log("Password changed:", data);
      toast.success("Password changed successfully!");
      e.currentTarget.reset();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.danger("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-default-200 bg-background p-6 shadow-lg sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Change Password
          </h1>
          <p className="mt-2 text-sm text-default-500">
            Update your password to keep your account secure.
          </p>
        </div>

        <Form
          className="w-full"
          onSubmit={handleChangePassword}
        >
          <Fieldset className="w-full">
            <FieldGroup>
              <TextField
                name="currentPassword"
                type="password"
                isRequired
              >
                <Label>Current Password</Label>
                <Input
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
                <FieldError />
              </TextField>

              <TextField
                name="newPassword"
                type="password"
                isRequired
                minLength={8}
                validate={(value) => {
                  if (value.length < 8) {
                    return "Password must be at least 8 characters.";
                  }
                  return null;
                }}
              >
                <Label>New Password</Label>
                <Input
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
                <Description>
                  Use at least 8 characters.
                </Description>
                <FieldError />
              </TextField>

              <TextField
                name="confirmPassword"
                type="password"
                isRequired
              >
                <Label>Confirm New Password</Label>
                <Input
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                <FieldError />
              </TextField>
            </FieldGroup>

            <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 size-4 accent-black"
                checked={revokeSessions}
                onChange={(e) =>
                  setRevokeSessions(e.target.checked)
                }
              />
              <span>
                <span className="font-medium">
                  Sign out other devices
                </span>
                <span className="mt-1 block text-default-500">
                  Invalidate other active sessions after changing
                  your password.
                </span>
              </span>
            </label>

            <Button
              type="submit"
              className="mt-6 w-full"
              isDisabled={loading}
            >
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          </Fieldset>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
