(function() {
    'use strict';
    console.log('reading js');
    
    let counter = 0;
    const receipts = document.querySelector('.receipts');
    let receiptLengths = [];

    const welcome = document.querySelector('#welcome');
    const button = document.querySelector('button');

    const coffeeBtn = document.getElementById('coffee-btn');
    coffeeBtn.addEventListener('click', makeCoffee);
    const needle = document.getElementById('needle');
    console.log(needle);

    window.addEventListener('load', () => {
        getData();

        // Reveal title
        document.querySelector('h1').style.transform = 'rotateX(0deg)';

        // "Print" welcome receipt after 2 seconds
        setTimeout( ()=> {
            receipts.scrollBy({
                top: -welcome.scrollHeight, // margin + border = 22px
                left: 0,
                behavior: "smooth",
            });
            button.addEventListener('click', printReceipt);
        }, 2000);

        // Animate the indicator button and disable button while "printing"/scrolling
        receipts.addEventListener('scroll', () => {
            button.style.pointerEvents = 'none';
            document.getElementById('indicator').className = 'off';
            if (counter < receiptLengths.length) {
                setTimeout( () => {
                    button.style.pointerEvents = 'auto';
                    document.getElementById('indicator').className = 'on';
                }, 500);
            } else {
                button.style.pointerEvents = 'auto';
                button.textContent = 'Restart';
                button.removeEventListener('click', printReceipt);
                button.addEventListener('click', restartList);
            }
        });
    });

    async function getData() {
        const orders =  await fetch('orders.json');
        const data = await orders.json();
        // Convert data to key-value pairs
        const receipts = Object.entries(data);
        console.log(receipts);
        generateReceiptList(receipts);
    }

    function generateReceiptList(data){
        // let receipts = document.querySelector('.receipts');
        data.forEach( (order) => {
            let receipt = createReceipt(order);
            receipts.append( receipt );
            receiptLengths.push(receipt.scrollHeight);
        });
        // receiptLengths.reverse();
        console.log(receiptLengths);
    }
    
    function createReceipt(dataValue) {
        // Create the receipt element
        let receipt = document.createElement('article');
        receipt.className = 'receipt';
        
        // Order Number
        let orderNumElem = document.createElement('h2');
        orderNumElem.textContent = "#" + dataValue[0]; // Order number used as key

        // Order type (to-go or dine-in)
        let toGoPara = document.createElement('p');
        toGoPara.textContent = 'To-Go';

        // Order List of items
        let orderElem = document.createElement('ul');
        // Create a list of each item
        dataValue[1].order.forEach( (item) => {
            let itemElem = document.createElement('li');
            itemElem.className = 'item';

            // add a paragraph of any special instructions
            let specialElem = '';
            if ('special' in item) {
                specialElem = document.createElement('p');
                specialElem.className = 'special';
                specialElem.textContent = item.special;
            }
            if (item.type == 'drink') {
                itemElem.append(`${item.quantity}x ${item.size} ${item.title}`, specialElem);
            } else {
                itemElem.append(`${item.quantity}x ${item.title}`, specialElem);
            }
            orderElem.append(itemElem);
        });

        // Timestamp of when the customer made the order
        let timestampElem = document.createElement('p');
        timestampElem.className = 'timestamp'
        timestampElem.textContent = dataValue[1].timestamp;

        receipt.append(orderNumElem, toGoPara, orderElem, timestampElem);
        return receipt;
    }

    function printReceipt() {
        receipts.scrollBy({
            top: -receiptLengths[counter] - 22, // margin + border = 22px
            left: 0,
            behavior: "smooth",
        });
        counter++;

        if (counter > 0 && receipts.children) {
            receipts.children[counter-1].style.opacity = 0;
        }
        console.log(counter, receiptLengths.length);
        if (counter == receiptLengths.length) {
            document.getElementById('indicator').className = 'off';
            document.querySelector('button').style.pointerEvents = 'none';
        }
    }

    function restartList() {
        counter = 0;
        console.log(receipts.childNodes)
        receipts.childNodes.forEach( (child) => {
            if (child.nodeType == Node.ELEMENT_NODE) {
                child.style.opacity = 1;
            }
        });
        receipts.scrollTo({
            top: -welcome.scrollHeight, // margin + border = 22px
            left: 0,
            behavior: "smooth",
        });
        button.textContent = 'Print Receipt';
        button.removeEventListener('click', restartList);
        button.addEventListener('click', printReceipt);
    }


    function makeCoffee() {
        let coffeeLight = document.getElementById('btn-light-inner');
        coffeeLight.setAttribute('fill', '#e9dec4');

        let coffeeEnds = document.querySelectorAll('#espresso circle');
        let coffeeStreams = document.querySelectorAll('#espresso rect');
        
        document.getElementById('espresso').setAttribute('class', 'ready');

        coffeeStreams.forEach((stream) => {
            stream.setAttribute('height', 70);
        });
        coffeeEnds.forEach((stream) => {
            stream.setAttribute('cy', parseInt(stream.getAttribute('cy')) + 70);
            
        });

        setTimeout( () => {
            coffeeStreams.forEach((stream) => {
                stream.setAttribute('height', 1);
                stream.setAttribute('y', 300);
            });
            // coffeeEnds.forEach((stream) => {
            //     stream.setAttribute('cy', 300);
            // });

            setTimeout( () => {
                // Reset positioning
                document.getElementById('espresso').setAttribute('class', '');
                coffeeStreams.forEach((stream) => {
                    stream.setAttribute('height', 1);
                    stream.setAttribute('y', 225);
                });
                coffeeEnds.forEach((stream) => {
                    stream.setAttribute('cy', parseInt(stream.getAttribute('cy')) - 70);
                });
                coffeeLight.setAttribute('fill', '#FFF8E7');

            }, 1000);
        }, 2000);

        // Spin pressure needle
        needle.style.animation = 'spin 4s 1';
        needle.addEventListener('animationend', () => {
            needle.style.animation = '';
        });

    }

})();