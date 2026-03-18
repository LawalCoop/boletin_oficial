import { Metadata } from 'next';
import { Articulo } from '@/lib/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArticleHero } from '@/components/article/ArticleHero';
import { AIBanner } from '@/components/article/AIBanner';
import { Summary } from '@/components/article/Summary';
import { KeyPoints } from '@/components/article/KeyPoints';
import { VoteSection } from '@/components/article/VoteSection';
import { OriginalText } from '@/components/article/OriginalText';
import { ImpactSection } from '@/components/article/ImpactSection';
import { RelatedArticles } from '@/components/article/RelatedArticles';
import { ArticleChat } from '@/components/article/ArticleChat';
import { CTABar } from '@/components/article/CTABar';
import { ArticleSidebar } from '@/components/article/ArticleSidebar';

async function getArticulo(slug: string): Promise<Articulo | null> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'articulos', `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articulo = await getArticulo(slug);

  if (!articulo) {
    return {
      title: 'Artículo no encontrado | entreLín[IA]s',
    };
  }

  const title = articulo.contenidoIA.titulo;
  const description = articulo.contenidoIA.resumen.slice(0, 160) + '...';
  const image = articulo.imagen || '/og-image.jpg';

  return {
    title: `${title} | entreLín[IA]s`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://entrelinias.vercel.app/articulo/${slug}`,
      siteName: 'entreLín[IA]s',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articulo = await getArticulo(slug);

  if (!articulo) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-text-primary mb-2">
              Artículo no encontrado
            </h1>
            <p className="text-text-muted">
              El artículo que buscás no existe o fue removido.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header - Desktop only, mobile has back button in Hero */}
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* Hero Section */}
      <ArticleHero articulo={articulo} />

      {/* Article Body - Desktop has sidebar */}
      <div className="max-w-7xl mx-auto lg:flex lg:gap-8 lg:px-8 lg:py-8">
        {/* Main Content - News article style */}
        <main className="flex-1 flex flex-col gap-8 p-4 sm:p-6 lg:p-0 lg:max-w-3xl">
          {/* AI Banner - Small disclaimer */}
          <AIBanner articulo={articulo} />

          {/* Lead paragraph + Educational Context - The heart of the article */}
          <Summary
            resumen={articulo.contenidoIA.resumen}
            contexto={articulo.contenidoIA.contexto}
          />

          {/* Key Points - What you need to know */}
          <section>
            <h2 className="text-xs font-semibold text-text-muted tracking-[1.5px] uppercase mb-4">
              Lo que tenés que saber
            </h2>
            <KeyPoints puntosClaves={articulo.contenidoIA.puntosClaves} />
          </section>

          <hr className="border-border" />

          {/* Impact Section - Who is affected */}
          <section>
            <h2 className="text-xs font-semibold text-text-muted tracking-[1.5px] uppercase mb-4">
              ¿A quién afecta?
            </h2>
            <ImpactSection grupos={articulo.contenidoIA.aQuienAfecta} />
          </section>

          <hr className="border-border" />

          {/* Original Text (collapsible) - For verification */}
          <OriginalText articulo={articulo} />

          <hr className="border-border" />

          {/* Vote Section - After reading everything */}
          <section className="py-4">
            <h2 className="text-xs font-semibold text-text-muted tracking-[1.5px] uppercase mb-4 text-center">
              ¿Qué te parece esta medida?
            </h2>
            <VoteSection slug={articulo.slug} />
          </section>

          {/* Related Articles - At the very end */}
          {articulo.relacionados && articulo.relacionados.length > 0 && (
            <>
              <hr className="border-border" />
              <RelatedArticles relacionados={articulo.relacionados} />
            </>
          )}
        </main>

        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:block w-80 shrink-0">
          <ArticleSidebar articulo={articulo} />
        </aside>
      </div>

      {/* CTA Bar with link to original Boletín Oficial - Mobile only */}
      <div className="lg:hidden">
        <CTABar articulo={articulo} />
      </div>

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ArticleChat articulo={articulo} />
    </div>
  );
}
