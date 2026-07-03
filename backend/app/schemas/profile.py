from pydantic import BaseModel, Field


class UpdateNameRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)


class ProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True
