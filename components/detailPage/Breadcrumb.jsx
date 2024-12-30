import Link from "next/link"; // Import Link from Next.js

const Breadcrumb = ({ paths }) => (
  <nav className="text-sm flex px-5">
    {paths.map((path, index) => (
      <span key={index} className="flex items-center">
        {path.link ? (
          <Link href={path.link}>
            <span className="text-gray-400 hover:text-green-400 cursor-pointer">
              {path.name} {path.ticker && `(${path.ticker})`}
            </span>
          </Link>
        ) : (
          <span className="text-green-400 font-bold">
            {path.name} {path.ticker && `(${path.ticker})`}
          </span>
        )}
        {index < paths.length - 1 && (
          <span className="mx-2 text-gray-500">/</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
