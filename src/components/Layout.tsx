import React from 'react';
import { useQR } from '../context/QRContext';
import { auth, googleProvider, signInWithPopup, signOut } from '../lib/firebase';
import { Button } from './ui/button';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthReady } = useQR();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-red-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#722f37] rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
            <span className="text-white font-bold text-xl tracking-tighter">CA</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-slate-900">CODEARMOND</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#722f37] uppercase">QR Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-[#722f37] transition-colors">Recursos</a>
            <a href="#" className="hover:text-[#722f37] transition-colors">Preços</a>
            <a href="#" className="hover:text-[#722f37] transition-colors">Docs</a>
          </nav>

          <div className="h-6 w-[1px] bg-slate-200 hidden lg:block" />

          {isAuthReady && (
            user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-red-50 rounded-2xl border border-red-100 shadow-sm">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-[#722f37]" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 leading-none">
                      {user.displayName}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      {user.email}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-900 hover:bg-red-100 rounded-xl">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <Button onClick={handleLogin} className="bg-[#722f37] hover:bg-[#5a252c] text-white shadow-lg shadow-red-100 transition-all active:scale-95 rounded-xl">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar com Google
              </Button>
            )
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#fcfcfd]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-red-50 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
            <div className="space-y-6 col-span-1 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#722f37] rounded-lg flex items-center justify-center shadow-md shadow-red-50">
                  <span className="text-white font-bold text-sm">CA</span>
                </div>
                <span className="font-bold text-slate-900 tracking-tight">CODEARMOND</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                A ferramenta definitiva para criação de QR Codes estilizados e análise de dados com inteligência artificial.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Produto</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#722f37] transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-[#722f37] transition-colors">API</a></li>
                <li><a href="#" className="hover:text-[#722f37] transition-colors">Segurança</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Suporte</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#722f37] transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-[#722f37] transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-[#722f37] transition-colors">Ajuda</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Newsletter</h4>
              <p className="text-xs text-slate-500">Receba novidades e dicas de design.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Seu e-mail" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#722f37] transition-all" />
                <Button size="sm" className="bg-[#722f37] hover:bg-[#5a252c] rounded-xl">OK</Button>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-red-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-xs">
              © {new Date().getFullYear()} CODEARMOND. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-[#722f37] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#722f37] transition-colors">Twitter</a>
              <a href="#" className="hover:text-[#722f37] transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
