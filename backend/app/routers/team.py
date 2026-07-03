from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.schemas.team import (
    CreateTeamRequest,
    RenameTeamRequest,
    AddMemberRequest,
    TeamResponse,
    TeamDetailResponse
)

from app.services.team_service import (
    create_new_team,
    get_my_teams,
    get_team_detail,
    add_member_by_email,
    remove_member,
    rename_team,
    delete_my_team,
    TeamError
)

router = APIRouter(
    prefix="/api/v1/teams",
    tags=["Teams"]
)


@router.post("", response_model=TeamResponse)
def create_team_api(
        request: CreateTeamRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return create_new_team(
        db,
        current_user.id,
        request.name
    )


@router.get("", response_model=List[TeamResponse])
def list_my_teams_api(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return get_my_teams(
        db,
        current_user.id
    )


@router.get("/{team_id}", response_model=TeamDetailResponse)
def get_team_api(
        team_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    try:
        team, members = get_team_detail(
            db,
            team_id,
            current_user.id
        )
    except TeamError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return {
        "team": team,
        "members": members
    }


@router.put("/{team_id}", response_model=TeamResponse)
def rename_team_api(
        team_id: int,
        request: RenameTeamRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    try:
        return rename_team(
            db,
            team_id,
            current_user.id,
            request.name
        )
    except TeamError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{team_id}/members")
def add_member_api(
        team_id: int,
        request: AddMemberRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    try:
        add_member_by_email(
            db,
            team_id,
            current_user.id,
            request.email
        )
    except TeamError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Member added"}


@router.delete("/{team_id}/members/{user_id}")
def remove_member_api(
        team_id: int,
        user_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    try:
        remove_member(
            db,
            team_id,
            current_user.id,
            user_id
        )
    except TeamError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Member removed"}


@router.delete("/{team_id}")
def delete_team_api(
        team_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    try:
        delete_my_team(
            db,
            team_id,
            current_user.id
        )
    except TeamError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Team deleted"}