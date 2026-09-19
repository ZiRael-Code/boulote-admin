import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getAdminActivitiesPage,
  getAdminNotificationsPage,
} from "@/lib/api/services/dashboard";

export function useAdminNotificationsPage(page: number, size = 10) {
  return useQuery({
    queryKey: ["admin-dashboard", "notifications", page, size],
    queryFn: () => getAdminNotificationsPage(page, size),
    placeholderData: keepPreviousData,
    retry: false,
  });
}

export function useAdminActivitiesPage(page: number, size = 10) {
  return useQuery({
    queryKey: ["admin-dashboard", "activities", page, size],
    queryFn: () => getAdminActivitiesPage(page, size),
    placeholderData: keepPreviousData,
    retry: false,
  });
}
