// Remove trailing slash if present to avoid double slashes in API calls
// const BACKEND_URL = "http://localhost:8000/"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export default BACKEND_URL;
