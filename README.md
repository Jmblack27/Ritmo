## Project structure

ritmo/
│
├── src/
│ │
│ ├── app/
│ │ ├── \_layout.tsx
│ │ ├── index.tsx
│ │ │
│ │ ├── (tabs)/
│ │ │ ├── \_layout.tsx
│ │ │ ├── index.tsx
│ │ │ ├── tasks.tsx
│ │ │ ├── habits.tsx
│ │ │ └── settings.tsx
│ │ │
│ │ ├── tasks/
│ │ │ ├── new.tsx
│ │ │ └── [id].tsx
│ │ │
│ │ └── habits/
│ │ ├── new.tsx
│ │ └── [id].tsx
│ │
│ ├── features/
│ │ │
│ │ ├── tasks/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ ├── repositories/
│ │ │ ├── schemas/
│ │ │ └── types/
│ │ │
│ │ ├── habits/
│ │ │ ├── components/
│ │ │ ├── hooks/
│ │ │ ├── services/
│ │ │ ├── repositories/
│ │ │ ├── schemas/
│ │ │ └── types/
│ │ │
│ │ └── dashboard/
│ │ ├── components/
│ │ └── hooks/
│ │
│ ├── db/
│ │ ├── client.ts
│ │ ├── schema.ts
│ │ └── migrations/
│ │
│ ├── components/
│ │ ├── Button.tsx
│ │ ├── Input.tsx
│ │ ├── Card.tsx
│ │ └── Screen.tsx
│ │
│ ├── lib/
│ │ ├── dates.ts
│ │ ├── uuid.ts
│ │ └── constants.ts
│ │
│ └── theme/
│ ├── colors.ts
│ ├── spacing.ts
│ └── typography.ts
│
├── assets/
│
├── tests/
│
├── app.json
├── package.json
├── tsconfig.json
└── drizzle.config.ts
