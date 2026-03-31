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

