"use client";

import React, { useEffect, useState } from "react";
import { Users, Plus, UserMinus, Loader2, Crown, Mail, Pencil, Trash2, Check } from "lucide-react";
import { api } from "@/lib/api";
import { fetchProfile, AuthUser } from "@/lib/auth-client";
import { TeamSummary, TeamDetail } from "@/lib/types";
import { ErrorBanner, PrimaryButton, SecondaryButton, EmptyState } from "@/components/ui/primitives";

export default function TeamPage() {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [teams, setTeams] = useState<TeamSummary[] | null>(null);
  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
  const [detail, setDetail] = useState<TeamDetail | null>(null);

  const [newTeamName, setNewTeamName] = useState("");
  const [creating, setCreating] = useState(false);

  const [memberEmail, setMemberEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadTeams = async () => {
    try {
      const list = await api.teams.list();
      setTeams(list);
      if (list.length > 0 && activeTeamId === null) {
        setActiveTeamId(list[0].id);
      }
      if (list.length === 0) {
        setActiveTeamId(null);
        setDetail(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teams");
    }
  };

  const loadDetail = async (teamId: number) => {
    try {
      const d = await api.teams.getById(teamId);
      setDetail(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team");
    }
  };

  useEffect(() => {
    fetchProfile().then(setProfile);
    loadTeams();
  }, []);

  useEffect(() => {
    if (activeTeamId !== null) loadDetail(activeTeamId);
  }, [activeTeamId]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const team = await api.teams.create(newTeamName.trim());
      setNewTeamName("");
      await loadTeams();
      setActiveTeamId(team.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create team");
    } finally {
      setCreating(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail.trim() || activeTeamId === null) return;
    setAddingMember(true);
    setError(null);
    try {
      await api.teams.addMember(activeTeamId, memberEmail.trim());
      setMemberEmail("");
      await loadDetail(activeTeamId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add member");
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (activeTeamId === null) return;
    setRemovingId(userId);
    setError(null);
    try {
      await api.teams.removeMember(activeTeamId, userId);
      await loadDetail(activeTeamId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove member");
    } finally {
      setRemovingId(null);
    }
  };

  const handleStartEdit = () => {
    if (!detail) return;
    setEditName(detail.team.name);
    setEditingName(true);
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || activeTeamId === null) return;
    setRenaming(true);
    setError(null);
    try {
      await api.teams.rename(activeTeamId, editName.trim());
      setEditingName(false);
      await loadTeams();
      await loadDetail(activeTeamId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not rename team");
    } finally {
      setRenaming(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (activeTeamId === null) return;
    if (!confirm("Delete this team? This can't be undone.")) return;
    setDeleting(true);
    setError(null);
    try {
      await api.teams.delete(activeTeamId);
      setActiveTeamId(null);
      setDetail(null);
      await loadTeams();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete team");
    } finally {
      setDeleting(false);
    }
  };

  const isOwner = detail && profile && detail.team.owner_id === profile.id;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">Team</h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">
          Group registered users together. Scan history stays private to each person.
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="panel p-6 space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">Create a team</h2>
        <form onSubmit={handleCreateTeam} className="flex gap-2">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="e.g. Security Team"
            className="flex-1 px-3 py-2.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]"
          />
          <PrimaryButton type="submit" disabled={creating || !newTeamName.trim()} className="px-4">
            {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Create
          </PrimaryButton>
        </form>
      </div>

      {teams === null ? (
        <p className="text-[13px] text-[var(--color-text-muted)]">Loading teams...</p>
      ) : teams.length === 0 ? (
        <EmptyState icon={Users} title="No teams yet" description="Create a team above to start grouping registered users." />
      ) : (
        <>
          {teams.length > 1 && (
            <div className="flex gap-1.5">
              {teams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTeamId(t.id)}
                  className={`px-3.5 py-1.5 rounded text-[13px] font-medium transition-smooth ${
                    activeTeamId === t.id
                      ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.03]"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}

          {detail && (
            <div className="panel p-6 space-y-5">
              <div className="flex items-center justify-between">
                {editingName ? (
                  <form onSubmit={handleRename} className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      className="flex-1 px-3 py-1.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 text-[14px] font-semibold"
                    />
                    <PrimaryButton type="submit" disabled={renaming || !editName.trim()} className="px-3 py-1.5">
                      {renaming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    </PrimaryButton>
                    <SecondaryButton type="button" onClick={() => setEditingName(false)} className="px-3 py-1.5">
                      Cancel
                    </SecondaryButton>
                  </form>
                ) : (
                  <div>
                    <h2 className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                      {detail.team.name}
                    </h2>
                    <p className="text-[12px] font-mono text-[var(--color-text-muted)] mt-0.5">
                      {detail.members.length} member{detail.members.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}

                {isOwner && !editingName && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleStartEdit}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                      aria-label="Rename team"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleDeleteTeam}
                      disabled={deleting}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-risk-high)] transition-colors disabled:opacity-50"
                      aria-label="Delete team"
                    >
                      {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {detail.members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded hover:bg-white/[0.03] transition-smooth">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
                        <span className="text-[12px] font-medium text-[var(--color-accent)]">
                          {m.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[var(--color-text-primary)] flex items-center gap-1.5">
                          {m.user.name}
                          {m.user_id === detail.team.owner_id && (
                            <Crown className="w-3 h-3 text-[var(--color-accent)]" />
                          )}
                        </p>
                        <p className="text-[11px] font-mono text-[var(--color-text-muted)]">{m.user.email}</p>
                      </div>
                    </div>

                    {isOwner && m.user_id !== detail.team.owner_id && (
                      <button
                        onClick={() => handleRemoveMember(m.user_id)}
                        disabled={removingId === m.user_id}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-risk-high)] transition-colors disabled:opacity-50"
                        aria-label={`Remove ${m.user.name}`}
                      >
                        {removingId === m.user_id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UserMinus className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isOwner ? (
                <form onSubmit={handleAddMember} className="flex gap-2 pt-2 border-t border-[var(--color-border-subtle)]">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      placeholder="Add by email (must already have an account)"
                      className="w-full pl-9 pr-3 py-2.5 panel-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/40 transition-smooth text-[13px]"
                    />
                  </div>
                  <SecondaryButton type="submit" disabled={addingMember || !memberEmail.trim()} className="px-4">
                    {addingMember ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Add
                  </SecondaryButton>
                </form>
              ) : (
                <p className="text-[12px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
                  Only the team owner can add or remove members.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}