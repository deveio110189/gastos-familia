# 💰 Gastos Família — Welinton & Débora

Aplicativo mobile de controle financeiro familiar com sincronização via Google Sheets.

---

## 📱 Como usar no celular

### Opção A — GitHub Pages (recomendado, grátis)

1. Crie uma conta em [github.com](https://github.com) (ou use a sua existente)
2. Crie um novo repositório chamado `gastos-familia`
3. Faça upload de todos os arquivos deste projeto
4. Vá em **Settings → Pages → Source: Deploy from branch → main → / (root)**
5. Após alguns minutos, seu app estará disponível em:  
   `https://SEU_USUARIO.github.io/gastos-familia`
6. Abra este link no celular e toque em **"Adicionar à tela inicial"**

### Opção B — Instalar localmente com servidor simples

```bash
# Com Python instalado:
cd finance-app
python -m http.server 8080
# Acesse http://localhost:8080 no navegador
```

---

## 🔄 Configurar Google Sheets (sincronização)

### Passo 1 — Crie a planilha

1. Acesse [sheets.google.com](https://sheets.google.com)
2. Crie uma nova planilha chamada `Gastos Família`
3. Anote o ID da planilha (está na URL: `https://docs.google.com/spreadsheets/d/**ID_AQUI**/edit`)

### Passo 2 — Crie o Apps Script

1. Na planilha, clique em **Extensões → Apps Script**
2. Apague todo o código existente
3. Cole o conteúdo do arquivo `Code.gs` incluído neste projeto
4. Salve com `Ctrl+S` e nomeie o projeto como `Gastos Família`

### Passo 3 — Publique como Web App

1. Clique em **Implantar → Nova implantação**
2. Tipo: **App da Web**
3. Descrição: `v1`
4. Executar como: **Eu (seu email)**
5. Quem tem acesso: **Qualquer pessoa** ⚠️ (necessário para o app funcionar)
6. Clique em **Implantar**
7. **Copie a URL** gerada (começa com `https://script.google.com/macros/s/...`)

> ⚠️ Importante: guarde bem essa URL pois ela é a "chave" de acesso à planilha.

### Passo 4 — Configure o app

1. Abra o aplicativo no celular
2. Toque em **Config** (ícone de engrenagem)
3. Cole a URL copiada no campo "URL do Apps Script"
4. Toque em **Salvar configuração**
5. Toque em **Testar conexão** para verificar

---

## 👥 Uso por duas pessoas (Welinton + Débora)

Os dois precisam:
1. Abrir o mesmo link no celular (ex: `https://welinton.github.io/gastos-familia`)
2. Adicionar à tela inicial como PWA
3. Configurar a **mesma URL do Apps Script** nas configurações

Cada lançamento feito por qualquer um dos dois é enviado automaticamente à planilha compartilhada. Os dados locais ficam no celular de cada um e são sincronizados ao Google Sheets quando há internet.

---

## 📊 Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| ➕ Lançamento rápido | Valor + categoria + quem lançou |
| 🏷️ 12 categorias | Alimentação, Mercado, Transporte, Saúde, Moradia, Educação, Lazer, Vestuário, Assinaturas, Pets, Presentes, Outros |
| 👤 Identificação | Welinton ou Débora por gasto |
| 📱 PWA offline | Funciona sem internet, sincroniza quando volta |
| 📊 Resumo mensal | Totais por pessoa e por categoria |
| 📥 Exportar CSV | Baixar relatório do mês |
| 🔄 Google Sheets | Histórico completo na nuvem |
| 📋 Aba Resumo | Visão mensal consolidada na planilha |

---

## 📁 Estrutura dos arquivos

```
finance-app/
├── index.html       ← App principal (toda a lógica e interface)
├── sw.js            ← Service Worker (PWA offline)
├── manifest.json    ← Configuração PWA
├── Code.gs          ← Google Apps Script (cola no Google Sheets)
├── icons/           ← Ícones do app (adicionar manualmente)
│   ├── icon-192.png
│   └── icon-512.png
└── README.md        ← Este arquivo
```

> 💡 Para os ícones, você pode criar uma imagem 512×512 com o emoji 💰 em fundo verde (#0F6E56) e exportar em dois tamanhos. Ferramentas gratuitas: [favicon.io](https://favicon.io) ou [realfavicongenerator.net](https://realfavicongenerator.net)

---

## 🔒 Segurança

- Os dados ficam **no celular de cada um** (localStorage) e **na sua planilha Google** (que só vocês acessam)
- A URL do Apps Script funciona como uma senha — não compartilhe com outras pessoas
- Para mais segurança, você pode adicionar verificação de token no `Code.gs`

---

## 🐛 Problemas comuns

**"Sem conexão" no app:**  
→ Verifique se a URL do Apps Script está correta nas configurações  
→ Certifique-se de que o acesso está como "Qualquer pessoa" no Apps Script

**Lançamentos não aparecem na planilha:**  
→ Toque em "Sincronizar agora" na aba Config  
→ Os itens com ● laranja ainda não foram sincronizados

**App não instala no iPhone:**  
→ Abra no Safari (não funciona no Chrome/Firefox no iOS)  
→ Toque no ícone de compartilhar → "Adicionar à Tela de Início"
