import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { useQR } from '../context/QRContext';
import { Button } from './ui/button';
import { Download, FileText, Share2, ExternalLink } from 'lucide-react';
import { Extension } from '../types';
import { jsPDF } from 'jspdf';

export const QRPreview: React.FC = () => {
  const { config } = useQR();
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      ...config,
      width: 300,
      height: 300,
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        ...config,
        width: 300,
        height: 300,
      });
    }
  }, [config]);

  const onDownload = (extension: Extension) => {
    if (qrCode.current) {
      qrCode.current.download({
        name: "codearmond-qr",
        extension: extension
      });
    }
  };

  const exportReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(114, 47, 55); // Wine Red (#722f37)
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Relatório CODEARMOND QR', 20, 25);
    
    // Content
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.setFontSize(12);
    doc.text(`Data do Relatório: ${new Date().toLocaleString()}`, 20, 50);
    doc.text(`Conteúdo do QR: ${config.data}`, 20, 60);
    
    doc.setFontSize(14);
    doc.text('Configurações Técnicas:', 20, 80);
    doc.setFontSize(10);
    doc.text(`- Largura/Altura: ${config.width}px`, 25, 90);
    doc.text(`- Margem: ${config.margin}px`, 25, 95);
    doc.text(`- Cor dos Pontos: ${config.dotsOptions.color}`, 25, 100);
    doc.text(`- Tipo de Pontos: ${config.dotsOptions.type}`, 25, 105);
    
    doc.save('codearmond-qr-report.pdf');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-12">
      {/* Preview Container */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-tr from-red-900/10 to-red-950/10 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all duration-500" />
        <div className="relative bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(114,47,55,0.1)] border border-red-50 transition-transform duration-500 hover:scale-[1.02]">
          <div ref={qrRef} className="flex items-center justify-center" />
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-md space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => onDownload('png')} 
            className="h-14 bg-[#722f37] hover:bg-[#5a252c] text-white rounded-2xl shadow-lg shadow-red-100 transition-all active:scale-95 font-bold"
          >
            <Download className="w-5 h-5 mr-2" />
            Baixar PNG
          </Button>
          <Button 
            onClick={() => onDownload('svg')} 
            variant="outline"
            className="h-14 border-red-200 text-red-900 hover:bg-red-50 rounded-2xl transition-all active:scale-95 font-bold"
          >
            <Download className="w-5 h-5 mr-2" />
            Baixar SVG
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={exportReport}
            variant="ghost" 
            className="flex-1 h-12 text-slate-500 hover:text-[#722f37] hover:bg-red-50 rounded-xl text-xs font-semibold"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exportar Relatório PDF
          </Button>
          <Button 
            variant="ghost" 
            className="h-12 w-12 text-slate-500 hover:text-[#722f37] hover:bg-red-50 rounded-xl"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {config.data.startsWith('http') && (
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            <ExternalLink className="w-3 h-3" />
            <span>Destino: {new URL(config.data).hostname}</span>
          </div>
        )}
      </div>
    </div>
  );
};
