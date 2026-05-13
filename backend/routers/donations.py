from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
import models
from routers.auth import require_admin

router = APIRouter()

class DonationCreate(BaseModel):
    amount: float
    donation_type: models.DonationType
    payment_status: models.PaymentStatus = models.PaymentStatus.paid
    family_id: Optional[int] = None
    donor_name: Optional[str] = None
    purpose: Optional[str] = None
    notes: Optional[str] = None
    receipt_number: Optional[str] = None

@router.get("/public/summary")
def get_public_summary(db: Session = Depends(get_db)):
    total = db.query(func.sum(models.Donation.amount)).filter(
        models.Donation.payment_status == models.PaymentStatus.paid).scalar() or 0
    count = db.query(func.count(models.Donation.id)).scalar() or 0
    return {"total_collected": total, "total_donations": count}

@router.get("/")
def get_donations(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return db.query(models.Donation).order_by(models.Donation.donation_date.desc()).all()

@router.post("/")
def create_donation(donation: DonationCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    db_donation = models.Donation(**donation.dict())
    db.add(db_donation)
    db.commit()
    db.refresh(db_donation)
    return db_donation

@router.get("/pending")
def get_pending(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return db.query(models.Donation).filter(
        models.Donation.payment_status == models.PaymentStatus.pending).all()

@router.get("/by-type")
def get_by_type(db: Session = Depends(get_db), admin=Depends(require_admin)):
    results = db.query(models.Donation.donation_type, func.sum(models.Donation.amount)).group_by(
        models.Donation.donation_type).all()
    return [{"type": r[0], "total": r[1]} for r in results]
