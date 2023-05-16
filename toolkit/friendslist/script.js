// JS here
(function(){
    'use strict';

    Parse.initialize("TdLUXlejsxPHgvya4mWXTpiyL0WLyGBZAzElHyhf","pEQ4bzzOl3piOAknWQdTxAHVOtNmX6gWSsIwrqRx"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = 'https://parseapi.back4app.com/';

    const inputs = document.querySelectorAll("#add-friend input:not([type=submit])");

    async function displayFriends() {
        const friends = Parse.Object.extend('Friends');
        const query = new Parse.Query(friends);

        try {
            const results = await query.find();
            // console.log(results);
    
            results.forEach( (eachFriend) => {
                const id = eachFriend.id;
                const lname = eachFriend.get('lname');
                const fname = eachFriend.get('fname');
                const email = eachFriend.get('email');
                const facebook = eachFriend.get('facebook');
                const twitter = eachFriend.get('twitter');
                const instagram = eachFriend.get('instagram');
                const linkedin = eachFriend.get('linkedin');
    
                const theListItem = document.createElement('li');
                theListItem.setAttribute('id', `r-${id}`);
                theListItem.innerHTML = `
                    <div class="name">
                        ${fname} ${lname}
                    </div>
                    <div class="email">
                        <i class="fas fa-envelope-square"></i> ${email}
                    </div>
                    <div class="social">
                        <a href="${facebook}"><i class="fab fa-facebook-square"></i></a>
                        <a href="${twitter}"><i class="fab fa-twitter-square"></i></a>
                        <a href="${instagram}"><i class="fab fa-instagram"></i></a>
                        <a href="${linkedin}"><i class="fab fa-linkedin"></i></a>
                    </div>
                    <i class="fas fa-edit" id="e-${id}"></i>
                    <i class="fas fa-times-circle" id="e-${id}"></i> `;
                friendList.append(theListItem);
            });
        } catch (error) {
            console.log('Error while fetching Friends', error);
        }

        
    }

    displayFriends();

    // Connect buttons for opening and closing edit/add friend forms
    const newBtn = document.getElementById('newbtn');
    const editBtns = document.querySelectorAll('.fa-edit');
    const addFriendForm = document.getElementById('add-friend');
    const editFriendForm = document.getElementById('edit-friend');
    const friendList = document.querySelector('main ol');
    let thisRecord;

    newBtn.addEventListener('click', function(event) {
        event.preventDefault();
        addFriendForm.className = "add-friend-onscreen";
    });

    addFriendForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // addFriendForm.className = 'add-friend-offscreen';
        addFriend();
    });

    async function addFriend() {
        const newFriend = {};
        inputs.forEach((input) => {
            let key = input.getAttribute('name');
            let value = input.value;
            newFriend[key] = value;
        });

        if(newFriend.fname != '' && newFriend.lname != '' && newFriend.email != '') {
            const newFriendData = new Parse.Object('Friends');
            newFriendData.set('fname', newFriend.fname);
            newFriendData.set('lname', newFriend.lname);
            newFriendData.set('email', newFriend.email);
            newFriendData.set('facebook', newFriend.facebook);
            newFriendData.set('twitter', newFriend.twitter);
            newFriendData.set('instagram', newFriend.instagram);
            newFriendData.set('linkedin', newFriend.linkedin);
            try {
                const result = await newFriendData.save();
                console.log("new friend", result);
                resetFormFields();
                addFriendForm.classname = 'add-friend-offscreen';
                friendList.innerHtml = '';
                displayFriends();
            } catch (error) {
                console.log('Error while creating friend: ', error);
            }
        } else {
            addFriendForm.className = 'add-friend-offscreen';
        }

        
    }

    // editBtns.forEach((btn) => {
    //     btn.addEventListener('click', function(event) {
    //         console.log('edit', btn);
    //         event.preventDefault();
    //         editFriendForm.className = "edit-friend-onscreen";
    //     });
    // });

    document.addEventListener('click', (e) => {
        if (e.target.matches('.fa-edit')) {
            editFriendForm.className = 'edit-friend-onscreen';
            thisRecord = e.target.getAttribute('id').slice(2);
            // console.log(thisRecord);
            setForm(thisRecord);
        }
        if (e.target.matches('.fa-times-circle')) {
            thisRecord = e.target.getAttribute('id').slice(2);
            // console.log(thisRecord);
            deleteRecord(thisRecord);
        }
    }, false);

    async function setForm(recordId) {
        const friends = Parse.Object.extend('Friends');
        const query = new Parse.Query(friends);
        query.equalTo('objectId', recordId);
        try {
            const results = await query.find();

            results.forEach( (thisFriend) => {
                document.getElementById('lname-edit').value = thisFriend.get('lname');
                document.getElementById('fname-edit').value = thisFriend.get('fname');
                document.getElementById('email-edit').value = thisFriend.get('email');
                document.getElementById('fbook-edit').value  = thisFriend.get('facebook');
                document.getElementById('twitter-edit').value = thisFriend.get('twitter');
                document.getElementById('insta-edit').value = thisFriend.get('instagram');
                document.getElementById('linkedin-edit').value = thisFriend.get('linkedin');
            });
        } catch (error) {
            console.error("Error while fetching Friends", error);
        }
    }

    async function updateRecord(recordId) {
        const theFields = document.querySelectorAll('#edit-friend input:not([type=submit])');
        const editedRecord = {};
        let key, value;
        theFields.forEach( (field) => {
            key = field.getAttribute('name');
            value = field.value;
            editedRecord[key] = value;
        });

        const friends = Parse.Object.extend('Friends');
        const query = new Parse.Query(friends);
        try {
            const object = await query.get(recordId);
            object.set('fname', editedRecord.fname);
            object.set('lname', editedRecord.lname);
            object.set('email', editedRecord.email);
            object.set('facebook', editedRecord.facebook);
            object.set('twitter', editedRecord.twitter);
            object.set('instagram', editedRecord.instagram);
            object.set('linkedin', editedRecord.linkedin);
            try {
                await object.save();
                editFriendForm.className = 'edit-friend-offscreen';
                friendList.innerHTML = '';
                displayFriends();
            } catch (error) {
                console.error('Error while updating friends', error);
            }
        } catch (error) {
            console.error('Error while retrieving object friends');
        }
    }

    async function deleteRecord(recordId) {
        const youAreSure = confirm(
            'Are you sure you want to delete this record?'
        );
        if (youAreSure) {
            const query = new Parse.Query('Friends');
            try {
                const object = await query.get(recordId);
                try {
                    await object.destroy();
                    document.getElementById(`r-${recordId}`).className = 'remove';
                    setTimeout(() => {
                        const elem = document.getElementById(`r-${recordId}`);
                        elem.parentNode.removeChild(elem);
                    }, 1500);
                } catch (error) {
                    console.error('Error while deleting ParseObject', error);
                }
            } catch (error) {
                console.error('Error while retrieving ParseObject');
            }
        }

    }

    editFriendForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // editFriendForm.className = "edit-friend-offscreen";
        updateRecord(thisRecord);
    });

    function resetFormFields() {
        document.getElementById('fname').value = '';
        document.getElementById('lname').value = '';
        document.getElementById('email').value = '';
        document.getElementById('fbook').value = 'https://facebook.com';
        document.getElementById('twitter').value = 'https://twitter.com';
        document.getElementById('insta').value = 'https://instagram.com';
        document.getElementById('linkedin').value = 'https://linkedin.com';
    }
}());