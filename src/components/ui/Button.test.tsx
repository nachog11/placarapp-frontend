import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Button, { buttonStyles } from "./Button";

describe("Button", () => {
  it("muestra el texto que recibe", () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
  });

  it('usa type="button" por defecto y permite type="submit"', () => {
    const { rerender } = render(<Button>Aceptar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");

    rerender(<Button type="submit">Aceptar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("ejecuta onClick al hacer click", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Click" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("no ejecuta onClick si está deshabilitado", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Click
      </Button>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Click" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("aplica las clases de la variante y el tamaño elegidos", () => {
    render(
      <Button variant="outline" size="lg">
        Outline
      </Button>,
    );

    const boton = screen.getByRole("button", { name: "Outline" });
    expect(boton.className).toContain("border-accent");
    expect(boton.className).toContain("h-12");
  });
});

describe("buttonStyles", () => {
  it("usa la variante primary y el tamaño md por defecto", () => {
    const clases = buttonStyles();
    expect(clases).toContain("bg-accent");
    expect(clases).toContain("h-11");
  });

  it("agrega clases extra", () => {
    expect(buttonStyles({ className: "w-full" })).toContain("w-full");
  });
});
