"use strict";

const { initializeApp } = require('firebase/app');

const { ref, uploadBytes, getStorage, getDownloadURL } = require('firebase/storage');

// Set the configuration for your app
// TODO: Replace with your app's config object

const firebaseConfig = {
    apiKey: "AIzaSyB2Ahb9NnI5C7qXaZKQojhV9MSqt_JWjOs",
    authDomain: "assignment-app-e1add.firebaseapp.com",
    projectId: "assignment-app-e1add",
    storageBucket: "assignment-app-e1add.appspot.com",
    messagingSenderId: "1090038593399",
    appId: "1:1090038593399:web:a3b735926b5a6327a41372",
    measurementId: "G-D2B7T66V78"
  };

const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage(firebaseApp, firebaseConfig.storageBucket);


const uploadToFireBase = (file, name, contentType) => {
	return new Promise((resolve, reject) => {

		let fileName = `${new Date(Date.now()).toLocaleString()}${name}`;
		let imageRef = ref(storage, fileName);
		let metadata = {
			contentType: contentType
		};
		uploadBytes(imageRef, file, metadata).then(
			(snapshot) => {
				getDownloadURL(imageRef).then(
					(downloadURL) => {
						resolve(downloadURL);
					}
				);
			}
		);

	});
};

module.exports = uploadToFireBase;