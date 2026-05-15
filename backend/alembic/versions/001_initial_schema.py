"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-05-15
"""
from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("CREATE TYPE rolusuario AS ENUM ('CIUDADANO', 'ADMINISTRADOR')")
    op.execute("CREATE TYPE tipoincidencia AS ENUM ('BACHE','ALUMBRADO','BASURA','SEGURIDAD_CIUDADANA','EMERGENCIA')")
    op.execute("CREATE TYPE estadoincidencia AS ENUM ('PENDIENTE','EN_PROCESO','RESUELTO','RECHAZADO')")
    op.execute("CREATE TYPE tipoarchivo AS ENUM ('IMAGEN','VIDEO','AUDIO')")

    op.create_table(
        "usuarios",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("nombre", sa.String(100), nullable=False),
        sa.Column("apellido", sa.String(100), nullable=False),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("telefono", sa.String(20)),
        sa.Column("rol", sa.Enum("CIUDADANO", "ADMINISTRADOR", name="rolusuario"), nullable=False, server_default="CIUDADANO"),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "incidencias",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("codigo_seguimiento", sa.String(20), unique=True, nullable=False),
        sa.Column("tipo", sa.Enum("BACHE","ALUMBRADO","BASURA","SEGURIDAD_CIUDADANA","EMERGENCIA", name="tipoincidencia"), nullable=False),
        sa.Column("descripcion", sa.Text, nullable=False),
        sa.Column("direccion", sa.String(500), nullable=False),
        sa.Column("latitud", sa.Float),
        sa.Column("longitud", sa.Float),
        sa.Column("estado", sa.Enum("PENDIENTE","EN_PROCESO","RESUELTO","RECHAZADO", name="estadoincidencia"), nullable=False, server_default="PENDIENTE"),
        sa.Column("comentario_resolucion", sa.Text),
        sa.Column("usuario_id", sa.Integer, sa.ForeignKey("usuarios.id"), nullable=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    op.create_table(
        "multimedia",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("incidencia_id", sa.Integer, sa.ForeignKey("incidencias.id"), nullable=False),
        sa.Column("tipo_archivo", sa.Enum("IMAGEN","VIDEO","AUDIO", name="tipoarchivo"), nullable=False),
        sa.Column("nombre_original", sa.String(255), nullable=False),
        sa.Column("nombre_guardado", sa.String(255), nullable=False),
        sa.Column("url", sa.String(500), nullable=False),
        sa.Column("tamanio_bytes", sa.Integer, nullable=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "notificaciones",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("usuario_id", sa.Integer, sa.ForeignKey("usuarios.id"), nullable=False),
        sa.Column("incidencia_id", sa.Integer, sa.ForeignKey("incidencias.id"), nullable=False),
        sa.Column("mensaje", sa.Text, nullable=False),
        sa.Column("leida", sa.Boolean, default=False),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now()),
    )


def downgrade():
    op.drop_table("notificaciones")
    op.drop_table("multimedia")
    op.drop_table("incidencias")
    op.drop_table("usuarios")
    op.execute("DROP TYPE IF EXISTS tipoarchivo")
    op.execute("DROP TYPE IF EXISTS estadoincidencia")
    op.execute("DROP TYPE IF EXISTS tipoincidencia")
    op.execute("DROP TYPE IF EXISTS rolusuario")
