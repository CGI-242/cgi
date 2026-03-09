import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OptionButtonGroup from "@/components/simulateur/OptionButtonGroup";

const options = [
  { value: "mensuel", label: "Mensuel" },
  { value: "annuel", label: "Annuel" },
  { value: "trimestriel", label: "Trimestriel" },
];

describe("OptionButtonGroup", () => {
  it("renders all options", () => {
    const { getByText } = render(
      <OptionButtonGroup options={options} selected="mensuel" onChange={jest.fn()} />
    );
    expect(getByText("Mensuel")).toBeTruthy();
    expect(getByText("Annuel")).toBeTruthy();
    expect(getByText("Trimestriel")).toBeTruthy();
  });

  it("highlights the selected option with primary color", () => {
    const { getByText } = render(
      <OptionButtonGroup options={options} selected="annuel" onChange={jest.fn()} />
    );
    // The selected button's text should have sidebarText color (#FFFFFF)
    const selectedText = getByText("Annuel");
    expect(selectedText.props.style).toMatchObject({ color: "#FFFFFF" });

    // A non-selected button's text should have text color (#000000)
    const unselectedText = getByText("Mensuel");
    expect(unselectedText.props.style).toMatchObject({ color: "#000000" });
  });

  it("calls onChange when an option is pressed", () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <OptionButtonGroup options={options} selected="mensuel" onChange={onChange} />
    );
    fireEvent.press(getByText("Annuel"));
    expect(onChange).toHaveBeenCalledWith("annuel");
  });
});
