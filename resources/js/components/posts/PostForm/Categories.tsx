// resources/js/components/posts/PostForm/Categories.tsx
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Category {
    id: number;
    nom: string;
    slug: string;
    parent_id?: number | null;
    color?: string | null;
}

interface CategoriesSectionProps {
    data: any;
    setData: (key: string, value: any) => void;
    categories: Category[];
    errors: Record<string, string>;
}

export function CategoriesSection({
    data,
    setData,
    categories,
    errors,
}: CategoriesSectionProps) {
    const selectedCategories = data.categories || [];

    const handleCategoryToggle = (categoryId: number, checked: boolean) => {
        if (checked) {
            setData('categories', [...selectedCategories, categoryId]);
        } else {
            setData(
                'categories',
                selectedCategories.filter((id: number) => id !== categoryId),
            );
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Catégories</Label>
                <div className="grid grid-cols-2 gap-2 rounded-md border p-4 md:grid-cols-3 lg:grid-cols-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={`category-${category.id}`}
                                checked={selectedCategories.includes(
                                    category.id,
                                )}
                                onCheckedChange={(checked) =>
                                    handleCategoryToggle(
                                        category.id,
                                        checked as boolean,
                                    )
                                }
                            />
                            <Label
                                htmlFor={`category-${category.id}`}
                                className="cursor-pointer text-sm"
                                style={{ color: category.color || undefined }}
                            >
                                {category.nom}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.categories && (
                    <p className="text-sm text-red-500">{errors.categories}</p>
                )}
            </div>
        </div>
    );
}
