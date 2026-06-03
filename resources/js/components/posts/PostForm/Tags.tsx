// resources/js/components/posts/PostForm/Tags.tsx
import { X } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Tag } from '@/types/posts/posts';

interface TagsSectionProps {
    data: any;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    availableTags: Tag[];
}

export function TagsSection({
    data,
    setData,
    errors,
    availableTags,
}: TagsSectionProps) {
    const [inputValue, setInputValue] = React.useState('');
    const [suggestions, setSuggestions] = React.useState<Tag[]>([]);

    const selectedTags = data.tags || [];

    const handleAddTag = (tagId: number) => {
        if (!selectedTags.includes(tagId)) {
            setData('tags', [...selectedTags, tagId]);
        }

        setInputValue('');
        setSuggestions([]);
    };

    const handleRemoveTag = (tagId: number) => {
        setData(
            'tags',
            selectedTags.filter((id: number) => id !== tagId),
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim()) {
            const filtered = availableTags.filter(
                (tag) =>
                    tag.name.toLowerCase().includes(value.toLowerCase()) &&
                    !selectedTags.includes(tag.id),
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && suggestions.length > 0) {
            e.preventDefault();
            handleAddTag(suggestions[0].id);
        }
    };

    const getTagName = (tagId: number) => {
        const tag = availableTags.find((t) => t.id === tagId);

        return tag ? tag.name : `Tag ${tagId}`;
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 rounded-md border p-2">
                    {selectedTags.map((tagId: number) => (
                        <Badge
                            key={tagId}
                            variant="secondary"
                            className="gap-1"
                        >
                            {getTagName(tagId)}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleRemoveTag(tagId)}
                            />
                        </Badge>
                    ))}
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Ajouter un tag..."
                        className="h-8 w-40 border-0 p-0 shadow-none focus-visible:ring-0"
                    />
                </div>
                {errors.tags && (
                    <p className="text-sm text-red-500">{errors.tags}</p>
                )}
            </div>

            {suggestions.length > 0 && (
                <div className="space-y-1 rounded-md border p-2">
                    <p className="text-xs text-muted-foreground">
                        Suggestions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant="outline"
                                className="cursor-pointer hover:bg-primary/10"
                                onClick={() => handleAddTag(tag.id)}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
