import Link from 'next/link';

function pageUrl(searchParams, n) {
  const params = new URLSearchParams(searchParams);
  params.set('page', String(n));
  return `/properties?${params.toString()}`;
}

export default function Pagination({ page, totalPages, searchParams }) {
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pageNums = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const linkBase = 'px-3.5 py-2 text-sm border rounded-lg transition-colors';
  const activeClass = `${linkBase} bg-primary text-white border-primary`;
  const inactiveClass = `${linkBase} border-border text-primary hover:bg-surface`;
  const disabledClass = `${linkBase} border-border text-muted opacity-40 cursor-not-allowed pointer-events-none`;

  return (
    <div className="flex items-center justify-center gap-1.5">

      {/* Prev */}
      {page > 1 ? (
        <Link href={pageUrl(searchParams, page - 1)} className={inactiveClass}>← Prev</Link>
      ) : (
        <span className={disabledClass}>← Prev</span>
      )}

      {/* First page + ellipsis */}
      {start > 1 && (
        <>
          <Link href={pageUrl(searchParams, 1)} className={inactiveClass}>1</Link>
          {start > 2 && <span className="text-muted text-sm px-1">…</span>}
        </>
      )}

      {/* Page range */}
      {pageNums.map((n) => (
        <Link key={n} href={pageUrl(searchParams, n)} className={n === page ? activeClass : inactiveClass}>
          {n}
        </Link>
      ))}

      {/* Last page + ellipsis */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-muted text-sm px-1">…</span>}
          <Link href={pageUrl(searchParams, totalPages)} className={inactiveClass}>{totalPages}</Link>
        </>
      )}

      {/* Next */}
      {page < totalPages ? (
        <Link href={pageUrl(searchParams, page + 1)} className={inactiveClass}>Next →</Link>
      ) : (
        <span className={disabledClass}>Next →</span>
      )}

    </div>
  );
}
