from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
import models
from routers.auth import require_admin

router = APIRouter()

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: datetime
    event_type: Optional[str] = None
    is_public: bool = True

@router.get("/public")
def get_public_events(db: Session = Depends(get_db)):
    return db.query(models.Event).filter(models.Event.is_public == True).order_by(
        models.Event.event_date.asc()).all()

@router.get("/upcoming")
def get_upcoming(db: Session = Depends(get_db)):
    return db.query(models.Event).filter(
        models.Event.event_date >= datetime.utcnow(),
        models.Event.is_public == True
    ).order_by(models.Event.event_date.asc()).limit(5).all()

@router.post("/")
def create_event(event: EventCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    db_event = models.Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event
