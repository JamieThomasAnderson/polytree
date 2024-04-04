import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash, Workflow } from "lucide-react";

interface ArticleListProps {
  handleDelete: (id: number) => void;
  handlePropogate: (url: string, articleID: number) => void;
  articles: Array<{ name: string; id: string; attr: Object; group: number }>;
  node: any;
  query: string;
}

export const ArticleList = ({
  articles,
  node,
  query,
  handleDelete,
  handlePropogate,
}: ArticleListProps) => {
  const resultsInOrder = articles.sort((a, b) => b.group - a.group);

  const results = resultsInOrder.filter(
    (article) =>
      (!query || article.name.toLowerCase().includes(query.toLowerCase())) &&
      (!node || node.id === article.id),
  );
  const Search = ({ article }: { article: any }) => {
    return (
      <div key={article.id} className="pl-8 pr-8 pt-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="">{article.name}</CardTitle>
              <div
                role="button"
                onClick={() => {
                  handleDelete(article.id);
                }}
                className=""
              >
                <Trash className="hover:bg-secondary p-1 rounded-md w-8 h-8" />
              </div>
            </div>
            <CardDescription className="hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600 content-start">
              <a
                href={`https://scholar.google.com.au/scholar?q=${article.name}`}
              >
                Search Query
              </a>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  };

  const Article = ({ article }: { article: any }) => {
    return (
      <div className="pl-8 pr-8 pt-4">
        <Card>
          <CardHeader>
            <CardTitle className="hover:underline">
              <a href={(article.attr as { article: string }).article}>
                {article.name}
              </a>
            </CardTitle>
            <CardDescription className="flex text-lime-500 dark:text-lime-200">
              <p className="pr-2">
                {(article.attr as { authors: Array<string> }).authors.join(
                  "  ",
                )}
              </p>
              <p className="pl-2">
                {(
                  article.attr as { publication: Array<string> }
                ).publication.join(" ")}
              </p>
            </CardDescription>
            <CardDescription>
              {(article.attr as { excerpt: string }).excerpt}
            </CardDescription>
          </CardHeader>
          <div className="flex justify-between">
            <CardFooter>
              <div className="text-xs">
                {(article.attr as { access: string }).access !==
                  "javascript:void(0)" && (
                  <a
                    href={(article.attr as { access: string }).access}
                    className="hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600 content-start pr-2"
                  >
                    [PDF]
                  </a>
                )}
                {(article.attr as { citedBy: string }).citedBy.length !== 0 && (
                  <a
                    href={(article.attr as { citedBy: string }).citedBy}
                    className="hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600 content-start pr-2"
                  >
                    Cited By
                  </a>
                )}
                {(article.attr as { relatedArticles: string })
                  .relatedArticles && (
                  <a
                    href={
                      (article.attr as { relatedArticles: string })
                        .relatedArticles
                    }
                    className="hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600 content-start pr-2"
                  >
                    Related
                  </a>
                )}
                {(article.attr as { relatedArticles: string })
                  .relatedArticles && (
                  <a
                    href={
                      (article.attr as { versionHistory: string })
                        .versionHistory
                    }
                    className="hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600 content-start pr-2"
                  >
                    Version History
                  </a>
                )}
              </div>
            </CardFooter>
            <CardFooter className="space-x-2">
              {(article.attr as { citedBy: string }).citedBy.length !== 0 && (
                <div
                  role="button"
                  onClick={() => {
                    handlePropogate(
                      (article.attr as { citedBy: string }).citedBy,
                      article.id,
                    );
                  }}
                >
                  <Workflow className="hover:bg-secondary p-1 rounded-md w-8 h-8" />
                </div>
              )}
              <div
                role="button"
                onClick={() => {
                  handleDelete(article.id);
                }}
                className=""
              >
                <Trash className="hover:bg-secondary p-1 rounded-md w-8 h-8" />
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <>
      {results.map((article) =>
        (article.attr as { article: string }).article === "" ? (
          <div key={article.id}>
            <Search article={article} />
          </div>
        ) : (
          <div key={article.id}>
            <Article article={article} />
          </div>
        ),
      )}
    </>
  );
};
