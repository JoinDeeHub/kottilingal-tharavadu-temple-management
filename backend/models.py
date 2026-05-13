from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    public = "public"

class DonationType(str, enum.Enum):
    monthly_pooja = "monthly_pooja"
    infrastructure = "infrastructure"
    festival = "festival"
    sponsorship = "sponsorship"
    general = "general"

class PaymentStatus(str, enum.Enum):
    paid = "paid"
    pending = "pending"
    overdue = "overdue"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.public)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Family(Base):
    __tablename__ = "families"
    id = Column(Integer, primary_key=True, index=True)
    family_name = Column(String, nullable=False)
    head_of_family = Column(String, nullable=False)
    contact_number = Column(String)
    address = Column(Text)
    is_public = Column(Boolean, default=True)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    donations = relationship("Donation", back_populates="family")

class Donation(Base):
    __tablename__ = "donations"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    donation_type = Column(Enum(DonationType), nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.paid)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=True)
    donor_name = Column(String)
    purpose = Column(String)
    notes = Column(Text)
    receipt_number = Column(String, unique=True)
    donation_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    family = relationship("Family", back_populates="donations")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    event_date = Column(DateTime(timezone=True), nullable=False)
    event_type = Column(String)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Sponsor(Base):
    __tablename__ = "sponsors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contribution = Column(String)
    amount = Column(Float)
    is_public = Column(Boolean, default=True)
    year = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Reminder(Base):
    __tablename__ = "reminders"
    id = Column(Integer, primary_key=True, index=True)
    family_id = Column(Integer, ForeignKey("families.id"))
    message = Column(Text)
    reminder_type = Column(String)
    is_sent = Column(Boolean, default=False)
    scheduled_at = Column(DateTime(timezone=True))
    sent_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
