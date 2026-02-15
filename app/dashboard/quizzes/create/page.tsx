"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Plus } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/input/textarea";
import Select from "@/components/ui/input/select";
import { useCreateQuiz, useSaveQuizDraft } from "@/hooks/use-quizzes";
import type { CreateQuizRequest } from "@/lib/api/services/quizzes";

type TabType = "basic-info" | "preview";

export default function CreateQuizPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("basic-info");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [formData, setFormData] = useState<Partial<CreateQuizRequest>>({
    title: "",
    difficulty: "BEGINNER",
    adminNotes: "",
    estimatedLevel: 30,
    tags: [],
    questions: [
      {
        questionText: "",
        questionType: "MULTIPLE_CHOICE",
        options: ["", ""],
        correctAnswer: 0,
        explanation: "",
      },
    ],
    timeLimit: {
      enabled: false,
      duration: 60,
    },
    passingScore: 70,
    questionOrder: "SEQUENTIAL",
    showResult: "AFTER_COMPLETION",
    accessControl: {
      requireLogin: true,
      verifiedProfessionals: false,
      premiumFeature: false,
    },
  });

  const createMutation = useCreateQuiz();
  const saveDraftMutation = useSaveQuizDraft();

  const currentQuestion = formData.questions?.[currentQuestionIndex] || {
    questionText: "",
    questionType: "MULTIPLE_CHOICE",
    options: ["", ""],
    correctAnswer: 0,
    explanation: "",
  };

  const totalQuestions = formData.questions?.length || 1;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field: string, value: any) => {
    setFormData((prev) => {
      const questions = [...(prev.questions || [])];
      questions[currentQuestionIndex] = {
        ...questions[currentQuestionIndex],
        [field]: value,
      };
      return { ...prev, questions };
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    setFormData((prev) => {
      const questions = [...(prev.questions || [])];
      const options = [...(questions[currentQuestionIndex].options || [])];
      options[index] = value;
      questions[currentQuestionIndex] = {
        ...questions[currentQuestionIndex],
        options,
      };
      return { ...prev, questions };
    });
  };

  const handleAddOption = () => {
    setFormData((prev) => {
      const questions = [...(prev.questions || [])];
      const options = [...(questions[currentQuestionIndex].options || [])];
      options.push("");
      questions[currentQuestionIndex] = {
        ...questions[currentQuestionIndex],
        options,
      };
      return { ...prev, questions };
    });
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => {
      const questions = [...(prev.questions || [])];
      const options = [...(questions[currentQuestionIndex].options || [])];
      options.splice(index, 1);
      questions[currentQuestionIndex] = {
        ...questions[currentQuestionIndex],
        options,
        correctAnswer:
          questions[currentQuestionIndex].correctAnswer === index
            ? 0
            : questions[currentQuestionIndex].correctAnswer,
      };
      return { ...prev, questions };
    });
  };

  const handleAddQuestion = () => {
    setFormData((prev) => {
      const questions = [...(prev.questions || [])];
      questions.push({
        questionText: "",
        questionType: "MULTIPLE_CHOICE",
        options: ["", ""],
        correctAnswer: 0,
        explanation: "",
      });
      return { ...prev, questions };
    });
    setCurrentQuestionIndex(totalQuestions);
  };

  const handleSaveDraft = () => {
    saveDraftMutation.mutate(formData as CreateQuizRequest, {
      onSuccess: (quiz) => {
        router.push(`/dashboard/quizzes/${quiz.id}`);
      },
    });
  };

  const handlePublish = () => {
    createMutation.mutate(formData as CreateQuizRequest, {
      onSuccess: (quiz) => {
        router.push(`/dashboard/quizzes/${quiz.id}`);
      },
    });
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
        <h1 className="text-3xl font-bold text-secondary-500">Create new quiz</h1>
      </div>

      <div className="flex gap-4 border-b border-border-500">
        <button
          onClick={() => setActiveTab("basic-info")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "basic-info"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          Basic info
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "preview"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          Preview
        </button>
      </div>

      {activeTab === "basic-info" ? (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-secondary-500">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Quiz Title*"
                placeholder="Enter quiz title"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                fullWidth
              />
              <Select
                label="Difficulty Level"
                options={[
                  { value: "BEGINNER", label: "Beginner" },
                  { value: "INTERMEDIATE", label: "Intermediate" },
                  { value: "ADVANCED", label: "Advanced" },
                ]}
                value={formData.difficulty || "BEGINNER"}
                onChange={(e) =>
                  handleInputChange("difficulty", e.target.value as any)
                }
                fullWidth
              />
              <Textarea
                label="Admin Notes"
                placeholder="Brief description of the quiz"
                value={formData.adminNotes || ""}
                onChange={(e) => handleInputChange("adminNotes", e.target.value)}
                fullWidth
              />
              <div className="flex gap-2">
                <Input
                  label="Estimated level (minutes)"
                  type="number"
                  value={formData.estimatedLevel || 30}
                  onChange={(e) =>
                    handleInputChange("estimatedLevel", Number(e.target.value))
                  }
                  className="flex-1"
                />
                <Select
                  options={[{ value: "minutes", label: "Minutes" }]}
                  value="minutes"
                  className="mt-6"
                />
              </div>
              <Select
                label="Category"
                placeholder="Select Category"
                options={[
                  { value: "Programming", label: "Programming" },
                  { value: "Design", label: "Design" },
                  { value: "Marketing", label: "Marketing" },
                  { value: "AI", label: "AI" },
                  { value: "Content", label: "Content" },
                  { value: "Data Science", label: "Data Science" },
                  { value: "Management", label: "Management" },
                ]}
                value={formData.category || ""}
                onChange={(e) => handleInputChange("category", e.target.value)}
                fullWidth
              />
              <Input
                label="Tags"
                placeholder="javascript, frontend, web"
                value={formData.tags?.join(", ") || ""}
                onChange={(e) =>
                  handleInputChange(
                    "tags",
                    e.target.value.split(",").map((t) => t.trim())
                  )
                }
                fullWidth
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-500">
                Questions ({currentQuestionIndex + 1}/{totalQuestions})
              </h2>
              <div className="flex gap-4">
                <Button variant="primary" onClick={handleAddQuestion}>
                  Add question
                </Button>
                <Button variant="secondary">Import questions</Button>
              </div>
            </div>

            <Select
              label="Question type"
              options={[
                { value: "MULTIPLE_CHOICE", label: "Multiple choice" },
                { value: "TRUE_FALSE", label: "True/False" },
                { value: "TEXT_INPUT", label: "Text input" },
                { value: "FILE_UPLOAD", label: "File upload" },
              ]}
              value={currentQuestion.questionType}
              onChange={(e) =>
                handleQuestionChange("questionType", e.target.value as any)
              }
              fullWidth
            />

            <Textarea
              label="Question Text*"
              placeholder="Enter your question here"
              value={currentQuestion.questionText}
              onChange={(e) => handleQuestionChange("questionText", e.target.value)}
              fullWidth
            />

            {currentQuestion.questionType === "MULTIPLE_CHOICE" && (
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-secondary-500">
                  Answer options
                </label>
                {(currentQuestion.options || []).map((option, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={currentQuestion.correctAnswer === index}
                      onChange={() => handleQuestionChange("correctAnswer", index)}
                      className="w-5 h-5"
                    />
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-error-500 hover:bg-error-50 rounded"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddOption}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add option
                </Button>
              </div>
            )}

            <Textarea
              label="Explanation (optional)"
              placeholder="Explain the correct answer"
              value={currentQuestion.explanation || ""}
              onChange={(e) => handleQuestionChange("explanation", e.target.value)}
              fullWidth
            />

            <Button variant="secondary" onClick={handleAddQuestion}>
              Add Another Question
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-secondary-500">Quiz Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.timeLimit?.enabled || false}
                    onChange={(e) =>
                      handleInputChange("timeLimit", {
                        ...formData.timeLimit,
                        enabled: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                  <label className="text-sm font-medium text-secondary-500">
                    Enable time limit
                  </label>
                </div>
                {formData.timeLimit?.enabled && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={formData.timeLimit.duration || 60}
                      onChange={(e) =>
                        handleInputChange("timeLimit", {
                          ...formData.timeLimit,
                          duration: Number(e.target.value),
                        })
                      }
                      className="flex-1"
                    />
                    <Select
                      options={[{ value: "minutes", label: "Minutes" }]}
                      value="minutes"
                    />
                  </div>
                )}
              </div>
              <Select
                label="Attempts"
                placeholder="Select attempts"
                options={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "unlimited", label: "Unlimited" },
                ]}
                value={formData.attempts?.toString() || ""}
                onChange={(e) =>
                  handleInputChange(
                    "attempts",
                    e.target.value === "unlimited" ? undefined : Number(e.target.value)
                  )
                }
                fullWidth
              />
              <Input
                label="Passing score (70%)"
                type="number"
                placeholder="Enter passing score"
                value={formData.passingScore || 70}
                onChange={(e) =>
                  handleInputChange("passingScore", Number(e.target.value))
                }
                fullWidth
              />
              <Select
                label="Question order"
                options={[
                  { value: "SEQUENTIAL", label: "Sequential" },
                  { value: "RANDOM", label: "Random" },
                ]}
                value={formData.questionOrder || "SEQUENTIAL"}
                onChange={(e) => handleInputChange("questionOrder", e.target.value as any)}
                fullWidth
              />
              <Select
                label="Show result"
                options={[
                  { value: "AFTER_COMPLETION", label: "After completion" },
                  { value: "IMMEDIATELY", label: "Immediately" },
                  { value: "NEVER", label: "Never" },
                ]}
                value={formData.showResult || "AFTER_COMPLETION"}
                onChange={(e) => handleInputChange("showResult", e.target.value as any)}
                fullWidth
              />
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium text-secondary-500">
                Access Control
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.accessControl?.requireLogin || false}
                    onChange={(e) =>
                      handleInputChange("accessControl", {
                        ...formData.accessControl,
                        requireLogin: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                  <label className="text-sm text-secondary-500">Require login</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.accessControl?.verifiedProfessionals || false}
                    onChange={(e) =>
                      handleInputChange("accessControl", {
                        ...formData.accessControl,
                        verifiedProfessionals: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                  <label className="text-sm text-secondary-500">
                    Verified professionals
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.accessControl?.premiumFeature || false}
                    onChange={(e) =>
                      handleInputChange("accessControl", {
                        ...formData.accessControl,
                        premiumFeature: e.target.checked,
                      })
                    }
                    className="w-5 h-5"
                  />
                  <label className="text-sm text-secondary-500">Premium feature</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-base text-neutral-500">Preview will be displayed here</p>
        </div>
      )}

      <div className="flex gap-4 justify-end pt-6 border-t border-border-500">
        <Button variant="secondary" onClick={handleSaveDraft}>
          Save As Draft
        </Button>
        <Button variant="primary" onClick={handlePublish}>
          Publish Quiz
        </Button>
      </div>
    </div>
  );
}
