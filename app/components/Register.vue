<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const fields = ref<AuthFormField[]>([
  {
    name: "name",
    type: "text",
    label: "Full Name",
    placeholder: "Enter your full name",
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Enter your password",
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm Password",
    placeholder: "Confirm your password",
  },
]);

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    await auth.register({ name: payload.data.name, email: payload.data.email, password: payload.data.password });
    toast.add({ title: "Success", description: "Registration successful!", color: "success" });
    router.push("/dashboard");
  } catch (error: any) {
    toast.add({
      title: "Registration Failed",
      description: error.data?.statusMessage || "Registration failed",
      color: "error",
    });
  }
}
</script>

<template>
  <UAuthForm
    title="Create your account"
    description="Fill in the details below to create your new account"
    :fields="fields"
    :schema="schema"
    submit-button="Create Account"
    class="max-w-xl"
    @submit="onSubmit"
  />
</template>
