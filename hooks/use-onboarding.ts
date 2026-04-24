import { useQuery } from "@tanstack/react-query";
import { onboardingService } from "@/lib/api/services/onboarding";

export const useOnboardingData = () => {
    return useQuery({
        queryKey: ["onboarding-data"],
        queryFn: () => onboardingService.getOnboardingData(),
        staleTime: 10 * 60 * 1000,
    });
};