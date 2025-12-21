import React from 'react';
import { programsData } from '../data';
import { notFound } from 'next/navigation';
import ProgramDetailClient from './ProgramDetailClient';

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const program = programsData[slug];

    if (!program) return { title: 'Program Not Found' };

    return {
        title: `${program.title} | Stackup`,
        description: program.description,
        keywords: program.seoKeywords,
        openGraph: {
            title: program.title,
            description: program.description,
            images: [program.image],
        },
    };
}

export default async function ProgramPage({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const program = programsData[slug];

    if (!program) {
        notFound();
    }

    return <ProgramDetailClient program={program} />;
}
