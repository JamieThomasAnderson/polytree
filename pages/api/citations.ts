import type { NextApiRequest, NextApiResponse } from 'next'

const URL = 'https://scholar-api2.p.rapidapi.com';

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const fullURL = `${URL}/cite?id=${id}`;

  try {
    const response = await fetch(
        fullURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': process.env.RAPID_API_KEY as string,
          'x-rapidapi-host': 'scholar-api2.p.rapidapi.com',
        }
      });
    
    if (response.status !== 200) {
      throw new Error("Failed to fetch data");
    }
    
    res.json(await response.json());

  }

  catch (error) {
    return error;
  }
}