"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/input/textarea";
import Select from "@/components/ui/input/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useQuiz, useUpdateQuiz } from "@/hooks/use-quizzes";

export default function EditQuizPage() {
    const router = useRouter();
    const params = useParams();
    const quizId = Number(params.id);

    const { data: quiz, isLoading } = useQuiz(quizId, true);
    const updateMutation = useUpdateQuiz();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        passingScore: 70,
        timeLimitMinutes: 30,
    });

    useEffect(() => {
        if (quiz) {
            setFormData({
                title: quiz.title || "",
                description: quiz.description || "",
                passingScore: quiz.passingScore || 70,
                timeLimitMinutes: quiz.timeLimitMinutes || 30,
            });
        }
    }, [quiz]);

    const handleSave = () => {
        updateMutation.mutate(
            { quizId, data: formData },
            { onSuccess: () => router.push(`/dashboard/quizzes/${quizId}`) }
        );
    };

    if (isLoading) return <LoadingSpinner message="Loading quiz..." className="py-32" />;
    if (!quiz) return <div className="py-32 text-center text-error-500">Quiz not found</div>;

    return (
        <div className="flex flex-col gap-6 px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-neutral-50 rounded-md">
                    <ArrowLeft className="w-6 h-6 text-secondary-500" />
                </button>
                <h1 className="text-3xl font-bold text-secondary-500">Edit Quiz</h1>
            </div>

            <div className="flex flex-col gap-6 max-w-2xl">
                <h2 className="text-xl font-semibold text-secondary-500">Basic Information</h2>
                <div className="flex flex-col gap-4">
                    <Input
                        label="Quiz Title*"
                        value={formData.title}
                        onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                        fullWidth
                    />
                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                        fullWidth
                    />
                    <Input
                        label="Passing Score (%)"
                        type="number"
                        value={formData.passingScore}
                        onChange={(e) => setFormData((p) => ({ ...p, passingScore: Number(e.target.value) }))}
                        fullWidth
                    />
                    <Input
                        label="Time Limit (minutes)"
                        type="number"
                        value={formData.timeLimitMinutes}
                        onChange={(e) => setFormData((p) => ({ ...p, timeLimitMinutes: Number(e.target.value) }))}
                        fullWidth
                    />
                </div>
            </div>

            <div className="flex gap-4 justify-end pt-6 border-t border-border-500 max-w-2xl">
                <Button variant="secondary" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}