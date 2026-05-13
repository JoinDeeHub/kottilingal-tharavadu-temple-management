from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
import models
from routers.auth import require_admin

router = APIRouter()

class FamilyCreate(BaseModel):
    family_name: str
    head_of_family: str
    contact_number: Optional[str] = None
    address: Optional[str] = None
    is_public: bool = True
    notes: Optional[str] = None

class FamilyUpdate(FamilyCreate):
    pass

@router.get("/public")
def get_public_families(db: Session = Depends(get_db)):
    return db.query(models.Family).filter(models.Family.is_public == True).all()

@router.get("/")
def get_all_families(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return db.query(models.Family).all()

@router.post("/")
def create_family(family: FamilyCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    db_family = models.Family(**family.dict())
    db.add(db_family)
    db.commit()
    db.refresh(db_family)
    return db_family

@router.put("/{family_id}")
def update_family(family_id: int, family: FamilyUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    db_family = db.query(models.Family).filter(models.Family.id == family_id).first()
    if not db_family: raise HTTPException(status_code=404, detail="Family not found")
    for k, v in family.dict().items(): setattr(db_family, k, v)
    db.commit()
    return db_family

@router.delete("/{family_id}")
def delete_family(family_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    db_family = db.query(models.Family).filter(models.Family.id == family_id).first()
    if not db_family: raise HTTPException(status_code=404, detail="Family not found")
    db.delete(db_family)
    db.commit()
    return {"message": "Family deleted"}
