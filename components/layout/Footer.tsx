import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border mt-12 py-8 px-4 sm:px-6 lg:px-8 bg-bg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <Link href="/sobre" className="hover:text-text-secondary">Sobre nosotros</Link>
          <Link href="/contacto" className="hover:text-text-secondary">Contacto</Link>
          <Link href="/privacidad" className="hover:text-text-secondary">Privacidad</Link>
          <Link href="/terminos" className="hover:text-text-secondary">Términos</Link>
        </div>
        <p className="text-center">
          Powered by AI · Fuente:{' '}
          <a
            href="https://www.boletinoficial.gob.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Boletín Oficial
          </a>
        </p>
      </div>
    </footer>
  );
}
