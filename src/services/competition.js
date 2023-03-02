// import { db,app } from "../firebase/firebaseConfig";
// import {
//   collection,
//   getDoc,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc
// } from "firebase/firestore";

// const competitionRef = collection(db, "competition");
// class competitionService {
//   addCompetition(newCompetition) {
//     return addDoc(competitionRef, newCompetition);
//   }

//   updateCompetition(id, updatedCompetition) {
//     //check if id exist in database
//     const competitionDoc = doc(db, "competition", id);

//     //replace the value with the new competition value
//     return updateDoc(competitionDoc, updatedCompetition);
//   }

//   deleteCompetition(id) {
//     const competitionDoc = doc(db, "competition", id);
//     return deleteDoc(competitionDoc);
//   }

//   getAllCompetitions(){
//     return getDocs(competitionRef);
//   }

//   getCompetitionById(id){
//     const competitionDoc = doc(db, "competition", id);
//     return getDoc(competitionDoc);  
//   }
// }

// export default new competitionService();



import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export function useFirestore(collectionName) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(docs);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    }

    fetchData();
  }, [collectionName]);

  async function addDocument(document) {
    try {
      const docRef = await addDoc(collection(db, collectionName), document);
      setData([...data, { id: docRef.id, ...document }]);
    } catch (error) {
      setError(error);
    }
  }

  async function updateDocument(id, updatedDocument) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, updatedDocument);
      const updatedDocs = data.map((doc) => (doc.id === id ? { id, ...updatedDocument } : doc));
      setData(updatedDocs);
    } catch (error) {
      setError(error);
    }
  }

  async function deleteDocument(id) {
    try {

      setIsLoading(true);
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      const filteredDocs = data.filter((doc) => doc.id !== id);
      setIsLoading(false);
      setData(filteredDocs);
    } catch (error) {
      setError(error);
    }
  }

  return { data, isLoading, error, addDocument, updateDocument, deleteDocument  };
}
