# EdiDev — GitHub Explorer

SPA de estudo para o checkpoint DevMedia **Criando uma SPA com React**.

## O que o projeto faz

- Carrega automaticamente um perfil e seus repositórios públicos pela API REST do GitHub.
- Possui duas telas: **Repositórios** e **Sobre mim**.
- Permite consultar outro usuário, buscar na lista carregada, filtrar por linguagem e ordenar.
- Mostra carregamento, lista vazia, erro de rede, perfil não encontrado e limite de consultas.
- Carrega as páginas seguintes sob demanda, sem perder os itens anteriores.
- Usa JavaScript, React, CSS e Vite. Não precisa de token, backend próprio ou banco de dados.

## Executar no notebook

Utilize Node.js 22.12 ou superior. Extraia o projeto, abra a pasta no VS Code e execute no terminal:

```bash
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite. Para conferir o projeto:

```bash
npm test
npm run build
```

`npm run preview` serve o resultado do build localmente. O npm usa as versões exatas registradas em `package-lock.json` quando você executa `npm ci`.

## Onde editar

| Arquivo | Responsabilidade |
| --- | --- |
| `src/config.js` | Nome, formação, cidade e usuário padrão do GitHub. |
| `src/App.jsx` | Estrutura geral, navegação por hash e seleção do perfil. |
| `src/pages/Repositories.jsx` | Busca, filtros, seleção de usuário e estados da listagem. |
| `src/pages/About.jsx` | Conteúdo da página Sobre mim. |
| `src/components/` | Cabeçalho, perfil e cards reutilizáveis. |
| `src/hooks/useGithub.js` | Estados de carregamento, consulta inicial e paginação. |
| `src/services/github.js` | Validação, requisições HTTP e normalização dos dados. |
| `src/utils/repositories.js` | Busca, ordenação e formatação de datas. |
| `src/styles.css` | Cores, tipografia, espaçamento, responsividade e foco visível. |
| `tests/github.test.js` | Testes das consultas, erros, validação, filtros e paginação. |

## Fluxo dos dados

1. O usuário abre a SPA ou seleciona um perfil.
2. `useGithub` inicia o carregamento usando `useEffect`.
3. O serviço consulta `GET /users/{username}` e `GET /users/{username}/repos`.
4. O GitHub consulta seus próprios dados e devolve JSON.
5. O serviço valida e normaliza o JSON.
6. O hook atualiza os estados e o React renderiza a interface.

O frontend conversa diretamente com a API pública. Nenhuma credencial é necessária para esses endpoints. Repositórios privados não são listados. A API limita consultas sem autenticação por endereço IP; a interface exibe uma mensagem quando esse limite é atingido. Não coloque tokens do GitHub no frontend.

A aplicação consulta inicialmente **edivandroreis4-netizen**, o perfil de Edivandro Reis confirmado no GitHub. Para alterar o perfil inicial, edite `DEFAULT_USERNAME` em `src/config.js`; o link pessoal acompanhará essa configuração. A tela Sobre mim apresenta o autor do projeto, Edivandro Lima, independentemente do perfil explorado na listagem.

As buscas e os filtros se aplicam aos repositórios já carregados. Quando houver outra página, o botão **Carregar mais repositórios** permite ampliar a lista.

## Decisões de implementação

- A navegação usa `#repositorios` e `#sobre`, preservando voltar/avançar do navegador sem recarregar a página e sem dependência de roteamento.
- A consulta fica fora dos componentes para facilitar entendimento, manutenção e testes.
- `AbortController` cancela consultas antigas quando o perfil muda.
- Busca e ordenação são locais: digitar na busca não dispara mais consultas à API.
- A paginação evita uma sequência automática de muitas requisições.
- O CSS inclui layouts para celular, foco visível, link para pular navegação e redução de movimento.
- A fonte DM Sans é opcional; se o provedor externo estiver indisponível, o sistema usa as fontes locais.

## Verificação manual antes de enviar à DevMedia

1. Confira os dados e textos pessoais em `src/config.js` e `src/pages/About.jsx`.
2. Confirme o carregamento real do seu perfil e de um segundo perfil público.
3. Teste busca, filtro, ordenação, atualização e paginação em um perfil com muitos repositórios.
4. Teste usuário inexistente, conexão indisponível e um perfil sem repositórios públicos.
5. Navegue entre as duas telas, use voltar/avançar e percorra os controles com Tab.
6. Confira o layout no notebook e no celular.
7. Execute testes e build. Compare novamente com os requisitos do checkpoint antes de enviar.

Os testes automatizados utilizam respostas controladas da API. Eles não substituem a verificação visual e o teste de integração com o GitHub no navegador.
