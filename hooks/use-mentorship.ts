import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getMentorshipDashboard,
  getPendingApplications,
  getActivePairs,
  getEligibleMentors,
  getEligibleMentorsForApplication,
  getMenteeRequirements,
  assignMentor,
  reassignMentor,
  endMentorship,
  declineRequest,
} from "@/lib/api/services/mentorship";

export function useMentorshipDashboard() {
  return useQuery({
    queryKey: ["mentorship", "dashboard"],
    queryFn: getMentorshipDashboard,
  });
}

export function usePendingApplications(params: {
  search?: string;
  industry?: string;
}) {
  return useQuery({
    queryKey: ["mentorship", "pending", params],
    queryFn: () => getPendingApplications(params),
  });
}

export function useActivePairs(params: { search?: string; industry?: string }) {
  return useQuery({
    queryKey: ["mentorship", "pairs", params],
    queryFn: () => getActivePairs(params),
  });
}

export function useEligibleMentors(params: {
  search?: string;
  industry?: string;
}) {
  return useQuery({
    queryKey: ["mentorship", "eligible-mentors", params],
    queryFn: () => getEligibleMentors(params),
  });
}

export function useEligibleMentorsForApplication(
  applicationId: number,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["mentorship", "eligible-mentors-for", applicationId],
    queryFn: () => getEligibleMentorsForApplication(applicationId),
    enabled: enabled && !!applicationId,
  });
}

export function useMenteeRequirements(applicationId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["mentorship", "requirements", applicationId],
    queryFn: () => getMenteeRequirements(applicationId),
    enabled: enabled && !!applicationId,
  });
}

export function useAssignMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      mentorId,
    }: {
      applicationId: number;
      mentorId: number;
    }) => assignMentor(applicationId, mentorId),
    onSuccess: () => {
      toast.success("Mentor assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["mentorship"] });
    },
    onError: () => toast.error("Failed to assign mentor"),
  });
}

export function useReassignMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      newMentorId,
    }: {
      applicationId: number;
      newMentorId: number;
    }) => reassignMentor(applicationId, newMentorId),
    onSuccess: () => {
      toast.success("Mentor reassigned successfully");
      queryClient.invalidateQueries({ queryKey: ["mentorship"] });
    },
    onError: () => toast.error("Failed to reassign mentor"),
  });
}

export function useEndMentorship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) => endMentorship(applicationId),
    onSuccess: () => {
      toast.success("Mentorship ended");
      queryClient.invalidateQueries({ queryKey: ["mentorship"] });
    },
    onError: () => toast.error("Failed to end mentorship"),
  });
}

export function useDeclineRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: number) => declineRequest(applicationId),
    onSuccess: () => {
      toast.success("Request declined");
      queryClient.invalidateQueries({ queryKey: ["mentorship"] });
    },
    onError: () => toast.error("Failed to decline request"),
  });
}
