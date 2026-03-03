import { Link, Outlet, useLocation } from 'react-router';
import { cn } from '../lib/utils';

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' || path === '/raw-materials') {
      return location.pathname === '/' || location.pathname === '/raw-materials';
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">CRUD Challenge</h1>
            <nav className="flex gap-6">
              <Link
                to="/raw-materials"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive('/raw-materials')
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Raw Materials
              </Link>
              <Link
                to="/products"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive('/products')
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Products
              </Link>
              <Link
                to="/production-suggestion"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive('/production-suggestion')
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Production Suggestion
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
