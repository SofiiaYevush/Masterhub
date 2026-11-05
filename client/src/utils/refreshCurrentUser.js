import newRequest from "./newRequest";

const refreshCurrentUser = async () => {
  try {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser")
    );

    if (!currentUser?._id) return null;

    const { data } = await newRequest.get(
      `/users/${currentUser._id}`
    );

    localStorage.setItem("currentUser", JSON.stringify(data));

    return data;
  } catch (error) {
    console.error("Failed to refresh current user:", error);
    return null;
  }
};

export default refreshCurrentUser;