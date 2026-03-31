# Design System

Este projeto segue um conjunto de fundamentos de UI (tokens + padrões) com adaptação para shadcn/ui + Tailwind.

## Princípios

- **Fonte da verdade**: tokens em `src/index.css` (CSS variables).
- **Uso nos componentes**: sempre preferir classes Tailwind e tokens (`bg-background`, `text-foreground`, `bg-primary`, etc).
- **Brand**: a **cor primária** do produto é `#24E478` (mantida como `--primary`).

## Cores

Usar tokens de texto/borda/fundo para hierarquia e legibilidade (evitar hex solto em componente).

Neste projeto:

- `--background`, `--foreground`, `--card`, `--popover`, `--muted`, `--border`, etc ficam em `src/index.css`
- `--primary` é fixo no brand `#24E478` (HSL \(146.3 78% 51.8%\))

### Valores monetários (crédito / débito)

- **Positivo (crédito, valor ≥ 0 no extrato)**: `text-primary`; em *chips* ou fundo suave: `bg-primary/10 text-primary`.
- **Negativo (débito)**: `text-destructive`; fundo suave: `bg-destructive/10 text-destructive`.
- Evitar paletas ad hoc (`emerald-*`, `rose-*`, etc.) para manter tema claro/escuro e a marca alinhados aos tokens.

## Motion / Animações

### Tokens

- **Duração**
  - `--anim-duration-sm`: 100ms
  - `--anim-duration-md`: 300ms
  - `--anim-duration-lg`: 500ms
- **Easing**
  - `--anim-ease-in`: ease-in
  - `--anim-ease-out`: ease-out
  - `--anim-ease-in-out`: ease-in-out

### Utilitários

Disponíveis como classes utilitárias (definidas em `src/index.css`):

- `anim-sm`: micro-interações (hover/focus)
- `anim-md`: transições de componentes/estados
- `anim-lg`: transições maiores (entradas/saídas mais perceptíveis)

### Preferências do usuário

Respeitar `prefers-reduced-motion` para reduzir/encurtar motion quando necessário.

## Elevação / Sombras

- `--shadow-0..--shadow-4`

Mapeamento Tailwind:

- `shadow-0`, `shadow-1`, `shadow-2`, `shadow-3`, `shadow-4`

## Espaçamento

Usar escala consistente (múltiplos de 4px sempre que possível) e padrões Tailwind (ex.: `p-4`, `gap-4`, `mt-6`).

## Tipografia

Preferir a escala Tailwind existente e manter hierarquia clara (títulos vs textos vs legendas).

## Calendário e filtro por intervalo de datas

- **Componentes**: `Popover` + `Calendar` (`react-day-picker`) para seleção em intervalo; conteúdo do popover usa `bg-popover`, `border-border`, `shadow-3` (ver `src/components/ui/popover.tsx`).
- **Estilo do DayPicker**: a classe utilitária `rdp-onda` no `Calendar` liga as variáveis CSS do pacote (`--rdp-accent-color`, intervalo, etc.) aos tokens globais (`--primary`, duração `--anim-duration-md`) em `src/index.css`. Evite cores soltas no JSX do calendário; ajustes visuais passam por essas variáveis ou por tokens.
- **Motion**: troca de mês/animações internas do DayPicker respeitam `prefers-reduced-motion` via override de `--rdp-animation_duration` no mesmo bloco de utilitários.
- **Referência de UX**: padrões de calendário e acessibilidade podem seguir a documentação de componentes semelhantes (ex.: [Basis Calendar no Storybook](https://storybook.basis.net/?path=/docs/components-calendar--docs)).

