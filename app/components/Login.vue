<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const fields = ref<AuthFormField[]>([
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
]);

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    await auth.login({ email: payload.data.email, password: payload.data.password });
    toast.add({ title: "Success", description: "Login successful!", color: "success" });
    router.push("/dashboard");
  } catch (error: any) {
    toast.add({
      title: "Login Failed",
      description: error.data?.statusMessage || "Invalid credentials",
      color: "error",
    });
  }
}
</script>

<template>
  <UAuthForm
    title="Sign in to your account"
    description="Welcome back! Please sign in to continue"
    :fields="fields"
    :schema="schema"
    submit-button="Sign In"
    class="max-w-xl"
    @submit="onSubmit"
  />
</template>
