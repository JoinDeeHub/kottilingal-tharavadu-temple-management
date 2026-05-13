from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from database import get_db
import models
from routers.auth import require_admin

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), admin=Depends(require_admin)):
    total_families = db.query(func.count(models.Family.id)).scalar()
    total_collected = db.query(func.sum(models.Donation.amount)).filter(
        models.Donation.payment_status == models.PaymentStatus.paid).scalar() or 0
    pending_amount = db.query(func.sum(models.Donation.amount)).filter(
        models.Donation.payment_status == models.PaymentStatus.pending).scalar() or 0
    total_sponsors = db.query(func.count(models.Sponsor.id)).scalar()
    upcoming_events = db.query(func.count(models.Event.id)).scalar()
    return {
        "total_families": total_families,
        "total_collected": total_collected,
        "pending_amount": pending_amount,
        "total_sponsors": total_sponsors,
        "upcoming_events": upcoming_events
    }

@router.get("/monthly")
def monthly_report(year: int = 2026, db: Session = Depends(get_db), admin=Depends(require_admin)):
    results = db.query(
        extract('month', models.Donation.donation_date).label('month'),
        func.sum(models.Donation.amount).label('total')
    ).filter(extract('year', models.Donation.donation_date) == year).group_by('month').all()
    return [{"month": int(r.month), "total": float(r.total or 0)} for r in results]
