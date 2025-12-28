"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Plus, TrendingUp } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  useQuizCategories,
  useCategoryStats,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-quizzes";

export default function ManageQuizCategoriesPage() {
  const router = useRouter();
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const { data: categories, isLoading: isLoadingCategories } =
    useQuizCategories(true);
  const { data: stats, isLoading: isLoadingStats } = useCategoryStats(true);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      createMutation.mutate(
        { name: newCategoryName.trim() },
        {
          onSuccess: () => {
            setNewCategoryName("");
          },
        }
      );
    }
  };

  const handleUpdateCategory = (categoryId: number, name: string) => {
    updateMutation.mutate(
      { categoryId, name },
      {
        onSuccess: () => {
          setEditingCategory(null);
        },
      }
    );
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(categoryId);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-neutral-50 rounded-md"
        >
          <ArrowLeft className="w-6 h-6 text-secondary-500" />
        </button>
        <h1 className="text-3xl font-bold text-secondary-500">Manage Quiz</h1>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-border-500 rounded-md p-6 flex flex-col">
          <p className="text-4xl font-bold text-primary-500 mb-2">
            {isLoadingStats ? "..." : stats?.programmingQuizzes || 0}
          </p>
          <p className="text-base font-normal text-secondary-500 mb-2">
            Programming quizzes
          </p>
          {stats?.programmingTrend && stats.programmingTrend !== "No change" && (
            <div className="flex items-center gap-2 text-sm text-success-600">
              <TrendingUp className="w-4 h-4" />
              <span>{stats.programmingTrend}</span>
            </div>
          )}
        </div>
        <div className="bg-white border border-border-500 rounded-md p-6 flex flex-col">
          <p className="text-4xl font-bold text-primary-500 mb-2">
            {isLoadingStats ? "..." : stats?.designQuizzes || 0}
          </p>
          <p className="text-base font-normal text-secondary-500 mb-2">
            Design quizzes
          </p>
          {stats?.designTrend && stats.designTrend !== "No change" && (
            <div className="flex items-center gap-2 text-sm text-success-600">
              <TrendingUp className="w-4 h-4" />
              <span>{stats.designTrend}</span>
            </div>
          )}
        </div>
        <div className="bg-white border border-border-500 rounded-md p-6 flex flex-col">
          <p className="text-4xl font-bold text-primary-500 mb-2">
            {isLoadingStats ? "..." : stats?.marketingQuizzes || 0}
          </p>
          <p className="text-base font-normal text-secondary-500 mb-2">
            Marketing quizzes
          </p>
          {stats?.marketingTrend && stats.marketingTrend !== "No change" && (
            <div className="flex items-center gap-2 text-sm text-success-600">
              <TrendingUp className="w-4 h-4" />
              <span>{stats.marketingTrend}</span>
            </div>
          )}
        </div>
      </div>

      {/* Add Category */}
      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateCategory();
              }
            }}
            fullWidth
          />
        </div>
        <Button variant="primary" onClick={handleCreateCategory}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Category
        </Button>
      </div>

      {/* Category Tree */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-secondary-500">Category Tree</h2>
        {isLoadingCategories ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {categories?.map((category) => (
              <div
                key={category.id}
                className="bg-white border border-border-500 rounded-md p-4 flex items-center justify-between"
              >
                {editingCategory === category.id ? (
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="text"
                      defaultValue={category.name}
                      onBlur={(e) => {
                        if (e.target.value !== category.name) {
                          handleUpdateCategory(category.id, e.target.value);
                        } else {
                          setEditingCategory(null);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                        } else if (e.key === "Escape") {
                          setEditingCategory(null);
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-border-500 rounded-md"
                      autoFocus
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-medium text-secondary-500">
                        {category.name}
                      </span>
                      {category.quizCount > 0 && (
                        <span className="text-sm text-neutral-500">
                          ({category.quizCount} quizzes)
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setEditingCategory(category.id)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
