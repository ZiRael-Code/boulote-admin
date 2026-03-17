import axiosInstance from "../axios-config";

export async function getCommunityDashboard() {
    const response = await axiosInstance.get("/admin/community/dashboard");
    return response.data;
}

export async function getFlaggedContent(params: {
    search?: string;
    reason?: string;
    type?: string;
    page?: number;
    size?: number;
}) {
    const p = new URLSearchParams();
    if (params.search) p.append("search", params.search);
    if (params.reason) p.append("reason", params.reason);
    if (params.type) p.append("type", params.type);
    p.append("page", String(params.page ?? 0));
    p.append("size", String(params.size ?? 10));
    const response = await axiosInstance.get(`/admin/community/flags?${p.toString()}`);
    return response.data;
}

export async function approveFlag(flagId: number) {
    await axiosInstance.post(`/admin/community/flags/${flagId}/approve`);
}

export async function removeFlaggedContent(flagId: number) {
    await axiosInstance.post(`/admin/community/flags/${flagId}/remove`);
}

export async function bulkApproveFlags(flagIds: number[]) {
    const response = await axiosInstance.post("/admin/community/flags/bulk-approve", flagIds);
    return response.data;
}

export async function bulkRemoveFlags(flagIds: number[]) {
    const response = await axiosInstance.post("/admin/community/flags/bulk-remove", flagIds);
    return response.data;
}

export async function getCommunityUsers(params: {
    search?: string;
    banned?: boolean;
    page?: number;
    size?: number;
}) {
    const p = new URLSearchParams();
    if (params.search) p.append("search", params.search);
    if (params.banned !== undefined) p.append("banned", String(params.banned));
    p.append("page", String(params.page ?? 0));
    p.append("size", String(params.size ?? 10));
    const response = await axiosInstance.get(`/admin/community/users?${p.toString()}`);
    return response.data;
}

export async function banUser(userId: number, reason: string, bannedUntil?: string) {
    await axiosInstance.post(`/admin/community/users/${userId}/ban`, { reason, bannedUntil });
}

export async function unbanUser(userId: number) {
    await axiosInstance.post(`/admin/community/users/${userId}/unban`);
}

export async function editQuestion(questionId: number, data: { title?: string; content?: string }) {
    await axiosInstance.put(`/admin/community/content/question/${questionId}`, data);
}

export async function editAnswer(answerId: number, data: { content: string }) {
    await axiosInstance.put(`/admin/community/content/answer/${answerId}`, data);
}

export async function getAllContent(params: {
    search?: string;
    type?: string;
    page?: number;
    size?: number;
}) {
    const p = new URLSearchParams();
    if (params.search) p.append("search", params.search);
    if (params.type) p.append("type", params.type);
    p.append("page", String(params.page ?? 0));
    p.append("size", String(params.size ?? 10));
    const response = await axiosInstance.get(`/admin/community/content?${p.toString()}`);
    return response.data;
}