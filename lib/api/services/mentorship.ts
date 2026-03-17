import axiosInstance from "../axios-config";

export async function getMentorshipDashboard() {
    const response = await axiosInstance.get("/admin/mentorship/dashboard");
    return response.data;
}

export async function getPendingApplications(params: { search?: string; industry?: string }) {
    const p = new URLSearchParams();
    if (params.search) p.append("search", params.search);
    if (params.industry) p.append("industry", params.industry);
    const response = await axiosInstance.get(`/admin/mentorship/applications/pending?${p.toString()}`);
    return response.data;
}

export async function getActivePairs(params: { search?: string; industry?: string }) {
    const p = new URLSearchParams();
    if (params.search) p.append("search", params.search);
    if (params.industry) p.append("industry", params.industry);
    const response = await axiosInstance.get(`/admin/mentorship/pairs/active?${p.toString()}`);
    return response.data;
}

export async function getEligibleMentors(params: { search?: string; industry?: string }) {
    const p = new URLSearchParams();
    if (params.search) p.append("search", params.search);
    if (params.industry) p.append("industry", params.industry);
    const response = await axiosInstance.get(`/admin/mentorship/mentors/eligible?${p.toString()}`);
    return response.data;
}

export async function getEligibleMentorsForApplication(applicationId: number) {
    const response = await axiosInstance.get(`/admin/mentorship/applications/${applicationId}/eligible-mentors`);
    return response.data;
}

export async function getMenteeRequirements(applicationId: number) {
    const response = await axiosInstance.get(`/admin/mentorship/applications/${applicationId}/requirements`);
    return response.data;
}

export async function assignMentor(applicationId: number, mentorId: number) {
    const response = await axiosInstance.post(`/admin/mentorship/applications/${applicationId}/assign/${mentorId}`);
    return response.data;
}

export async function reassignMentor(applicationId: number, newMentorId: number) {
    const response = await axiosInstance.post(`/admin/mentorship/pairs/${applicationId}/reassign/${newMentorId}`);
    return response.data;
}

export async function endMentorship(applicationId: number) {
    await axiosInstance.post(`/admin/mentorship/pairs/${applicationId}/end`);
}

export async function declineRequest(applicationId: number) {
    await axiosInstance.post(`/admin/mentorship/applications/${applicationId}/decline`);
}