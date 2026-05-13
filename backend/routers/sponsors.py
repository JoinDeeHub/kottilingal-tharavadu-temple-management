from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from database import get_db
import models
from routers.auth import require_admin

router = APIRouter()

class SponsorCreate(BaseModel):
    name: str
    contribution: Optional[str] = None
    amount: Optional[float] = None
    is_public: bool = True
    year: Optional[int] = None

@router.get("/public")
def get_public_sponsors(db: Session = Depends(get_db)):
    return db.query(models.Sponsor).filter(models.Sponsor.is_public == True).all()

@router.post("/")
def create_sponsor(sponsor: SponsorCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    db_sponsor = models.Sponsor(**sponsor.dict())
    db.add(db_sponsor)
    db.commit()
    db.refresh(db_sponsor)
    return db_sponsor
