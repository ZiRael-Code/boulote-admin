import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    getCommunityDashboard,
    getFlaggedContent,
    approveFlag,
    removeFlaggedContent,
    bulkApproveFlags,
    bulkRemoveFlags,
    getCommunityUsers,
    banUser,
    unbanUser,
    getAllContent,
} from "@/lib/api/services/community";

export function useCommunityDashboard() {
    return useQuery({
        queryKey: ["community", "dashboard"],
        queryFn: getCommunityDashboard,
    });
}

export function useFlaggedContent(params: {
    search?: string;
    reason?: string;
    type?: string;
    page?: number;
}) {
    return useQuery({
        queryKey: ["community", "flags", params],
        queryFn: () => getFlaggedContent({ ...params, size: 10 }),
        keepPreviousData: true,
    });
}

export function useApproveFlag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (flagId: number) => approveFlag(flagId),
        onSuccess: () => {
            toast.success("Flag approved");
            queryClient.invalidateQueries({ queryKey: ["community"] });
        },
        onError: () => toast.error("Failed to approve flag"),
    });
}

export function useRemoveFlag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (flagId: number) => removeFlaggedContent(flagId),
        onSuccess: () => {
            toast.success("Content removed");
            queryClient.invalidateQueries({ queryKey: ["community"] });
        },
        onError: () => toast.error("Failed to remove content"),
    });
}

export function useBulkApproveFlags() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (flagIds: number[]) => bulkApproveFlags(flagIds),
        onSuccess: (data) => {
            toast.success(`${data.successCount} flags approved`);
            queryClient.invalidateQueries({ queryKey: ["community"] });
        },
        onError: () => toast.error("Bulk approve failed"),
    });
}

export function useBulkRemoveFlags() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (flagIds: number[]) => bulkRemoveFlags(flagIds),
        onSuccess: (data) => {
            toast.success(`${data.successCount} items removed`);
            queryClient.invalidateQueries({ queryKey: ["community"] });
        },
        onError: () => toast.error("Bulk remove failed"),
    });
}

export function useCommunityUsers(params: {
    search?: string;
    banned?: boolean;
    page?: number;
}) {
    return useQuery({
        queryKey: ["community", "users", params],
        queryFn: () => getCommunityUsers({ ...params, size: 10 }),
        keepPreviousData: true,
    });
}

import { editQuestion, editAnswer } from "@/lib/api/services/community";

export function useEditQuestion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { title?: string; content?: string } }) =>
            editQuestion(id, data),
        onSuccess: () => {
            toast.success("Question updated");
            queryClient.invalidateQueries({ queryKey: ["community", "content"] });
        },
        onError: () => toast.error("Failed to update question"),
    });
}

export function useEditAnswer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { content: string } }) =>
            editAnswer(id, data),
        onSuccess: () => {
            toast.success("Answer updated");
            queryClient.invalidateQueries({ queryKey: ["community", "content"] });
        },
        onError: () => toast.error("Failed to update answer"),
    });
}

export function useBanUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, reason, bannedUntil }: { userId: number; reason: string; bannedUntil?: string }) =>
            banUser(userId, reason, bannedUntil),
        onSuccess: () => {
            toast.success("User banned");
            queryClient.invalidateQueries({ queryKey: ["community", "users"] });
        },
        onError: () => toast.error("Failed to ban user"),
    });
}

export function useUnbanUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: number) => unbanUser(userId),
        onSuccess: () => {
            toast.success("User unbanned");
            queryClient.invalidateQueries({ queryKey: ["community", "users"] });
        },
        onError: () => toast.error("Failed to unban user"),
    });
}

export function useAllContent(params: {
    search?: string;
    type?: string;
    page?: number;
}) {
    return useQuery({
        queryKey: ["community", "content", params],
        queryFn: () => getAllContent({ ...params, size: 10 }),
        keepPreviousData: true,
    });
}