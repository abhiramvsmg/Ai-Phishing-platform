from sqlalchemy.orm import Session

from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.user import User


def create_team(
        db: Session,
        team: Team
):
    db.add(team)
    db.commit()
    db.refresh(team)

    return team


def get_team_by_id(
        db: Session,
        team_id: int
):
    return (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )


def get_teams_owned_by(
        db: Session,
        user_id: int
):
    return (
        db.query(Team)
        .filter(Team.owner_id == user_id)
        .all()
    )


def get_teams_for_member(
        db: Session,
        user_id: int
):
    return (
        db.query(Team)
        .join(TeamMember, TeamMember.team_id == Team.id)
        .filter(TeamMember.user_id == user_id)
        .all()
    )


def get_team_members(
        db: Session,
        team_id: int
):
    return (
        db.query(TeamMember)
        .filter(TeamMember.team_id == team_id)
        .all()
    )


def get_team_member(
        db: Session,
        team_id: int,
        user_id: int
):
    return (
        db.query(TeamMember)
        .filter(
            TeamMember.team_id == team_id,
            TeamMember.user_id == user_id
        )
        .first()
    )


def add_team_member(
        db: Session,
        member: TeamMember
):
    db.add(member)
    db.commit()
    db.refresh(member)

    return member


def remove_team_member(
        db: Session,
        team_id: int,
        user_id: int
):
    member = get_team_member(
        db,
        team_id,
        user_id
    )

    if member:
        db.delete(member)
        db.commit()

    return member


def update_team(
        db: Session,
        team: Team
):
    db.commit()
    db.refresh(team)

    return team


def delete_team(
        db: Session,
        team: Team
):
    db.delete(team)
    db.commit()