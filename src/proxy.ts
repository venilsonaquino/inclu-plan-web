import { NextResponse, NextRequest } from 'next/server';

// Este proxy intercepta todas as requisições para validar a sessão
export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  console.log(`[Proxy] Verificando rota: ${pathname} | Token presente: ${!!token}`);

  // Definimos o que é rota pública de autenticação
  const isAuthPage = pathname === '/login' || pathname === '/cadastro';
  
  // Ignoramos arquivos estáticos, rotas de API internas e assets do Next.js
  const isStaticOrApi = pathname.startsWith('/_next') || 
                        pathname.startsWith('/api') || 
                        pathname.includes('.') ||
                        pathname === '/favicon.ico';

  if (isStaticOrApi) {
    return NextResponse.next();
  }

  // Lógica de redirecionamento:
  // 1. Se estiver logado e tentar acessar login/cadastro, manda pro app
  if (isAuthPage) {
    if (token) {
      console.log(`[Proxy] Usuário logado tentando acessar ${pathname}. Redirecionando para /turmas/criar`);
      return NextResponse.redirect(new URL('/turmas/criar', request.url));
    }
    return NextResponse.next();
  }

  // 2. Se não estiver logado e tentar acessar qualquer outra tela (barra ou interna), manda pro login
  if (!token) {
    console.log(`[Proxy] Usuário não autenticado tentando acessar ${pathname}. Redirecionando para /login`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
