<div
    {{
        $attributes
            ->merge($getExtraAttributes(), escape: false)
            ->class([
                'px-3 py-4' => ! $isInline(),
            ])
    }}
>
    <div class="flex">
        @include($getComponentView())
    </div>
</div>
