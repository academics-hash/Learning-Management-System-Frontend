export const getBaseUrl = (path) => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api/v1";
    // Remove trailing slash for consistency
    const baseUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
    return `${baseUrl}/${path}/`;
};
