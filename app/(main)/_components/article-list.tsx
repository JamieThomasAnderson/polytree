
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ArticleListProps {
  articles: Array<{ name: string, id: string, attr: Object, group: number }>;
}

export const ArticleList = ({articles}: ArticleListProps) => {

  return (
    <>
      {articles.map((article) => (
        article.group === -1 ? <Separator /> : (
          <div key={article.id} className="pl-8 pr-8 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="hover:underline">
                  <a href={(article.attr as {article: string}).article}>{article.name}</a>
                </CardTitle>
                <CardDescription className="flex text-lime-500 dark:text-lime-200">
                  <p className="pr-2">{((article.attr as { authors: Array<string> }).authors).join("  ")}</p>
                  <p className="pl-2">{((article.attr as { publication: Array<string> }).publication).join(" ")}</p>
                </CardDescription>
                <CardDescription>
                  {(article.attr as { excerpt: string }).excerpt}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="text-xs">
                  <a href={(article.attr as { access: string }).access} className="hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600 content-start pr-2">
                    [PDF] 
                  </a>
                  <a href={(article.attr as { citedBy: string }).citedBy} className="hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600 content-start pr-2">
                    Cited By
                  </a>
                  <a href={(article.attr as { relatedArticles: string }).relatedArticles} className="hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600 content-start pr-2">
                    Related
                  </a>
                  <a href={(article.attr as { versionHistory: string }).versionHistory} className="hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600 content-start pr-2">
                    Version History
                  </a>
                </div>
              </CardFooter>
            </Card>
          </div>
        )
      ))}
    </>
  );
}