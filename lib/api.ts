import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const URL = 'https://scholar-api2.p.rapidapi.com/search';

export const hash = (str: string) => {
  const hash = crypto.createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

export const createSearchNode = (query: string, chunk: number) => {
  
  const searchNodeID = uuidv4();
  const searchNode = [
    {
      "name": query, 
      "id": searchNodeID, 
      "group": chunk,
      "attr": {
        "article": "",
        "authors": [],
        "authorProfile": "",
        "publication": [],
        "excerpt": "",
        "access": "",
        "citedBy": 0,
        "citationCount": 0,
        "relatedArticles": "",
        "versionHistory": ""
      }
    }
  ];

  return searchNode;
}


export const callScholarAPI = async (query: string) => {
  const fullURL = `${URL}?q=${query}`;

  console.log(process.env.NEXT_PUBLIC_RAPID_API_KEY);

  try {
    const response = await fetch(
        fullURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPID_API_KEY as string,
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

export const getNodeIDs = (articles: { article: string }[]) => {
  return articles.map(({ article }) => {
    const nodeID = hash(article);
    return nodeID;
  });
};

export const getNodes = (
  articles: {
    title: string;
    article: string;
    authors: Array<string>;
    authorProfile: string;
    publication: Array<string>;
    excerpt: string;
    access: string;
    citedBy: number;
    citationCount: number;
    relatedArticles: string;
    versionHistory: string;
  }[],
  nodeIDs: string[],
  chunk: number
) => {
  return articles.map(
    (
      {
        title,
        article,
        authors,
        authorProfile,
        publication,
        excerpt,
        access,
        citedBy,
        citationCount,
        relatedArticles,
        versionHistory,
      },
      index
    ) => {
      return {
        name: title,
        id: nodeIDs[index],
        group: chunk,
        attr: {
          article: article,
          authors: authors,
          authorProfile: authorProfile,
          publication: publication,
          excerpt: excerpt,
          access: access,
          citedBy: citedBy,
          citationCount: citationCount,
          relatedArticles: relatedArticles,
          versionHistory: versionHistory,
        },
      };
    }
  );
};

export const getLinks = (
  articles: { title: string }[],
  searchNodeID: string,
  nodeIDs: string[]
) => {
  return articles.map(({ title }, index) => ({
    source: searchNodeID,
    target: nodeIDs[index],
    value: 1,
  }));
};
