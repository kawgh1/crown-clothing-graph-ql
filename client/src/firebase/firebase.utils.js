// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';
// v9 compat packages are API compatible with v8 code
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCRJyTtQWLJtliwks8xnRpGjCZ5K3AivRU",
    authDomain: "crown-db-62654.firebaseapp.com",
    projectId: "crown-db-62654",
    storageBucket: "crown-db-62654.appspot.com",
    messagingSenderId: "981561321482",
    appId: "1:981561321482:web:db7a7b6f7a9de1ad6d17f3",
    measurementId: "G-WM192G384F",
};

//initialize app
const firebaseApp = firebase.initializeApp(firebaseConfig);

// FireStore Database
export const createUserProfileDocument = async (userAuth, additionalData) => {
    // if there is no Google user on Google Signin -> if userAuth == null

    if (!userAuth) return; // exit

    // console.log(firestore.doc('users/12'));
    // const userRef = firestore.doc('users/12');
    const userRef = firestore.doc(`users/${userAuth.uid}`);

    // snapShot's exist property tells us if there's any data there or not
    const snapShot = await userRef.get();

    // console.log(snapShot);

    // if returned snapShot.exists property == false, ie, user does not exist in firestore
    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        // then create that new user from the data in our userAuth object in the database

        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData,
            });
        } catch (error) {
            console.log("error creating user", error.message);
        }
    }

    return userRef;
};

export const auth = firebase.auth();
export const firestore = firebaseApp.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebaseApp;
