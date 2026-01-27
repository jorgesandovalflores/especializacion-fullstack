import {
    collection,
    addDoc,
    onSnapshot,
    Timestamp,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const messagesRef = collection(db, "mensajes");

export const addMessage = (text: string, userEmail: string) => {
    return addDoc(messagesRef, {
        text,
        user: userEmail,
        createdAt: Timestamp.now(),
    });
};

export const listenMessages = (callback: (data: any[]) => void) => {
    const q = query(messagesRef, orderBy("createdAt"));
    onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(messages);
    });
};
