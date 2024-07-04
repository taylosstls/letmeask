import firebase from 'firebase/compat/app';
import { useEffect, useState } from "react"

import { FirebaseQuestion, Question } from "../types/FirebaseQuestions"
import { database } from '../services/firebase';

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState()

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    const questionsRef = roomRef.child('questions');

    const handleChangeTitle = (snapshot: firebase.database.DataSnapshot) => {
      const databaseRoom = snapshot.val();
      setTitle(databaseRoom.title)
    }

    const handleChildAdded = (snapshot: firebase.database.DataSnapshot) => {
      const newQuestion: FirebaseQuestion = snapshot.val();
      const newQuestionKey = snapshot.key as string;
  
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          id: newQuestionKey,
          ...newQuestion,
        },
      ]);
    };
  
    const handleChildChanged = (snapshot: firebase.database.DataSnapshot) => {
      const updatedQuestion: FirebaseQuestion = snapshot.val();
      const updatedQuestionKey = snapshot.key as string;
  
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === updatedQuestionKey
            ? {
                id: updatedQuestionKey,
                ...updatedQuestion,
              }
            : question
        )
      );
    };
  
    const handleChildRemoved = (snapshot: firebase.database.DataSnapshot) => {
      const removedQuestionKey = snapshot.key as string;
  
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== removedQuestionKey)
      );
    };

    roomRef.once('value', handleChangeTitle);
    questionsRef.on('child_added', handleChildAdded);
    questionsRef.on('child_changed', handleChildChanged);
    questionsRef.on('child_removed', handleChildRemoved);
  
    return () => {
      questionsRef.off('child_added', handleChildAdded);
      questionsRef.off('child_changed', handleChildChanged);
      questionsRef.off('child_removed', handleChildRemoved);
    };
  }, [roomId]);

  return { questions, title }
}