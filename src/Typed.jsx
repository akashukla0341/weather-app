import React, { useEffect } from 'react';
import Typed from 'typed.js';

function YourComponent() {
    useEffect(() => {
        const typedElement = document.querySelector(".typed");
        if (typedElement) {
            let typed_strings = typedElement.getAttribute("data-typed-items");
            typed_strings = typed_strings.split(",");
            new Typed(".typed", {
                strings: typed_strings,
                loop: true,
                typeSpeed: 200,
                backSpeed: 50,
                backDelay: 2000,
            });
        }
    }, []); // Empty dependency array ensures this effect runs only once after initial render

    return (
        <>
        <h2 className='hero-subtitle'>
            <span className='typed' data-typed-items="Weather,Application"></span>
        </h2>
        </>
    );
}

export default YourComponent;
