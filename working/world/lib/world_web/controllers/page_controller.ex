defmodule WorldWeb.PageController do
  use WorldWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
