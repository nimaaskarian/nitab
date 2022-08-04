import axios from "axios";

const unsplash = axios.create({
  baseURL: "https://api.unsplash.com",
  params: {
    client_id: "Oi5eeseZ0KatuzRuE5P1HFP7bk7UIUC-jIFXY5nS154",
  },
});
export default unsplash;
