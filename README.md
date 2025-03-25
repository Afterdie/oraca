# Oraca

AI-Powered Data Visualization Agent for SQL Generation, Analysis and Data Exploratin.

## Features

- Describe what you need and let Oraca write the query for you
- Multi-modal output
- Generate Documentation with AI with example queries
- Talk to your database
- Generate visualisation quick, just ask
- View the Schema of your database
- Connect to your database or upload your .sqlite file and get querying
- Export query results and visualisations to CSV, JSON and Excel formats
- Supports Postgres, MySQL, SQLite and .sqlite files

Link to [oraca-backend](http://github.com/afterdie/oraca-backend).

## Architecture

Uses Gemini 1.5-flash to process inputs. Below is the generalised architecture of the application.

## Tech Stack

Build using NextJS for fronend, FastAPI for backend, TailwindCSS for styling, shadCN for components, Redux for store management, BlockNote for editor, sqlalchemy for processing queries.

## Context

The model does not have access to the data itself making it scalable and compliant with zero-trust idelogies. Here's the format of the data shared with the model.

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
