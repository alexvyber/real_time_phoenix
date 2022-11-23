defmodule NewWorld.Repo do
  use Ecto.Repo,
    otp_app: :new_world,
    adapter: Ecto.Adapters.Postgres
end
