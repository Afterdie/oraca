# Oraca

AI-Powered Data Visualization Agent for SQL Generation, Analysis and Data Exploration.

[Demo](https://www.youtube.com/watch?v=l2cT9td9YQM)
## Features

- Self-Service Data Exploration: Enable business users to explore data without
relying on SQL experts. Describe what you need and let Oraca write the query for you

- Natural Language Refinement: Allow follow-up queries like "Can you filter this
by last month’s data?"
- Multi-modal output
- Generate Documentation with AI with example queries
- Talk to your database
- Automated visualisation, just ask
- View the Schema of your database
- Connect to your database or upload your .sqlite file and get querying
- Export query results and visualisations to CSV, JSON and Excel formats
- Supports Postgres, MySQL, SQLite and .sqlite files

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
