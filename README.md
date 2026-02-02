# PlateauDetector Web

A fitness tracking web application built with Next.js 14, Tailwind CSS, and Supabase. Migrated from the original React Native/Expo app.

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

## Getting Started

### 1. Clone and Install

```bash
cd plateau-detector-web
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Project Settings > API**
4. Copy the Project URL and anon public key

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open and run the file: `supabase/migrations/001_initial_schema.sql`

This creates the required tables:

- `profiles` - User profiles
- `exercises` - Exercise definitions
- `workouts` - Workout sessions
- `sets` - Individual sets within workouts

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Migration from React Native

This is a web port of the original React Native app. Key changes:

| React Native        | Next.js                 |
| ------------------- | ----------------------- |
| AsyncStorage        | Supabase database       |
| react-native-paper  | Tailwind CSS components |
| React Navigation    | Next.js App Router      |
| StyleSheet.create() | Tailwind classes        |
| View/Text           | div/span/p              |
| Alert.alert()       | window.confirm()        |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
