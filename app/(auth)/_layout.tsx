import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerLeft: () => null,
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="register" options={{ title: "Create account" }} />
      <Stack.Screen name="forgot-password" options={{ title: "Reset password" }} />
      <Stack.Screen
        name="change-password"
        options={{
          title: "Change password",
          headerLeft: () => null,
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}