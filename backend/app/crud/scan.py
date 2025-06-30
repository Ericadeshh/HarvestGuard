
from sqlalchemy.orm import Session
from ..db.models.scan import Scan
from ..schemas.scan import ScanCreate

def create_scan(db: Session, scan: ScanCreate):
    db_scan = Scan(**scan.dict())
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    return db_scan