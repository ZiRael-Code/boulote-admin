"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Plus } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/input/textarea";
import Select from "@/components/ui/input/select";
import {useCreateQuiz, useSaveQuizDraft, useQuizCategoryOptions} from "@/hooks/use-quizzes";
import type { CreateQuizRequest } from "@/lib/api/services/quizzes";

type TabType = "basic-info" | "preview";

export default function CreateQuizPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("basic-info");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { data: categoryOptions = [] } = useQuizCategoryOptions(true);

  const [formData, setFormData] = useState<Partial<CreateQuizRequest>>({
    title: "",
    difficulty: "MEDIUM",
    adminNotes: "",
    questions: [
      {
        questionText: "",
        questionType: "MULTIPLE_CHOICE",
        options: ["", ""],
        correctAnswer: 0,
        explanation: "",
      },
    ],
    timeLimit: { enabled: false, duration: 60 },
    passingScore: 70,
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
      questions[currentQuestionIndex] = { ...questions[currentQuestionIndex], [field]: value };
      return { ...prev, questions };
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    setFormData((prev) => {
      const questions = [...(prev.questions || [])];
      const options = [...(questions[currentQuestionIndex].options || [])];
      options[index] = value;
      questions[currentQuestionIndex] = { ...questions[currentQuestionIndex], options };
      return { ...prev, questions };
    });
  };

  const handleAddOption = () => {
    setFormData((prev) => {
      const questions = [...(prev.questions || [])];
      const options = [...(questions[currentQuestionIndex].options || []), ""];
      questions[currentQuestionIndex] = { ...questions[currentQuestionIndex], options };
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
      onSuccess: () => router.push("/dashboard/quizzes"),
    });
  };

  const handlePublish = () => {
    createMutation.mutate(formData as CreateQuizRequest, {
      onSuccess: () => router.push("/dashboard/quizzes"),
    });
  };

  return (
      <div className="flex flex-col gap-6 px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-neutral-50 rounded-md">
            <ArrowLeft className="w-6 h-6 text-secondary-500" />
          </button>
          <h1 className="text-3xl font-bold text-secondary-500">Create new quiz</h1>
        </div>

        <div className="flex gap-4 border-b border-border-500">
          {(["basic-info", "preview"] as TabType[]).map((tab) => (
              <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 border-b-2 transition-colors capitalize ${
                      activeTab === tab
                          ? "border-primary-500 text-primary-500"
                          : "border-transparent text-secondary-500"
                  }`}
              >
                {tab === "basic-info" ? "Basic info" : "Preview"}
              </button>
          ))}
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
                        { value: "EASY", label: "Easy" },
                        { value: "MEDIUM", label: "Medium" },
                        { value: "HARD", label: "Hard" },
                      ]}
                      value={formData.difficulty || "MEDIUM"}
                      onChange={(e) => handleInputChange("difficulty", e.target.value)}
                      fullWidth
                  />
                  <Textarea
                      label="Admin Notes"
                      placeholder="Brief description of the quiz"
                      value={formData.adminNotes || ""}
                      onChange={(e) => handleInputChange("adminNotes", e.target.value)}
                      fullWidth
                  />
                  <Select
                      label="Category"
                      placeholder="Select Category"
                      options={categoryOptions}
                      value={formData.category || ""}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      fullWidth
                  />
                </div>
              </div>


              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-secondary-500">
                    Questions ({currentQuestionIndex + 1}/{totalQuestions})
                  </h2>
                  <div className="flex gap-2">
                    {formData.questions && formData.questions.length > 1 && (
                        <div className="flex gap-2">
                          <Button
                              variant="secondary"
                              onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
                              disabled={currentQuestionIndex === 0}
                          >
                            ← Prev
                          </Button>
                          <Button
                              variant="secondary"
                              onClick={() => setCurrentQuestionIndex((i) => Math.min(totalQuestions - 1, i + 1))}
                              disabled={currentQuestionIndex === totalQuestions - 1}
                          >
                            Next →
                          </Button>
                        </div>
                    )}
                    <Button variant="primary" onClick={handleAddQuestion}>
                      Add question
                    </Button>
                  </div>
                </div>

                <Select
                    label="Question type"
                    options={[
                      { value: "MULTIPLE_CHOICE", label: "Multiple choice" },
                      { value: "TRUE_FALSE", label: "True/False" },
                    ]}
                    value={currentQuestion.questionType}
                    onChange={(e) => handleQuestionChange("questionType", e.target.value)}
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
                        Answer options (select the correct one)
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

                {currentQuestion.questionType === "TRUE_FALSE" && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-secondary-500">Correct answer</label>
                      {["True", "False"].map((opt) => (
                          <div key={opt} className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="trueFalseAnswer"
                                checked={currentQuestion.correctAnswer === opt}
                                onChange={() => handleQuestionChange("correctAnswer", opt)}
                                className="w-5 h-5"
                            />
                            <label className="text-sm text-secondary-500">{opt}</label>
                          </div>
                      ))}
                    </div>
                )}

                <Textarea
                    label="Explanation (optional)"
                    placeholder="Explain the correct answer"
                    value={currentQuestion.explanation || ""}
                    onChange={(e) => handleQuestionChange("explanation", e.target.value)}
                    fullWidth
                />
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
                              handleInputChange("timeLimit", { ...formData.timeLimit, enabled: e.target.checked })
                          }
                          className="w-5 h-5"
                      />
                      <label className="text-sm font-medium text-secondary-500">Enable time limit</label>
                    </div>
                    {formData.timeLimit?.enabled && (
                        <div className="flex gap-2">
                          <Input
                              type="number"
                              value={formData.timeLimit.duration || 60}
                              onChange={(e) =>
                                  handleInputChange("timeLimit", { ...formData.timeLimit, duration: Number(e.target.value) })
                              }
                              className="flex-1"
                          />
                          <Select options={[{ value: "minutes", label: "Minutes" }]} value="minutes" />
                        </div>
                    )}
                  </div>
                  <Input
                      label="Passing score (%)"
                      type="number"
                      value={formData.passingScore || 70}
                      onChange={(e) => handleInputChange("passingScore", Number(e.target.value))}
                      fullWidth
                  />
                </div>
              </div>
            </div>
        ) : (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-secondary-500">Preview</h2>
              {formData.questions?.map((q, i) => (
                  <div key={i} className="bg-white border border-border-500 rounded-md p-6 flex flex-col gap-4">
                    <p className="text-base font-medium text-secondary-500">
                      {i + 1}. {q.questionText || "No question text"}
                    </p>
                    {q.options?.map((opt, j) => (
                        <div
                            key={j}
                            className={`px-4 py-2 rounded-md text-sm border ${
                                q.correctAnswer === j || q.correctAnswer === opt
                                    ? "border-success-500 bg-success-50 text-success-700"
                                    : "border-border-500 text-neutral-500"
                            }`}
                        >
                          {String.fromCharCode(65 + j)}. {opt}
                        </div>
                    ))}
                    {q.explanation && (
                        <p className="text-sm text-neutral-400 italic">Explanation: {q.explanation}</p>
                    )}
                  </div>
              ))}
            </div>
        )}

        <div className="flex gap-4 justify-end pt-6 border-t border-border-500">
          <Button variant="secondary" onClick={handleSaveDraft} disabled={saveDraftMutation.isPending}>
            {saveDraftMutation.isPending ? "Saving..." : "Save As Draft"}
          </Button>
          <Button variant="primary" onClick={handlePublish} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Publishing..." : "Publish Quiz"}
          </Button>
        </div>
      </div>
  );
}