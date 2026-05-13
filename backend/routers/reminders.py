from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
import models
from routers.auth import require_admin

router = APIRouter()

class ReminderCreate(BaseModel):
    family_id: int
    message: str
    reminder_type: str
    scheduled_at: datetime

@router.get("/")
def get_reminders(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return db.query(models.Reminder).all()

@router.post("/")
def create_reminder(reminder: ReminderCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    db_reminder = models.Reminder(**reminder.dict())
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

@router.get("/pending")
def pending_reminders(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return db.query(models.Reminder).filter(models.Reminder.is_sent == False).all()
