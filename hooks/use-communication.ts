import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    getCommunicationDashboard,
    createAnnouncement,
    saveDraft,
    sendAnnouncement,
    getPreviousAnnouncements,
    getJobPostings,
    getMatchingProfessionals,
    sendJobInvites,
    getSystemAlerts,
} from "@/lib/api/services/communication";

export function useCommunicationDashboard() {
    return useQuery({
        queryKey: ["communication", "dashboard"],
        queryFn: getCommunicationDashboard,
    });
}

export function usePreviousAnnouncements(enabled = true) {
    return useQuery({
        queryKey: ["communication", "announcements"],
        queryFn: getPreviousAnnouncements,
        enabled,
    });
}

export function useCreateAnnouncement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { title: string; message: string; targetAudience: string }) =>
            createAnnouncement(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["communication", "announcements"] });
            return data;
        },
        onError: () => toast.error("Failed to create announcement"),
    });
}

export function useSaveDraft() {
    return useMutation({
        mutationFn: (data: { title: string; message: string; targetAudience: string }) =>
            saveDraft(data),
        onSuccess: () => toast.success("Draft saved"),
        onError: () => toast.error("Failed to save draft"),
    });
}

export function useSendAnnouncement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => sendAnnouncement(id),
        onSuccess: () => {
            toast.success("Announcement sent successfully");
            queryClient.invalidateQueries({ queryKey: ["communication"] });
        },
        onError: () => toast.error("Failed to send announcement"),
    });
}

export function useJobPostings(enabled = true) {
    return useQuery({
        queryKey: ["communication", "job-postings"],
        queryFn: getJobPostings,
        enabled,
    });
}

export function useMatchingProfessionals(
    jobId: number | null,
    params: { search?: string; industry?: string; rating?: string; sortBy?: string },
    enabled = true
) {
    return useQuery({
        queryKey: ["communication", "matching-professionals", jobId, params],
        queryFn: () => getMatchingProfessionals(jobId!, params),
        enabled: enabled && !!jobId,
        keepPreviousData: true,
    });
}

export function useSendJobInvites() {
    return useMutation({
        mutationFn: ({ jobId, professionalIds }: { jobId: number; professionalIds: number[] }) =>
            sendJobInvites(jobId, professionalIds),
        onSuccess: () => toast.success("Job invites sent successfully"),
        onError: () => toast.error("Failed to send job invites"),
    });
}

export function useSystemAlerts(
    params: { type?: string; priority?: string },
    enabled = true
) {
    return useQuery({
        queryKey: ["communication", "system-alerts", params],
        queryFn: () => getSystemAlerts(params),
        enabled,
    });
}