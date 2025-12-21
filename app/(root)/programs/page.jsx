import React from 'react';
import { programsData } from './data';
import ProgramsClient from './ProgramsClient';

export const metadata = {
    title: "Our Programs | Tech Training & Placements | Stackup",
    description: "Explore our wide range of industry-leading tech programs from MERN Stack to AI/ML. Get certified and launch your tech career with dedicated placement support.",
    keywords: "MERN Stack, Python Full Stack, AI, ML, Data Science, Data Analytics, Digital Marketing, Software Testing, UI/UX, Flutter",
};

export default function ProgramsPage() {
    return <ProgramsClient programsData={programsData} />;
}
