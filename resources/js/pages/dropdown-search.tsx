'use client';

import DropdownSearch from '@/components/dropdown-search';

export default function DropdownSearchExperience() {
    return (
        <div className="relative flex min-h-25 items-center justify-center p-4 md:min-h-100">
            <div className="w-full max-w-md">
                <DropdownSearch
                    applicationId="06YAZFOHSQ"
                    apiKey="94b6afdc316917b6e6cdf2763fa561df"
                    indexName="algolia_podcast_sample_dataset"
                    placeholder="Search podcasts..."
                    hitsPerPage={5}
                    attributes={{
                        primaryText: 'title',
                        secondaryText: 'description',
                        tertiaryText: 'itunesAuthor',
                        image: 'imageUrl',
                        url: 'url',
                    }}
                />
            </div>
        </div>
    );
}
