# Nova Estrutura de Dados para Perfis

Para tornar a página de perfil mais profissional e informativa, a estrutura de dados atual no `perfis.json` será expandida para incluir os seguintes campos:

## Campos Existentes (mantidos):

*   `id`: `number` - Identificador único do perfil.
*   `nome`: `string` - Nome da acompanhante.
*   `categoria`: `"feminina" | "trans"` - Categoria do perfil.
*   `cidade`: `string` - Cidade de atendimento.
*   `descricao`: `string` - Descrição breve do perfil.
*   `foto_original`: `string` - Nome do arquivo da foto principal.
*   `url_amigavel`: `string` - URL amigável para o perfil.

## Novos Campos Propostos:

*   `precos`: `Array<Object>` - Tabela de preços por duração.
    *   `duracao`: `string` - Ex: "1 hora", "2 horas", "Pernoite".
    *   `valor`: `number` - Valor correspondente à duração.
*   `caracteristicas`: `Object` - Detalhes físicos e outras características.
    *   `altura`: `string` - Ex: "1.70m".
    *   `peso`: `string` - Ex: "60kg".
    *   `busto`: `string` - Ex: "42".
    *   `olhos`: `string` - Cor dos olhos.
    *   `cabelo`: `string` - Cor e tipo de cabelo.
    *   `medidas`: `string` - Ex: "90-60-90".
    *   `idade`: `number` - Idade da acompanhante.
*   `servicos`: `Array<string>` - Lista de serviços ou diferenciais oferecidos.
    *   Ex: "Massagem relaxante", "Viagens", "Jantares".
*   `galeria_fotos`: `Array<string>` - Lista de nomes de arquivos para fotos adicionais.
    *   Ex: `["foto2.jpeg", "foto3.jpeg"]`.
*   `disponibilidade`: `string` - Informações sobre a disponibilidade (ex: "Disponível para viagens", "Atendimento 24h").

## Exemplo de Estrutura de Perfil Atualizada:

```json
{
  "id": 1,
  "nome": "Alessandra",
  "categoria": "feminina",
  "cidade": "São Paulo",
  "descricao": "Acompanhante exclusiva para momentos especiais, com discrição e elegância.",
  "foto_original": "3e1ed949-f074-434a-8322-31ebe0ec19a4.jpeg",
  "url_amigavel": "perfil-alessandra-1",
  "precos": [
    { "duracao": "1 hora", "valor": 500 },
    { "duracao": "2 horas", "valor": 800 },
    { "duracao": "Pernoite", "valor": 2500 }
  ],
  "caracteristicas": {
    "altura": "1.70m",
    "peso": "60kg",
    "busto": "42",
    "olhos": "Castanhos",
    "cabelo": "Loiro, liso",
    "medidas": "90-60-90",
    "idade": 28
  },
  "servicos": [
    "Jantares e eventos",
    "Viagens nacionais",
    "Massagem relaxante"
  ],
  "galeria_fotos": [
    "alessandra_galeria_1.jpeg",
    "alessandra_galeria_2.jpeg"
  ],
  "disponibilidade": "Atendimento em São Paulo e viagens, agendamento flexível."
}
```
