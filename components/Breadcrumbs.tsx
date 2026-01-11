
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  // Schema for Breadcrumbs specifically for the UI component (optional visually, but good for structure)
  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-5xl mx-auto mb-6">
      <ol className="flex items-center flex-wrap gap-2 text-xs md:text-sm font-mono text-slate-500">
        <li className="flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 flex items-center gap-1 transition-colors">
            <Home className="w-3 h-3" /> Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-700" />
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index < items.length - 1 ? (
              <>
                <Link href={item.href} className="hover:text-blue-400 transition-colors">
                  {item.label}
                </Link>
                <ChevronRight className="w-3 h-3 text-slate-700" />
              </>
            ) : (
              <span className="text-slate-300 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
