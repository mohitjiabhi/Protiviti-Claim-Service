from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
import tempfile
import os

app = FastAPI()

class ScriptContent(BaseModel):
    content: str

@app.post("/check-forge")
def check_forge(req: ScriptContent):
    try:
        # Absolute or relative path to abc.py
        script_path = "./check-forge.py"
        print(script_path, req.content)
        # Build the command
        cmd = ["python", script_path, req.content]
        print(cmd)
        # Run the script
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=30
        )
        print(result)
        return {
            "stdout": result.stdout.decode("utf-8"),
            "stderr": result.stderr.decode("utf-8"),
            "exit_code": result.returncode
        }

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)