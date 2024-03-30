const URL = 'https://scholar-api2.p.rapidapi.com/search';

export const callScholarAPI = async (query: string) => {
  const fullURL = `${URL}?q=${query}`;
  try {
    const response = await fetch(
        fullURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': '19cc737024msh60fef5315e88d61p19f58fjsn1e2192b5f5ce',
          'x-rapidapi-host': 'scholar-api2.p.rapidapi.com',
        }
      });
    
    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();

  }

  catch (error) {
    return error;
  }
}