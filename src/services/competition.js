import {
  useEffect,
  useState
} from 'react';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import {
  db
} from '../firebase/firebaseConfig';

export function useFirestore(collectionName) {
  const [data, setData] = useState([]);
  const [dataById, setDataById] = useState([]);
  const [addedData, setAddedData] = useState("");
  const [userData, setUserData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchData(collectionName) {
    setIsLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(docs);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  }
  async function addDocument(document, collectionName) {
    try {
      const docRef = await addDoc(collection(db, collectionName), document);
      setAddedData(...data, {
        id: docRef.id,
        ...document
      });
    } catch (error) {
      setError(error);
    }
  }

  async function updateDocument(id, updatedDocument, collectionName) {
    setIsLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, updatedDocument);
      const updatedDocs = data.map((doc) => (doc.id === id ? {
        id,
        ...updatedDocument
      } : doc));
      setData(updatedDocs);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);

  }

  async function deleteDocument(id, collectionName) {
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

  async function getCompetitionById(id, collectionName) {
    setIsLoading(true)
    setError(null)
    try {
      const docRef = doc(db, collectionName, id);
      const docSnapshot = await getDoc(docRef);
      const competitionData = docSnapshot.data();
      setDataById(competitionData);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false)
  }
  async function deleteUnique(id, collectionName) {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(
        query(collection(db, collectionName), where('id', '==', id))
      );
      const promises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(promises);
      const filteredDocs = data.filter((doc) => doc.id !== id);
      setData(filteredDocs);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  }

  async function getUserByEmail(email) {
    setIsLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserData(docs);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  }
  

  async function formatData() {
    setData([])
  }
  return {
    data,
    isLoading,
    error,
    dataById,
    getCompetitionById,
    addDocument,
    updateDocument,
    deleteDocument,
    fetchData,
    deleteUnique,
    getUserByEmail,
    userData,
    addedData
  };
}