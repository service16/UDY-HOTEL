// Import Firebase SDKs (using modular CDN versions)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Replace this configuration with your actual Firebase project configuration from Step 1
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- REAL-TIME UNITS (ROOMS & APARTMENTS) LISTENER ---
export function listenToUnits(callback) {
    const colRef = collection(db, "units");
    // onSnapshot listens to live changes automatically across all screens!
    onSnapshot(colRef, (snapshot) => {
        const units = [];
        snapshot.forEach((docSnap) => {
            units.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(units);
    });
}

// --- ADD NEW UNIT ---
export async function addUnit(unitData) {
    try {
        await addDoc(collection(db, "units"), unitData);
    } catch (e) {
        console.error("Error adding unit: ", e);
    }
}

// --- UPDATE UNIT ---
export async function updateUnit(id, updatedData) {
    try {
        const unitRef = doc(db, "units", id);
        await updateDoc(unitRef, updatedData);
    } catch (e) {
        console.error("Error updating unit: ", e);
    }
}

// --- DELETE UNIT ---
export async function deleteUnitData(id) {
    try {
        await deleteDoc(doc(db, "units", id));
    } catch (e) {
        console.error("Error deleting unit: ", e);
    }
}

// --- REAL-TIME BOOKINGS ---
export function listenToBookings(callback) {
    const colRef = collection(db, "bookings");
    onSnapshot(colRef, (snapshot) => {
        const bookings = [];
        snapshot.forEach((docSnap) => {
            bookings.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(bookings);
    });
}

export async function createBooking(bookingData) {
    try {
        await addDoc(collection(db, "bookings"), bookingData);
    } catch (e) {
        console.error("Error creating booking: ", e);
    }
}
