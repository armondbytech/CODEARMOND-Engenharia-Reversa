import { Layout } from './components/Layout';
import { QRProvider } from './context/QRContext';
import { QRPreview } from './components/QRPreview';
import { ConfigPanel } from './components/ConfigPanel';
import { ScrollArea } from './components/ui/scroll-area';

export default function App() {
  return (
    <QRProvider>
      <Layout>
        {/* Sidebar - Config Panel */}
        <aside className="w-full md:w-[600px] bg-white border-r border-slate-200 flex flex-col h-full shadow-sm">
          <ScrollArea className="flex-1">
            <div className="p-12">
              <ConfigPanel />
            </div>
          </ScrollArea>
        </aside>

        {/* Preview Area */}
        <section className="flex-1 bg-[#fcfcfd] overflow-y-auto p-12 flex flex-col items-center justify-center">
          <QRPreview />
        </section>
      </Layout>
    </QRProvider>
  );
}
