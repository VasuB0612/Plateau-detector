# Plateau Detector

A fitness tracking web application built with Next.js 14, Tailwind CSS, and Supabase.

## Features

- **Dashboard**: View plateau status overview for all exercises
- **Log Workouts**: Record sets with weight, reps, and RPE
- **History**: Browse and filter workout history
- **Exercises**: Manage your exercise library
- **Plateau Detection**: Automatic analysis comparing weekly volumes
- **Authentication**: Secure user accounts with Supabase Auth

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth)
- **State**: React Context + useReducer
- **Icons**: Lucide React

## Project Structure

```
plateau-detector-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Dashboard
│   │   ├── log/page.tsx        # Log workout
│   │   ├── history/page.tsx    # Workout history
│   │   ├── exercises/page.tsx  # Manage exercises
│   │   └── auth/               # Authentication pages
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Navigation
│   │   ├── workout/            # Workout-specific components
│   │   └── alerts/             # PlateauAlert component
│   ├── lib/
│   │   ├── supabase/           # Supabase client setup
│   │   ├── api/                # API functions
│   │   └── plateau/            # Plateau detection logic
│   ├── context/                # React Context providers
│   └── types/                  # TypeScript types
└── supabase/
    └── migrations/             # Database schema
```

## Plateau Detection Logic

The app analyzes weekly training volume to detect plateaus:

| Status      | Condition                | Recommendation                     |
| ----------- | ------------------------ | ---------------------------------- |
| **OK**      | Volume up >= 2%          | Keep progressing                   |
| **Warning** | Volume change -2% to +2% | Consider increasing weight or reps |
| **Plateau** | Volume down > 2%         | Consider deload or program change  |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
