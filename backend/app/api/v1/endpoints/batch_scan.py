from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import shutil, os, tempfile, zipfile
from typing import Optional, List, Union
from app.db.session import get_db
from app.schemas.batch import BatchScanResponse, ImageScanResult
from app.services.batch_processor import process_images
from app.services.auth_utils import get_current_user
from app.db.models import User

router = APIRouter()

@router.post("/batch", response_model=BatchScanResponse)
async def batch_scan(
    file: UploadFile = File(...),
    threshold: Optional[float] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    🔄 Upload a ZIP file or a single image and run batch scan.
    - file: .zip archive or image file
    - threshold: optional override for reconstruction threshold
    - returns list of per-image results
    """
    # Save uploaded file temporarily
    suffix = os.path.splitext(file.filename)[1].lower()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    contents = await file.read()
    tmp.write(contents)
    tmp.flush()
    tmp.close()

    # Determine input source
    try:
        source: Union[str, List[str]]
        if suffix == ".zip":
            source = tmp.name
        else:
            source = tmp.name
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid file uploaded")

    # Process images
    try:
        results = process_images(source, user_id=current_user.id, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch scan failed: {e}")
    finally:
        os.unlink(tmp.name)

    # Format response
    response = BatchScanResponse(
        total_scanned=len(results),
        results=[ImageScanResult(**r) for r in results]
    )
    return JSONResponse(status_code=200, content=response.dict())