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

### Frontend - NextJS, TypeScript, Redux, TailwindCSS, shadCN
### Backend - Python, fastAPI, sqlAlchemy

## Context

The model does not have access to the data itself making it scalable and compliant with zero-trust ideologies. Here's the format of the data shared with the model.

```
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
            },
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
```

### Schema

This stores the context neccessary for the model to write queries for cross-table joins, generate documentation and for answering questions.

### Stats

Stores information useful for generation of indexes.

Creation of Index can be done with a rule based system -

- Create a list of queries executed and store frequency and execution times
- Sort the list based on frequency
- Sort the list based on execution time
- Determine if the query is Seq Scan(scanning sequentially or using a preexisting index)
- To determine the columns that can be indexed in order to increase performance we pattern match columns that appear after WHERE
- Determine cardinality(uniqueness of values) of these columns. Column with highly repeated values do not benefit from a index.
```
        "stats": {
            "[tableName]": {
                "row_count": [integercount],
                "cardinality": {
                    "[colName]": [cardinalityValue]
                }
            }
        }
```
