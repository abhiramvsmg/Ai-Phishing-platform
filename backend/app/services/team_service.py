from sqlalchemy.orm import Session

from app.models.team import Team
from app.models.team_member import TeamMember

from app.repositories.team_repository import (
    create_team,
    get_team_by_id,
    get_teams_owned_by,
    get_teams_for_member,
    get_team_members,
    get_team_member,
    add_team_member,
    remove_team_member,
    update_team,
    delete_team
)

from app.repositories.user_repository import (
    get_user_by_email
)


class TeamError(Exception):
    """Raised for any team operation that fails a business rule.
    Routers catch this and turn it into a 400/403/404 as appropriate.
    """
    pass


def create_new_team(
        db: Session,
        owner_id: int,
        name: str
):
    team = Team(
        name=name,
        owner_id=owner_id
    )

    saved_team = create_team(
        db,
        team
    )

    # Owner is automatically a member of their own team.
    add_team_member(
        db,
        TeamMember(
            team_id=saved_team.id,
            user_id=owner_id
        )
    )

    return saved_team


def get_my_teams(
        db: Session,
        user_id: int
):
    owned = get_teams_owned_by(
        db,
        user_id
    )

    member_of = get_teams_for_member(
        db,
        user_id
    )

    # A user could theoretically appear in both lists (they own a
    # team, which already includes them as a member) - dedupe by id.
    seen_ids = set()
    combined = []

    for team in owned + member_of:
        if team.id not in seen_ids:
            seen_ids.add(team.id)
            combined.append(team)

    return combined


def get_team_detail(
        db: Session,
        team_id: int,
        requesting_user_id: int
):
    team = get_team_by_id(
        db,
        team_id
    )

    if not team:
        raise TeamError("Team not found")

    membership = get_team_member(
        db,
        team_id,
        requesting_user_id
    )

    if not membership:
        raise TeamError("You are not a member of this team")

    members = get_team_members(
        db,
        team_id
    )

    return team, members


def add_member_by_email(
        db: Session,
        team_id: int,
        requesting_user_id: int,
        email: str
):
    team = get_team_by_id(
        db,
        team_id
    )

    if not team:
        raise TeamError("Team not found")

    if team.owner_id != requesting_user_id:
        raise TeamError("Only the team owner can add members")

    user_to_add = get_user_by_email(
        db,
        email
    )

    if not user_to_add:
        raise TeamError(
            f"No registered user found with email {email}"
        )

    existing = get_team_member(
        db,
        team_id,
        user_to_add.id
    )

    if existing:
        raise TeamError(
            f"{user_to_add.email} is already on this team"
        )

    return add_team_member(
        db,
        TeamMember(
            team_id=team_id,
            user_id=user_to_add.id
        )
    )


def remove_member(
        db: Session,
        team_id: int,
        requesting_user_id: int,
        target_user_id: int
):
    team = get_team_by_id(
        db,
        team_id
    )

    if not team:
        raise TeamError("Team not found")

    if team.owner_id != requesting_user_id:
        raise TeamError("Only the team owner can remove members")

    if target_user_id == team.owner_id:
        raise TeamError("The team owner cannot be removed")

    removed = remove_team_member(
        db,
        team_id,
        target_user_id
    )

    if not removed:
        raise TeamError("That user is not a member of this team")

    return removed


def rename_team(
        db: Session,
        team_id: int,
        requesting_user_id: int,
        new_name: str
):
    team = get_team_by_id(
        db,
        team_id
    )

    if not team:
        raise TeamError("Team not found")

    if team.owner_id != requesting_user_id:
        raise TeamError("Only the team owner can rename the team")

    team.name = new_name

    return update_team(
        db,
        team
    )


def delete_my_team(
        db: Session,
        team_id: int,
        requesting_user_id: int
):
    team = get_team_by_id(
        db,
        team_id
    )

    if not team:
        raise TeamError("Team not found")

    if team.owner_id != requesting_user_id:
        raise TeamError("Only the team owner can delete the team")

    delete_team(
        db,
        team
    )