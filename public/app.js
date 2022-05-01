    import { onAuthStateChanged, signOut, GoogleAuthProvider, getAuth, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
    import { getFirestore, orderBy, query, where, collection, addDoc, getDocs, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js"

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAEQ7B-OmHqpC2g_UEDfJxyHSsoPuGcqis",
        authDomain: "project2-cb2fa.firebaseapp.com",
        projectId: "project2-cb2fa",
        storageBucket: "project2-cb2fa.appspot.com",
        messagingSenderId: "877391288601",
        appId: "1:877391288601:web:a31b7ddfbc20f84116cd88"
    };

    // Initialize Firebase and GoogleAuth
    const app = initializeApp(firebaseConfig);
    const provider = new GoogleAuthProvider();
    const auth = getAuth(); 

    //Assigning Google Auth to Sign in/ out buttons
    const signInBtn = document.getElementById('signInBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    signInBtn.onclick = () =>  signInWithPopup(auth, provider);
    signOutBtn.onclick = () => signOut(auth);
    
    //Accessing the firestore databse using the getFirestore method
    const messageContent = document.getElementById('message-content');
    const Btn = document.getElementById("Btn");
    const textbox = document.getElementById("textbox");
    const db = getFirestore();
    let messageRef;
    let unsubscribe; 

    onAuthStateChanged(auth, user => {
        if (user != null) {
            messageRef = collection(db, "users");
            console.log("Hello");
            signOutBtn.style.visibility = 'visible';
            signInBtn.style.visibility = 'hidden';
            messageContent.style.visibility = 'visible';

            //Creating documents in the database. Each document is a message attached to a time, photo url and user id
            Btn.onclick = () => {
                if (textbox.value !== "") {
                    addDoc(messageRef, {
                    uid: user.uid,
                    docDate: Date.now(),
                    text: textbox.value,
                    photoURL: user.photoURL
                    });
                    textbox.value = "";
               }
            };

            //Reading documents from the database. The documents are separated using their user id. 
            //The document's text is appended to a list.
            const q = query(messageRef, orderBy("docDate"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const items =  querySnapshot.docs.map( doc => {
                    const messageClass = doc.data().uid === auth.currentUser.uid ? 'sent' : 'received';
                    const photoID = doc.data().photoURL;
                    return `<li class=${messageClass}>
                               <img src='${photoID}'/>
                                ${doc.data().text}
                            </li>`
                });
                messageContent.innerHTML = items.join(" ");
            });
        
        } else {
            console.log("No USer");
            signOutBtn.style.visibility = 'hidden';
            signInBtn.style.visibility = 'visible';
            messageContent.style.visibility = 'hidden';
            q && unsubscribe();
        } 
    });
    
    // firebasicstest@gmail.com