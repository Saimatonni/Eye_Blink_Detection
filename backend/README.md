python -m venv venv 

.\venv\Scripts\activate 

pip install -r requirements.txt
 
pip install fastapi uvicorn

uvicorn index:app --reload
