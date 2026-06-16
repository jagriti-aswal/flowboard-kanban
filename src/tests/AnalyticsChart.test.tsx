import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AnalyticsChart from "../components/AnalyticsChart";

describe("AnalyticsChart", () => {

  const analytics = {
    todo: 3,
    inprogress: 2,
    done: 5,
    total: 10,
    highPriority: 2,
    byCategory: {
      Bug: 2,
      Feature: 5,
      Enhancement: 3,
    },
  };

  it("renders sprint analytics heading", () => {

    render(
      <AnalyticsChart analytics={analytics} />
    );

    expect(
      screen.getByText("Sprint Analytics")
    ).toBeInTheDocument();

  });

  it("renders total tasks count", () => {

    render(
      <AnalyticsChart analytics={analytics} />
    );

    expect(
      screen.getByText("10")
    ).toBeInTheDocument();

  });

  it("renders completion rate", () => {

    render(
      <AnalyticsChart analytics={analytics} />
    );

    expect(
      screen.getByText("50%")
    ).toBeInTheDocument();

  });

  it("renders high priority alert", () => {

    render(
      <AnalyticsChart analytics={analytics} />
    );

    expect(
      screen.getByText(/high priority/i)
    ).toBeInTheDocument();

  });

});