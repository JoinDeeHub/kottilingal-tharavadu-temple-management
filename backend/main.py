from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import families, donations, events, sponsors, auth, reminders, reports

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kottilingal Tharavadu Temple API",
    description="Temple management system for Kottilingal Tharavadu Bhagavathi Temple, Palakkad",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(families.router, prefix="/families", tags=["Families"])
app.include_router(donations.router, prefix="/donations", tags=["Donations"])
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(sponsors.router, prefix="/sponsors", tags=["Sponsors"])
app.include_router(reminders.router, prefix="/reminders", tags=["Reminders"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])

@app.get("/")
def root():
    return {"message": "🛕 Kottilingal Tharavadu Bhagavathi Temple API", "status": "active"}

@app.get("/health")
def health():
    return {"status": "healthy"}
