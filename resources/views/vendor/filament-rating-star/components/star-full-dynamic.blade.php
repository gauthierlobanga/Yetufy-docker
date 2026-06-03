@php
    $isDisabled = $isDisabled();
    $color = $getColor();
    $colorClass = match ($color) {
        'gray' => 'text-gray-500 dark:text-gray-400',
        default => "text-custom-500",
    };
    $groupHoverColorClass = match ($color) {
        'gray' => 'group-hover:!text-gray-500 dark:group-hover:!text-gray-400',
        default => "group-hover:!text-custom-500",
    };
    $size = $getIconSize();
    $sizeClass = match ($size) {
        'xs' => 'w-3 h-3',
        'sm' => 'w-4 h-4',
        'md' => 'w-6 h-6',
        'lg' => 'w-8 h-8',
        'xl' => 'w-10 h-10',
    };
@endphp

<div
    x-data="{
        rating: {{ $getState() ?? 0 }},
        hoverRating: {{ $getState() ?? 0 }},
        allowZero: @js($shouldAllowZero()),
        starArrays: @js($getStarArray()),
        rate(amount) {
            if (this.allowZero && this.rating == amount) {
                this.rating = 0;
            } else {
                this.rating = amount;
            }
        },
        resetPreview() {
            this.hoverRating = this.rating;
        }
    }"
    class="flex group"
>
    <input
        type="hidden"
        {{ $applyStateBindingModifiers('wire:model') }}="{{ $getStatePath() }}"
        x-model="rating"
    >

    <template x-for="starIndex in starArrays">
        <div x-data="{ checked: false }">
            <input
                type="radio"
                x-bind:value="starIndex"
                x-model="checked"
                class="sr-only peer"
                wire:loading.attr="disabled"
                @disabled($isDisabled)
            >

            <button
                type="button"
                @click="rate(starIndex); checked = true; $wire.set('{{ $getStatePath() }}', rating)"
                @mouseover="hoverRating = starIndex"
                @mouseleave="resetPreview()"
                :disabled="{{ $isDisabled ? 'true' : 'false' }}"
                wire:loading.attr="disabled"
                @class([
                    "cursor-pointer" => ! $isDisabled,
                    "cursor-not-allowed" => $isDisabled,
                ])
                :class="{
                    'text-slate-300': hoverRating < starIndex,
                    '{{ $groupHoverColorClass }}': hoverRating >= starIndex && rating < starIndex,
                    '{{ $colorClass }}': hoverRating >= starIndex && rating >= starIndex,
                }"
                @style([
                    \Filament\Support\get_color_css_variables($color, [500]) => $color !== 'gray',
                ])
            >
                <template x-if="hoverRating >= starIndex && rating >= starIndex">
                    <x-icon name="heroicon-s-star" class="{{ $sizeClass }} pointer-events-none" />
                </template>
                <template x-if="hoverRating < starIndex || rating < starIndex">
                    <x-icon name="heroicon-o-star" class="{{ $sizeClass }} pointer-events-none" />
                </template>
            </button>
        </div>
    </template>
</div>
