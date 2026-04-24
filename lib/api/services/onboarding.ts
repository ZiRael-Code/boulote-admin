import api from "../axios-config";

export type CompanyType = { id: number; name: string };

export type CompanySize = {
    id: number;
    employeesFrom: number;
    employeesTo: number;
    sizeRange: string | null;
};

export type Purpose = {
    id: number;
    name: string;
    description: string;
    displayOrder: number;
    active: boolean;
};

export type GetCompaniesDetail = {
    companyTypes: CompanyType[];
    companySizes: CompanySize[];
};

export type OnboardingData = {
    purposes: Purpose[];
    paymentPlans: any[];
    currentStatus: string | null;
    selectedPurposes: Purpose[];
    selectedPaymentPlan: any | null;
    companyDetails: GetCompaniesDetail;
};

export type AdminCreateCompanyRequest = {
    companyName: string;
    email: string;
    companyType: string;
    companySize: string;
    purposeIds: number[];
};

export const onboardingService = {
    getOnboardingData: async (): Promise<OnboardingData> => {

        const response = await api.get("/admin/onboarding-data");
        return response.data;
    },

    adminCreateCompany: async (data: AdminCreateCompanyRequest): Promise<void> => {
        await api.post("/admin/company/create", data);
    },
};
