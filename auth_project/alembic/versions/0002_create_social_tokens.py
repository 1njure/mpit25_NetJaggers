"""create social tokens

Revision ID: 0002_create_social_tokens
Revises: 0001_baseline_create_users
Create Date: 2025-12-13

"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0002_create_social_tokens"
down_revision = "0001_baseline_create_users"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "social_tokens",
        sa.Column("id", sa.Uuid(), primary_key=True, nullable=False),
        sa.Column(
            "user_id",
            sa.Uuid(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("provider", sa.String(length=32), nullable=False),
        sa.Column("access_token", sa.Text(), nullable=False),
        sa.Column("refresh_token", sa.Text(), nullable=True),
        sa.Column("token_type", sa.String(length=32), nullable=True),
        sa.Column("scope", sa.Text(), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("timezone('utc', now())"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("timezone('utc', now())"),
        ),
        sa.UniqueConstraint("user_id", "provider", name="uq_social_tokens_user_provider"),
    )

    op.create_index("ix_social_tokens_user_id", "social_tokens", ["user_id"], unique=False)
    op.create_index("ix_social_tokens_provider", "social_tokens", ["provider"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_social_tokens_provider", table_name="social_tokens")
    op.drop_index("ix_social_tokens_user_id", table_name="social_tokens")
    op.drop_table("social_tokens")
