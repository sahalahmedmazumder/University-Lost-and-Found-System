# Backend Setup

## Requirements

- Python 3.x
- pip

## Install Dependencies

```bash
py -m pip install -r requirements.txt
```

## Run Backend

```bash
uvicorn app.main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

## Health Check

Open:

```text
http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "healthy"
}
```

## Environment Variables

Create configuration using:

```text
.env.example
```

Frontend URL:

```text
http://localhost:5173
```
