(function() {
    'use strict';

    const button = document.querySelector('#toggle input');
    const body = document.querySelector('body');
    const banner = document.querySelector('#banner');
    const sections = document.querySelectorAll('section')
    const windowSvgElements = document.querySelectorAll('#banner svg *');
    const deskSvgElements = document.querySelectorAll('#desk *');


    console.log(deskSvgElements);
    let mode = 'dark';

    let colors = {
        light: '#9A7655',
        dark: '#C1AA95'
    }

    button.addEventListener('click', function() {
        console.log("CLICK");
        if (mode === 'dark') {
            body.className = 'switch';
            banner.className = 'switch';
            button.className = 'dark';
            for (const section of sections) {
                section.className = 'switch';
            }

            windowSvgElements.forEach( (element) => {
                element.setAttribute('stroke', colors.dark);
            });
            deskSvgElements.forEach( (element) => {
                element.setAttribute('stroke', colors.dark);
                if (element.id == 'desk-outline') {
                    element.setAttribute('fill', colors.dark);
                }

            });
            mode = 'light';
        } else {
            body.removeAttribute('class');
            banner.removeAttribute('class');
            button.className = 'light';            
            for (const section of sections) {
                section.removeAttribute('class');
            }
            windowSvgElements.forEach( (element) => {
                element.setAttribute('stroke', colors.light);
            });
            deskSvgElements.forEach( (element) => {
                element.setAttribute('stroke', colors.light);
                if (element.id == 'desk-outline') {
                    element.setAttribute('fill', colors.light);
                }
            });
            mode = 'dark'
        }
    })
})()