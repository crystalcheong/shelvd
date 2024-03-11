import Book from '@/components/Book'
import { HardcoverEndpoints } from '@/data/clients/hardcover.api'
import { useNavigate, useParams } from '@/router'
import { Hardcover } from '@/types'
import { DefaultTrendPeriod } from '@/types/hardcover'
import { HardcoverUtils } from '@/utils/clients/hardcover'
import { ShelvdUtils } from '@/utils/clients/shelvd'
import { cn } from '@/utils/dom'

const TrendingPeriodPage = () => {
  const navigate = useNavigate()

  const { period = DefaultTrendPeriod } = useParams('/trending/:period')

  const { trending } = HardcoverEndpoints
  const { data, isSuccess } = trending.useQuery(undefined)

  const books: Hardcover.Book[] = isSuccess
    ? data?.results?.[period as Hardcover.TrendPeriod] ?? []
    : []

  return (
    <main className=" max-h-[80dvh] w-full overflow-auto">
      {books.map((hcBook, idx) => {
        const book: Book = HardcoverUtils.parseBook(hcBook)
        return (
          <Book
            key={`${book.source}-${idx}-${book.key}`}
            book={book!}
          >
            <div
              onClick={() => {
                navigate(
                  {
                    pathname: '/book/:slug?',
                  },
                  {
                    state: {
                      source: book.source,
                    },
                    params: {
                      slug: book.slug ?? book.key,
                    },
                    unstable_viewTransition: true,
                  },
                )
              }}
              className={cn(
                'flex flex-row place-content-start place-items-start gap-4',
                'w-full border-b py-2',
              )}
            >
              <small className="whitespace-nowrap	"># {idx + 1}</small>
              <Book.Thumbnail className="w-fit !rounded-none" />

              <aside>
                <p className="h4 line-clamp-3 truncate text-pretty capitalize">
                  {book.title}
                </p>
                <p className="!m-0 capitalize text-muted-foreground">
                  <small className="font-semibold uppercase">by</small>&nbsp;
                  {ShelvdUtils.printAuthorName(book.author.name, {
                    mandatoryNames: [book.author.name],
                  })}
                </p>
              </aside>
            </div>
          </Book>
        )
      })}
    </main>
  )
}

export default TrendingPeriodPage