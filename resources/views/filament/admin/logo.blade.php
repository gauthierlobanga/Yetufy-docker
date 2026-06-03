@php
    $logoUrl ??= null;
    $name ??= config('app.name');
@endphp

<a href="{{ filament()->getUrl() }}" class="flex items-center gap-3 outline-none">
    @if ($logoUrl)
        <img src="{{ $logoUrl }}" alt="{{ $name }}" class="h-8 w-auto rounded" loading="eager">
    @else
        <div class="flex h-8 w-8 items-center justify-center rounded bg-primary-600 text-white font-bold">
            {{ strtoupper(substr($name, 0, 2)) }}
        </div>
    @endif
    <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ $name }}</span>
</a>
