import { MarqueeEffect } from '@/components/marquee-effect';

const logos = [
    {
        name: 'OpenAi',
        img: 'https://cdn.worldvectorlogo.com/logos/openai-logo-1.svg',
    },
    {
        name: 'Microsoft Copilot',
        img: 'https://cdn.worldvectorlogo.com/logos/microsoft-copilot-logo.svg',
    },
    {
        name: 'Deepseek Ai',
        img: 'https://cdn.worldvectorlogo.com/logos/deepseek-ai-seeklogo.svg',
    },
    {
        name: 'Gemini',
        img: 'https://cdn.worldvectorlogo.com/logos/gemini-ai.svg',
    },
    {
        name: 'Grok',
        img: 'https://cdn.worldvectorlogo.com/logos/grok-3.svg',
    },
    {
        name: 'Lovable',
        img: 'https://cdn.worldvectorlogo.com/logos/lovable.svg',
    },
];

export default function LogoClouds() {
    return (
        <section className="py-12 lg:py-20">
            <div className="mx-auto max-w-3xl px-4">
                <header className="space-y-2">
                    <h3 className="font-heading text-3xl md:text-4xl">
                        Trusted by leading companies.
                    </h3>
                    <p className="text-balance text-muted-foreground md:text-lg">
                        Built to integrate effortlessly with your existing
                        tools, frameworks and workflows — so you can move
                        faster.
                    </p>
                </header>
                {logos.length > 0 && (
                    <MarqueeEffect
                        className="mask-r-from-80% mask-l-from-80%"
                        speed={50}
                        gap={50}
                    >
                        {logos.map((logo) => (
                            <div className="flex items-center">
                                <img
                                    src={logo.img}
                                    className="w-32.5"
                                    alt={logo.name}
                                />
                            </div>
                        ))}
                    </MarqueeEffect>
                )}
            </div>
        </section>
    );
}
