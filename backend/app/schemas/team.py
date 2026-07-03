from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List


class CreateTeamRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)


class RenameTeamRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)


class AddMemberRequest(BaseModel):
    email: EmailStr


class TeamMemberUser(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class TeamMemberResponse(BaseModel):
    id: int
    user_id: int
    added_at: datetime
    user: TeamMemberUser

    class Config:
        from_attributes = True


class TeamResponse(BaseModel):
    id: int
    name: str
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TeamDetailResponse(BaseModel):
    team: TeamResponse
    members: List[TeamMemberResponse]