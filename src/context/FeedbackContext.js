import { createContext, useState, useEffect } from "react";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [feedback, setFeedback] = useState([]);
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  });

  //to load the data as soon as page loads
  useEffect(() => {
    fetchFeedback();
  }, []);

  //fetch feedback data from json server
  const fetchFeedback = async () => {
    const response = await fetch(`/feedback`);
    const data = await response.json();
    setFeedback(data);
    setIsLoading(false);
  };

  //add feedback
  const addFeedback = async (newFeedback) => {
    const response = await fetch("/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFeedback),
    });

    const data = await response.json();
    setFeedback([data, ...feedback]);
  };

  //delete feedback
  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback")) {
      await fetch(`/feedback/${id}`, {
        method: "DELETE",
      });

      setFeedback(feedback.filter((item) => item.id !== id));
    }
  };

  //set item to be updated
  const editFeedback = (item) => {
    setFeedbackEdit({
      item: item,
      edit: true,
    });
  };

  //update current feedback item
  const updateFeedback = async (id, updItem) => {
    const response = await fetch(`/feedback/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updItem),
    });

    const data = await response.json;

    setFeedback(
      feedback.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        addFeedback,
        deleteFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
