import React from 'react';
import { InteractiveImageSlider } from './interactive-image-slider';

const images = [
    '/images/gold-zipper.jpg',
    '/images/gold-zipper.jpg',
    '/images/gold-zipper.jpg',
];

export default function InteractiveImageSliderExample() {
    return <InteractiveImageSlider items={images} />;
}
