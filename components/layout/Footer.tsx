import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border mt-12 py-6 px-4 sm:px-6 lg:px-8 bg-bg">
      <div className="max-w-7xl mx-auto text-center text-xs text-text-muted space-y-2">
        <p>
          <Link href="/sobre" className="text-accent hover:underline font-medium">
            ¿Por qué hacemos esto?
          </Link>
          {' · '}
          Hecho por{' '}
          <a
            href="https://lawal.coop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline font-medium"
          >
            Cooperativa Lawal
          </a>
          {' · '}
          <a
            href="https://www.mozilla.org/en-US/MPL/2.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-secondary"
          >
            MPL 2.0
          </a>
        </p>
        <p>
          Fuente:{' '}
          <a
            href="https://www.boletinoficial.gob.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Boletín Oficial de la República Argentina
          </a>
        </p>
      </div>
    </footer>
  );
}
