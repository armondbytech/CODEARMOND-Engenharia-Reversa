import React, { useState } from 'react';
import { useQR } from '../context/QRContext';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { DotType, CornerSquareType, CornerDotType } from '../types';
import { Sparkles, Save, History, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const ConfigPanel: React.FC = () => {
  const { 
    config, 
    user,
    history,
    updateConfig, 
    updateDotsOptions, 
    updateCornersSquareOptions, 
    updateCornersDotOptions,
    saveToHistory
  } = useQR();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveName, setSaveName] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateConfig({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWithAI = async () => {
    if (!config.data) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analise este conteúdo de QR Code e forneça uma breve avaliação de segurança e utilidade em português. Conteúdo: ${config.data}`,
      });
      setAiAnalysis(response.text || "Não foi possível analisar.");
    } catch (error) {
      console.error('AI Analysis error:', error);
      setAiAnalysis("Erro ao conectar com a IA.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!saveName) return;
    setIsSaving(true);
    try {
      await saveToHistory(saveName);
      setSaveName('');
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center gap-4 py-3">
      <Label className="w-32 text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">{label}</Label>
      <div className="flex-1">{children}</div>
    </div>
  );

  return (
    <div className="w-full space-y-8">
      {/* AI Analysis Section */}
      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#722f37]">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-sm">Análise Inteligente</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={analyzeWithAI} 
            disabled={isAnalyzing || !config.data}
            className="text-[#722f37] hover:bg-red-100"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analisar'}
          </Button>
        </div>
        
        {aiAnalysis ? (
          <div className="bg-white border border-red-100 p-4 rounded-xl text-xs text-slate-600 leading-relaxed flex gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
            <p>{aiAnalysis}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Insira dados no QR Code para que a IA possa analisar a segurança e utilidade.
          </p>
        )}
      </div>

      <Accordion type="single" collapsible defaultValue={"main" as any} className="w-full space-y-4 border-none">
        
        {/* Main Options */}
        <AccordionItem value="main" className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
          <AccordionTrigger className="px-6 py-4 hover:bg-red-50/30 transition-colors hover:no-underline group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-data-[state=open]:bg-[#722f37] transition-colors">
                <Sparkles className="w-4 h-4 text-[#722f37] group-data-[state=open]:text-white" />
              </div>
              <span className="font-bold text-slate-700 text-sm">Configurações Base</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 space-y-2">
            <FieldRow label="Conteúdo">
              <Textarea 
                value={config.data}
                onChange={(e) => updateConfig({ data: e.target.value })}
                placeholder="https://..."
                className="min-h-[100px] resize-none border-slate-200 rounded-xl focus-visible:ring-red-900/20 focus-visible:border-[#722f37]"
              />
            </FieldRow>
            
            <FieldRow label="Logotipo">
              <div className="flex items-center gap-3">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border-slate-200 rounded-xl h-10 py-1.5 px-3 text-xs file:hidden focus-visible:ring-red-900/20 focus-visible:border-[#722f37]"
                />
                {config.image && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => updateConfig({ image: null })}
                    className="text-xs text-slate-400 hover:text-red-500"
                  >
                    Remover
                  </Button>
                )}
              </div>
            </FieldRow>

            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Largura">
                <Input 
                  type="number"
                  value={config.width}
                  onChange={(e) => updateConfig({ width: parseInt(e.target.value) || 0 })}
                  className="border-slate-200 rounded-xl h-10 focus-visible:ring-red-900/20 focus-visible:border-[#722f37]"
                />
              </FieldRow>
              <FieldRow label="Margem">
                <Input 
                  type="number"
                  value={config.margin}
                  onChange={(e) => updateConfig({ margin: parseInt(e.target.value) || 0 })}
                  className="border-slate-200 rounded-xl h-10 focus-visible:ring-red-900/20 focus-visible:border-[#722f37]"
                />
              </FieldRow>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Style Options */}
        <AccordionItem value="style" className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
          <AccordionTrigger className="px-6 py-4 hover:bg-red-50/30 transition-colors hover:no-underline group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-data-[state=open]:bg-[#722f37] transition-colors">
                <Sparkles className="w-4 h-4 text-[#722f37] group-data-[state=open]:text-white" />
              </div>
              <span className="font-bold text-slate-700 text-sm">Estilo Visual</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 space-y-4">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pontos (Dots)</h4>
              <FieldRow label="Tipo">
                <Select 
                  value={config.dotsOptions.type} 
                  onValueChange={(value: DotType) => updateDotsOptions({ type: value })}
                >
                  <SelectTrigger className="border-slate-200 rounded-xl h-10 focus:ring-red-900/20 focus:border-[#722f37]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rounded">Arredondado</SelectItem>
                    <SelectItem value="dots">Pontilhado</SelectItem>
                    <SelectItem value="classy">Elegante</SelectItem>
                    <SelectItem value="square">Quadrado</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
              <FieldRow label="Cor">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden shrink-0">
                    <Input 
                      type="color" 
                      value={config.dotsOptions.color}
                      onChange={(e) => updateDotsOptions({ color: e.target.value })}
                      className="w-full h-full p-0 border-none cursor-pointer scale-150"
                    />
                  </div>
                  <Input 
                    value={config.dotsOptions.color}
                    onChange={(e) => updateDotsOptions({ color: e.target.value })}
                    className="border-slate-200 rounded-xl h-10 focus-visible:ring-red-900/20 focus-visible:border-[#722f37] font-mono text-xs"
                  />
                </div>
              </FieldRow>
            </div>

            <div className="pt-4 border-t border-slate-50 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cantos (Corners)</h4>
              <FieldRow label="Formato">
                <Select 
                  value={config.cornersSquareOptions.type} 
                  onValueChange={(value: CornerSquareType) => updateCornersSquareOptions({ type: value })}
                >
                  <SelectTrigger className="border-slate-200 rounded-xl h-10 focus:ring-red-900/20 focus:border-[#722f37]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Quadrado</SelectItem>
                    <SelectItem value="dot">Ponto</SelectItem>
                    <SelectItem value="extra-rounded">Extra Arredondado</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* History Section */}
        {user && (
          <AccordionItem value="history" className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:bg-red-50/30 transition-colors hover:no-underline group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-data-[state=open]:bg-[#722f37] transition-colors">
                  <History className="w-4 h-4 text-[#722f37] group-data-[state=open]:text-white" />
                </div>
                <span className="font-bold text-slate-700 text-sm">Histórico Salvo</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2 space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Nome do QR Code" 
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  className="border-slate-200 rounded-xl h-10 focus-visible:ring-red-900/20 focus-visible:border-[#722f37]"
                />
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || !saveName}
                  className="bg-[#722f37] hover:bg-[#5a252c] rounded-xl"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                </Button>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {history.length > 0 ? (
                  history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-red-200 transition-colors group">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{item.name}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{item.data}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateConfig(item.config)}
                        className="text-red-900 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Carregar
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">Nenhum QR Code salvo ainda.</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Privacy Note */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 leading-relaxed">
          <span className="font-bold text-slate-700">Proteção de Privacidade:</span> Seus dados são processados localmente e criptografados ao serem salvos no Firebase. Não rastreamos o conteúdo dos seus QR Codes sem sua permissão.
        </p>
      </div>
    </div>
  );
};
