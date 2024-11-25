import { getAuth } from "firebase/auth";

export const getIdToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("No user is currently signed in.");
    return null;
  }

  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error retrieving ID token:", error);
    return null;
  }
};
