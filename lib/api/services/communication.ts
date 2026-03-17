import axiosInstance from "../axios-config";

export async function getCommunicationDashboard() {
    const response = await axiosInstance.get("/admin/communication/dashboard");
    return response.data;
}

export async function createAnnouncement(data: {
    title: string;
    message: string;
    targetAudience: string;
}) {
    const params = new URLSearchParams();
    params.append("title", data.title);
    params.append("message", data.message);
    params.append("targetAudience", data.targetAudience);
    const response = await axiosInstance.post(`/admin/communication/announcements?${params.toString()}`);
    return response.data;
}

export async function saveDraft(data: {
    title: string;
    message: string;
    targetAudience: string;
}) {
    const params = new URLSearchParams();
    params.append("title", data.title);
    params.append("message", data.message);
    params.append("targetAudience", data.targetAudience);
    const response = await axiosInstance.post(`/admin/communication/announcements/draft?${params.toString()}`);
    return response.data;
}

export async function sendAnnouncement(id: number) {
    await axiosInstance.post(`/admin/communication/announcements/${id}/send`);
}

export async function getPreviousAnnouncements() {
    const response = await axiosInstance.get("/admin/communication/announcements/previous");
    return response.data;
}

export async function getJobPostings() {
    const response = await axiosInstance.get("/admin/communication/job-invites/jobs");
    return response.data;
}

export async function getMatchingProfessionals(
    jobId: number,
    params: { search?: string; industry?: string; rating?: string; sortBy?: string }
) {
    const p = new URLSearchParams();
    if (params.search) p.append("search", params.search);
    if (params.industry) p.append("industry", params.industry);
    if (params.rating) p.append("rating", params.rating);
    if (params.sortBy) p.append("sortBy", params.sortBy);
    const response = await axiosInstance.get(
        `/admin/communication/job-invites/jobs/${jobId}/professionals?${p.toString()}`
    );
    return response.data;
}

export async function sendJobInvites(jobId: number, professionalIds: number[]) {
    await axiosInstance.post("/admin/communication/job-invites/send", {
        jobId,
        professionalIds,
    });
}

export async function getSystemAlerts(params: { type?: string; priority?: string }) {
    const p = new URLSearchParams();
    if (params.type) p.append("type", params.type);
    if (params.priority) p.append("priority", params.priority);
    const response = await axiosInstance.get(`/admin/communication/system-alerts?${p.toString()}`);
    return response.data;
}