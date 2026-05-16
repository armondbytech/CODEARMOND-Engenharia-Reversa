# 🟧 CODEARMOND QR Studio — Gerador Inteligente de QR Codes com IA

## 📝 Descrição do Projeto

Este projeto consiste em um gerador de QR Codes profissional com inteligência artificial integrada, desenvolvido sob a marca **CODEARMOND QR Studio**. O objetivo principal é oferecer ao usuário controle total sobre a criação e personalização visual de QR Codes, combinando design moderno com análise inteligente via IA — que avalia a **segurança e utilidade** do conteúdo inserido antes da geração.

Desenvolvido com foco em experiência do usuário e privacidade, o sistema processa os dados localmente e os criptografa ao salvar no Firebase, garantindo que o conteúdo dos QR Codes não seja rastreado sem permissão do usuário.

---

## 🚀 Tecnologias Utilizadas

- **Linguagem:** TypeScript
- **Framework:** React 19 + Vite 6
- **Estilização:** Tailwind CSS v4
- **Componentes:** shadcn/ui + Base UI + Lucide React
- **IA:** Google Gemini API (`@google/genai`)
- **Backend/Infra:** Firebase 12 + Firestore + Express.js
- **Animações:** Motion
- **Ferramentas:** Google AI Studio

---

## ✨ Funcionalidades

- **Análise Inteligente com IA:** Insira dados no QR Code para que a IA analise a segurança e utilidade.
- **Suporte a logos:** Insira sua marca diretamente no centro do QR Code.
- **Gradientes personalizados:** Escolha cores de início e fim para criar designs únicos.
- **Estilo Visual:** Customize completamente a aparência com paleta de cores personalizada.
- **Exportação:** Baixe o QR Code gerado em PNG ou SVG.
- **Proteção de Privacidade:** Dados processados localmente e criptografados no Firebase.
- **Autenticação:** Login com Google integrado.
- **Modo dark/light:** Interface adaptável com alternância entre temas.

---

## 🔧 Como Executar

1. Clone o repositório.
2. Instale as dependências: `npm install`.
3. Configure sua chave no `.env.local`: `GEMINI_API_KEY=sua_chave_aqui`.
4. Execute o comando: `npm run dev`.
5. Acesse em: `http://localhost:3000`.
