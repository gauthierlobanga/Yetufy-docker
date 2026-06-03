@php
    $state = $getState();
    $color = $getColor();
    $colorClass = match ($color) {
        'gray' => 'text-gray-500 dark:text-gray-400',
        default => 'text-custom-500',
    };
    $size = $getIconSize();
    $sizeClass = match ($size) {
        'xs' => 'w-2 h-2',
        'sm' => 'w-4 h-4',
        'md' => 'w-6 h-6',
        'lg' => 'w-8 h-8',
        'xl' => 'w-10 h-10',
    };
    $halfSizeClass = match ($size) {
        'xs' => 'w-1 h-2',
        'sm' => 'w-2 h-4',
        'md' => 'w-3 h-6',
        'lg' => 'w-4 h-8',
        'xl' => 'w-5 h-10',
    };
@endphp

<div class="flex">
    @if ($shouldAllowZero())
        <div @class([
            'text-slate-300' => $state !== 0,
            'text-danger-500' => $state === 0,
        ])>
            <x-icon name="heroicon-c-no-symbol" class="{{ $sizeClass }}" />
        </div>
    @endif

    @foreach ($getStarArray() as $value)
        <div @class([
            "shrink-0 relative {$halfSizeClass} overflow-hidden",
            'text-slate-300' => $state < $value - 0.5,
            $colorClass => $state >= $value - 0.5,
        ]) @style([
            \Filament\Support\get_color_css_variables($color, [500]) => $color !== 'gray',
        ])>
            <x-icon name="heroicon-s-star" class="absolute inset-s-0 {{ $sizeClass }}" />
        </div>

        <div @class([
            "shrink-0 relative {$halfSizeClass} overflow-hidden",
            'text-slate-300' => $state < $value,
            $colorClass => $state >= $value,
        ]) @style([
            \Filament\Support\get_color_css_variables($color, [500]) => $color !== 'gray',
        ])>
            <x-icon name="heroicon-s-star" class="absolute inset-e-0 {{ $sizeClass }}" />
        </div>
    @endforeach
</div>
