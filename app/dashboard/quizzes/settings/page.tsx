"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/input/select";
import { useQuizSettings, useUpdateQuizSettings } from "@/hooks/use-quizzes";

export default function QuizSettingsPage() {
  const router = useRouter();
  const { data: settings, isLoading } = useQuizSettings(true);
  const updateMutation = useUpdateQuizSettings();

  const [formData, setFormData] = useState({
    defaultDuration: settings?.defaultDuration || 30,
    autoSaveInterval: settings?.autoSaveInterval || 30,
    defaultPassingScore: settings?.defaultPassingScore || 70,
    estimatedLevel: settings?.estimatedLevel || 30,
    maxQuestionsPerQuiz: settings?.maxQuestionsPerQuiz || 30,
    enabledQuestionTypes: settings?.enabledQuestionTypes || [],
    requireAuthentication: settings?.requireAuthentication || false,
    allowAnonymousAttempts: settings?.allowAnonymousAttempts || false,
    trackProgress: settings?.trackProgress || false,
    enablePublicSharing: settings?.enablePublicSharing || false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const handleQuestionTypeToggle = (type: string) => {
    setFormData((prev) => {
      const types = [...(prev.enabledQuestionTypes || [])];
      const index = types.indexOf(type as any);
      if (index > -1) {
        types.splice(index, 1);
      } else {
        types.push(type as any);
      }
      return { ...prev, enabledQuestionTypes: types };
    });
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleReset = () => {
    if (settings) {
      setFormData({
        defaultDuration: settings.defaultDuration,
        autoSaveInterval: settings.autoSaveInterval,
        defaultPassingScore: settings.defaultPassingScore,
        estimatedLevel: settings.estimatedLevel,
        maxQuestionsPerQuiz: settings.maxQuestionsPerQuiz,
        enabledQuestionTypes: settings.enabledQuestionTypes,
        requireAuthentication: settings.requireAuthentication,
        allowAnonymousAttempts: settings.allowAnonymousAttempts,
        trackProgress: settings.trackProgress,
        enablePublicSharing: settings.enablePublicSharing,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-neutral-50 rounded-md"
        >
          <ArrowLeft className="w-6 h-6 text-secondary-500" />
        </button>
        <h1 className="text-3xl font-bold text-secondary-500">Settings</h1>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-secondary-500">
          General Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Default quiz Duration*"
            type="number"
            value={formData.defaultDuration}
            onChange={(e) =>
              handleInputChange("defaultDuration", Number(e.target.value))
            }
            fullWidth
          />
          <Select
            label="Auto-Save Draft Interval"
            options={[
              { value: "10", label: "every 10 seconds" },
              { value: "30", label: "every 30 seconds" },
              { value: "60", label: "every 60 seconds" },
            ]}
            value={formData.autoSaveInterval.toString()}
            onChange={(e) =>
              handleInputChange("autoSaveInterval", Number(e.target.value))
            }
            fullWidth
          />
          <Input
            label="Default passing score (%)"
            type="number"
            value={formData.defaultPassingScore}
            onChange={(e) =>
              handleInputChange("defaultPassingScore", Number(e.target.value))
            }
            fullWidth
          />
          <Select
            label="Estimated level (minutes)"
            options={[
              { value: "15", label: "15" },
              { value: "30", label: "30" },
              { value: "45", label: "45" },
              { value: "60", label: "60" },
            ]}
            value={formData.estimatedLevel.toString()}
            onChange={(e) =>
              handleInputChange("estimatedLevel", Number(e.target.value))
            }
            fullWidth
          />
          <Input
            label="Maximum question per quiz"
            type="number"
            value={formData.maxQuestionsPerQuiz}
            onChange={(e) =>
              handleInputChange("maxQuestionsPerQuiz", Number(e.target.value))
            }
            fullWidth
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-secondary-500">
          Questions type enabled
        </h2>
        <div className="flex flex-col gap-2">
          {[
            { value: "MULTIPLE_CHOICE", label: "Multiple choice" },
            { value: "TRUE_FALSE", label: "True/false" },
            { value: "TEXT_INPUT", label: "Text input" },
            { value: "FILE_UPLOAD", label: "File upload" },
          ].map((type) => (
            <div key={type.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.enabledQuestionTypes?.includes(type.value as any)}
                onChange={() => handleQuestionTypeToggle(type.value)}
                className="w-5 h-5"
              />
              <label className="text-base text-secondary-500">{type.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-secondary-500">Access control</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.requireAuthentication}
              onChange={(e) =>
                handleCheckboxChange("requireAuthentication", e.target.checked)
              }
              className="w-5 h-5"
            />
            <label className="text-base text-secondary-500">
              Require user authentication for quizzes
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.allowAnonymousAttempts}
              onChange={(e) =>
                handleCheckboxChange("allowAnonymousAttempts", e.target.checked)
              }
              className="w-5 h-5"
            />
            <label className="text-base text-secondary-500">
              Allow anonymous quiz attempts
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.trackProgress}
              onChange={(e) => handleCheckboxChange("trackProgress", e.target.checked)}
              className="w-5 h-5"
            />
            <label className="text-base text-secondary-500">
              Track user progress across sessions
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.enablePublicSharing}
              onChange={(e) =>
                handleCheckboxChange("enablePublicSharing", e.target.checked)
              }
              className="w-5 h-5"
            />
            <label className="text-base text-secondary-500">
              Enable quiz sharing via public links
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-6 border-t border-border-500">
        <Button variant="secondary" onClick={handleReset}>
          Reset To Defaults
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
