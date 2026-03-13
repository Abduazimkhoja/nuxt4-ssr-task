<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const auth = useAuthStore();

const allItems = [
  {
    label: "Home",
    icon: "i-lucide-house",
    to: "/dashboard",
    roles: ["admin", "manager", "user"],
  },
  {
    label: "Inbox",
    icon: "i-lucide-inbox",
    badge: "4",
    to: "/inbox",
    roles: ["admin", "manager", "user"],
  },
  {
    label: "Contacts",
    icon: "i-lucide-users",
    to: "/contacts",
    roles: ["admin", "manager"],
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    defaultOpen: true,
    roles: ["admin", "manager", "user"],
    children: [
      { label: "General", to: "/settings", roles: ["admin", "manager", "user"] },
      { label: "Members", to: "/settings/members", roles: ["admin"] },
      { label: "Notifications", to: "/settings/notifications", roles: ["admin", "manager", "user"] },
    ],
  },
];

const items = computed<NavigationMenuItem[]>(() => {
  const role = auth.role;
  if (!role) return [];
  return allItems
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      children: item.children?.filter((c) => c.roles.includes(role)),
    }));
});
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      :ui="{ footer: 'border-t border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="text-2xl text-primary font-bold">Auth Task</div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="items"
          orientation="vertical"
        />
      </template>

      <template #footer>
        <UButton class="w-full justify-center" color="error" @click="auth.logout()">
          Logout
        </UButton>
      </template>
    </UDashboardSidebar>

    <div class="p-5">
      <slot />
    </div>
  </UDashboardGroup>
</template>	
