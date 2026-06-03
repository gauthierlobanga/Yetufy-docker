'use client';

import Search from '@/components/search';

export default function SearchInput() {
    return (
        <div className="relative flex min-h-25 items-center justify-center p-4 md:min-h-100">
            <Search
                applicationId="06YAZFOHSQ"
                apiKey="94b6afdc316917b6e6cdf2763fa561df"
                indexName="algolia_podcast_sample_dataset"
                attributes={{
                    primaryText: 'title',
                    secondaryText: 'description',
                    tertiaryText: 'itunesAuthor',
                    image: 'imageUrl',
                    url: 'url',
                }}
            />
        </div>
    );
}
