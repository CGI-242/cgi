import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import SimulateurLayout from "@/components/simulateur/SimulateurLayout";

const defaultProps = {
  title: "Simulateur ITS",
  description: "Calcul de l'impot sur les traitements et salaires",
  emptyMessage: "Remplissez les champs pour voir le resultat",
  hasResult: false,
  inputSection: <Text>Input content</Text>,
  resultSection: <Text>Result content</Text>,
};

describe("SimulateurLayout", () => {
  it("renders title and description", () => {
    const { getByText } = render(<SimulateurLayout {...defaultProps} />);
    expect(getByText("Simulateur ITS")).toBeTruthy();
    expect(getByText("Calcul de l'impot sur les traitements et salaires")).toBeTruthy();
  });

  it("renders inputSection content", () => {
    const { getByText } = render(<SimulateurLayout {...defaultProps} />);
    expect(getByText("Input content")).toBeTruthy();
  });

  it("renders resultSection when hasResult is true", () => {
    const { getByText } = render(
      <SimulateurLayout {...defaultProps} hasResult={true} />
    );
    expect(getByText("Result content")).toBeTruthy();
  });

  it("renders empty state message when hasResult is false", () => {
    const { getByText } = render(
      <SimulateurLayout {...defaultProps} hasResult={false} />
    );
    expect(getByText("Remplissez les champs pour voir le resultat")).toBeTruthy();
  });

  it("renders subtitle when provided", () => {
    const { getByText } = render(
      <SimulateurLayout {...defaultProps} subtitle="Art. 100 du CGI" />
    );
    expect(getByText("Art. 100 du CGI")).toBeTruthy();
  });

  it("does not render subtitle when not provided", () => {
    const { queryByText } = render(<SimulateurLayout {...defaultProps} />);
    expect(queryByText("Art. 100 du CGI")).toBeNull();
  });

  it("renders legalRef when provided", () => {
    const { getByText } = render(
      <SimulateurLayout {...defaultProps} legalRef="Ref: Art. 85 CGI 2026" />
    );
    expect(getByText("Ref: Art. 85 CGI 2026")).toBeTruthy();
  });
});
