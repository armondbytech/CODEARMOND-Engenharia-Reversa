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

- **Análise Inteligente com IA:** A API Gemini analisa a segurança e utilidade do conteúdo do QR Code antes da geração.
- **Configurações Base:** Personalização do conteúdo e parâmetros do QR Code.
- **Estilo Visual:** Customização completa da aparência, incluindo paleta de cores personalizada.
- **Exportação:** Download do QR Code gerado em PNG ou SVG.
- **Proteção de Privacidade:** Dados processados localmente e criptografados no Firebase.
- **Autenticação:** Login com Google integrado.
- **Interface Responsiva:** Navegação com seções de Recursos, Preços e Docs.

---

## 🔧 Como Executar

**Pré-requisitos:** Node.js

1. Clone o repositório:
   git clone https://github.com/sophiassantos/engenharia-reversa.git
2. Instale as dependências:
   npm install
3. Configure sua chave da API no arquivo `.env.local`:
