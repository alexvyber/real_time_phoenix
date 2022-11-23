defmodule NewWorld.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      NewWorldWeb.Telemetry,
      # Start the Ecto repository
      NewWorld.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: NewWorld.PubSub},
      # Start Finch
      {Finch, name: NewWorld.Finch},
      # Start the Endpoint (http/https)
      NewWorldWeb.Endpoint
      # Start a worker by calling: NewWorld.Worker.start_link(arg)
      # {NewWorld.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: NewWorld.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    NewWorldWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
