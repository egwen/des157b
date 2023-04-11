(function() {
    'use strict';

    const button = document.querySelector('#toggle input');
    const body = document.querySelector('body');
    const banner = document.querySelector('#banner');
    const sections = document.querySelectorAll('section')
    const windowSvgElements = document.querySelectorAll('#banner svg *');
    const deskSvgElements = document.querySelectorAll('#desk *');

    // DES157A items
    const books = document.querySelector('#books img');

    let mode = 'light';

    window.addEventListener('load', () => {
        console.log(button.checked);
        if (button.checked) {
            mode = 'dark';
            switchMode();
        }

        books.addEventListener('mouseover', () => {
            console.log("BOOKS");
            books.src = 'images/books.png';
        });
        books.addEventListener('mouseout', () => {
            console.log(mode);
            books.src = `images/books-outline-${mode}.png`;
        });

    });


    let colors = {
        light: '#9A7655',
        dark: '#A4A4A4'
    }

    button.addEventListener('click', function() {
        console.log(button.checked);
        if (button.checked) {
            mode = 'dark';
        }

        switchMode();
    })

    function switchMode() {
        books.src = `images/books-outline-${mode}.png`;

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
    }
})()