# Oraca

An AI-Powered Data Visualization and SQL Generation Platform that helps you interact with your databases using natural language.

## Overview

Oraca is a powerful tool that combines the capabilities of AI with database management and visualization. It allows you to interact with your databases using natural language, generate SQL queries, create visualizations, and analyze data without writing complex SQL code.

[Project Overview, Architecture, Code highlight and Challenges faced](https://www.youtube.com/watch?v=l2cT9td9YQM)
## Features

- 🤖 **Natural Language Query Generation**: Simply describe what you need, and Oraca will write the SQL query for you


https://github.com/user-attachments/assets/d413f9e4-2166-49bd-b403-bc399e4e5fca

- 📊 **Interactive Data Visualization**: Generate charts and graphs from your data with simple commands
![visu](https://github.com/user-attachments/assets/954eceb2-f757-4158-ab93-e693b4945888)
- 🔭 Natural Language Refinement: Allow follow-up queries like "Can you filter this
by last month’s data?"
- 📝 **AI-Powered Documentation**: Automatically generate documentation with example queries
![docs](https://github.com/user-attachments/assets/2be92aa8-e167-4440-a244-e191c5251875)
- 🔄 **Multi-Modal Output**: View your data in various formats including tables, charts, and text
- 🗣️ **Talk to your database**
![talk](https://github.com/user-attachments/assets/d583a227-baf3-48ef-ba67-8a4f7d902d86)
- 🔍 **Schema Exploration**: Easily view and understand your database structure
![schema](https://github.com/user-attachments/assets/891a0477-514c-4d1f-bb8c-dc584069663b)
- 🔌 **Database Connectivity**: Support for multiple database types:
  - PostgreSQL
  - SQLite files (.sqlite)
  - MySQL(wip)
  - SQLite(wip)
- 📤 **Export Capabilities**: Export your data and visualizations in multiple formats:
  - CSV
  - JSON
  - Excel

Link to [oraca-backend](http://github.com/afterdie/oraca-backend).

## Architecture

Below is the generalised architecture of the application.
![diagram-export-3-26-2025-3_08_41-PM](https://github.com/user-attachments/assets/de901d6d-5878-4e5a-8115-97153ef650d3)

## Tech Stack
- **Frontend**:

  - Next.js 15
  - React 19
  - TailwindCSS
  - shadcn/ui components
  - Redux for state management
  - BlockNote for rich text editing
  - Recharts for data visualization
  - ReactFlow for flow diagrams

- **Backend**:
  - FastAPI
  - SQLAlchemy
  - Gemini 1.5-flash for AI processing

## Architecture

### AI Processing

The application uses Gemini 1.5-flash for processing natural language inputs and generating SQL queries. The model operates with a zero-trust ideology, meaning it doesn't have direct access to the actual data.

### Data Context

The model receives structured information about your database in the following format:

```json
{
  "data": {
    "schema": {
      "[tableName]": {
        "columns": [
          {
            "name": "[colName]",
            "type": "[datatype]",
            "nullable": [boolean]
          }
        ],
        "foreign_keys": [],
        "relationships": [],
        "indexes": []
      }
    },
    "stats": {
      "[tableName]": {
        "row_count": [integercount],
        "cardinality": {
          "[colName]": [cardinalityValue]
        }
      }
    }
  }
}
```

### Data Flow and Schema Management

The application handles database schema through a streamlined process: when connecting to a database (local or remote), the schema is extracted and processed into a structured format containing table definitions, relationships, and statistics. This processed schema is stored in Redux state management and distributed to various components including the AI model for query generation, visualization system for schema diagrams, and documentation generator. The schema is automatically updated after query execution, ensuring consistency between the database state and its representation throughout the application.

### Performance Optimization

The system includes an intelligent indexing system that:

- Tracks query execution frequency and times
- Identifies sequential scans
- Analyzes column cardinality
- Suggests optimal indexes based on query patterns

## Getting Started
Clone the repo

```
git clone https://github.com/Afterdie/oraca.git
```

### Local variables
Add .env.local file to the root of the project folder
To get the backend url run the backend by following the instructions [here](https://github.com/afterdie/oraca-backend)
```
NEXT_PUBLIC_QUERY_BACKEND=your_backend_url_here
```
### Install dependencies

The project uses npm

```
npm install
```

### Start dev server

```
npm run dev
```

Visit local host link in the terminal to see the website

### Create Build

```
npm run build
```

Thanks for visiting 😺
