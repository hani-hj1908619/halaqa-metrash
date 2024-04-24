const fetcher = async (...args) => {
    const response = await fetch(...args);
    if (!response.ok) {
        throw new Error(response.status);
    }
    return await response.json();
};

export { fetcher }